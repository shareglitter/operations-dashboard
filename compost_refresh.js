#!/usr/bin/env node
/**
 * Glitter Pilots Dashboard — Compost site usage refresh
 *
 * Ingests the vendor's (Bennett Compost) pickup log — a Google Sheet Glitter can
 * read but does not control — and rebuilds compost_data.js: one tidy row per
 * site per pickup, per-site usage stats, and the early-warning flags the Compost
 * tab on pilots.html shows. Flags that are new since the previous run (and flags
 * that cleared) are posted to Slack so a site that goes quiet is noticed before
 * the next site visit, not during it.
 *
 * The sheet is private; the script reads a Glitter-owned mirror sheet that
 * IMPORTRANGEs the vendor's tab and is published to the web as CSV (see
 * CLAUDE.md → "Compost site usage"). Any CSV with the same layout works.
 *
 * Usage:  node compost_refresh.js                    fetch $COMPOST_SHEET_CSV_URL, rewrite compost_data.js
 *         node compost_refresh.js --file sheet.csv   parse a local CSV instead (testing / backfill)
 *         node compost_refresh.js --dry-run          parse, print, write nothing, post nothing
 *         node compost_refresh.js --no-slack         write but don't post
 * Env:    COMPOST_SHEET_CSV_URL   publish-to-web CSV link of the mirror sheet
 *         SLACK_WEBHOOK_URL       optional — same Incoming Webhook refresh.js uses
 */

const fs = require('fs');
const path = require('path');

const OUT_FILE = 'compost_data.js';
const SOURCE_NAME = 'Bennett Compost — Commercial Weight Tracking (vendor Google Sheet)';

// ── Sites ───────────────────────────────────────────────────────────────────
// The sheet names each column group by street; the Airtable Block Codes don't
// always match the street number (901 Christian lives on the 2100Christian
// block record — that's how it's labeled, confirmed Oct 2026). `match` is
// tested against the header cell above each "Date" column, so a header rename
// (Christian read "2101" through Aug 2026 and "901" from Sep) stays one site.
// A header that matches nothing becomes a `sheet` flag rather than being dropped
// silently — that's how a sixth site, or a vendor rename, surfaces.
const SITES = [
  { key: 'christian', label: '901 Christian St', code: '2100Christian', match: /CHRISTIAN/i },
  { key: 'kimball',   label: '1901 Kimball St',  code: '1900Kimball',   match: /KIMBALL/i },
  { key: 'uber',      label: '840 N Uber St',    code: '1900Parrish',   match: /UBER/i },
  { key: 'green',     label: '1501 Green St',    code: '1500Green',     match: /GREEN/i },
  { key: 'latona',    label: '1227 Latona St',   code: '1200Latona',    match: /LATONA/i, note: "Morgan's bin" },
];

// ── Physical constants (from the sheet's own conversion) ───────────────────
const BIN_GALLONS = 32;       // one roller; the sheet's "1 full"
const LBS_PER_GALLON = 4;     // the sheet's "Converted to Weight (Approx lbs)"

// ── Flag parameters ────────────────────────────────────────────────────────
// Readings are quarter-bin steps once a week, so "a drop" has to be read over
// several pickups and against the site's own history, and a drop every site
// shares is weather/season, not a problem at that corner.
const RECENT_N = 3;           // pickups that make up "now"
const BASELINE_N = 8;         // pickups before those that make up "normal"
const MIN_BASELINE = 4;       // fewer than this → too new to judge a drop
const DROP_RATIO = 0.6;       // now ÷ normal at or below this is a drop (a 1/2 bin → 1/4 bin is 0.5)
const NETWORK_ADJ = 0.75;     // …and site ratio ÷ network ratio at or below this means the site fell on its own
const MISSED_DAYS = 10;       // weekly pickup; nothing logged in this many days
const FULL_OF_RECENT = 2;     // full bins among the last RECENT_N pickups → at capacity

const LEVEL_RANK = { urgent: 0, investigate: 1, capacity: 2, watch: 3 };
const LEVEL_LABEL = { urgent: 'Urgent', investigate: 'Investigate', capacity: 'At capacity', watch: 'Watch' };
const LEVEL_EMOJI = { urgent: ':red_circle:', investigate: ':large_orange_circle:', capacity: ':large_yellow_circle:', watch: ':large_blue_circle:' };

// ── CLI ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = n => argv.includes(n);
const opt = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const DRY_RUN = flag('--dry-run');
const NO_SLACK = flag('--no-slack') || DRY_RUN;
const LOCAL_FILE = opt('--file');

// Today's calendar date in Philadelphia; the sheet's dates are local days.
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

// ── CSV ────────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.map(r => r.map(c => c.trim()));
}

// ── Sheet → pickups ────────────────────────────────────────────────────────
const DATE_RE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const toISO = s => { const m = DATE_RE.exec(s); return m ? `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}` : null; };
// "1/4 full" → 0.25, "1 full" / "full" → 1, "empty" / "0" → 0, anything else → null
function fracFromDesc(d) {
  const s = (d || '').toLowerCase();
  if (!s) return null;
  if (/^(0|empty|none)$/.test(s)) return 0;
  const m = /^(\d)\s*\/\s*(\d)/.exec(s); if (m) return +m[1] / +m[2];
  if (/^(1\s*)?full/.test(s)) return 1;
  return null;
}

/**
 * Scans the whole grid for column groups headed "Date | Description | Amount |
 * Weight" (any position — the vendor stacks months top-down and sites left to
 * right, and could add either) and walks each group down to its TOTAL row.
 * The site name is the cell above the "Date" header.
 */
function parseGrid(grid) {
  const cell = (r, c) => (grid[r] && grid[r][c]) || '';
  const pickups = [], issues = [], unknown = new Set();
  const seen = new Map();   // site:date → index in pickups (dedupe)
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (cell(r, c) !== 'Date' || !/^description$/i.test(cell(r, c + 1))) continue;
      const header = cell(r - 1, c) || cell(r - 2, c);
      const site = SITES.find(s => s.match.test(header));
      if (!site) { if (header) unknown.add(header); continue; }
      for (let rr = r + 1; rr < grid.length; rr++) {
        const d = cell(rr, c), desc = cell(rr, c + 1), gal = cell(rr, c + 2), lbs = cell(rr, c + 3);
        if (/^total$/i.test(desc) || d === 'Date') break;
        if (d && !DATE_RE.test(d)) break;             // ran into the next site header
        if (!d) continue;                              // blank rows inside a section (site started mid-month)
        const date = toISO(d), where = `${site.label} ${d}`;
        const frac = fracFromDesc(desc);
        const galN = gal === '' ? null : Number(gal);
        const lbsN = lbs === '' ? null : Number(lbs);
        let status, gallons;
        if (/skip/i.test(desc)) { status = 'skip'; gallons = 0; }
        else if (galN !== null && !Number.isNaN(galN)) {
          gallons = galN; status = gallons > 0 ? 'pickup' : 'empty';
          if (frac !== null && Math.abs(frac * BIN_GALLONS - gallons) > 0.01)
            issues.push(`${where}: description "${desc}" ≠ ${gallons} gal — using the gallons column`);
        } else if (frac !== null) {
          gallons = frac * BIN_GALLONS; status = gallons > 0 ? 'pickup' : 'empty';
          issues.push(`${where}: no gallons entered — derived ${gallons} from "${desc}"`);
        } else {
          // Nothing recorded (the vendor pre-fills next week's date). Only worth
          // a note once the date is comfortably past.
          if (date < TODAY && daysBetween(date, TODAY) > 3) issues.push(`${where}: row exists but nothing recorded`);
          continue;
        }
        if (date > TODAY) { issues.push(`${where}: dated in the future — ignored`); continue; }
        const row = { site: site.key, date, status, gallons, lbs: lbsN !== null && !Number.isNaN(lbsN) ? lbsN : gallons * LBS_PER_GALLON, desc };
        const k = `${site.key}:${date}`;
        if (seen.has(k)) { issues.push(`${where}: appears twice — keeping the later entry`); pickups[seen.get(k)] = row; }
        else { seen.set(k, pickups.length); pickups.push(row); }
      }
    }
  }
  pickups.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.site.localeCompare(b.site));
  return { pickups, issues, unknownHeaders: [...unknown] };
}

// ── Stats + flags ──────────────────────────────────────────────────────────
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const avg = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const median = xs => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r1 = x => x === null || x === undefined ? null : Math.round(x * 10) / 10;
const pctStr = ratio => `${ratio >= 1 ? '+' : '−'}${Math.round(Math.abs(ratio - 1) * 100)}%`;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fmtD = iso => { const [y, m, d] = iso.split('-'); return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1]} ${+d}`; };

function siteStats(site, rows) {
  const visits = rows.filter(r => r.status !== 'skip');          // vendor saw the bin
  const last = rows[rows.length - 1] || null;
  const lastVisit = visits[visits.length - 1] || null;
  const recent = visits.slice(-RECENT_N);
  const baseline = visits.slice(-(RECENT_N + BASELINE_N), -RECENT_N);
  const recentAvg = avg(recent.map(r => r.gallons));
  const baselineAvg = baseline.length >= MIN_BASELINE ? avg(baseline.map(r => r.gallons)) : null;
  const dayCounts = {};
  rows.forEach(r => { const d = DAYS[new Date(r.date + 'T12:00:00Z').getUTCDay()]; dayCounts[d] = (dayCounts[d] || 0) + 1; });
  const day = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]).map(e => e[0])[0] || null;
  return {
    key: site.key, label: site.label, code: site.code, note: site.note || null, day,
    first: rows[0] ? rows[0].date : null, last: last ? last.date : null, lastStatus: last ? last.status : null,
    lastGallons: last ? last.gallons : null, lastVisit: lastVisit ? lastVisit.date : null,
    pickups: visits.length, skips: rows.length - visits.length, empties: visits.filter(r => r.status === 'empty').length,
    fulls: visits.filter(r => r.gallons >= BIN_GALLONS).length,
    gallons: visits.reduce((s, r) => s + r.gallons, 0), lbs: visits.reduce((s, r) => s + r.lbs, 0),
    recentN: recent.length, recentAvg: r1(recentAvg), baselineN: baseline.length, baselineAvg: r1(baselineAvg),
    ratio: baselineAvg ? +(recentAvg / baselineAvg).toFixed(2) : null,
    recentFulls: recent.filter(r => r.gallons >= BIN_GALLONS).length,
  };
}

function siteFlags(s, networkRatio) {
  const out = [], f = (level, kind, text) => out.push({ site: s.key, level, kind, text });
  if (!s.last) { f('urgent', 'no-data', 'No pickups in the sheet at all'); return out; }
  const since = daysBetween(s.lastVisit || s.last, TODAY);
  if (since > MISSED_DAYS) f('urgent', 'missed', `Nothing logged in ${since} days (last pickup ${fmtD(s.lastVisit || s.last)}) — missed pickup, or the sheet is behind`);
  if (s.lastStatus === 'empty') f('urgent', 'empty', `Bin was empty on ${fmtD(s.last)} — nobody is using it, or nobody can reach it`);
  if (s.lastStatus === 'skip') f('urgent', 'skip', `Vendor logged a skip on ${fmtD(s.last)}`);
  if (s.ratio !== null && s.ratio <= DROP_RATIO) {
    const adj = networkRatio ? s.ratio / networkRatio : s.ratio;
    const base = `last ${s.recentN} pickups average ${s.recentAvg} gal vs ${s.baselineAvg} gal over the ${s.baselineN} before (${pctStr(s.ratio)})`;
    if (adj <= NETWORK_ADJ) f('investigate', 'drop', `Usage dropped: ${base}, while the other sites held (${pctStr(networkRatio)}) — check for contamination, access or signage`);
    else f('watch', 'drop-network', `Down with everyone else: ${base}; the whole network is ${pctStr(networkRatio)}, so likely seasonal`);
  } else if (s.lastStatus === 'pickup' && s.baselineAvg && s.lastGallons <= DROP_RATIO * s.baselineAvg) {
    f('watch', 'dip', `Light pickup on ${fmtD(s.last)}: ${s.lastGallons} gal vs ${s.baselineAvg} gal usual — one reading, watch next week`);
  }
  if (s.recentFulls >= FULL_OF_RECENT) f('capacity', 'full', `Full bin on ${s.recentFulls} of the last ${s.recentN} pickups — at capacity; overflow invites contamination`);
  return out;
}

function build(parsed) {
  const bySite = {}; parsed.pickups.forEach(p => (bySite[p.site] = bySite[p.site] || []).push(p));
  const sites = SITES.map(s => siteStats(s, bySite[s.key] || []));
  const networkRatio = median(sites.map(s => s.ratio).filter(x => x !== null));
  const flags = [];
  sites.forEach(s => flags.push(...siteFlags(s, networkRatio)));
  parsed.unknownHeaders.forEach(h => flags.push({ site: 'sheet', level: 'urgent', kind: 'unknown-site', text: `Sheet has a column group "${h}" that maps to no known site — add it to SITES in compost_refresh.js` }));
  flags.sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level] || a.site.localeCompare(b.site));
  const dates = parsed.pickups.map(p => p.date);
  const weekAgo = new Date(Date.parse(TODAY) - 7 * 86400000).toISOString().slice(0, 10);
  const lastWeek = parsed.pickups.filter(p => p.date > weekAgo);
  return {
    asOf: dates.length ? dates[dates.length - 1] : null,
    generated: TODAY,
    source: SOURCE_NAME,
    binGallons: BIN_GALLONS, lbsPerGallon: LBS_PER_GALLON,
    params: { RECENT_N, BASELINE_N, MIN_BASELINE, DROP_RATIO, NETWORK_ADJ, MISSED_DAYS, FULL_OF_RECENT },
    network: { ratio: r1(networkRatio), weekGallons: lastWeek.reduce((s, p) => s + p.gallons, 0), weekLbs: lastWeek.reduce((s, p) => s + p.lbs, 0), weekPickups: lastWeek.length },
    sites, pickups: parsed.pickups, flags, issues: parsed.issues,
  };
}

// ── Output ─────────────────────────────────────────────────────────────────
function serialize(data) {
  const first = data.pickups[0] ? data.pickups[0].date : '—';
  return `// Glitter Pilots Dashboard — Compost site usage (vendor pickup log)
// Auto-generated ${data.generated} by compost_refresh.js — do not hand-edit.
// Source: ${data.source}
// ${data.pickups.length} pickups, ${first} → ${data.asOf}, ${data.sites.length} sites, ${data.flags.length} flags

const COMPOST_DATA = ${JSON.stringify(data, null, 1)};
if (typeof module !== 'undefined') module.exports = COMPOST_DATA;
`;
}
// The generated-date line changes daily; everything else only changes when the
// sheet does. Comparing without it keeps the Action from committing every day.
const body = text => text.replace(/^\/\/ Auto-generated .*$/m, '').replace(/"generated": *"[^"]*"/, '');

function loadPrevious(outPath) {
  try { delete require.cache[outPath]; return require(outPath); } catch { return null; }
}

function slackText(data, added, cleared) {
  const line = f => `${LEVEL_EMOJI[f.level]} *${siteLabel(data, f.site)}* — ${f.text}`;
  const parts = [`*Compost site check — ${fmtD(data.generated)}*`];
  if (added.length) parts.push(...added.map(line));
  if (cleared.length) parts.push(`:white_check_mark: Cleared: ${cleared.map(f => `${siteLabel(data, f.site)} (${f.kind})`).join(', ')}`);
  const stillOn = data.flags.filter(f => !added.includes(f));
  if (stillOn.length) parts.push(`_Still flagged: ${stillOn.map(f => `${siteLabel(data, f.site)} (${LEVEL_LABEL[f.level].toLowerCase()})`).join(' · ')}_`);
  parts.push(`_${data.sites.length} sites · ${data.network.weekPickups} pickups / ${data.network.weekGallons} gal (≈${data.network.weekLbs} lbs) in the last 7 days · data through ${fmtD(data.asOf)}_`);
  return parts.join('\n');
}
const siteLabel = (data, key) => key === 'sheet' ? 'Sheet layout' : (data.sites.find(s => s.key === key) || {}).label || key;

async function postToSlack(text) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) { console.log('\n  (SLACK_WEBHOOK_URL not set — flags printed only, not posted)'); return; }
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    console.log('\n  ✅ Posted to Slack');
  } catch (e) { console.log(`\n  ⚠ Slack post failed: ${e.message}`); }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function fetchSheet() {
  if (LOCAL_FILE) { console.log(`Reading ${LOCAL_FILE}`); return fs.readFileSync(LOCAL_FILE, 'utf8'); }
  const url = process.env.COMPOST_SHEET_CSV_URL;
  if (!url) { console.error('❌ Set COMPOST_SHEET_CSV_URL (publish-to-web CSV link of the mirror sheet), or pass --file sheet.csv'); process.exit(1); }
  console.log('Fetching the mirror sheet…');
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Sheet fetch failed: HTTP ${res.status}`);
  const text = await res.text();
  if (/^\s*</.test(text)) throw new Error('Sheet fetch returned HTML, not CSV — is the mirror published to the web (File → Share → Publish to web → CSV)?');
  return text;
}

async function main() {
  const text = await fetchSheet();
  const grid = parseCSV(text);
  const parsed = parseGrid(grid);
  if (!parsed.pickups.length) throw new Error('Parsed 0 pickups — the sheet layout has probably changed (no "Date | Description" column groups found)');
  const data = build(parsed);

  console.log(`\n${parsed.pickups.length} pickups, ${data.pickups[0].date} → ${data.asOf} (today ${TODAY})`);
  console.log(`\n  ${'Site'.padEnd(18)} ${'Block'.padEnd(14)} Day  Last        Last gal  Last ${RECENT_N}  Prior ${BASELINE_N}  Ratio`);
  data.sites.forEach(s => console.log(`  ${s.label.padEnd(18)} ${s.code.padEnd(14)} ${(s.day || '—').padEnd(4)} ${(s.last || '—').padEnd(11)} ${String(s.lastGallons ?? '—').padStart(8)}  ${String(s.recentAvg ?? '—').padStart(6)}  ${String(s.baselineAvg ?? '—').padStart(7)}  ${s.ratio === null ? '—' : s.ratio}`));
  console.log(`  network ratio (median): ${data.network.ratio ?? '—'}`);
  console.log(`\n  Flags (${data.flags.length}):`);
  data.flags.forEach(f => console.log(`   [${LEVEL_LABEL[f.level]}] ${siteLabel(data, f.site)} — ${f.text}`));
  if (!data.flags.length) console.log('   none — every site within its normal range');
  if (parsed.issues.length) { console.log(`\n  Data notes (${parsed.issues.length}):`); parsed.issues.forEach(i => console.log(`   · ${i}`)); }

  const outPath = path.join(__dirname, OUT_FILE);
  const prev = loadPrevious(outPath);
  const key = f => `${f.site}:${f.kind}`;
  const prevKeys = new Set(((prev && prev.flags) || []).map(key));
  const nowKeys = new Set(data.flags.map(key));
  const added = data.flags.filter(f => !prevKeys.has(key(f)));
  const cleared = ((prev && prev.flags) || []).filter(f => !nowKeys.has(key(f)));

  const output = serialize(data);
  if (DRY_RUN) { console.log(`\n  (dry run — ${OUT_FILE} not written; ${added.length} new flag(s), ${cleared.length} cleared)`); return; }
  const existing = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  if (body(existing) === body(output)) console.log(`\n  ${OUT_FILE} unchanged — not rewritten`);
  else { fs.writeFileSync(outPath, output); console.log(`\n  ✅ Wrote ${OUT_FILE}`); }

  if (added.length || cleared.length) {
    const text = slackText(data, added, cleared);
    console.log('\n' + text.split('\n').map(l => '  ' + l).join('\n'));
    if (!NO_SLACK) await postToSlack(text);
  } else console.log('\n  No new or cleared flags — nothing to post');
}

main().catch(err => { console.error(`\n❌ ${err.message}`); process.exit(1); });

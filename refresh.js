#!/usr/bin/env node
/**
 * Glitter Ops Dashboard — Monthly Data Refresh
 * 
 * Pulls cleaning log and block data from Airtable, computes monthly summaries,
 * and writes updated data.js. Run on the 1st of each month (or anytime).
 * 
 * Usage:  node refresh.js
 * Env:    AIRTABLE_TOKEN (or uses hardcoded fallback)
 */

const fs = require('fs');
const path = require('path');

const TOKEN = process.env.AIRTABLE_TOKEN;
if (!TOKEN) {
  console.error('❌ Set AIRTABLE_TOKEN environment variable first.');
  console.error('   macOS/Linux: export AIRTABLE_TOKEN="pat..."');
  console.error('   Windows:     set AIRTABLE_TOKEN=pat...');
  process.exit(1);
}
const BASE = 'appzuuUtAQVDg0YW1';
const BLOCKS_TABLE = 'tblssvtXzgL200hSi';
const CLEANS_TABLE = 'tblaDXbhz6DEcytgh';
const CHURN_DAYS = 35;
const BAG_MAP = { rare: 0.25, light: 0.5, medium: 0.75, heavy: 1.25, severe: 2.0 };
// Grant-funded projects (the Safe Steps programs). Every other value of the
// Blocks `Projects` select — Area32, Philly Safe, TCB South St, WPNA — is a
// normal project.
const GRANT_PROJECTS = new Set(['SSNE', 'SSW', 'SSNW']);

// President's KPIs (OpsHub → Monthly Metrics). A "core" block is anything not
// project/grant funded; it counts as funded once its cleaning level reaches 1/4
// (0.25 = once a month; 1.0 = weekly).
const CORE_FUNDING = ['Resident', 'Commercial / Property Management', 'Community'];
const FUNDED_MIN = 0.25;
const FUNDING_LEVEL = 'Funding Level (with Override and Cap)';

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Airtable's limit is 5 requests/second per base; breaching it returns 429 plus
// a 30-second lockout on that base. The cleaning-log pull is ~500 sequential
// pages, so we (a) space pages out to stay under the ceiling and (b) retry
// politely on 429/5xx instead of aborting the whole monthly refresh.
const THROTTLE_MS = 220;   // ~4.5 req/s, safely under the 5 req/s ceiling
const MAX_RETRIES = 5;

async function fetchAirtable(url) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (res.ok) return res.json();
    // 429 = rate limited (honor Retry-After / 30s box); 5xx = transient. Back off.
    if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
      const retryAfter = parseInt(res.headers.get('retry-after') || '', 10);
      const wait = Number.isFinite(retryAfter) ? retryAfter * 1000 : Math.min(30000, 1000 * 2 ** attempt);
      console.log(`  ⏳ AT ${res.status} — waiting ${Math.round(wait / 1000)}s (retry ${attempt + 1}/${MAX_RETRIES})`);
      await sleep(wait);
      continue;
    }
    throw new Error(`AT ${res.status}: ${await res.text()}`);
  }
}

async function fetchAll(tableId, fields, filter) {
  const fieldParams = fields.map(f => `fields[]=${encodeURIComponent(f)}`).join('&');
  const filterParam = filter ? `&filterByFormula=${encodeURIComponent(filter)}` : '';
  let records = [], offset = null, page = 0;
  do {
    const url = `https://api.airtable.com/v0/${BASE}/${tableId}?${fieldParams}&pageSize=100${filterParam}${offset ? '&offset=' + offset : ''}`;
    const data = await fetchAirtable(url);
    records = records.concat(data.records);
    offset = data.offset;
    page++;
    if (page % 50 === 0) console.log(`  ...${records.length} records so far`);
    if (offset) await sleep(THROTTLE_MS); // stay under 5 req/s between pages
  } while (offset);
  return records;
}

function normScore(val) {
  if (!val) return 0;
  const name = String(val).toLowerCase().split('.')[0].trim();
  return BAG_MAP[name] || 0;
}

// Cleaning Log's `Project` and `Multiplier` are lookups from Blocks, and Airtable's
// REST API returns lookup fields as arrays (["SSNE"], [1.5]) — never bare scalars.
// Unwrap to the first value so equality checks and arithmetic behave.
function one(val) {
  return Array.isArray(val) ? (val.length ? val[0] : null) : (val === undefined ? null : val);
}

async function buildCleaningSeries() {
  console.log('Fetching cleaning log...');
  const records = await fetchAll(CLEANS_TABLE,
    ['Date and Time', 'Project', 'Multiplier', 'Payout', 'Trash', 'Debris']);
  console.log(`  ${records.length} cleaning records`);

  const monthly = {};
  for (const r of records) {
    const f = r.fields;
    if (!f['Date and Time']) continue;
    const month = f['Date and Time'].slice(0, 7);
    const mult = one(f['Multiplier']) || 1;
    const payout = one(f['Payout']) || 25;
    const proj = one(f['Project']);

    if (!monthly[month]) monthly[month] = { core: 0, project: 0, grant: 0, rev: 0, cogs: 0, trash_bags: 0, debris_bags: 0 };
    const m = monthly[month];

    if (GRANT_PROJECTS.has(proj)) m.grant++;
    else if (proj) m.project++;
    else m.core++;

    m.rev += 50 * mult;
    m.cogs += payout;
    m.trash_bags += normScore(f['Trash']);
    m.debris_bags += normScore(f['Debris']);
  }

  return Object.keys(monthly).sort().map(month => {
    const m = monthly[month];
    const total = m.core + m.project + m.grant;
    const gm = m.rev - m.cogs;
    const bags = m.trash_bags + m.debris_bags;
    return {
      month, core_cleans: m.core, project_cleans: m.project, grant_cleans: m.grant,
      total_cleans: total, revenue: Math.round(m.rev), cogs: Math.round(m.cogs),
      gross_margin: Math.round(gm), gm_pct: total ? Math.round(gm / m.rev * 1000) / 10 : 0,
      bags: Math.round(bags * 100) / 100,
      trash_bags: Math.round(m.trash_bags * 100) / 100,
      debris_bags: Math.round(m.debris_bags * 100) / 100
    };
  });
}

async function buildBlockSeries() {
  console.log('Fetching block data...');
  // Last clean comes from the rollup (MAX over linked Cleaning Log rows): the
  // automation-filled `Last Clean Date` matched blocks by *substring* of Block
  // Code, so a clean on 2300South also stamped 2200-2300South, leaving the real
  // block looking dormant and its superset twin looking immortal.
  //
  // First clean deliberately stays on the automation field. ~13 blocks were
  // backfilled to 2022-10-06 with no linked cleaning rows that old, so the
  // rollup would erase them from four years of history and re-book them as new
  // in the month they were first linked. See CLAUDE.md.
  const records = await fetchAll(BLOCKS_TABLE,
    ['First Clean Date', 'Last Clean Date [Rollup]', 'Funding Type', 'Projects']);
  console.log(`  ${records.length} block records`);

  const blocks = records
    .filter(r => r.fields['First Clean Date'] && r.fields['Last Clean Date [Rollup]'])
    .map(r => ({
      first: new Date(r.fields['First Clean Date']),
      last: new Date(r.fields['Last Clean Date [Rollup]']),
      isProject: r.fields['Funding Type'] === 'Project' || !!r.fields['Projects']
    }));

  console.log(`  ${blocks.length} blocks with clean history`);

  const today = new Date();
  const months = [];
  let cur = new Date(2022, 0, 1);
  while (cur <= today) {
    months.push([cur.getFullYear(), cur.getMonth() + 1]);
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }

  let prevActive = new Set();
  return months.map(([y, m], idx) => {
    const me = new Date(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1);
    const cutoff = new Date(me.getTime() - CHURN_DAYS * 86400000);
    const ms = new Date(y, m - 1, 1);

    let coreA = 0, projA = 0, newC = 0, newP = 0;
    const curActive = new Set();

    blocks.forEach((b, i) => {
      if (b.first <= me && b.last >= cutoff) {
        curActive.add(i);
        b.isProject ? projA++ : coreA++;
      }
      if (b.first >= ms && b.first < me) {
        b.isProject ? newP++ : newC++;
      }
    });

    // Split churn by type: the president's Monthly Churn % is a core-block rate,
    // so a month where project blocks roll off shouldn't read as core churn.
    const churnedIdx = idx > 0 ? [...prevActive].filter(i => !curActive.has(i)) : [];
    const churned = churnedIdx.length;
    const churnedCore = churnedIdx.filter(i => !blocks[i].isProject).length;
    prevActive = curActive;

    return {
      month: `${y}-${String(m).padStart(2, '0')}`,
      core_active: coreA, proj_active: projA, total_active: coreA + projA,
      new_core: newC, new_proj: newP, churned, churned_core: churnedCore,
      net: (newC + newP) - churned
    };
  });
}

async function main() {
  console.log('Glitter Ops Dashboard — Data Refresh');
  console.log('=====================================\n');

  const cleans = await buildCleaningSeries();
  const blocks = await buildBlockSeries();

  // Drop current partial month (it's computed live by the app)
  const now = new Date();
  const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const cleansFinal = cleans.filter(d => d.month < curMonth);
  const blocksFinal = blocks.filter(d => d.month < curMonth);

  const lastClean = cleansFinal[cleansFinal.length - 1];
  const lastBlock = blocksFinal[blocksFinal.length - 1];

  console.log(`\nCleaning data: ${cleansFinal.length} months (${cleansFinal[0].month} → ${lastClean.month})`);
  console.log(`Block data: ${blocksFinal.length} months (${blocksFinal[0].month} → ${lastBlock.month})`);
  console.log(`Last complete month — Cleans: ${lastClean.total_cleans}, Revenue: $${lastClean.revenue.toLocaleString()}, Core blocks: ${lastBlock.core_active}`);

  const output = `// Glitter Operations Dashboard — Historical Data
// Auto-generated ${now.toISOString().slice(0, 10)}
// Last complete month: ${lastClean.month}
// Cleaning data: ${cleansFinal[0].month} → ${lastClean.month} (${cleansFinal.length} months)
// Block data: ${blocksFinal[0].month} → ${lastBlock.month} (${blocksFinal.length} months)

const HIST_CLEANS = ${JSON.stringify(cleansFinal)};

const HIST_BLOCKS = ${JSON.stringify(blocksFinal)};
`;

  const outPath = path.join(__dirname, 'data.js');
  fs.writeFileSync(outPath, output);
  console.log(`\n✅ data.js written`);

  // Build health data (block tier snapshot)
  await buildHealthData(now);

  // President's KPIs — printed for manual entry into OpsHub, never written
  await buildMonthlyMetrics(blocksFinal);

  console.log('\nDeploy: git add data.js health_data.js && git commit -m "monthly refresh" && git push');
}

// ── President's KPIs → OpsHub "Monthly Metrics" ──────────────────────────────
//
// Prints the metrics whose values are derivable from Airtable so they can be
// pasted into the OpsHub row for the month. Deliberately read-only: nothing is
// written back, so a bad computation can never corrupt the KPI table.
//
// NB: Funded Blocks / Cleaning Health / Cleaning Equivalents are point-in-time
// snapshots of the Blocks table as it stands *right now* — they can't be
// recomputed for a past month. Run this shortly after month end.
async function buildMonthlyMetrics(blocksFinal) {
  console.log('\nFetching funding levels for KPIs...');
  const records = await fetchAll(BLOCKS_TABLE, ['Funding Type', FUNDING_LEVEL]);

  const funded = records.filter(r => {
    const f = r.fields;
    return CORE_FUNDING.includes(f['Funding Type']) && (one(f[FUNDING_LEVEL]) || 0) >= FUNDED_MIN;
  });
  const levels = funded.map(r => one(r.fields[FUNDING_LEVEL]) || 0);
  const levelSum = levels.reduce((a, b) => a + b, 0);

  const fundedBlocks = funded.length;
  // Level is a fraction where 1.0 = weekly, so the mean is already the health %.
  const cleaningHealth = fundedBlocks ? Math.round(levelSum / fundedBlocks * 1000) / 10 : 0;
  // Weekly = 4 cleans per billing cycle, 3/4 = 3, and so on.
  const cleaningEquivalents = Math.round(levelSum * 4);

  // Live count of active subscriptions (same source the dashboard's Metrics tab
  // shows as a reference). Guarded — it must not sink the whole refresh.
  let activeSubs = null;
  try {
    const subs = await fetchAll(encodeURIComponent('Active Subscriptions'),
      ['Contribution Status'], "{Contribution Status}='Active'");
    activeSubs = subs.length;
  } catch (e) {
    console.log(`  ⚠ Active Subscriptions unavailable: ${e.message}`);
  }

  const cur = blocksFinal[blocksFinal.length - 1];
  const prev = blocksFinal[blocksFinal.length - 2];
  const pct = (n, d) => d ? Math.round(n / d * 1000) / 10 : 0;
  const churnCore = prev ? pct(cur.churned_core, prev.core_active) : 0;
  const churnAll = prev ? pct(cur.churned, prev.core_active) : 0;
  const growth = prev ? pct(cur.core_active - prev.core_active, prev.core_active) : 0;

  console.log(`\n${'='.repeat(58)}`);
  console.log(`OpsHub → Monthly Metrics — paste into row "${cur.month}"`);
  console.log('='.repeat(58));
  console.log(`  Funded Blocks - Actual .......... ${fundedBlocks}`);
  console.log(`  Cleaning Health % - Actual ...... ${cleaningHealth}`);
  console.log(`  Cleaning Equivalents - Actual ... ${cleaningEquivalents}`);
  console.log(`  Block Growth % - Actual ......... ${growth}`);
  console.log(`  Monthly Churn % - Actual ........ ${churnCore}`);
  if (activeSubs !== null) console.log(`  Active Subscriptions - Actual ... ${activeSubs}`);
  console.log('\n  Still manual: Cleaner Churn %, Partnerships, Grants $, Backlog Reduced %');
  console.log(`\n  Context — core blocks ${prev ? prev.core_active : '?'} → ${cur.core_active}, ` +
    `churned ${cur.churned_core} core of ${cur.churned} total`);
  if (churnAll !== churnCore) {
    console.log(`  (all-block churn would read ${churnAll}% — project blocks rolling off)`);
  }
  console.log(`  Block-state metrics above are as of ${new Date().toISOString().slice(0, 10)}, not month end.`);
  console.log('='.repeat(58));
}

async function buildHealthData(now) {
  console.log('\nFetching block tier data...');
  const records = await fetchAll(BLOCKS_TABLE,
    ['Subscriber Tier', 'Cleaning Level Tier', 'Block Tier (calc)', 'Funding Type']);
  console.log(`  ${records.length} block records`);

  const subTiersSet = new Set();
  const cleanTiersSet = new Set();
  const blockTiersSet = new Set();

  const core = { tiers: {}, heatmap: {}, total: 0 };
  const proj = { tiers: {}, heatmap: {}, total: 0 };

  for (const r of records) {
    const f = r.fields;
    const st = f['Subscriber Tier'] || '';
    const ct = f['Cleaning Level Tier'] || '';
    const bt = f['Block Tier (calc)'] || '';
    const fund = f['Funding Type'] || '';

    if (!bt || bt === '#ERROR!') continue;

    subTiersSet.add(st);
    cleanTiersSet.add(ct);
    blockTiersSet.add(bt);

    const isCore = ['Resident', 'Community', 'Commercial / Property Management'].includes(fund);
    const isProj = fund === 'Project';
    const bucket = isCore ? core : isProj ? proj : null;
    if (!bucket) continue;

    bucket.tiers[bt] = (bucket.tiers[bt] || 0) + 1;
    const key = `${st}|${ct}`;
    bucket.heatmap[key] = (bucket.heatmap[key] || 0) + 1;
    bucket.total++;
  }

  const tierLabels = [...blockTiersSet].sort();
  const subTiers = [...subTiersSet].sort();
  const cleanTiers = [...cleanTiersSet].sort();

  console.log(`  Core: ${core.total} blocks, Project: ${proj.total} blocks`);
  console.log(`  Tiers: ${tierLabels.join(', ')}`);

  const healthOutput = `// Glitter Operations Dashboard — Block Health Snapshot
// Auto-generated ${now.toISOString().slice(0, 10)}
// Core blocks: ${core.total} | Project blocks: ${proj.total}

const TIER_LABELS = ${JSON.stringify(tierLabels)};
const SUB_TIERS = ${JSON.stringify(subTiers)};
const CLEAN_TIERS = ${JSON.stringify(cleanTiers)};

const HEALTH_DATA = {
  core: ${JSON.stringify(core)},
  proj: ${JSON.stringify(proj)}
};
`;

  const healthPath = path.join(__dirname, 'health_data.js');
  fs.writeFileSync(healthPath, healthOutput);
  console.log(`✅ health_data.js written`);
}

main().catch(err => {
  console.error('❌ Refresh failed:', err);
  process.exit(1);
});

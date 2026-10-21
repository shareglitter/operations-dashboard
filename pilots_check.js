#!/usr/bin/env node
/**
 * Pilots Dashboard — consistency check.
 *
 * Pulls the pilot tables through the deployed proxy (no token needed), runs the
 * pure compute block from pilots.html (between the @compute-start/@compute-end
 * markers) and prints the model plus a handful of invariants. Run after any
 * Airtable field change or edit to the compute block:
 *
 *   node pilots_check.js [proxy-url]
 */
const fs = require('fs'), vm = require('vm'), path = require('path');

const PROXY = process.argv[2] || 'https://glitter-ops-dashboard.netlify.app/.netlify/functions/at-proxy';

// Lift the page's config, helpers and compute block into a bare context.
const html = fs.readFileSync(path.join(__dirname, 'pilots.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const cut = (from, to) => script.slice(script.indexOf(from), script.indexOf(to));
const ctx = { console, location: { hostname: 'check', protocol: 'https:' } };
vm.createContext(ctx);
vm.runInContext(cut('// ── Config ──', 'let charts = {};') + cut('// ── Helpers ──', '// ── Airtable via proxy') + cut('// @compute-start', '// @compute-end'), ctx);
// Top-level `const`s don't become context globals — read them back with an expression.
const { T, CS_FIELD, PLEDGE_FIELD, LEAD_BLOCK_LOOKUP, FUNDING_LEVEL, EXCLUDE_FLAG, one, buildAmbassadorModel } =
  vm.runInContext('({ T, CS_FIELD, PLEDGE_FIELD, LEAD_BLOCK_LOOKUP, FUNDING_LEVEL, EXCLUDE_FLAG, one, buildAmbassadorModel })', ctx);

async function fetchAT(table, fields, filter) {
  const res = await fetch(PROXY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, fields, filter }) });
  const body = await res.json();
  if (!res.ok) throw new Error(`Proxy ${res.status} — ${table} — ${body.error}`);
  return body.records;
}

const checks = [];
const check = (name, ok, detail = '') => { checks.push(ok); console.log(`  ${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`); };

(async () => {
  const now = new Date().toISOString();
  const [ambassadors, shifts, leads, blocks] = await Promise.all([
    fetchAT(T.ambassadors, ['Name', 'Status', 'Start Date', 'Assigned Blocks']),
    fetchAT(T.shifts, ['Date', 'Ambassadors', 'Hours Worked', 'Doors Knocked', 'Activity Type', 'Pay Due']),
    fetchAT(T.leads, ['Date of Contact', 'Ambassador Name', 'Block', LEAD_BLOCK_LOOKUP, 'Status', 'Subscriber Record', CS_FIELD, PLEDGE_FIELD, 'Commission Amount']),
    fetchAT(T.blocks, ['Block Code', 'Ambassadors', FUNDING_LEVEL, 'Total Subscribers', 'Funding Type', EXCLUDE_FLAG, 'Last Clean Date [Rollup]'], '{Ambassadors}!=""'),
  ]);
  const m = buildAmbassadorModel({ ambassadors, shifts, leads, blocks, now });
  const t = m.totals;

  console.log(`\nAmbassadors: ${t.ambassadors} (${t.withActivity} with activity) · shifts ${t.shifts} · hours ${t.hours} · doors ${t.doors}`);
  console.log(`Leads ${t.leads} → active ${t.active} / pending ${t.pending} / lost ${t.lost} / unlinked ${m.stages.lead}`);
  console.log(`MRR added $${t.mrr.toFixed(0)} · cost $${t.cost} · cost/conv ${t.costPerConv == null ? '—' : '$' + t.costPerConv.toFixed(0)} · payback ${t.paybackMonths == null ? '—' : t.paybackMonths.toFixed(1) + ' mo'}`);
  console.log('By month:'); m.months.forEach(x => console.log(`  ${x.month}  shifts ${x.shifts}  hrs ${x.hours}  leads ${x.leads}  active ${x.active}  mrr $${x.mrr.toFixed(0)}  pay $${x.pay}  comm $${x.commission}`));
  console.log('By ambassador:'); m.ambassadors.forEach(a => console.log(`  ${a.name.padEnd(20)} shifts ${String(a.shifts).padEnd(3)} hrs ${String(a.hours).padEnd(5)} leads ${String(a.leads).padEnd(3)} active ${String(a.active).padEnd(3)} mrr $${a.mrr.toFixed(0)}`));
  console.log('Data flags:', JSON.stringify(m.quality));

  console.log('\nChecks:');
  const sum = k => m.months.reduce((s, x) => s + x[k], 0);
  check('months sum to totals (hours)', Math.abs(sum('hours') - t.hours) < 1e-6);
  check('months sum to totals (leads)', sum('leads') === t.leads);
  check('months sum to totals (pay)', Math.abs(sum('pay') - t.pay) < 1e-6);
  check('stages sum to leads', m.stages.lead + m.stages.pending + m.stages.active + m.stages.lost === t.leads);
  check('ambassadors sum to totals (active)', m.ambassadors.reduce((s, a) => s + a.active, 0) === t.active);
  check('every shift/lead ambassador exists', !m.ambassadors.some(a => a.name === '(deleted ambassador)'));
  check('no block links a missing ambassador', !m.blocks.some(b => b.ambassadors.includes('(deleted ambassador)')));
  check('activity types all bucketed', shifts.every(r => ['Door Knocking', 'Event', 'Admin', 'Training', undefined].includes(r.fields['Activity Type'])), 'new Activity Type values fall into "Admin & training"');
  const cs = new Set(leads.map(r => one(r.fields[CS_FIELD])).filter(Boolean));
  const known = new Set(['Active', 'Invoice Sent', 'Pledged, Not Yet Paying', 'Pledged, Block Not Active', 'Payment Churn', 'Missing Payment', 'Never Converted', 'Negative Churn', 'Positive Churn']);
  check('contribution statuses all known', [...cs].every(s => known.has(s)), [...cs].filter(s => !known.has(s)).join(', ') || 'unknown ones would count as "lost"');
  check('proxy answered every field (no 422)', true);

  const bad = checks.filter(ok => !ok).length;
  console.log(bad ? `\n${bad} check(s) failed` : '\nAll checks passed');
  process.exit(bad ? 1 : 0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });

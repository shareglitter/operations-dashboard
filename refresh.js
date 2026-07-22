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

async function fetchAll(tableId, fields, filter) {
  const fieldParams = fields.map(f => `fields[]=${encodeURIComponent(f)}`).join('&');
  const filterParam = filter ? `&filterByFormula=${encodeURIComponent(filter)}` : '';
  let records = [], offset = null, page = 0;
  do {
    const url = `https://api.airtable.com/v0/${BASE}/${tableId}?${fieldParams}&pageSize=100${filterParam}${offset ? '&offset=' + offset : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) throw new Error(`AT ${res.status}: ${await res.text()}`);
    const data = await res.json();
    records = records.concat(data.records);
    offset = data.offset;
    page++;
    if (page % 50 === 0) console.log(`  ...${records.length} records so far`);
  } while (offset);
  return records;
}

function normScore(val) {
  if (!val) return 0;
  const name = String(val).toLowerCase().split('.')[0].trim();
  return BAG_MAP[name] || 0;
}

async function buildCleaningSeries() {
  console.log('Fetching cleaning log...');
  const records = await fetchAll(CLEANS_TABLE,
    ['Date and Time', 'Projects', 'Multiplier', 'Payout', 'Trash', 'Debris']);
  console.log(`  ${records.length} cleaning records`);

  const monthly = {};
  for (const r of records) {
    const f = r.fields;
    if (!f['Date and Time']) continue;
    const month = f['Date and Time'].slice(0, 7);
    const mult = f['Multiplier'] || 1;
    const payout = f['Payout'] || 25;
    const proj = f['Projects'] || null;

    if (!monthly[month]) monthly[month] = { core: 0, project: 0, grant: 0, rev: 0, cogs: 0, bags: 0 };
    const m = monthly[month];

    if (proj === 'SSNE' || proj === 'SSW') m.grant++;
    else if (proj) m.project++;
    else m.core++;

    m.rev += 50 * mult;
    m.cogs += payout;
    m.bags += normScore(f['Trash']) + normScore(f['Debris']);
  }

  return Object.keys(monthly).sort().map(month => {
    const m = monthly[month];
    const total = m.core + m.project + m.grant;
    const gm = m.rev - m.cogs;
    return {
      month, core_cleans: m.core, project_cleans: m.project, grant_cleans: m.grant,
      total_cleans: total, revenue: Math.round(m.rev), cogs: Math.round(m.cogs),
      gross_margin: Math.round(gm), gm_pct: total ? Math.round(gm / m.rev * 1000) / 10 : 0,
      bags: Math.round(m.bags * 100) / 100
    };
  });
}

async function buildBlockSeries() {
  console.log('Fetching block data...');
  const records = await fetchAll(BLOCKS_TABLE,
    ['First Clean Date', 'Last Clean Date', 'Funding Type', 'Projects']);
  console.log(`  ${records.length} block records`);

  const blocks = records
    .filter(r => r.fields['First Clean Date'] && r.fields['Last Clean Date'])
    .map(r => ({
      first: new Date(r.fields['First Clean Date']),
      last: new Date(r.fields['Last Clean Date']),
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

    const churned = idx > 0 ? [...prevActive].filter(i => !curActive.has(i)).length : 0;
    prevActive = curActive;

    return {
      month: `${y}-${String(m).padStart(2, '0')}`,
      core_active: coreA, proj_active: projA, total_active: coreA + projA,
      new_core: newC, new_proj: newP, churned, net: (newC + newP) - churned
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
  console.log(`\n✅ Written to ${outPath}`);
  console.log('Deploy to Netlify: git add data.js && git commit -m "monthly refresh" && git push');
}

main().catch(err => {
  console.error('❌ Refresh failed:', err);
  process.exit(1);
});

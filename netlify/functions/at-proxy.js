/**
 * Airtable API proxy — keeps the token server-side.
 *
 * Client sends POST with { table, fields, filter?, base?, maxRecords? }
 * Function fetches all pages from AT and returns the combined records.
 *
 * Set AIRTABLE_TOKEN in Netlify dashboard: Site settings → Environment variables
 *
 * ALLOW-LIST. The site URL is public, so the proxy only answers for the exact
 * base / table / field combinations the two pages (index.html, pilots.html)
 * actually request. Anything else — another table, an extra field such as
 * Email, a filter formula that references a field not listed here — gets a 403
 * naming what was refused. Field-level checks matter because Subscribers and
 * Active Subscriptions hold emails, phones and Stripe ids; filterByFormula is
 * checked too, or `{Email}="x"` would be an oracle for enumerating them.
 *
 * To let a page request a new field: add it below, push (Netlify redeploys the
 * function), then ship the page change. `node pilots_check.js` fails loudly
 * with the 403 text if the two drift apart.
 */

const CLEANING_BASE = 'appzuuUtAQVDg0YW1';
const OPSHUB_BASE = 'app87a9ZvrVJZiFuZ';
const DEFAULT_BASE = CLEANING_BASE;

const ALLOW = {
  [CLEANING_BASE]: {
    // Cleaning Log — index.html current-month cleans
    tblaDXbhz6DEcytgh: ['Date and Time', 'Project', 'Multiplier', 'Payout', 'Trash', 'Debris'],
    // Blocks — index.html live block state; pilots.html ambassador + compost blocks
    tblssvtXzgL200hSi: ['Block Code', 'Funding Type', 'Projects', 'Funding Level (with Override and Cap)', 'Total Subscribers',
      'First Clean Date', 'Last Clean Date [Rollup]', 'Exclude from Dashboard',
      'Ambassadors', 'Compost Pilot', 'Compost Pickup Day', 'Count Compost Add-On Active Subscriptions'],
    // index.html Metrics/Financials; pilots.html compost add-ons
    'Active Subscriptions': ['Contribution Status', 'Share', 'Funding Type (from Block)', 'MRR', 'MRR (Share)', 'MRR (Donation)',
      'Compost Add-On', 'Last Modified - Compost Add-On', 'Compost Opt-In (from Subscriber)', 'Block Code', 'Member Since'],
    // pilots.html service interest — opt-in flags synced from ActiveCampaign (Oct 2026)
    Subscribers: ['Snow opt-in', 'Leaves opt-in', 'TrashCan opt-in', 'Weeds opt-in', 'Compost opt-in', 'Member Since'],
    // pilots.html ambassadors
    Ambassadors: ['Name', 'Status', 'Start Date', 'Assigned Blocks'],
    'Ambassador Shifts': ['Date', 'Ambassadors', 'Hours Worked', 'Doors Knocked', 'Activity Type', 'Pay Due'],
    'Ambassador Leads': ['Date of Contact', 'Ambassador Name', 'Block', 'Blocks (from Subscriber Record)', 'Status', 'Subscriber Record',
      'Contribution Status (from Active Subscriptions) (from Subscriber Record)', 'Pledge (from Subscriber Record)', 'Commission Amount'],
  },
  [OPSHUB_BASE]: {
    // Monthly Metrics — index.html President's Metrics tab
    tblqg4SxBkQoliQrn: ['Name',
      'Cleaning Health % - Goal', 'Cleaning Health % - Actual', 'Funded Blocks - Goal', 'Funded Blocks - Actual',
      'Monthly Churn % - Goal', 'Monthly Churn % - Actual', 'Block Growth % - Goal', 'Block Growth % - Actual',
      'Cleaner Churn % - Goal', 'Cleaner Churn % - Actual', 'Partnerships - Goal', 'Partnerships - Actual',
      'Grants $ - Goal', 'Grants $ - Actual', 'Backlog Reduced % - Goal', 'Backlog Reduced % - Actual',
      'Cleaning Equivalents - Goal', 'Cleaning Equivalents - Actual', 'Active Subscriptions - Goal', 'Active Subscriptions - Actual'],
    // Initiatives
    tblBvYsdfCuRKj4rF: ['Name', 'KPI', 'KPI (Goal)', 'KPI (Current)', '# of Projects Active', '# of Projects Total'],
  },
};
const MAX_FILTER_LEN = 600;

// Returns null if the request is allowed, else a human-readable reason.
function denyReason({ base, table, fields, filter }) {
  const tables = ALLOW[base];
  if (!tables) return `base "${base}" is not served by this proxy`;
  const allowed = tables[table];
  if (!allowed) return `table "${table}" is not served by this proxy`;
  if (!fields.length) return 'fields[] must name at least one field (no whole-record requests)';
  const badFields = fields.filter(f => !allowed.includes(f));
  if (badFields.length) return `field(s) not served for "${table}": ${badFields.join(', ')}`;
  if (filter != null) {
    if (typeof filter !== 'string' || filter.length > MAX_FILTER_LEN) return 'filter must be a string under 600 characters';
    const refs = [...filter.matchAll(/\{([^}]*)\}/g)].map(m => m[1]);
    const badRefs = refs.filter(r => !allowed.includes(r));
    if (badRefs.length) return `filter references field(s) not served for "${table}": ${badRefs.join(', ')}`;
  }
  return null;
}

exports.handler = async (event) => {
  // CORS headers for local dev
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST only' }) };
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'AIRTABLE_TOKEN not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { table, fields, filter, base, maxRecords } = body;
  if (!table || !Array.isArray(fields)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'table (string) and fields (array) required' }) };
  }

  const baseId = base || DEFAULT_BASE;

  const reason = denyReason({ base: baseId, table, fields, filter });
  if (reason) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: `Not in proxy allow-list — ${reason}. Add it to netlify/functions/at-proxy.js if a page needs it.`, base: baseId, table })
    };
  }

  // Airtable allows 5 req/s per base and hands out a 30s lockout on breach. A
  // single dashboard load fans out to ~8 sequential pages, so on a 429/5xx we
  // back off and retry rather than surfacing a transient failure to the viewer.
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const MAX_RETRIES = 4;
  const fetchAirtable = async (url) => {
    for (let attempt = 0; ; attempt++) {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      // Retry only rate-limit / transient-server errors. Everything else — success
      // or a real 4xx like 422 (bad field name) — is returned to the error path below.
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= MAX_RETRIES) return res;
      const retryAfter = parseInt(res.headers.get('retry-after') || '', 10);
      const wait = Number.isFinite(retryAfter) ? retryAfter * 1000 : Math.min(30000, 500 * 2 ** attempt);
      await sleep(wait);
    }
  };

  try {
    const params = new URLSearchParams();
    fields.forEach(f => params.append('fields[]', f));
    params.set('pageSize', '100');
    if (filter) params.set('filterByFormula', filter);
    if (maxRecords) params.set('maxRecords', String(maxRecords));

    let records = [], offset = null;

    do {
      if (offset) params.set('offset', offset);
      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?${params}`;
      const res = await fetchAirtable(url);

      if (!res.ok) {
        const errText = await res.text();
        // Airtable errors are {"error":{"type":"UNKNOWN_FIELD_NAME","message":"..."}}.
        // Flatten to "TYPE: message" so it survives the trip to the browser console.
        let detail = errText;
        try {
          const e = JSON.parse(errText).error;
          if (e) detail = typeof e === 'string' ? e : `${e.type}: ${e.message}`;
        } catch { /* not JSON — pass through raw */ }
        return {
          statusCode: res.status,
          headers,
          body: JSON.stringify({ error: detail, base: baseId, table })
        };
      }

      const data = await res.json();
      records = records.concat(data.records);
      offset = data.offset;
    } while (offset);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ records, count: records.length })
    };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

exports.denyReason = denyReason;   // exported for tests
exports.ALLOW = ALLOW;

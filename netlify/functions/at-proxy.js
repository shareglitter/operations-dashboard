/**
 * Airtable API proxy — keeps the token server-side.
 * 
 * Client sends POST with { table, fields, filter? }
 * Function fetches all pages from AT and returns the combined records.
 * 
 * Set AIRTABLE_TOKEN in Netlify dashboard: Site settings → Environment variables
 */

const DEFAULT_BASE = 'appzuuUtAQVDg0YW1';

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
  // fields may be [] — that's a deliberate "give me every field" request used when
  // probing a table whose field names we're unsure of. Only undefined/null is an error.
  if (!table || !Array.isArray(fields)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'table (string) and fields (array) required' }) };
  }

  const baseId = base || DEFAULT_BASE;

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

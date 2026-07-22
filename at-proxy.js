/**
 * Airtable API proxy — keeps the token server-side.
 * 
 * Client sends POST with { table, fields, filter? }
 * Function fetches all pages from AT and returns the combined records.
 * 
 * Set AIRTABLE_TOKEN in Netlify dashboard: Site settings → Environment variables
 */

const BASE_ID = 'appzuuUtAQVDg0YW1';

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

  const { table, fields, filter } = body;
  if (!table || !fields) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'table and fields required' }) };
  }

  try {
    const fieldParams = fields.map(f => `fields[]=${encodeURIComponent(f)}`).join('&');
    const filterParam = filter ? `&filterByFormula=${encodeURIComponent(filter)}` : '';
    let records = [], offset = null;

    do {
      const url = `https://api.airtable.com/v0/${BASE_ID}/${table}?${fieldParams}&pageSize=100${filterParam}${offset ? '&offset=' + offset : ''}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

      if (!res.ok) {
        const errText = await res.text();
        return { statusCode: res.status, headers, body: JSON.stringify({ error: `Airtable: ${errText}` }) };
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

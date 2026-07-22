# Glitter Operations Dashboard

Single source of truth for cleaning operations, revenue, block growth, and churn.

## What it shows

**Cleaning & Revenue tab:** Monthly cleans (Core/Project/Grant stacked), revenue overlay, bags diverted, gross margin. Data from Airtable Cleaning Log (Sep 2021 →).

**Block Growth tab:** Cumulative active blocks, new vs churned per month, with All/Core/Project filters. Data from Airtable Blocks table (Jan 2022 →).

**Data Table tab:** Combined monthly summary, exportable as CSV.

## Architecture

- `index.html` — The app. Chart.js, vanilla JS, no build step.
- `data.js` — Historical monthly data (completed months only). Updated monthly.
- `refresh.js` — Node script that pulls from Airtable and regenerates data.js.
- On page load, the app fetches the **current month's** data live from Airtable API (cleaning log + blocks). Historical data loads instantly from the cached data.js.

## Deployment (from VS Code terminal)

```bash
# 1. Initialize git repo
git init
git add .
git commit -m "initial deploy"

# 2. Create GitHub repo and push
gh repo create glitter-ops-dashboard --private --source=. --push
# (or create on github.com and git remote add origin ...)

# 3. Connect to Netlify
#    Go to app.netlify.com → Add new site → Import from Git → select the repo
#    Build settings: leave blank (no build command needed)
#    Publish directory: .

# 4. Set the Airtable token in Netlify (REQUIRED for live data)
#    Netlify dashboard → Site settings → Environment variables
#    Add: AIRTABLE_TOKEN = pat...  (your Airtable personal access token)

# 5. Set the same token as a GitHub secret (for monthly auto-refresh)
#    GitHub repo → Settings → Secrets → Actions → New repository secret
#    Name: AIRTABLE_TOKEN   Value: pat...
```

**Security:** The API token is NEVER in client-side code. All Airtable calls go through a Netlify serverless function (`netlify/functions/at-proxy.js`) that reads the token from the server environment. Safe to share the URL publicly.

## Monthly refresh

**Automatic (recommended):** The GitHub Action runs on the 2nd of each month. It pulls all data from Airtable, rebuilds data.js, and commits. Netlify auto-deploys.

Setup: Add your Airtable token as a GitHub secret named `AIRTABLE_TOKEN`.

**Manual:** Run locally if needed:
```bash
node refresh.js
git add data.js && git commit -m "manual refresh" && git push
```

**If no one refreshes:** The dashboard still works — it shows historical data through the last refresh, and always fetches the current month live. Only the gap between the last refresh and last month would be missing, and the next refresh (manual or scheduled) fills it in.

## Embedding in Softr

Add a "Custom Code" or "Embed" block to your Softr page with the Netlify URL as an iframe:
```html
<iframe src="https://YOUR-SITE.netlify.app" width="100%" height="900" frameborder="0"></iframe>
```

## Airtable API token

The token lives in two places (neither is in source code):
1. **Netlify environment variable** — used by the serverless proxy function at runtime
2. **GitHub secret** — used by the monthly refresh Action

If you rotate the token, update both. The token never appears in any committed file.

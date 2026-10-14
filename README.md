# Farcon Wealth

AMFI-registered mutual fund distributor site (ARN 229006). The homepage, planning tools, and enquiry forms run as a Vite + React app. Leads can be appended to the Google Sheet **Farcon Leads**.

This repository does not deploy or merge on its own. Production stays on the existing Cloudflare Worker until you choose to publish.

## Local development

```bash
npm install --legacy-peer-deps
npm run dev
```

The dev server is `server.ts` (Express + Vite) on port 3000. `POST /api/leads` validates each enquiry. If `LEADS_WEBHOOK_URL` is unset, the API still accepts the lead and reports `forwarded: false`.

```bash
npm run lint
npm run build
npm run start   # serves dist when NODE_ENV=production
```

## Pages

Home, About Us, Our Services, Mutual Funds, Calculators (SIP, lumpsum, goal, retirement), Portfolio Review, Investor Login, Investor Education, Contact Us, and Regulatory Disclosures. Investor Login does not authenticate and does not store passwords.

Market levels and fund NAVs on the marketing pages are labelled illustrative.

## PWA

`public/manifest.webmanifest` and `public/sw.js` make the site installable. The service worker keeps an offline shell: pages try the network first and fall back to the cached app shell. Hashed assets and images are cached after they load.

## Leads sheet

Spreadsheet: **Farcon Leads**  
ID: `1uUn5ZLBny1_0A4tiPTdZv0CShnlq5K8IbKsloA-FGKc`

Columns, in order:

1. Timestamp (set by Apps Script)
2. Form
3. Name
4. Email
5. Phone
6. City
7. Goal
8. Investment Type
9. Amount
10. Time Horizon
11. Risk Profile
12. Message
13. Source Page
14. Status (`New`)

### Apps Script deployment

1. Open the spreadsheet.
2. Extensions → Apps Script.
3. Replace the default script with `apps-script/leads-webhook.gs` and save.
4. Deploy → New deployment → type **Web app**.
5. Execute as **Me**. Who has access: **Anyone**.
6. Copy the web app URL (it ends in `/exec`).
7. Treat that URL as a secret. Anyone who has it can append rows.

The script writes a header row if the `Farcon Leads` tab is empty, appends one row per POST, stamps the server time, sets Status to `New`, and returns JSON `{ "ok": true }`.

### Wire the URL

Local:

```bash
# .env (do not commit)
LEADS_WEBHOOK_URL="https://script.google.com/macros/s/…/exec"
```

Cloudflare Worker (only when you are ready to deploy — not part of opening this PR):

```bash
npx wrangler secret put LEADS_WEBHOOK_URL
```

`worker/index.ts` reads `LEADS_WEBHOOK_URL`, checks the body, and POSTs the mapped fields. `wrangler.toml` serves `dist/` and routes `/api/leads` to that handler. Do not put the webhook URL in `wrangler.toml`.

Forms that post this shape: Contact, Portfolio Review, and the consultation modal (mapped onto the same columns).

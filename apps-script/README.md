# Farcon Leads Apps Script

The sheet **Farcon Leads** (`1uUn5ZLBny1_0A4tiPTdZv0CShnlq5K8IbKsloA-FGKc`) already has one tab, `Farcon Leads`, and these 14 headers in row 1:

Timestamp, Form, Name, Email, Phone, City, Goal, Investment Type, Amount, Time Horizon, Risk Profile, Message, Source Page, Status.

Do not add columns. `apps-script/Code.gs` writes into that row. Lead ID, consent and its timestamp, contact preference, and UTM parameters are included in **Message**. The same phone or email within 24 hours updates that row and returns `duplicate: true`.

## Deploy

1. Open the spreadsheet. Go to **Extensions → Apps Script**.
2. Replace the default `Code.gs` with the file in this folder. Remove any older `leads-webhook` file in that project so only this script runs.
3. **Project Settings → Script properties → Add script property.** Name: `LEADS_SECRET`. Value: a long random string. The same value is the worker secret `LEADS_SECRET`. It is not stored in this repo.
4. **Deploy → New deployment → Type: Web app.**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the web app URL (it ends in `/exec`).
6. On the `farcon-wealth` worker, for production and for preview:

```bash
npx wrangler secret put LEADS_WEBHOOK_URL
npx wrangler secret put LEADS_SECRET
```

Paste the `/exec` URL for the first secret and the same `LEADS_SECRET` string for the second.

7. Send one test lead from Contact. The script returns `{ "ok": true }`. The sheet gains one row, Status `New`, and the Message starts with the visitor’s note and `Lead ID:`. A second submit with the same phone inside 24 hours returns `duplicate: true` and sets Status to `Updated`.

Optional: `npx wrangler secret put TURNSTILE_SECRET` only if a Turnstile widget is switched on. Leave it unset and the worker skips the check. A KV namespace bound as `LEADS_KV` is optional; without it the worker rate-limits in memory.

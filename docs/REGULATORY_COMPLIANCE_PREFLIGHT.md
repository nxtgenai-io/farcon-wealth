# Farcon Wealth — Regulatory & Communications Compliance Preflight

> **Document Status:** Engineering & Communications Preflight Audit (28 November 2026)  
> **Disclaimer:** This document is a technical and editorial preflight review, **not legal advice or regulatory certification**. Farcon Wealth must complete owner documentary checks and obtain qualified Indian securities-law review prior to production release.

---

## Primary Regulatory Sources Reviewed
1. **SEBI (Mutual Funds) Regulations, 2026** (Fifth Schedule — Advertisement Code, amended through 10 October 2026):  
   https://www.sebi.gov.in/web/?file=https%3A%2F%2Fwww.sebi.gov.in%2Fsebi_data%2Fattachdocs%2Foct-2026%2F1792659909505.pdf
2. **AMFI Master Circular for Mutual Fund Distributors** (14 January 2026 — Code of Conduct, Regular Plan rules, prominent commission/SID/SAI/KIM links, confidentiality & data handling):  
   https://www.amfiindia.com/uploads/AMFI_Master_Cicular_for_MF_Ds_3c7f5ee44f.pdf
3. **SEBI Investor Grievance Redressal / SCORES:**  
   https://investor.sebi.gov.in/securities-resolvedispute.html and https://scores.sebi.gov.in/faqs
4. **SEBI Investor Charter:**  
   https://investor.sebi.gov.in/Investor-charter.html
5. **Digital Personal Data Protection Rules, 2025 (MeitY Gazette):**  
   https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf

---

## Control-by-Control Preflight Matrix

| Area | Regulatory Expectation | Codebase Status (Current Branch) | Gate Outcome |
| :--- | :--- | :--- | :--- |
| **Direct Plan Prohibition (MFD Role)** | AMFI Jan 2026 Master Circular prohibits MFDs from dealing in Direct Plans for distributed client relationships. | **Remediated (Fail-Closed):** All `"Direct Growth"` labels, hardcoded schemes, and stale NAVs removed from Homepage (`FeaturedFundsSection.tsx`), Explorer (`MutualFundExplorerView.tsx`), and `FundsPage` (`SitePages.tsx`). | **PASS (Non-Transactional)** — Blocked on owner scheme verification (`LEGAL_OWNER_INPUTS.md` #3) before re-enabling schemes. |
| **Stale NAVs / Performance Claims** | No stale NAVs, synthetic returns, or `"latest"/"top funds"` claims when authorized live data is unavailable. | **Remediated:** Static October 2026 NAVs, CAGRs, `"top funds"`, and Demo mutual fund data removed (`mockFunds.ts` fails closed to `[]`). Homepage `MarketSnapshot` fails closed with NSE/BSE links. | **PASS** |
| **Exact SEBI Standard Warning** | `"Mutual Fund investments are subject to market risks, read all scheme related documents carefully."` — exact words & punctuation. | **Remediated:** Standardized in `COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk` and applied across Footer, Hero Calculator, Milestone Planner, AMFI Band, Disclosures, Blogs, Quizzes, AI Drawer, and Calculators. | **PASS** |
| **Commission Disclosure** | Full disclosure of material commission information and prominent commission-rate links alongside SID/SAI/KIM links on digital platforms. | **Partially Remediated:** Added prominent `"Commission Disclosures"` links in Footer & AMFI Band routing to `/disclosures#commission`, plus SEBI/AMFI document portal links. Actual commission percentages remain blocked on owner schedules (`LEGAL_OWNER_INPUTS.md` #4). | **BLOCKED (Owner Input #4)** for transactional launch. |
| **Legal & Utility Routing** | Direct entry, refresh, trailing-slash normalization, and canonical consistency across all routes. | **Remediated:** Added `src/lib/routing/normalizeRoute.ts`, `/faqs` alias -> `/faq`, `/commission-disclosure` route, hash scrolling, and `wrangler.toml` `html_handling = "drop-trailing-slash"`. | **PASS** |
| **Wording, Claims & Ambiguous "Direct"** | Avoid ambiguous `"Direct"` for account custody, unsubstantiated `"audited"`, `"zero hidden fees"`, `"no product push"`, `"near zero"`, or invented founder attribution. | **Remediated:** Replaced with `"Investments Held in Your Name"` / `"In Your Own Name"`; removed `"zero hidden fees"`, `"audited"`, `"zero product push"`, `"Yahoo Finance"`, and fake `"Founder / Director"` attribution. Softened blog claims & clarified ELSS Old vs New Tax Regime rules. | **PASS** |
| **Identity, Address & Grievance** | True entity name, ARN proof, registered vs operating address proof, named grievance officer & actual process. | **Code Updated / Pending Proof:** Displays verified phone numbers (`tel:`), unchanged WhatsApp (`+91 76730 08502`), Unison Tower address, and neutral escalation steps without invented officer names or SLAs. | **BLOCKED (Owner Inputs #1, #2, #5)** until documentary proof supplied. |
| **Privacy & DPDP Rules 2025** | Accurate field inventory, processors, unchecked consent by default, correction/deletion channel, phased DPDP commencement. | **Remediated:** `ConsultationModal` & `LeadForm` enforce `consent: false` default; `/privacy` documents Cloudflare, Apps Script/Sheets webhook, `wa.me`, `youtube-nocookie.com`, and phased DPDP commencement. | **Pending Legal Review & Retention Schedule (#6)** |
| **Environment & Indexing Separation** | Preview Worker (`*.workers.dev`) must never conflict with canonical `farconwealth.com` DNS or get indexed. | **Remediated:** `worker/index.ts` serves `X-Robots-Tag: noindex, nofollow` and `Disallow: /` on `robots.txt` for all `.workers.dev` preview requests; `SITE_URL` (`farconwealth.com`) & DNS untouched. | **PASS** |

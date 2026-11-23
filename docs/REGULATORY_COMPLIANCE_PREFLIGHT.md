# Farcon Wealth — Regulatory & Communications Compliance Preflight

> **Document Status:** Internal Engineering & Editorial Preflight Review
> **Applicable Regulations:** SEBI (Mutual Funds) Regulations, 2026 (amended through 10 October 2026); AMFI Master Circular for Mutual Fund Distributors (Code of Conduct); SEBI Advertising Guidelines for Capital Market Intermediaries.
> **Notice:** This document constitutes a conservative communications preflight audit, not a formal legal certification.

---

## 1. Regulatory Status & Distributor Role
- **Entity Identity:** Farcon Wealth Private Limited.
- **Registration Classification:** AMFI-Registered Mutual Fund Distributor.
- **ARN:** 329006.
- **Verification:**
  - The website prominently displays the registration category and ARN in the utility bar, navbar drawer, footer legal text, About page, and regulatory disclosures.
  - The website avoids using protected terms such as "Investment Adviser", "Independent Financial Adviser", "Wealth Management RIA", or implies offering fee-only advisory services under SEBI (Investment Advisers) Regulations, 2013.
  - The scope of engagement is clearly defined as mutual fund distribution, goal planning, and scheme facilitation.

## 2. Market Data & Data Integrity
- **Previous Gap:** The homepage featured an illustrative teaching shelf with static returns and NAVs dated 30 September 2026.
- **Remediation:**
  - Removed static scheme figures and synthetic NAVs.
  - Implemented the `MarketSnapshot` section and server-side provider abstraction (`src/lib/api/market.ts`).
  - Strict compliance with NSE Data Policy and Yahoo Finance Terms: Absent a commercial redistribution license, live quotes are NOT scraped or fabricated.
  - Transparent state: Shows "Provider connection pending" alongside direct external links to official portals:
    - [NSE India Live Market Dashboard](https://www.nseindia.com/market-data/live-equity-market)
    - [BSE India SENSEX Index](https://www.bseindia.com/sensex/code/16/)

## 3. Disclosures & Risk Warnings
- **Mandatory Warning:** "Mutual fund investments are subject to market risks; read all scheme related documents carefully."
  - Verified present across homepage footer, service view, market snapshot, calculators, and educational articles.
- **Custody Clarification:** Explicit notice that Farcon Wealth never holds investor funds. Capital moves directly via regulated clearing platforms (BSE StAR MF, NSE NMF II) to respective Asset Management Companies (AMCs) in the investor's own name.
- **Commission Disclosure:** Clear statement in `DisclosuresPage` and `LegalViews` noting that Farcon Wealth receives standard distributor trail commissions directly from AMCs as per SEBI regulations, without extra charges to investors.

## 4. Educational Content Audit
- Verified all 7 articles in `src/content/blogs/blogData.ts`:
  - Removed unsubstantiated statistical claims (e.g., unqualified assertions of "zero probability of loss").
  - Phrased historical market cycles factually and conservatively.
  - Explicitly stated that past performance does not guarantee future results.
  - Embedded risk warnings on all educational reading materials.

## 5. Contact Information & Business Authenticity
- Canonical Address: `4th Floor, Unison Tower, Near Rajeev Nagar Crossing, Atal Path, Patna – 800013, Bihar, India`.
- Primary Contact Phone: `+91 93077 45700` (plus additional lines `+91 92967 87132`, `+91 97713 48560`).
- WhatsApp Official: `+91 76730 08502`.
- Canonical Google Maps embed and link verified matching Unison Tower, Atal Path, Patna.

## 6. Preflight Conclusion
The website implementation conforms strictly to the conservative communication requirements for an AMFI-registered Mutual Fund Distributor.

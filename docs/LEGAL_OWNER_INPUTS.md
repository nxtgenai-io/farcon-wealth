# Farcon Wealth — Owner & Legal Inputs Required Before Compliance Sign-Off

**Audit Date:** 28 November 2026  
**Target Branch:** `fix/audit-remediation-mobile-hero`  
**Status:** **HARD RELEASE BLOCKERS PRESENT FOR TRANSACTIONAL / SCHEME BROWSING**

This document tracks every factual, documentary, and regulatory item required from the business owner and qualified Indian securities counsel before representing the website as production-compliant under SEBI (Mutual Funds) Regulations, 2026, the AMFI Master Circular for Mutual Fund Distributors (14 January 2026), and the Digital Personal Data Protection Rules, 2025.

---

## Hard Release Blockers (Must Be Provided by Owner / Legal Counsel)

### 1. AMFI ARN Registration & Legal Entity Proof
- **Current State:** Site displays `Farcon Wealth Private Limited` and `AMFI-Registered Mutual Fund Distributor · ARN: 329006`.
- **Required Owner Input:** Current AMFI registration certificate / renewal letter for ARN `329006` confirming the exact attached legal entity name (corporate entity vs proprietary/individual registration) and active validity dates.

### 2. Registered Office vs Operating / Correspondence Address
- **Current State:** Site publishes `4th Floor, Unison Tower, Near Rajeev Nagar Crossing, Atal Path, Patna – 800013, Bihar, India` (previously `A-160, P.C. Colony, Kankarbagh, Patna – 800020`).
- **Required Owner Input:** Certificate of Incorporation / MCA master data / GST or lease proof confirming exact **Registered Office** address vs **Operating / Correspondence Office** address, and whether CIN/GSTIN should be displayed on legal pages.

### 3. Regular Plan Scheme Catalog, SID/SAI/KIM & Live Feed Integration
- **Current State:** Website is in **fail-closed non-transactional mode**. All scheme cards, static October 2026 NAVs, CAGRs, and `"Direct Growth"` labels have been removed (`src/data/mockFunds.ts` returns `[]`; `FeaturedFundsSection` and `FundsPage` render category overviews and official AMFI/SEBI links).
- **Required Owner Input (if scheme-level browsing is desired):**
  - Verified list of Regular Plan AMFI scheme codes (zero Direct Plan scheme codes) distributed under ARN `329006`.
  - Official current riskometer feed/mapping and live or authorized dated NAV source.
  - Direct official URLs to each displayed scheme's SID, SAI, and KIM documents.

### 4. AMC Empanelment List & Approved Commission-Rate Schedule
- **Current State:** `/disclosures#commission` discloses the Regular Plan trail commission model and explicitly states that scheme-wise AMC commission statements are pending owner upload/verification (no fabricated percentages; no claim that "upon request" suffices for transactional platforms). Footer and AMFI band display AMC wordmarks with an empanelment-verification notice.
- **Required Owner Input:**
  - Exact list of AMCs currently empanelled with ARN `329006` (approve or trim logos for SBI, HDFC, ICICI Prudential, Axis, Mirae Asset, Nippon India).
  - Current, approved **commission-rate schedule** across competing schemes (with effective dates and source) suitable for prominent publication on `/disclosures#commission`.

### 5. Grievance Officer Identity & Agreed SLA Timelines
- **Current State:** `/grievance` publishes email (`hello@farconwealth.com`), three telephone lines, and office address without inventing a Grievance Officer name or unverified response SLAs (`24 hours` / `5 days` removed).
- **Required Owner Input:**
  - Named Grievance Redressal Officer / Compliance contact name and designation.
  - Approved acknowledgement and resolution timelines matching internal SOPs.
  - Legal confirmation of escalation wording to respective AMCs/RTAs, AMFI, and SEBI SCORES (`scores.sebi.gov.in`) / SMART ODR.

### 6. Privacy Policy, DPDP Rules 2025 & Data-Processing Inventory
- **Current State:** `/privacy` truthfully reflects only what the codebase implements (form fields collected, Cloudflare Workers edge handling, optional Turnstile verification, optional Google Apps Script/Sheets webhook, external `wa.me` link, `youtube-nocookie.com` click-to-play, `sessionStorage` UTM capture, unchecked default consent).
- **Required Owner / Legal Input:**
  - Formal data-retention period & archival/deletion schedule for Google Sheets / email enquiries.
  - Named Privacy / Data Protection Contact (and Data Fiduciary particulars under DPDP Rules, 2025 phased commencement).
  - Confirmation on whether any external email/CRM automation or analytics tools are connected via webhook.

### 7. Consultation Scope & Booking Provider
- **Current State:** Primary/secondary CTAs route to interactive planner (`#planner`) and in-app 2-step consultation capture (`ConsultationModal`), avoiding unverified claims of `"free 15-minute call"`.
- **Required Owner Input:** Confirm whether consultations are always provided at zero upfront cost and supply an approved calendar/scheduling URL if external booking is desired.

### 8. Optional Leadership / Founder Section Assets
- **Current State:** Placeholder founder attribution and pending-video banner were replaced with a neutral `"A Note from Farcon Wealth"` section; `FARCON_CONFIG.founderVideoUrl` remains blank.
- **Required Owner Input:** Approved founder name, designation, photograph, written note, and verified YouTube video URL — only if a founder-attributed section is wanted.

### 9. Market Data Feed License (Optional)
- **Current State:** `MarketSnapshot` fails closed to `'unconfigured'` with official NSE/BSE links (`src/lib/api/market.ts`).
- **Required Owner Input:** Authorized commercial exchange market-data API credentials (`MARKET_DATA_API_KEY` + `MARKET_DATA_PROVIDER_URL`) if live index values are to be shown on the homepage.

# Farcon Wealth — Figma Make Handoff & Visual Polish Guide

> **Target Audience:** UI/UX Designers & Product Owners using Figma Make for final visual refinement.
> **Repository:** `nxtgenai-io/farcon-wealth`
> **Branch:** `feat/homepage-remainder-redesign-20261124`

---

## 1. Design Tokens & System Specifications

### Color Palette
- **Forest Green (Brand Primary):**
  - Main: `#0F3D2E` (`--fw-forest`)
  - Deep / Hover: `#0A291E`
  - Subtle Tint / Background: `#E7F3EC`
  - Border Accents: `#C5DDD0`
- **Warm Cream & Paper (Backgrounds):**
  - Page Canvas: `#F7F4EC` (`--fw-cream`)
  - Elevated Cards: `#FFFFFF`
  - Soft Card Surface: `#FFFDF8`
  - Divider Lines: `#E2DDD2` (`--fw-line`)
- **Heritage Gold (Accent & Highlights):**
  - Accent Gold: `#C9A24A` (`--fw-gold`)
  - Dark Gold / Hover: `#B8923E`
  - Light Gold: `#F6E2A4`
  - Translucent Badge: `rgba(201, 162, 74, 0.18)`
- **Typography & Ink:**
  - Headings & Primary Inks: `#17243A` / `#0F3D2E`
  - Body Text: `#1A241C`
  - Muted Editorial Copy: `#5E675C`
  - Captions & Timestamps: `#8B9188`

### Typography Scale
- **Headings (Sans & Serif Accents):**
  - Hero H1: `clamp(36px, 4.2vw, 60px)`, Line-height: `1.08`, Font: `Poppins`, Weight: `700`
  - Section Headings H2: `clamp(26px, 2.8vw, 42px)`, Line-height: `1.15`, Font: `Poppins`, Weight: `700`
  - Editorial Accents / Script: `Caveat`, cursive, Weight: `600`
- **Body & Controls:**
  - Primary Body: `Inter`, regular (`400`) & medium (`500`), Line-height: `1.55`
  - Card Titles: `Inter` / `Poppins`, Weight: `650`, `14px` – `18px`
  - Badges & Eyebrows: `Inter`, Weight: `600`, `11px` – `12px`, letter-spacing: `0.1em`, uppercase

### Elevation & Border Radii
- **Badges & Pills:** `999px`
- **Buttons & Small Tiles:** `10px` – `12px`
- **Cards (Service, Tools, Articles):** `14px` – `16px`
- **Feature Panels & Modals:** `20px` – `24px`
- **Shadows:** Soft diffuse shadows (`box-shadow: 0 4px 16px rgba(15, 61, 46, 0.04)`)

---

## 2. Section Audit & Screenshot Reference

All high-resolution screenshots are stored in the repository under `screenshots-stage2/` and mirrored in the artifact directory:

| Section | Description | Reference Asset |
| :--- | :--- | :--- |
| **Hero & Quick Estimator** | High-conversion hero with Quick Goal SIP Estimator | `screenshots-stage2/homepage-1440x900.png` |
| **Services Showcase** | 10 distinct service cards in 2 logical groups | `screenshots-stage2/section-services.png` |
| **Why Farcon** | 4 benefits (Goals first, Transparency, Investor custody, Reviews) | `screenshots-stage2/section-why-farcon.png` |
| **Market Snapshot** | Benchmark index indicators with honest provider state | `screenshots-stage2/section-market-snapshot.png` |
| **Leadership Note** | Dignified editorial approach note from Farcon Wealth team | `screenshots-stage2/section-leadership-approach.png` |
| **Learn & Grow** | 3 distinct article cards linking to dedicated URLs | `screenshots-stage2/section-learn-and-grow.png` |
| **Contact Page** | Clean desk contact card, tel links, and Patna map | `screenshots-stage2/page-contact.png` |
| **About Page** | Mission, registration details, and approach | `screenshots-stage2/page-about.png` |
| **Disclosures Page** | Regulatory disclosures, commission notices, and ARN | `screenshots-stage2/page-disclosures.png` |

---

## 3. Approved Elements (DO NOT ALTER)

1. **Brand Lockup Artwork:** The stacked Farcon Wealth logo lockup, wordmark proportions, and stag crest artwork are fully approved.
2. **Canonical Business Identity:**
   - Name: Farcon Wealth Private Limited
   - Status: AMFI-registered Mutual Fund Distributor, ARN 329006
   - Office: 4th Floor, Unison Tower, Near Rajeev Nagar Crossing, Atal Path, Patna – 800013, Bihar, India
   - WhatsApp: +91 76730 08502
   - Telephones: +91 93077 45700, +91 92967 87132, +91 97713 48560
3. **Core Color Tokens:** Forest Green (`#0F3D2E`) and Warm Cream (`#F7F4EC`) brand identity.
4. **Calculators & Math Engine:** The 6% default inflation benchmark, target FV handoffs, and ₹100 Crore range boundary handling.
5. **Form Contracts:** Progressive-disclosure modal, unchecked-by-default consent, and 14-column Google Sheets integration.

---

## 4. Remaining Visual Polish Recommendations for Figma Make

1. **Hero Gradient Feathering:** Fine-tune the left-to-right scrim feathering on ultra-wide viewports (1920px+) to maintain photographic mood while ensuring high contrast for the headline.
2. **Service Card Hover States:** Consider a subtle 1px inner glow or soft forest border accent (`#1F9D55`) on hover across desktop viewports.
3. **Article Badge Styling:** Harmonize the read-time badges (`5 min read`) across article cards with the category badges.

---

## 5. Missing External Dependencies (Required Before Final Live Deployment)

1. **Licensed Market Data Provider Agreement:**
   - Commercial feed contract with NSE/BSE authorized vendor (e.g., TruData, Refinitiv, Bloomberg).
   - Once acquired, configure `MARKET_DATA_PROVIDER_URL` and `MARKET_DATA_API_KEY` in server-side environment.
   - Documented in `docs/MARKET_DATA_PROVIDER.md`.
2. **Founder Assets:**
   - Verified Founder / Director full name.
   - Approved personal founder message or video statement.
   - High-resolution genuine executive photograph.
   - Currently rendered accurately as **"A Note from Farcon Wealth"** signed by the Farcon Wealth Team.

# Farcon Wealth — Desktop & Mobile Hero Design Polish & Tokens

**Updated:** 28 November 2026  
**Branch:** `fix/audit-remediation-mobile-hero`

---

## 1. Visual Design System & Brand Tokens (`src/farcon.css`)
- **Canvas Cream:** `#F7F4EC` (`--fw-bg`)
- **Primary Forest Green:** `#0F3D2E` (`--fw-forest`) / Deep Forest `#0A2E22`
- **Primary Ink:** `#0B1830` / `#1A241C` (`--fw-ink`)
- **Muted Copy:** `#3D4A42` / `#4A554E` (`--fw-muted`)
- **Accent Gold:** `#F3D48A` / `#C9A24A` (`--fw-gold`)
- **Typography:**
  - Editorial Headings: `Poppins` (`--fw-serif`)
  - UI & Body: `Inter` (`--fw-sans`)
  - Handwritten Accent Note: `Caveat` (`--fw-script`)

---

## 2. Authoritative Hero Composition Across Breakpoints

### Desktop (`1100px+` — tested at `1100x850`, `1280x800`, `1440x900`)
- Full-bleed `public/images/home/hero-1600.webp` photograph (`object-position: 55% 42%` at `1280px+`, `57% 42%` at `1100–1279px`) preserving all 6 family members clearly in the central opening.
- Left cream gradient scrim (`#F7F4EC 0%–20%` feathering smoothly to transparent at `45%`) ensures WCAG contrast behind headline and copy.
- Left column: Eyebrow, handwritten Caveat note, editorial headline (`54px` / `46px`), concise body copy, clear CTA hierarchy, glassmorphic trust pills.
- Right column: Goal SIP Estimator (`376px` / `360px` wide) computing real-time monthly SIP with 6% default inflation matching the full interactive milestone planner.

### Compact Desktop / Landscape Tablet (`1024×768`) & Portrait Tablet / Mobile (`768×1024`, `430×932`, `390×844`, `360×780`)
- Refactored into one authoritative responsive hero architecture wrapping `.hf-hero-photo` + `.hf-hero-scrim` inside `.hf-hero-backdrop` (`src/components/sections/HomeView.tsx`, `src/farcon.css`), removing legacy detached-banner and duplicate rules.
- **At `1024×768`:** Preserves full-bleed `100%` height `.hf-hero-backdrop` with 2-column layout (copy left over left cream scrim, all 6 family members centered clearly in the middle window, Goal SIP Estimator right).
- **At `<=1023px` (`768×1024`, `430×932`, `390×844`, `360×780`):** `.hf-hero-backdrop` sits `position: absolute` behind the introductory hero copy (height `490px` on `768px`, `clamp(430px, 112vw, 480px)` on `<=767px`), fading leftward (`90deg`) for crisp dark typography and downward (`180deg`) smoothly into `#F7F4EC` before the white `Goal SIP Estimator` card.
- **No detached thumbnail box** placed above or between headline copy and calculator.
- On narrow phones (`<=767px`), eyebrow (`AMFI-REGISTERED MUTUAL FUND DISTRIBUTOR`) and Caveat accent (`A more secure tomorrow, together.`) stack cleanly above `h1` without horizontal cramping; forced `<br />` in `h1` is hidden for natural responsive wrapping; Goal SIP Estimator sits comfortably below on `#F7F4EC`.
- **Ask Farcon AI (`FloatingContactActions.tsx`):** Remains hidden while the hero sits at initial viewport (`scrollY = 0`), revealing cleanly on scroll with `env(safe-area-inset-*)` spacing so it never overlaps hero copy, CTAs, trust pills, estimator sliders/results, or the AMFI disclosure bar.

---

## 3. CTA Hierarchy
1. **Primary (Filled Forest Green):** `Plan My Goal` — scrolls smoothly to `#planner`.
2. **Secondary (Forest Outline):** `Talk to Our Team` — opens the interactive `ConsultationModal`.
3. **Tertiary (Text Link):** `Explore Services →` — navigates to `/services` (`<a href="/services">`).
- On mobile (`<=767px`), Primary and Secondary expand full-width (`min-height: 46px`), while `Explore Services →` remains a lightweight text link (`min-height: 44px` tap target) so buttons do not compete equally.

---

## 4. Verification Screenshots (Captured in `screenshots-audit-verification/`)
- `hero-360px.png` / `full-360px.png`
- `hero-390px.png` / `full-390px.png`
- `hero-768px.png` / `full-768px.png`
- `hero-1024px.png` / `full-1024px.png`
- `hero-1100px.png` / `full-1100px.png`
- `hero-1280px.png` / `full-1280px.png`
- `hero-1440px.png` / `full-1440px.png`

---

## 5. Remaining Owner / Legal Blockers
See [LEGAL_OWNER_INPUTS.md](./LEGAL_OWNER_INPUTS.md) for the complete pre-production sign-off checklist (ARN certificate & corporate address proof, AMC empanelment verification, commission schedules, verified Regular Plan scheme codes/SID-SAI-KIM links, Grievance Officer identity/SLA, privacy retention schedule, and optional founder/market-feed inputs).

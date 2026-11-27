import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { RoutePath } from '@/types';
import { formatINR } from '@/lib/formatting/currency';
import { formatPlanCompact, formatTargetLabel, planIllustration } from '@/components/sections/home/planGoal';
import { getCanonicalVideoEmbedUrl } from '@/lib/video/embedUrl';
import { FARCON_CONFIG } from '@/content/site/config';
import { COMPLIANCE_REGISTRY } from '@/lib/compliance';
import { ServiceShowcase } from '@/components/sections/ServiceShowcase';
import { MarketSnapshot } from '@/components/sections/MarketSnapshot';
import { FAQ_ITEMS } from '@/content/faq/faqData';
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ChevronDown,
  FileText,
  LineChart,
  Shield,
  ShieldCheck,
  Sprout,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { FeaturedFundsSection } from '@/components/sections/home/FeaturedFundsSection';

interface HomeViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (subject?: string) => void;
  onOpenAI: () => void;
}

const GOALS = [
  { title: 'Retirement', text: 'Live your next chapter with confidence', image: 'goal-retirement', alt: 'A beach chair facing the ocean at sunset', href: '/goals/retirement' as RoutePath },
  { title: 'Child Education', text: 'Turn their dreams into reality', image: 'goal-education', alt: 'A child walking to school with a backpack', href: '/goals/child-education' as RoutePath },
  { title: 'Wealth Creation', text: 'Build long-term financial freedom', image: 'goal-wealth', alt: 'A green plant growing from a jar of coins', href: '/goals/wealth-creation' as RoutePath },
  { title: 'Tax Saving', text: 'Invest smart. Save more.', image: 'goal-tax', alt: 'A calculator resting on tax forms and coins', href: '/goals/tax-saving' as RoutePath },
];

const PLAN_PRESETS: Record<string, { target: number; years: number; rate: number; inflation: number }> = {
  Retirement: { target: 35_000_000, years: 20, rate: 12, inflation: 6 },
  'Child Education': { target: 10_000_000, years: 15, rate: 12, inflation: 6 },
  'Wealth Creation': { target: 20_000_000, years: 12, rate: 12, inflation: 6 },
  'Tax Saving': { target: 5_000_000, years: 5, rate: 12, inflation: 0 },
};

function cardSrc(name: string) {
  return {
    src: `/images/home/${name}-800.webp`,
    srcSet: `/images/home/${name}-800.webp 800w, /images/home/${name}-1600.webp 1600w`,
  };
}

function bleedSrc(name: string) {
  return {
    src: `/images/home/${name}-800.webp`,
    srcSet: `/images/home/${name}-800.webp 800w, /images/home/${name}-1440.webp 1440w, /images/home/${name}-2880.webp 2880w`,
  };
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function SyncedField({
  value, min, max, step, label, display, onChange,
}: { value: number; min: number; max: number; step: number; label: string; display: (n: number) => string; onChange: (n: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      className="hf-select"
      aria-label={label}
      inputMode="decimal"
      value={draft ?? display(value)}
      onFocus={() => setDraft(String(value))}
      onBlur={() => setDraft(null)}
      onChange={(event) => {
        const next = event.target.value;
        setDraft(next);
        const parsed = Number(next.replace(/[^\d.]/g, ''));
        if (!Number.isFinite(parsed)) return;
        const snapped = Math.round(parsed / step) * step;
        onChange(Math.min(max, Math.max(min, snapped)));
      }}
    />
  );
}

function PlanningPlant() {
  return (
    <svg className="hf-plant" viewBox="0 0 380 150" width="380" height="150" role="img" aria-label="A leafy plant illustration">
      <path d="M70 142c40-8 90-6 150-2 50 3 100 2 140-6" fill="none" stroke="#c5b59a" strokeWidth="3" strokeLinecap="round" />
      <path d="M168 138c2-28 4-52 8-74" fill="none" stroke="#2f6b45" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M176 108c18-8 34-8 52-2-16 10-32 12-52 8z" fill="#7BA238" />
      <path d="M174 92c-20-6-36-2-48 8 16 6 32 6 48-2z" fill="#5f8f32" />
      <path d="M178 74c16-14 36-16 54-6-18 8-34 12-54 12z" fill="#8fb84a" />
      <path d="M172 64c-18-12-38-10-50 2 18 4 34 6 50 4z" fill="#6ea03a" />
      <ellipse cx="176" cy="48" rx="16" ry="10" fill="#9bc85a" transform="rotate(-18 176 48)" />
    </svg>
  );
}

const PLAN_TABS = ['Retirement', 'Child Education', 'Wealth Creation', 'Tax Saving'] as const;

const TOOLS: { title: string; text: string; href: RoutePath; tint: string; icon: React.ReactNode }[] = [
  { title: 'SIP Calculator', text: 'Build wealth regularly', href: '/calculators/sip', tint: '#E5F6EA', icon: <TrendingUp size={16} color="#1F9D55" /> },
  { title: 'Lumpsum Calculator', text: 'Grow your investments', href: '/calculators/lumpsum', tint: '#E7F0FB', icon: <Wallet size={16} color="#3B82C4" /> },
  { title: 'Goal Planner', text: 'Plan for your dreams', href: '/calculators/goal', tint: '#FDE8D0', icon: <Target size={16} color="#E07A2F" /> },
  { title: 'Retirement Planner', text: 'Secure your future', href: '/calculators/retirement', tint: '#E5F2FB', icon: <User size={16} color="#3B82C4" /> },
  { title: 'Historical Returns', text: 'Analyse past performance', href: '/mutual-funds', tint: '#FDE8EA', icon: <LineChart size={16} color="#D4535A" /> },
  { title: 'Risk Analysis', text: 'Understand your risk', href: '/investor-quiz', tint: '#F3E8FB', icon: <Shield size={16} color="#8A4FB3" /> },
];

function AreaChart({
  series,
}: {
  series: { year: number; estimated: number; invested: number }[];
}) {
  const [active, setActive] = useState(Math.max(0, series.length - 1));

  useEffect(() => {
    setActive(Math.max(0, series.length - 1));
  }, [series.length]);

  const w = 640;
  const h = 220;
  const left = 16;
  const right = 12;
  const top = 28;
  const bottom = 24;
  const max = Math.max(...series.map((p) => Math.max(p.estimated, p.invested)), 1);
  const lastYear = series[series.length - 1]?.year ?? Math.max(1, series.length - 1);
  const x = (i: number) => left + (i / Math.max(1, series.length - 1)) * (w - left - right);
  const y = (v: number) => top + (1 - v / max) * (h - top - bottom);
  const line = (key: 'estimated' | 'invested') =>
    series.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ');
  const area = `${line('estimated')} L${x(series.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;

  const activeIndex = Math.min(active, series.length - 1);
  const activePoint = series[activeIndex] ?? series[series.length - 1];

  // Dynamic X-axis ticks derived from tenure years
  const xTicks = useMemo(() => {
    if (lastYear <= 5) {
      return Array.from({ length: lastYear + 1 }, (_, i) => i);
    }
    const step = lastYear > 20 ? 10 : 5;
    const ticks: number[] = [0];
    for (let yr = step; yr < lastYear; yr += step) {
      ticks.push(yr);
    }
    if (!ticks.includes(lastYear)) {
      ticks.push(lastYear);
    }
    return ticks;
  }, [lastYear]);

  // Dynamic Y-axis ticks derived from maximum plotted value
  const yTicks = [max, max * 0.67, max * 0.33, 0];

  return (
    <div className="hf-chart">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const ratio = (event.clientX - rect.left) / rect.width;
          const index = Math.round(Math.min(1, Math.max(0, ratio)) * (series.length - 1));
          setActive(index);
        }}
      >
        {xTicks.map((label) => (
          <text
            key={label}
            x={left + (label / lastYear) * (w - left - right)}
            y={h - 4}
            fontSize="11"
            fill="#6a736c"
            textAnchor="middle"
          >
            {label === 0 ? 'Yr 0' : `${label}y`}
          </text>
        ))}
        <path d={area} fill="rgba(31,157,85,0.16)" />
        <path className="hf-line" d={line('estimated')} fill="none" stroke="#1F9D55" strokeWidth="2.5" />
        <path className="hf-line" d={line('invested')} fill="none" stroke="#C9A24A" strokeWidth="2" />
        {activePoint && <circle cx={x(activeIndex)} cy={y(activePoint.estimated)} r="4" fill="#0F3D2E" />}
      </svg>
      <div className="hf-year-badge">
        Yr {activePoint?.year ?? lastYear}: Est. {formatPlanCompact(activePoint?.estimated ?? 0)} · Inv. {formatPlanCompact(activePoint?.invested ?? 0)}
      </div>
      <div className="hf-axis" aria-hidden="true">
        {yTicks.map((t, idx) => (
          <span key={idx}>{formatPlanCompact(t)}</span>
        ))}
      </div>
      <div className="hf-legend">
        <span><i style={{ background: '#1F9D55' }} />Estimated Wealth</span>
        <span><i style={{ background: '#C9A24A' }} />Invested Amount</span>
      </div>
    </div>
  );
}

export const HomeView: React.FC<HomeViewProps> = ({ navigate, onOpenConsultation }) => {
  const [planTab, setPlanTab] = useState<(typeof PLAN_TABS)[number]>('Retirement');
  const [target, setTarget] = useState(35_000_000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);
  const [inflation, setInflation] = useState(6);
  const heroRef = useRef<HTMLElement>(null);

  // Quick Goal SIP Calculator state in Hero
  const [quickTarget, setQuickTarget] = useState(5_000_000); // 50 Lakhs
  const [quickYears, setQuickYears] = useState(10); // 10 Years
  const [quickRate, setQuickRate] = useState(12); // 12% p.a.
  const [quickInflation, setQuickInflation] = useState(6); // 6% p.a. default inflation

  const quickIllustration = useMemo(
    () => planIllustration(quickTarget, quickYears, quickRate, quickInflation),
    [quickTarget, quickYears, quickRate, quickInflation]
  );

  const plan = useMemo(() => planIllustration(target, years, rate, inflation), [target, years, rate, inflation]);
  const whatsapp = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const onScroll = () => {
      const shift = Math.min(48, window.scrollY * 0.08);
      heroRef.current?.style.setProperty('--hero-shift', `${shift}px`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleOpenFullPlanner = () => {
    setTarget(quickTarget);
    setYears(quickYears);
    setRate(quickRate);
    setInflation(quickInflation);
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hf">
      <section className="hf-hero" data-section="hero" ref={heroRef}>
        <div className="hf-hero-backdrop">
          <img
            className="hf-hero-photo"
            src="/images/home/hero-1600.webp"
            srcSet="/images/home/hero-800.webp 800w, /images/home/hero-1024.webp 1024w, /images/home/hero-1600.webp 1600w"
            sizes="(min-width: 1100px) 1600px, 100vw"
            alt="An Indian family of six in a sunlit living room: grandfather, grandmother, father, mother, a girl, and a boy"
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
          />
          <div className="hf-hero-scrim" aria-hidden="true" />
        </div>
        <div className="hf-hero-inner">
          <div className="hf-hero-copy">
            <span className="hf-eye">AMFI-Registered Mutual Fund Distributor</span>
            <p className="hf-script">
              A more secure
              <br />tomorrow, together.
              <svg className="hf-script-arrow" viewBox="0 0 140 36" aria-hidden="true">
                <path d="M120 6 C 80 10, 48 22, 18 30" fill="none" stroke="#2c3a34" strokeWidth="1.2" />
                <path d="M18 30 l10 -2 M18 30 l3 8" fill="none" stroke="#2c3a34" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </p>
            <h1>Your family’s future <br /><em>deserves a thoughtful plan.</em></h1>
            <p className="hf-lede">Personalized mutual fund strategies designed around the milestones that matter most to your family—from children’s education to lifelong retirement peace.</p>
            <p className="hf-lede">Guidance with clarity and discipline from an AMFI-registered distributor. Investments held in your name, planned for your timeline.</p>
            <div className="hf-cta-row">
              <button
                type="button"
                className="hf-btn hf-btn-green"
                onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Plan My Goal <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="hf-btn hf-btn-outline"
                onClick={() => onOpenConsultation('Talk to Our Team')}
              >
                Talk to Our Team
              </button>
              <a
                href="/services"
                className="hf-textlink hf-hero-tertiary"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/services');
                }}
              >
                Explore Services <ArrowRight size={13} />
              </a>
            </div>
            <div className="hf-trust" aria-label="Key trust highlights">
              <span title={`AMFI-registered Mutual Fund Distributor (ARN ${FARCON_CONFIG.arn})`}>
                <ShieldCheck size={14} /> AMFI Regd. ARN {FARCON_CONFIG.arn}
              </span>
              <span title="Goal-oriented mutual fund planning designed for family milestones">
                <Target size={14} /> Milestone-Oriented
              </span>
              <span title="All investments and folios are held in your own name">
                <UserCheck size={14} /> In Your Own Name
              </span>
            </div>
          </div>

          <article className="hf-hero-calc" aria-label="Goal SIP Estimator">
            <div className="hf-calc-header">
              <div className="hf-calc-badge">
                <Target size={13} /> Milestone Estimator
              </div>
              <h3 className="hf-calc-title">Goal SIP Estimator</h3>
              <p className="hf-calc-sub">Estimate your monthly investment.</p>
            </div>

            {/* Goal Presets */}
            <div className="hf-calc-presets" role="group" aria-label="Goal Presets">
              {[
                { label: '₹25 Lakh (5y)', target: 2_500_000, years: 5, rate: 12 },
                { label: '₹50 Lakh (10y)', target: 5_000_000, years: 10, rate: 12 },
                { label: '₹1 Crore (12y)', target: 10_000_000, years: 12, rate: 12 },
                { label: '₹2 Crore (15y)', target: 20_000_000, years: 15, rate: 12 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`hf-calc-preset-chip ${quickTarget === preset.target && quickYears === preset.years ? 'is-active' : ''}`}
                  onClick={() => {
                    setQuickTarget(preset.target);
                    setQuickYears(preset.years);
                    setQuickRate(preset.rate);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="hf-calc-fields">
              {/* Target Corpus Slider */}
              <div className="hf-calc-field">
                <div className="hf-calc-label-row">
                  <span className="hf-calc-label">Target Amount (Today's Value)</span>
                  <span className="hf-calc-val-pill">{formatPlanCompact(quickTarget)}</span>
                </div>
                <input
                  type="range"
                  className="hf-calc-range"
                  min={500_000}
                  max={100_000_000}
                  step={500_000}
                  value={quickTarget}
                  style={{ ['--pct' as string]: `${((quickTarget - 500_000) / 99_500_000) * 100}%` }}
                  onChange={(e) => setQuickTarget(Number(e.target.value))}
                  aria-label="Target amount in today's rupees"
                />
                <div className="hf-calc-scale">
                  <span>₹5 L</span>
                  <span>₹10 Cr</span>
                </div>
              </div>

              {/* Time Horizon Slider */}
              <div className="hf-calc-field">
                <div className="hf-calc-label-row">
                  <span className="hf-calc-label">Investment Horizon</span>
                  <span className="hf-calc-val-pill">{quickYears} {quickYears === 1 ? 'Year' : 'Years'}</span>
                </div>
                <input
                  type="range"
                  className="hf-calc-range"
                  min={1}
                  max={30}
                  step={1}
                  value={quickYears}
                  style={{ ['--pct' as string]: `${((quickYears - 1) / 29) * 100}%` }}
                  onChange={(e) => setQuickYears(Number(e.target.value))}
                  aria-label="Investment horizon in years"
                />
                <div className="hf-calc-scale">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* Assumed Return Rate Slider */}
              <div className="hf-calc-field">
                <div className="hf-calc-label-row">
                  <span className="hf-calc-label">Expected Annual Return</span>
                  <span className="hf-calc-val-pill">{quickRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  className="hf-calc-range"
                  min={8}
                  max={15}
                  step={0.5}
                  value={quickRate}
                  style={{ ['--pct' as string]: `${((quickRate - 8) / 7) * 100}%` }}
                  onChange={(e) => setQuickRate(Number(e.target.value))}
                  aria-label="Expected annual return rate"
                />
                <div className="hf-calc-scale">
                  <span>8% (Conservative)</span>
                  <span>15% (Aggressive)</span>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="hf-calc-result-box">
              <div className="hf-calc-result-header">
                <span className="hf-calc-result-eyebrow">Required Monthly SIP</span>
                <div className="hf-calc-result-amount">
                  {formatINR(quickIllustration.requiredMonthlySIP)}
                  <span className="hf-calc-result-unit">/ month</span>
                </div>
              </div>

              {/* Future Inflation-Adjusted Goal Highlight */}
              <div className="hf-calc-future-banner">
                <span className="hf-calc-future-label">Future Goal (with 6% inflation):</span>
                <strong className="hf-calc-future-val">{formatPlanCompact(quickIllustration.futureInflationAdjustedGoal)}</strong>
              </div>

              {/* 2-Column Supporting Stats Grid */}
              <div className="hf-calc-stats-2col">
                <div className="hf-calc-stat-item">
                  <span className="hf-calc-stat-k">Total Amount Invested</span>
                  <span className="hf-calc-stat-v">{formatPlanCompact(quickIllustration.totalInvestment)}</span>
                </div>
                <div className="hf-calc-stat-item">
                  <span className="hf-calc-stat-k">Estimated Wealth Gain</span>
                  <span className="hf-calc-stat-v is-gain">+{formatPlanCompact(quickIllustration.estimatedGrowth)}</span>
                </div>
              </div>
            </div>

            <p className="hf-calc-disclaimer">
              Illustrative calculation assuming {quickRate}% p.a. return and 6% p.a. inflation (adjustable in full planner; not a scheme-specific projection). {COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk}
            </p>

            <button
              type="button"
              className="hf-btn hf-btn-green hf-calc-cta-btn"
              onClick={handleOpenFullPlanner}
            >
              Customize Full Goal Plan <ArrowRight size={14} />
            </button>
          </article>
        </div>
      </section>

      {/* AMFI Trust & Credibility Band (Replaces former immediate #goals row) */}
      <Reveal as="section" className="hf-amfi-band" id="amfi-trust" data-section="trust">
        <div className="hf-wrap">
          {/* Top Bar: AMFI Registration & Disclosures Link */}
          <div className="hf-amfi-header">
            <div className="hf-amfi-badge">
              <Shield size={16} className="hf-amfi-shield" />
              <span>AMFI-Registered Mutual Fund Distributor</span>
            </div>
            <div className="hf-amfi-arn-wrap">
              <span className="hf-amfi-arn-label">Registration</span>
              <span className="hf-amfi-arn-val">ARN {FARCON_CONFIG.arn}</span>
            </div>
            <button
              type="button"
              className="hf-amfi-disc-link"
              onClick={() => navigate('/disclosures')}
            >
              Regulatory Disclosures &amp; Code of Conduct <ArrowRight size={13} />
            </button>
          </div>

          {/* 3 Investor Safeguards */}
          <div className="hf-amfi-grid">
            <div className="hf-amfi-card">
              <div className="hf-amfi-icon">
                <Shield size={20} />
              </div>
              <div className="hf-amfi-card-text">
                <h3>Investments Held in Your Name</h3>
                <p>
                  Investments stay in your own name with SEBI-regulated mutual fund houses. Farcon Wealth holds zero client funds, securities, or pool accounts.
                </p>
              </div>
            </div>

            <div className="hf-amfi-card">
              <div className="hf-amfi-icon">
                <FileText size={20} />
              </div>
              <div className="hf-amfi-card-text">
                <h3>Regular Plans · Commission Disclosed</h3>
                <p>
                  We distribute Regular Plans of mutual fund schemes and receive trail commissions from AMCs.{' '}
                  <button
                    type="button"
                    className="underline text-[#0F3D2E] font-medium cursor-pointer"
                    onClick={() => navigate('/disclosures#commission' as RoutePath)}
                  >
                    View commission disclosure &amp; status
                  </button>.
                </p>
              </div>
            </div>

            <div className="hf-amfi-card">
              <div className="hf-amfi-icon">
                <Target size={20} />
              </div>
              <div className="hf-amfi-card-text">
                <h3>Disciplined Milestone Planning</h3>
                <p>
                  Assumption-based financial modeling tailored to your family milestones—retirement, education, and wealth—without speculative return promises.
                </p>
              </div>
            </div>
          </div>

          {/* Partner AMC Ecosystem */}
          <div className="hf-amfi-ecosystem">
            <div className="hf-amfi-ecosystem-head">
              <span className="hf-amfi-ecosystem-tag">Distribution Ecosystem · Scope Notice</span>
              <p className="hf-amfi-ecosystem-title">Mutual fund categories across Asset Management Companies (AMCs)</p>
            </div>
            <div className="hf-amfi-logos">
              <div className="hf-amfi-logo-tile" title="SBI Mutual Fund">
                <img src="/images/amc/sbi.svg" alt="SBI Mutual Fund" width={32} height={32} loading="lazy" />
                <span>SBI Mutual Fund</span>
              </div>
              <div className="hf-amfi-logo-tile" title="HDFC Mutual Fund">
                <img src="/images/amc/hdfc-mark.svg" alt="HDFC Mutual Fund" width={32} height={32} loading="lazy" />
                <span>HDFC Mutual Fund</span>
              </div>
              <div className="hf-amfi-logo-tile" title="ICICI Prudential Mutual Fund">
                <img src="/images/amc/icici-mark.png" alt="ICICI Prudential Mutual Fund" width={32} height={32} loading="lazy" />
                <span>ICICI Prudential</span>
              </div>
              <div className="hf-amfi-logo-tile" title="Axis Mutual Fund">
                <img src="/images/amc/axis-mark.svg" alt="Axis Mutual Fund" width={32} height={32} loading="lazy" />
                <span>Axis Mutual Fund</span>
              </div>
              <div className="hf-amfi-logo-tile" title="Mirae Asset Mutual Fund">
                <img src="/images/amc/mirae-mark.svg" alt="Mirae Asset Mutual Fund" width={32} height={32} loading="lazy" />
                <span>Mirae Asset</span>
              </div>
              <div className="hf-amfi-logo-tile" title="Nippon India Mutual Fund">
                <img src="/images/amc/nippon.png" alt="Nippon India Mutual Fund" width={32} height={32} loading="lazy" />
                <span>Nippon India</span>
              </div>
            </div>

            {/* Regulatory Disclaimers & Notes */}
            <div className="hf-amfi-footnotes">
              <p className="hf-amfi-trademark-note">
                Mutual fund marks belong to their respective Asset Management Companies (AMCs). Active empanelment confirmation for listed AMCs is tracked in our regulatory preflight; information offered relates to mutual fund products we distribute, and investors may consider alternatives not offered by Farcon Wealth.
              </p>
              <p className="hf-amfi-disclaimer">
                {COMPLIANCE_REGISTRY.distributor.amfiRegistration} (not a SEBI-registered Investment Adviser). {COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk} {COMPLIANCE_REGISTRY.statutoryMutualFund.pastPerformance}
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="hf-section svc-band" id="services" data-section="services">
        <div className="hf-wrap">
          <ServiceShowcase navigate={navigate} />
        </div>
      </Reveal>

      {/* Interactive Milestone Planner Studio (with relocated Goal Shortcuts) */}
      <Reveal as="section" className="hf-section hf-planner-section" id="planner" data-section="planner">
        <span id="goals" className="sr-only" aria-hidden="true" />
        <div className="hf-wrap">
          {/* Header */}
          <div className="hf-planner-head">
            <span className="hf-eye">Interactive Milestone Studio</span>
            <h2>Your Goals.<br /><em>Our Planning.</em></h2>
            <p className="hf-lede">
              Explore our core life-stage milestones below or customize your investment parameters. Every projection includes realistic inflation modeling to safeguard your future purchasing power.
            </p>
          </div>

          {/* 4 Relocated Goal Shortcut Cards */}
          <div className="hf-goal-shortcuts" role="tablist" aria-label="Goal Milestones">
            {GOALS.map((goal) => {
              const isActive = planTab === goal.title;
              return (
                <div
                  key={goal.title}
                  className={`hf-goal-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    const preset = PLAN_PRESETS[goal.title];
                    setPlanTab(goal.title as (typeof PLAN_TABS)[number]);
                    if (preset) {
                      setTarget(preset.target);
                      setYears(preset.years);
                      setRate(preset.rate);
                      setInflation(preset.inflation);
                    }
                  }}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const preset = PLAN_PRESETS[goal.title];
                      setPlanTab(goal.title as (typeof PLAN_TABS)[number]);
                      if (preset) {
                        setTarget(preset.target);
                        setYears(preset.years);
                        setRate(preset.rate);
                        setInflation(preset.inflation);
                      }
                    }
                  }}
                >
                  <div className="hf-goal-card-media">
                    <img
                      {...cardSrc(goal.image)}
                      sizes="(min-width: 1100px) 260px, (min-width: 768px) 45vw, 90vw"
                      alt={goal.alt}
                      width={400}
                      height={240}
                      loading="lazy"
                    />
                    {isActive && (
                      <span className="hf-goal-tag-active">
                        <CheckCircle size={11} /> Selected
                      </span>
                    )}
                  </div>
                  <div className="hf-goal-card-content">
                    <h3>{goal.title}</h3>
                    <p>{goal.text}</p>
                    <div className="hf-goal-card-actions">
                      <span className="hf-goal-preset-cue">
                        Preset: {formatPlanCompact(PLAN_PRESETS[goal.title]?.target ?? 0)} · {PLAN_PRESETS[goal.title]?.years}y
                      </span>
                      <button
                        type="button"
                        className="hf-goal-guide-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(goal.href);
                        }}
                        title={`Read full guide for ${goal.title}`}
                      >
                        Guide <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3-Panel Studio Container */}
          <div className="hf-plan-studio">
            <div className="hf-plan-studio-header">
              <div className="hf-plan-studio-current">
                <span className="hf-plan-studio-sub">Active Milestone:</span>
                <strong>{planTab}</strong>
                <span className="hf-plan-studio-sep">·</span>
                <span>Assumed Return: <strong>{rate}% p.a.</strong></span>
                <span className="hf-plan-studio-sep">·</span>
                <span>Assumed Inflation: <strong>{inflation}% p.a.</strong></span>
              </div>
              <div className="hf-tabs" role="tablist">
                {PLAN_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={planTab === tab}
                    className={planTab === tab ? 'is-on' : ''}
                    onClick={() => {
                      const preset = PLAN_PRESETS[tab];
                      setPlanTab(tab);
                      setTarget(preset.target);
                      setYears(preset.years);
                      setRate(preset.rate);
                      setInflation(preset.inflation);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="hf-plan-grid">
              {/* Panel 1: Controls */}
              <div className="hf-controls">
                <label className="hf-slider">
                  <div className="hf-slider-top">
                    <span>Target Corpus (Today's Value)</span>
                    <span className="hf-calc-val-pill">{formatPlanCompact(target)}</span>
                  </div>
                  <SyncedField
                    label="Target corpus in rupees"
                    value={target}
                    min={500_000}
                    max={1_000_000_000}
                    step={500_000}
                    display={(n) => formatPlanCompact(n)}
                    onChange={setTarget}
                  />
                  <input
                    type="range"
                    min={500_000}
                    max={1_000_000_000}
                    step={500_000}
                    value={target}
                    style={{ ['--pct' as string]: `${((target - 500_000) / 999_500_000) * 100}%` }}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    aria-label="Target corpus in rupees"
                  />
                  <div className="hf-scale">
                    <span>₹5 Lakh</span>
                    <span>₹100 Crore</span>
                  </div>
                </label>

                <label className="hf-slider">
                  <div className="hf-slider-top">
                    <span>Investment Horizon</span>
                    <span className="hf-calc-val-pill">{years} {years === 1 ? 'Year' : 'Years'}</span>
                  </div>
                  <SyncedField
                    label="Time horizon in years"
                    value={years}
                    min={1}
                    max={30}
                    step={1}
                    display={(n) => `${n} Years`}
                    onChange={setYears}
                  />
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={years}
                    style={{ ['--pct' as string]: `${((years - 1) / 29) * 100}%` }}
                    onChange={(e) => setYears(Number(e.target.value))}
                    aria-label="Time horizon in years"
                  />
                  <div className="hf-scale">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </label>

                <label className="hf-slider hf-return">
                  <div className="hf-slider-top">
                    <span>Expected Return (p.a.)</span>
                    <span className="hf-calc-val-pill">{rate}% p.a.</span>
                  </div>
                  <SyncedField
                    label="Expected annual return percent"
                    value={rate}
                    min={6}
                    max={18}
                    step={1}
                    display={(n) => `${n}%`}
                    onChange={setRate}
                  />
                  <input
                    type="range"
                    min={6}
                    max={18}
                    step={1}
                    value={rate}
                    style={{ ['--pct' as string]: `${((rate - 6) / 12) * 100}%` }}
                    onChange={(e) => setRate(Number(e.target.value))}
                    aria-label="Expected return rate"
                  />
                  <div className="hf-scale">
                    <span>6% (Conservative)</span>
                    <span>18% (Aggressive)</span>
                  </div>
                </label>

                <label className="hf-slider">
                  <div className="hf-slider-top">
                    <span>Expected Inflation (p.a.)</span>
                    <span className="hf-calc-val-pill">{inflation}% p.a.</span>
                  </div>
                  <SyncedField
                    label="Expected annual inflation percent"
                    value={inflation}
                    min={0}
                    max={12}
                    step={1}
                    display={(n) => `${n}%`}
                    onChange={setInflation}
                  />
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={inflation}
                    style={{ ['--pct' as string]: `${(inflation / 12) * 100}%` }}
                    onChange={(e) => setInflation(Number(e.target.value))}
                    aria-label="Expected annual inflation rate"
                  />
                  <div className="hf-scale">
                    <span>0% (No Inflation)</span>
                    <span>12% (High Cost of Living)</span>
                  </div>
                </label>
              </div>

              {/* Panel 2: Result Card */}
              <div className="hf-result" aria-live="polite">
                <span className="hf-result-caption">Required Monthly SIP</span>
                <strong className="hf-result-sip">
                  <AnimatedNumber value={plan.requiredMonthlySIP} durationMs={480} />
                  <span className="hf-result-period">/ month</span>
                </strong>

                {/* Inflation Adjusted Callout */}
                <div className="hf-result-future-callout">
                  <span className="hf-result-callout-k">Future Inflation-Adjusted Goal:</span>
                  <strong className="hf-result-callout-v">
                    {formatPlanCompact(plan.futureInflationAdjustedGoal)}
                  </strong>
                  <span className="hf-result-callout-sub">
                    ({inflation}% inflation applied over {years} years)
                  </span>
                </div>

                <dl className="hf-result-dl">
                  <div>
                    <dt>Target in Today's Value</dt>
                    <dd>{formatPlanCompact(target)}</dd>
                  </div>
                  <div>
                    <dt>Total Amount Invested</dt>
                    <dd>{formatPlanCompact(plan.totalInvestment)}</dd>
                  </div>
                  <div>
                    <dt>Estimated Wealth Gain</dt>
                    <dd className="is-gain">+{formatPlanCompact(plan.estimatedGrowth)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="hf-btn hf-btn-green hf-result-cta"
                  onClick={() =>
                    navigate(
                      `/calculators/goal?target=${target}&years=${years}&rate=${rate}&inflation=${inflation}` as RoutePath
                    )
                  }
                >
                  View Detailed Plan <ArrowRight size={15} />
                </button>
              </div>

              {/* Panel 3: Dynamic Area Chart & Safeguards */}
              <div className="hf-plan-chart-col">
                <div className="hf-draw">
                  <AreaChart series={plan.series} />
                </div>
                <div className="hf-plan-assumptions-box">
                  <p className="hf-note">
                    Illustrative mathematical projection assuming {rate}% p.a. return and {inflation}% p.a. inflation (not a scheme-specific return or guarantee). {COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk}
                  </p>
                  <ul className="hf-truststrip hf-truststrip-compact">
                    <li>AMFI-registered ARN {FARCON_CONFIG.arn}</li>
                    <li>Investments in your name</li>
                    <li>
                      <button type="button" onClick={() => navigate('/disclosures#commission' as RoutePath)}>
                        Commission disclosed
                      </button>
                    </li>
                  </ul>
                  <div className="hf-plan-actions-row">
                    <a className="hf-btn hf-btn-outline hf-expert" href={whatsapp} target="_blank" rel="noreferrer">
                      Talk to Our Team
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <FeaturedFundsSection navigate={navigate} />

      <MarketSnapshot navigate={navigate} />

      <section className="hf-why" data-section="why">
        <img
          className="hf-why-photo"
          {...bleedSrc('why-mountains')}
          sizes="100vw"
          alt="A mountain ridge at sunset with a small flag on the right-hand peak"
          width={2880}
          height={1400}
          loading="eager"
          fetchPriority="low"
          decoding="async"
        />
        <svg className="hf-flag" viewBox="0 0 72 120" aria-hidden="true">
          <path d="M16 116 V6" stroke="#F3D48A" strokeWidth="3" strokeLinecap="round" />
          <path d="M16 8 h46 l-12 16 12 16 H16 z" fill="#F3D48A" />
        </svg>
        <div className="hf-why-inner hf-split">
          <div>
            <span className="hf-eye">Why Farcon Wealth</span>
            <h2>Suitability first. Discipline always.</h2>
            <p className="hf-why-lead">
              As an AMFI-registered mutual fund distributor (ARN: 329006), we help you match schemes to your horizon, stay disciplined through market volatility, and build wealth without noise.
            </p>
            <button type="button" className="hf-btn hf-btn-white" onClick={() => navigate('/about')}>Know More About Us <ArrowRight size={16} /></button>
          </div>
          <div className="hf-cols">
            <article>
              <div className="hf-num">01</div>
              <div className="hf-icon-tile"><Target size={18} /></div>
              <h3>Goal-First Framework</h3>
              <p>Every rupee is aligned to a milestone — retirement, children’s education, or long-term financial independence.</p>
            </article>
            <article>
              <div className="hf-num">02</div>
              <div className="hf-icon-tile"><LineChart size={18} /></div>
              <h3>Curated Scheme Selection</h3>
              <p>Structured qualitative and quantitative evaluation across AMCs to select suitable schemes for your risk appetite.</p>
            </article>
            <article>
              <div className="hf-num">03</div>
              <div className="hf-icon-tile"><Shield size={18} /></div>
              <h3>Folio in Investor’s Name</h3>
              <p>All holdings remain registered in your own name with the mutual fund AMC. Farcon Wealth never holds custody of investor capital.</p>
            </article>
          </div>
        </div>
      </section>

      <Reveal as="section" className="hf-section hf-tools-section" data-section="tools">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Powerful tools for every stage</span>
            <h2>Calculators &amp; Planners</h2>
            <p className="hf-lede">Make better decisions with our easy-to-use financial tools.</p>
            <button type="button" className="hf-textlink" onClick={() => navigate('/calculators')}>Explore All Calculators →</button>
          </div>
          <div className="hf-tools">
            {TOOLS.map((tool) => (
              <button key={tool.title} type="button" className="hf-tool" onClick={() => navigate(tool.href)}>
                <span className="hf-pastel" style={{ background: tool.tint }}>{tool.icon}</span>
                <h2>{tool.title}</h2>
                <p>{tool.text}</p>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="hf-section hf-founder-section" data-section="approach-note">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Our Guiding Philosophy</span>
            <h2>A Note from Farcon Wealth</h2>
            <p className="hf-lede">
              Goal-based mutual fund planning begins with clarity around the date, timeline, and liquidity needs of each family milestone—rather than reacting to short-term market headlines.
            </p>
          </div>
          <div className="hf-founder-content">
            <div className="hf-founder-message p-6 bg-white rounded-2xl border border-[#DCE4EE] shadow-xs space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                At Farcon Wealth, our commitment is straightforward: clear communication, transparent Regular Plan mutual fund distribution, and disciplined goal modeling tailored to your horizon.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every investment remains in your own name with the respective Asset Management Company and registrar, supported by periodic reviews as family needs evolve.
              </p>
              {(() => {
                const canonicalEmbed = getCanonicalVideoEmbedUrl(FARCON_CONFIG.founderVideoUrl);
                return canonicalEmbed ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden mt-4 border border-slate-200 bg-black">
                    <iframe
                      src={canonicalEmbed}
                      title="Farcon Wealth Introduction"
                      className="w-full h-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null;
              })()}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                <span className="font-semibold text-[#0F3D2E]">{FARCON_CONFIG.brandName}</span>
                <span className="font-mono text-[11px] text-slate-400">AMFI ARN {FARCON_CONFIG.arn}</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="hf-section" data-section="articles">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Investor education</span>
            <h2>Learn and Grow</h2>
            <p className="hf-lede">Practical, jargon-free notes on mutual fund mechanics, asset allocation, and systematic investing.</p>
            <button type="button" className="hf-textlink" onClick={() => navigate('/education')}>Explore All Articles →</button>
          </div>
          <div className="hf-articles">
            {[
              ['article-funds', 'Coin stacks with a small plant', 'Mutual Funds 101', 'A beginner\'s guide to investing in mutual funds', '/blogs/mutual-funds-101-beginners-guide' as RoutePath],
              ['article-sip', 'A pink piggy bank', 'SIP vs Lumpsum', 'Which strategy aligns with your goal?', '/blogs/sip-vs-lumpsum-investing-guide' as RoutePath],
              ['article-elss', 'A calculator on tax paperwork', 'Tax Saving with ELSS', 'Understanding 80C lock-in and regime rules', '/blogs/demystifying-elss-tax-saving-beyond-80c' as RoutePath],
            ].map(([name, alt, title, text, href]) => (
              <a
                key={title}
                className="hf-article"
                href={href}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(href as RoutePath);
                }}
              >
                <img {...cardSrc(name)} sizes="96px" alt={alt} width={1600} height={1100} loading="eager" fetchPriority="low" decoding="async" />
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                  <span className="hf-read">Read Article →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="hf-section" id="faqs" data-section="faqs">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Common questions</span>
            <h2>Before you write in</h2>
            <p className="hf-lede">A short set. The full list is on the FAQ page.</p>
            <button type="button" className="hf-textlink" onClick={() => navigate('/faq')}>Read all FAQs →</button>
          </div>
          <div>
            {FAQ_ITEMS.slice(0, 4).map((item) => (
              <details key={item.id} className="acc">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Reveal>

      <section className="hf-cta" data-section="cta">
        <img
          className="bg"
          {...bleedSrc('cta-sunset')}
          sizes="100vw"
          alt="A hiker sitting on a rock above a forested mountain valley"
          width={2880}
          height={1620}
          loading="eager"
          fetchPriority="low"
          decoding="async"
        />
        <div className="hf-cta-scrim" />
        <div className="hf-cta-inner">
          <div>
            <span className="hf-eye">Ready to take the next step?</span>
            <h2>Let&apos;s build your financial future, together.</h2>
            <p>Speak with our AMFI-registered distributor team about your goals, time horizon, and investment plan.</p>
            <div className="hf-cta-row">
              <button type="button" className="hf-btn hf-btn-gold" onClick={() => onOpenConsultation('Talk to Our Team')}>
                Talk to Our Team <ArrowRight size={16} />
              </button>
              <button type="button" className="hf-btn hf-btn-white" onClick={() => navigate('/portfolio-review')}>Request a portfolio review</button>
              <a className="hf-btn hf-btn-white" href={whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
          </div>
          <ol className="hf-path">
            <li><span><Target size={16} /></span> Your Goals</li>
            <li><span><User size={16} /></span> Our Guidance</li>
            <li><span><Sprout size={16} /></span> A Brighter Tomorrow</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

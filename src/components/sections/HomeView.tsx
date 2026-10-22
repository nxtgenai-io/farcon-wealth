import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RoutePath } from '@/types';
import { formatINR } from '@/lib/formatting/currency';
import { formatPlanCompact, formatSip, formatTargetLabel, planIllustration } from '@/components/sections/home/planGoal';
import { FARCON_CONFIG } from '@/content/site/config';
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LineChart,
  Shield,
  Sprout,
  Target,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

interface HomeViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (subject?: string) => void;
  onOpenAI: () => void;
}

const PERIODS = ['1D', '1W', '1M', '1Y', '5Y'] as const;
type Period = (typeof PERIODS)[number];

const MARKET = {
  nifty: { name: 'NIFTY 50', value: '24,612.35', change: '+185.70', pct: '(+0.76%)' },
  sensex: { name: 'SENSEX', value: '81,050.62', change: '+618.91', pct: '(+0.77%)' },
};

function smoothSeries(start: number, end: number, points = 24): number[] {
  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1);
    const eased = t * t * (3 - 2 * t);
    const lift = Math.sin(t * Math.PI) * (end - start) * 0.035;
    const value = start + (end - start) * eased + lift;
    return i === points - 1 ? end : Math.round(value);
  });
}

const PATHS: Record<Period, { nifty: number[]; sensex: number[] }> = {
  '1D': { nifty: [24230, 24270, 24360, 24320, 24410, 24500, 24460, 24540, 24510, 24580, 24550, 24600, 24612], sensex: smoothSeries(80420, 81051) },
  '1W': { nifty: smoothSeries(24110, 24612), sensex: smoothSeries(79200, 81051) },
  '1M': { nifty: smoothSeries(23680, 24612), sensex: smoothSeries(77600, 81051) },
  '1Y': { nifty: smoothSeries(21840, 24612), sensex: smoothSeries(72400, 81051) },
  '5Y': { nifty: smoothSeries(14200, 24612), sensex: smoothSeries(48200, 81051) },
};

const GOALS = [
  { title: 'Retirement', text: 'Live your next chapter with confidence', image: 'goal-retirement', alt: 'A beach chair facing the ocean at sunset', href: '/goals/retirement' as RoutePath },
  { title: 'Child Education', text: 'Turn their dreams into reality', image: 'goal-education', alt: 'A child walking to school with a backpack', href: '/goals/child-education' as RoutePath },
  { title: 'Wealth Creation', text: 'Build long-term financial freedom', image: 'goal-wealth', alt: 'A green plant growing from a jar of coins', href: '/goals/wealth-creation' as RoutePath },
  { title: 'Tax Saving', text: 'Invest smart. Save more.', image: 'goal-tax', alt: 'A calculator resting on tax forms and coins', href: '/goals/tax-saving' as RoutePath },
];

const PLAN_PRESETS: Record<string, { target: number; years: number; rate: number }> = {
  Retirement: { target: 35_000_000, years: 20, rate: 12 },
  'Child Education': { target: 10_000_000, years: 15, rate: 12 },
  'Wealth Creation': { target: 20_000_000, years: 12, rate: 12 },
  'Tax Saving': { target: 5_000_000, years: 5, rate: 12 },
};

const RISK_NOTE: Record<string, string> = {
  'Very High Risk': 'Very high risk: returns can swing sharply. Suitable only when the goal is many years away.',
  'High Risk': 'High risk: equity-oriented. Values can fall in the short term.',
  'Moderate Risk': 'Moderate risk: a mix of growth and stability. Still subject to market movement.',
  'Low Risk': 'Low risk: relatively steadier, with lower expected growth. Not risk-free.',
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

function CountUp({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(value);
      return;
    }
    const from = 0;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      const eased = 1 - (1 - progress) ** 3;
      setShown(from + (value - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{shown.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
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

const RISK = {
  veryHigh: '#0E6B38',
  high: '#9B2C2C',
  moderate: '#9A5410',
} as const;

const FUNDS = [
  { name: 'SBI Small Cap Fund', group: 'Equity Funds', tags: ['Equity', 'Small Cap'], cagr: '26.4%', nav: '₹164.72', risk: 'Very High Risk', tone: RISK.veryHigh, logo: '/images/amc/sbi.svg', spark: [12, 13, 15, 16, 18, 20, 22, 24, 26] },
  { name: 'HDFC Flexi Cap Fund', group: 'Equity Funds', tags: ['Equity', 'Flexi Cap'], cagr: '21.8%', nav: '₹712.35', risk: 'High Risk', tone: RISK.high, logo: '/images/amc/hdfc.svg', spark: [11, 13, 14, 16, 17, 18, 20, 21, 22] },
  { name: 'ICICI Prudential Balanced Advantage Fund', group: 'Hybrid Funds', tags: ['Hybrid', 'Dynamic'], cagr: '14.6%', nav: '₹348.12', risk: 'Moderate Risk', tone: RISK.moderate, logo: '/images/amc/icici.webp', spark: [12, 12.4, 13, 13.6, 14.2, 14.8, 15.4, 16.2, 17] },
  { name: 'Axis ELSS Tax Saver Fund', group: 'Tax Saving (ELSS)', tags: ['Equity', 'ELSS'], cagr: '18.2%', nav: '₹112.46', risk: 'High Risk', tone: RISK.high, logo: '/images/amc/axis.svg', spark: [10, 11, 12.5, 13.5, 15, 16, 17.2, 18.2, 19] },
  { name: 'HDFC Short Term Debt Fund', group: 'Debt Funds', tags: ['Debt', 'Short Duration'], cagr: '7.4%', nav: '₹28.16', risk: 'Moderate Risk', tone: RISK.moderate, logo: '/images/amc/hdfc.svg', spark: [12, 12.2, 12.4, 12.7, 13, 13.2, 13.5, 13.8, 14] },
  { name: 'SBI Magnum Gilt Fund', group: 'Debt Funds', tags: ['Debt', 'Gilt'], cagr: '7.1%', nav: '₹58.40', risk: 'Moderate Risk', tone: RISK.moderate, logo: '/images/amc/sbi.svg', spark: [11, 11.4, 11.2, 11.8, 12.1, 12.4, 12.2, 12.8, 13.1] },
  { name: 'ICICI Prudential Corporate Bond Fund', group: 'Debt Funds', tags: ['Debt', 'Corporate'], cagr: '7.6%', nav: '₹26.90', risk: 'Moderate Risk', tone: RISK.moderate, logo: '/images/amc/icici.webp', spark: [10, 10.4, 10.8, 11.1, 11.4, 11.8, 12.1, 12.5, 12.8] },
  { name: 'Axis Treasury Advantage Fund', group: 'Debt Funds', tags: ['Debt', 'Money Market'], cagr: '6.8%', nav: '₹2,746', risk: 'Low Risk', tone: RISK.moderate, logo: '/images/amc/axis.svg', spark: [9, 9.2, 9.4, 9.5, 9.7, 9.9, 10.1, 10.3, 10.5] },
];

const TOOLS: { title: string; text: string; href: RoutePath; tint: string; icon: React.ReactNode }[] = [
  { title: 'SIP Calculator', text: 'Build wealth regularly', href: '/calculators/sip', tint: '#E5F6EA', icon: <TrendingUp size={16} color="#1F9D55" /> },
  { title: 'Lumpsum Calculator', text: 'Grow your investments', href: '/calculators/lumpsum', tint: '#E7F0FB', icon: <Wallet size={16} color="#3B82C4" /> },
  { title: 'Goal Planner', text: 'Plan for your dreams', href: '/calculators/goal', tint: '#FDE8D0', icon: <Target size={16} color="#E07A2F" /> },
  { title: 'Retirement Planner', text: 'Secure your future', href: '/calculators/retirement', tint: '#E5F2FB', icon: <User size={16} color="#3B82C4" /> },
  { title: 'Historical Returns', text: 'Analyse past performance', href: '/mutual-funds', tint: '#FDE8EA', icon: <LineChart size={16} color="#D4535A" /> },
  { title: 'Risk Analysis', text: 'Understand your risk', href: '/investor-quiz', tint: '#F3E8FB', icon: <Shield size={16} color="#8A4FB3" /> },
];

const STORIES = [
  { initials: 'A.S.', role: 'Retired Professional', quote: 'Farcon helped me plan my retirement in a very simple and clear way. I finally feel confident about my financial future.' },
  { initials: 'R.K.', role: 'Parent', quote: 'The goal planning process made it easy for me to invest for my child\'s education. Very supportive team.' },
  { initials: 'M.P.', role: 'Business Owner', quote: 'Transparent advice and a very disciplined approach. I appreciate the focus on long-term investing.' },
];

function smoothLine(pts: Array<readonly [number, number]>): string {
  if (pts.length === 0) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function Spark({ values, color }: { values: number[]; color: string }) {
  const w = 180;
  const h = 84;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - 8 - ((v - min) / (max - min || 1)) * (h - 16);
    return [x, y] as const;
  });
  const d = smoothLine(pts);
  const area = `${d} L${w} ${h} L0 ${h} Z`;
  return (
    <svg className="hf-spark" viewBox={`0 0 ${w} ${h}`} width="100%" height="84" aria-hidden="true">
      <path d={area} fill={color} opacity="0.14" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function NiftyChart({ values }: { values: number[] }) {
  const w = 340;
  const h = 108;
  const left = 8;
  const right = 54;
  const top = 8;
  const bottom = 18;
  const min = 24200;
  const max = 24800;
  const pts = values.map((v, i) => {
    const x = left + (i / (values.length - 1)) * (w - left - right);
    const y = top + (1 - (v - min) / (max - min)) * (h - top - bottom);
    return [x, Math.min(h - bottom, Math.max(top, y))] as const;
  });
  const d = smoothLine(pts);
  const area = `${d} L${pts[pts.length - 1][0].toFixed(1)} ${h - bottom} L${pts[0][0].toFixed(1)} ${h - bottom} Z`;
  const ticks = [24800, 24600, 24400, 24200];
  const times = ['09:15', '11:00', '13:00', '15:30'];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Illustrative NIFTY 50 chart">
      {ticks.map((tick) => {
        const y = top + (1 - (tick - min) / (max - min)) * (h - top - bottom);
        return (
          <g key={tick}>
            <line x1={left} x2={w - right} y1={y} y2={y} stroke="#e7efe9" strokeWidth="1" />
            <text x={w - 4} y={y + 3} fontSize="9" fill="#5c675f" textAnchor="end">{tick.toLocaleString('en-IN')}</text>
          </g>
        );
      })}
      {times.map((label, i) => (
        <text key={label} x={left + (i / (times.length - 1)) * (w - left - right)} y={h - 2} fontSize="9" fill="#5c675f" textAnchor={i === 0 ? 'start' : i === times.length - 1 ? 'end' : 'middle'}>{label}</text>
      ))}
      <path d={area} fill="rgba(31,157,85,0.18)" />
      <path className="hf-line" d={d} fill="none" stroke="#1F9D55" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function SensexSpark({ values }: { values: number[] }) {
  const w = 92;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = 4 + (1 - (v - min) / (max - min || 1)) * (h - 8);
    return [x, y] as const;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="92" height="28" aria-hidden="true">
      <path className="hf-line" d={smoothLine(pts)} fill="none" stroke="#1F9D55" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function AreaChart({
  series,
}: {
  series: { year: number; estimated: number; invested: number }[];
}) {
  const [active, setActive] = useState(Math.max(0, series.length - 1));
  const w = 640;
  const h = 220;
  const left = 16;
  const right = 12;
  const top = 28;
  const bottom = 24;
  const max = Math.max(...series.map((p) => Math.max(p.estimated, p.invested)), 1);
  const x = (i: number) => left + (i / Math.max(1, series.length - 1)) * (w - left - right);
  const y = (v: number) => top + (1 - v / max) * (h - top - bottom);
  const line = (key: 'estimated' | 'invested') =>
    series.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ');
  const area = `${line('estimated')} L${x(series.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
  const point = series[Math.min(active, series.length - 1)];

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
        {[0, 5, 10, 15, 20].map((label) => (
          <text key={label} x={left + (label / 20) * (w - left - right)} y={h - 4} fontSize="11" fill="#6a736c" textAnchor="middle">{label}</text>
        ))}
        <path d={area} fill="rgba(31,157,85,0.16)" />
        <path className="hf-line" d={line('estimated')} fill="none" stroke="#1F9D55" strokeWidth="2.5" />
        <path className="hf-line" d={line('invested')} fill="none" stroke="#C9A24A" strokeWidth="2" />
        {point && <circle cx={x(active)} cy={y(point.estimated)} r="4" fill="#0F3D2E" />}
      </svg>
      <div className="hf-year-badge">
        Year {series[series.length - 1]?.year} {formatTargetLabel(series[series.length - 1]?.estimated ?? 0)}
      </div>
      <div className="hf-axis" aria-hidden="true">
        <span>3 Cr</span><span>2 Cr</span><span>1 Cr</span><span>0</span>
      </div>
      <div className="hf-legend">
        <span><i style={{ background: '#1F9D55' }} />Estimated Value</span>
        <span><i style={{ background: '#C9A24A' }} />Invested Amount</span>
      </div>
    </div>
  );
}

export const HomeView: React.FC<HomeViewProps> = ({ navigate, onOpenConsultation }) => {
  const [period, setPeriod] = useState<Period>('1D');
  const [indexFocus, setIndexFocus] = useState<'nifty' | 'sensex'>('nifty');
  const [planTab, setPlanTab] = useState<(typeof PLAN_TABS)[number]>('Retirement');
  const [target, setTarget] = useState(35_000_000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);
  const [fundTab, setFundTab] = useState('Equity Funds');
  const storyRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [storyDot, setStoryDot] = useState(0);
  const [storyStart, setStoryStart] = useState(0);
  const [storiesPaused, setStoriesPaused] = useState(false);
  const plan = useMemo(() => planIllustration(target, years, rate), [target, years, rate]);
  const funds = fundTab === 'Equity Funds'
    ? FUNDS.filter((fund) => fund.group !== 'Debt Funds')
    : FUNDS.filter((fund) => fund.group === fundTab);
  const whatsapp = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;

  const orderedStories = useMemo(
    () => STORIES.map((_, index) => STORIES[(index + storyStart) % STORIES.length]),
    [storyStart],
  );

  const scrollStories = (dir: number) => {
    const el = storyRef.current;
    if (el && el.scrollWidth > el.clientWidth + 12) {
      const card = el.querySelector('article');
      const width = card ? card.getBoundingClientRect().width + 14 : el.clientWidth;
      const max = el.scrollWidth - el.clientWidth;
      if (dir > 0 && el.scrollLeft + width >= max - 6) el.scrollTo({ left: 0, behavior: 'smooth' });
      else if (dir < 0 && el.scrollLeft <= 6) el.scrollTo({ left: max, behavior: 'smooth' });
      else el.scrollBy({ left: dir * width, behavior: 'smooth' });
      return;
    }
    setStoryStart((current) => (current + dir + STORIES.length) % STORIES.length);
    setStoryDot((current) => (current + dir + STORIES.length) % STORIES.length);
  };

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

  const scrollStoriesRef = useRef(scrollStories);
  scrollStoriesRef.current = scrollStories;

  useEffect(() => {
    if (prefersReducedMotion() || storiesPaused) return undefined;
    const timer = window.setInterval(() => scrollStoriesRef.current(1), 6500);
    return () => window.clearInterval(timer);
  }, [storiesPaused]);

  return (
    <div className="hf">
      <section className="hf-hero" data-section="hero" ref={heroRef}>
        <img
          className="hf-hero-photo"
          src="/images/home/hero-1024.webp"
          srcSet="/images/home/hero-800.webp 800w, /images/home/hero-1024.webp 1024w, /images/home/hero-1600.webp 1600w"
          sizes="100vw"
          alt="An Indian family of six in a sunlit living room: grandfather, grandmother, father, mother, a girl, and a boy"
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
        />
        <div className="hf-hero-scrim" aria-hidden="true" />
        <div className="hf-hero-inner">
          <div className="hf-hero-copy">
            <span className="hf-eye">Goal-based wealth guidance</span>
            <p className="hf-script">
              A more secure
              <br />tomorrow, together.
              <svg className="hf-script-arrow" viewBox="0 0 140 36" aria-hidden="true">
                <path d="M120 6 C 80 10, 48 22, 18 30" fill="none" stroke="#2c3a34" strokeWidth="1.2" />
                <path d="M18 30 l10 -2 M18 30 l3 8" fill="none" stroke="#2c3a34" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </p>
            <h1>Investing,<br /><em>without the noise.</em></h1>
            <p className="hf-lede">Your goals are personal. Your investment journey should be too.</p>
            <p className="hf-lede">Farcon helps you approach mutual fund investing with clarity, discipline and purpose.</p>
            <div className="hf-cta-row">
              <button type="button" className="hf-btn hf-btn-green" onClick={() => document.getElementById('goals')?.scrollIntoView({ behavior: 'smooth' })}>
                Start with a Goal <ArrowRight size={14} />
              </button>
              <button type="button" className="hf-btn hf-btn-outline" onClick={() => onOpenConsultation('Book a Free 15-Minute Call')}>
                Book a Free 15-Minute Call
              </button>
            </div>
            <div className="hf-trust">
              <span><Target size={14} /> Goal-based</span>
              <span><Shield size={14} /> Transparent</span>
              <span><User size={14} /> In your name</span>
            </div>
          </div>
          <article className="hf-market" aria-label="Illustrative market snapshot">
            <div className="hf-market-tabs">
              <div className="hf-tabs" role="group" aria-label="Index">
                <button type="button" className={indexFocus === 'nifty' ? 'is-on' : ''} onClick={() => setIndexFocus('nifty')}>NIFTY 50</button>
                <button type="button" className={indexFocus === 'sensex' ? 'is-on' : ''} onClick={() => setIndexFocus('sensex')}>SENSEX</button>
              </div>
              <div className="hf-tabs" role="group" aria-label="Period">
                {PERIODS.map((item) => (
                  <button key={item} type="button" className={period === item ? 'is-on' : ''} onClick={() => setPeriod(item)}>{item}</button>
                ))}
              </div>
            </div>
            <p className="hf-index-name">NIFTY 50</p>
            <p className="hf-level"><CountUp value={24612.35} /> <span className="hf-up">{MARKET.nifty.change} {MARKET.nifty.pct}</span></p>
            <p className="hf-note">As of 12 Mar 2025, 03:30 PM IST <span className="hf-indicative">Indicative</span></p>
            <div key={period} className="hf-draw">
              <NiftyChart values={PATHS[period].nifty} />
            </div>
            <div className="hf-sensex">
              <div>
                <b>SENSEX</b>
                <strong><CountUp value={81050.62} /></strong>
                <span className="hf-up">{MARKET.sensex.change} {MARKET.sensex.pct}</span>
              </div>
              <span key={period} className="hf-draw"><SensexSpark values={PATHS[period].sensex} /></span>
              <ChevronDown size={14} aria-hidden="true" />
            </div>
          </article>
        </div>
      </section>

      <Reveal as="section" className="hf-section" id="goals" data-section="goals">
        <div className="hf-wrap">
          <div className="hf-goals">
            {GOALS.map((goal, index) => (
              <button key={goal.title} type="button" className="hf-goal" style={{ animationDelay: `${index * 70}ms` }} onClick={() => navigate(goal.href)}>
                <img {...cardSrc(goal.image)} sizes="(min-width: 1100px) 180px, 80vw" alt={goal.alt} width={1600} height={1100} loading="eager" fetchPriority="high" decoding="sync" />
                <span>
                  <h2>{goal.title}</h2>
                  <p>{goal.text}</p>
                </span>
                <span className="hf-arrow" aria-hidden="true"><ArrowRight size={16} /></span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="hf-section" id="planner" data-section="planner">
        <div className="hf-wrap">
          <div className="hf-plan">
            <div className="hf-plan-copy">
              <span className="hf-eye">Interactive goal planning calculator</span>
              <h2>Your Goals.<br /><em>Our Planning.</em></h2>
              <p className="hf-lede">See how small, consistent steps today can create a brighter tomorrow.</p>
              <PlanningPlant />
            </div>
            <div className="hf-plan-panel">
              <div className="hf-tabs">
                {PLAN_TABS.map((tab) => (
                  <button key={tab} type="button" className={planTab === tab ? 'is-on' : ''} onClick={() => {
                    const preset = PLAN_PRESETS[tab];
                    setPlanTab(tab);
                    setTarget(preset.target);
                    setYears(preset.years);
                    setRate(preset.rate);
                  }}>{tab}</button>
                ))}
              </div>
              <div className="hf-plan-grid">
              <div className="hf-controls">
              <label className="hf-slider">
                <span className="hf-slider-top"><span>Target Corpus</span></span>
                <SyncedField label="Target corpus in rupees" value={target} min={5_000_000} max={100_000_000} step={500_000} display={(n) => formatINR(n)} onChange={setTarget} />
                <input type="range" min={5_000_000} max={100_000_000} step={500_000} value={target} style={{ ['--pct' as string]: `${((target - 5_000_000) / 95_000_000) * 100}%` }} onChange={(e) => setTarget(Number(e.target.value))} />
                <span className="hf-scale"><span>₹50 L</span><span>₹10 Cr</span></span>
              </label>
              <label className="hf-slider">
                <span className="hf-slider-top"><span>Time Horizon</span></span>
                <SyncedField label="Time horizon in years" value={years} min={3} max={30} step={1} display={(n) => `${n} Years`} onChange={setYears} />
                <input type="range" min={3} max={30} step={1} value={years} style={{ ['--pct' as string]: `${((years - 3) / 27) * 100}%` }} onChange={(e) => setYears(Number(e.target.value))} />
                <span className="hf-scale"><span>3 Yrs</span><span>30 Yrs</span></span>
              </label>
              <label className="hf-slider hf-return">
                <span className="hf-slider-top"><span>Expected Return (p.a.)</span></span>
                <SyncedField label="Expected annual return percent" value={rate} min={6} max={18} step={1} display={(n) => `${n}%`} onChange={setRate} />
                <input type="range" min={6} max={18} step={1} value={rate} style={{ ['--pct' as string]: `${((rate - 6) / 12) * 100}%` }} onChange={(e) => setRate(Number(e.target.value))} />
                <span className="hf-scale"><span>6%</span><span>18%</span></span>
              </label>
              </div>
              <div className="hf-result" aria-live="polite">
                <span>Required Monthly SIP</span>
                <strong key={plan.requiredMonthlySIP}>{formatSip(plan.requiredMonthlySIP)}</strong>
                <dl>
                  <div><dt>Total Investment</dt><dd>{formatPlanCompact(plan.totalInvestment)}</dd></div>
                  <div><dt>Estimated Growth</dt><dd>{formatPlanCompact(plan.estimatedGrowth)}</dd></div>
                </dl>
                <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate(`/calculators/goal?target=${target}&years=${years}&rate=${rate}` as RoutePath)}>
                  View Detailed Plan <ArrowRight size={16} />
                </button>
              </div>
              <div>
                <div key={`${target}-${years}-${rate}`} className="hf-draw">
                  <AreaChart series={plan.series} />
                </div>
                <p className="hf-note">This is an estimate based on the returns assumed. Actual results may vary.</p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="hf-section" data-section="funds">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Featured mutual funds</span>
            <h2>Explore top funds for your <em>goals.</em></h2>
            <p className="hf-lede">Handpicked schemes across categories to help you build a stronger tomorrow.</p>
            <button type="button" className="hf-textlink" onClick={() => navigate('/mutual-funds')}>Explore All Mutual Funds →</button>
          </div>
          <div>
          <div className="hf-pills">
            {['Equity Funds', 'Hybrid Funds', 'Debt Funds', 'Tax Saving (ELSS)'].map((tab) => (
              <button key={tab} type="button" className={fundTab === tab ? 'is-on' : ''} onClick={() => setFundTab(tab)}>{tab}</button>
            ))}
            <button type="button" className="hf-textlink" onClick={() => navigate('/mutual-funds')}>View All Funds →</button>
          </div>
          <div className="hf-fund-row" key={fundTab}>
            {funds.map((fund) => (
              <article key={fund.name} className="hf-fund">
                <div className="hf-amc">
                  <img className="hf-logo" src={fund.logo} alt="" />
                  <div>
                    <h2>{fund.name}</h2>
                    <div className="hf-sub">Direct Growth</div>
                  </div>
                </div>
                <div className="hf-tags">{fund.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="hf-metrics">
                  <span>3Y CAGR<b>{fund.cagr}</b></span>
                  <span>NAV<b>{fund.nav}</b></span>
                </div>
                <Spark values={fund.spark} color={fund.tone} />
                <span className="hf-pill" tabIndex={0} style={{ background: fund.tone }}>
                  {fund.risk}
                  <span className="hf-tip" role="tooltip">{RISK_NOTE[fund.risk]}</span>
                </span>
              </article>
            ))}
            {funds.length === 0 && (
              <article className="hf-fund">
                <h2>Debt funds</h2>
                <p>Illustrative debt schemes are listed in the fund explorer.</p>
                <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/mutual-funds')}>View All Funds →</button>
              </article>
            )}
          </div>
          <button type="button" className="hf-textlink hf-more-mobile" onClick={() => navigate('/mutual-funds')}>View All Funds →</button>
          </div>
        </div>
      </Reveal>

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
            <h2>A disciplined approach to wealth creation.</h2>
            <p className="hf-why-lead">We combine research, technology and a goal-based approach to help you invest with confidence.</p>
            <button type="button" className="hf-btn hf-btn-white" onClick={() => navigate('/about')}>Know More About Us <ArrowRight size={16} /></button>
          </div>
          <div className="hf-cols">
            <article>
              <div className="hf-num">01</div>
              <div className="hf-icon-tile"><Target size={18} /></div>
              <h3>Goal-Based Planning</h3>
              <p>Your investments are aligned to what matters most — your goals, your timelines, your life events.</p>
            </article>
            <article>
              <div className="hf-num">02</div>
              <div className="hf-icon-tile"><LineChart size={18} /></div>
              <h3>Research-Backed Recommendations</h3>
              <p>We use a structured research process to shortlist quality mutual funds across categories.</p>
            </article>
            <article>
              <div className="hf-num">03</div>
              <div className="hf-icon-tile"><Shield size={18} /></div>
              <h3>Transparent & Client-First</h3>
              <p>No hidden charges. No pressure. Just clear guidance, in your best interest.</p>
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

      <Reveal as="section" className="hf-section" data-section="stories">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Investor stories</span>
            <h2>What our investors say</h2>
            <p className="hf-lede">Real experiences, real journeys, a shared belief in long-term wealth creation.</p>
          </div>
          <div>
          <div
            className="hf-carousel"
            onMouseEnter={() => setStoriesPaused(true)}
            onMouseLeave={() => setStoriesPaused(false)}
            onFocus={() => setStoriesPaused(true)}
            onBlur={() => setStoriesPaused(false)}
          >
            <button type="button" className="hf-side" onClick={() => scrollStories(-1)} aria-label="Previous stories"><ChevronLeft size={18} /></button>
          <div
            className="hf-stories"
            ref={storyRef}
            onScroll={(event) => {
              const el = event.currentTarget;
              if (el.scrollWidth <= el.clientWidth + 12) return;
              const card = el.querySelector('article');
              const width = card ? card.getBoundingClientRect().width + 14 : 1;
              setStoryDot(Math.round(el.scrollLeft / width) % STORIES.length);
            }}
          >
            {orderedStories.map((story) => (
              <article key={story.initials} className="hf-story">
                <div className="hf-quote">“</div>
                <p>“{story.quote}”</p>
                <div className="hf-who">
                  <span className="hf-initials" data-who={story.initials[0]} aria-hidden="true">{story.initials[0]}</span>
                  <span className="hf-who-text">
                    <b>{story.initials}</b>
                    <small>{story.role}</small>
                  </span>
                </div>
              </article>
            ))}
          </div>
            <button type="button" className="hf-side" onClick={() => scrollStories(1)} aria-label="Next stories"><ChevronRight size={18} /></button>
          </div>
          <div className="hf-dots">
            {STORIES.map((story, index) => (
              <button key={story.initials} type="button" className={storyDot === index ? 'is-on' : ''} aria-label={`Story ${index + 1}`} onClick={() => scrollStories(index - storyDot)}>
                <i />
              </button>
            ))}
          </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="hf-section" data-section="articles">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Investor education</span>
            <h2>Learn, Plan &amp; Grow</h2>
            <p className="hf-lede">Simplified insights to help you make informed decisions.</p>
            <button type="button" className="hf-textlink" onClick={() => navigate('/education')}>Explore All Articles →</button>
          </div>
          <div className="hf-articles">
            {[
              ['article-funds', 'Coin stacks with a small plant', 'Mutual Funds 101', 'A beginner\'s guide to investing in mutual funds'],
              ['article-sip', 'A pink piggy bank', 'SIP vs Lumpsum', 'Which strategy is right for you?'],
              ['article-elss', 'A calculator on tax paperwork', 'Tax Saving with ELSS', 'Save tax while building wealth'],
            ].map(([name, alt, title, text]) => (
              <a key={title} className="hf-article" href="/education" onClick={(event) => { event.preventDefault(); navigate('/education'); }}>
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
            <p>Get personalised guidance from our experts. No pressure, just a conversation about your goals.</p>
            <div className="hf-cta-row">
              <button type="button" className="hf-btn hf-btn-gold" onClick={() => onOpenConsultation('Book a Free 15-Minute Call')}>
                Book a Free 15-Minute Call <ArrowRight size={16} />
              </button>
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

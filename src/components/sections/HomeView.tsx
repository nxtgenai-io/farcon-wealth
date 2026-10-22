import React, { useMemo, useRef, useState } from 'react';
import { RoutePath } from '@/types';
import { formatINR } from '@/lib/formatting/currency';
import { formatPlanCompact, formatSip, formatTargetLabel, planIllustration } from '@/components/sections/home/planGoal';
import { FARCON_CONFIG } from '@/content/site/config';
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Flag,
  LineChart,
  Shield,
  Sprout,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react';

interface HomeViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (subject?: string) => void;
  onOpenAI: () => void;
}

const PERIODS = ['1D', '1W', '1M', '1Y', '5Y'] as const;
type Period = (typeof PERIODS)[number];

const MARKET = {
  nifty: { name: 'NIFTY 50', value: '24,612.35', change: '+185.70', pct: '(+0.76%)' },
  sensex: { name: 'SENSEX', value: '81,050.62', change: '+618.51', pct: '(+0.77%)' },
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
  '1D': { nifty: smoothSeries(24420, 24612), sensex: smoothSeries(80420, 81051) },
  '1W': { nifty: smoothSeries(24110, 24612), sensex: smoothSeries(79200, 81051) },
  '1M': { nifty: smoothSeries(23680, 24612), sensex: smoothSeries(77600, 81051) },
  '1Y': { nifty: smoothSeries(21840, 24612), sensex: smoothSeries(72400, 81051) },
  '5Y': { nifty: smoothSeries(14200, 24612), sensex: smoothSeries(48200, 81051) },
};

const GOALS = [
  { title: 'Retirement', text: 'Live your next chapter with confidence', image: '/images/home/goal-retirement.webp', href: '/goals/retirement' as RoutePath },
  { title: 'Child Education', text: 'Turn their dreams into reality', image: '/images/home/goal-education.webp', href: '/goals/child-education' as RoutePath },
  { title: 'Wealth Creation', text: 'Build long-term financial freedom', image: '/images/home/goal-wealth.webp', href: '/goals/wealth-creation' as RoutePath },
  { title: 'Tax Saving', text: 'Invest smart. Save more.', image: '/images/home/goal-tax.webp', href: '/goals/tax-saving' as RoutePath },
];

const PLAN_TABS = ['Retirement', 'Child Education', 'Wealth Creation', 'Tax Saving'] as const;

const RISK = {
  veryHigh: '#0E6B38',
  high: '#9B2C2C',
  moderate: '#9A5410',
} as const;

const FUNDS = [
  { name: 'SBI Small Cap Fund', group: 'Equity Funds', tags: ['Equity', 'Small Cap'], cagr: '26.4%', nav: '₹164.72', risk: 'Very High Risk', tone: RISK.veryHigh, logo: '/images/amc/sbi.svg', spark: [12, 13, 15, 16, 18, 20, 22, 24, 26] },
  { name: 'HDFC Flexi Cap Fund', group: 'Equity Funds', tags: ['Equity', 'Flexi Cap'], cagr: '21.8%', nav: '₹712.35', risk: 'High Risk', tone: RISK.high, logo: '/images/amc/hdfc.svg', spark: [11, 13, 14, 16, 17, 18, 20, 21, 22] },
  { name: 'ICICI Prudential Balanced Advantage Fund', group: 'Hybrid Funds', tags: ['Hybrid', 'Dynamic'], cagr: '14.6%', nav: '₹348.12', risk: 'Moderate Risk', tone: RISK.moderate, logo: '/images/amc/icici.svg', spark: [12, 12.4, 13, 13.6, 14.2, 14.8, 15.4, 16.2, 17] },
  { name: 'Axis ELSS Tax Saver Fund', group: 'Tax Saving (ELSS)', tags: ['Equity', 'ELSS'], cagr: '18.2%', nav: '₹112.46', risk: 'High Risk', tone: RISK.high, logo: '/images/amc/axis.svg', spark: [10, 11, 12.5, 13.5, 15, 16, 17.2, 18.2, 19] },
  { name: 'HDFC Short Term Debt Fund', group: 'Debt Funds', tags: ['Debt', 'Short Duration'], cagr: '7.4%', nav: '₹28.16', risk: 'Moderate Risk', tone: RISK.moderate, logo: '/images/amc/hdfc.svg', spark: [12, 12.2, 12.4, 12.7, 13, 13.2, 13.5, 13.8, 14] },
  { name: 'SBI Magnum Gilt Fund', group: 'Debt Funds', tags: ['Debt', 'Gilt'], cagr: '7.1%', nav: '₹58.40', risk: 'Moderate Risk', tone: RISK.moderate, logo: '/images/amc/sbi.svg', spark: [11, 11.4, 11.2, 11.8, 12.1, 12.4, 12.2, 12.8, 13.1] },
  { name: 'ICICI Prudential Corporate Bond Fund', group: 'Debt Funds', tags: ['Debt', 'Corporate'], cagr: '7.6%', nav: '₹26.90', risk: 'Moderate Risk', tone: RISK.moderate, logo: '/images/amc/icici.svg', spark: [10, 10.4, 10.8, 11.1, 11.4, 11.8, 12.1, 12.5, 12.8] },
  { name: 'Axis Treasury Advantage Fund', group: 'Debt Funds', tags: ['Debt', 'Money Market'], cagr: '6.8%', nav: '₹2,746', risk: 'Low Risk', tone: RISK.moderate, logo: '/images/amc/axis.svg', spark: [9, 9.2, 9.4, 9.5, 9.7, 9.9, 10.1, 10.3, 10.5] },
];

const TOOLS: { title: string; text: string; href: RoutePath; tint: string; icon: React.ReactNode }[] = [
  { title: 'SIP Calculator', text: 'Build wealth regularly', href: '/calculators/sip', tint: '#E5F6EA', icon: <TrendingUp size={20} /> },
  { title: 'Lumpsum Calculator', text: 'Grow your investments', href: '/calculators/lumpsum', tint: '#FDECDD', icon: <Wallet size={20} /> },
  { title: 'Goal Planner', text: 'Plan for your dreams', href: '/calculators/goal', tint: '#EEE7FA', icon: <Target size={20} /> },
  { title: 'Retirement Planner', text: 'Secure your future', href: '/calculators/retirement', tint: '#F8F1DE', icon: <Calculator size={20} /> },
  { title: 'Historical Returns', text: 'Analyse past performance', href: '/mutual-funds', tint: '#E5F0FA', icon: <LineChart size={20} /> },
  { title: 'Risk Analysis', text: 'Understand your risk', href: '/investor-quiz', tint: '#FBE7EA', icon: <Shield size={20} /> },
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

function MarketLine({ values, label }: { values: number[]; label: string }) {
  const w = 360;
  const h = 132;
  const left = 58;
  const top = 12;
  const bottom = 18;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = left + (i / (values.length - 1)) * (w - left - 10);
    const y = top + (1 - (v - min) / span) * (h - top - bottom);
    return [x, y] as const;
  });
  const d = smoothLine(pts);
  const area = `${d} L${pts[pts.length - 1][0].toFixed(1)} ${h - bottom} L${pts[0][0].toFixed(1)} ${h - bottom} Z`;
  const ticks = [0, 0.5, 1].map((t) => ({
    y: top + (1 - t) * (h - top - bottom),
    label: Math.round(min + span * t).toLocaleString('en-IN'),
  }));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Illustrative ${label} chart`}>
      {ticks.map((tick) => (
        <g key={tick.label}>
          <line x1={left} x2={w - 8} y1={tick.y} y2={tick.y} stroke="#e6e0d4" strokeWidth="1" />
          <text x="0" y={tick.y + 4} fontSize="11" fill="#3d4a40">{tick.label}</text>
        </g>
      ))}
      <path d={area} fill="rgba(31,157,85,0.16)" />
      <path d={d} fill="none" stroke="#1F9D55" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
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
  const tipLeft = series.length > 1 ? (active / (series.length - 1)) * 100 : 50;

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
        <path d={area} fill="rgba(31,157,85,0.16)" />
        <path d={line('estimated')} fill="none" stroke="#1F9D55" strokeWidth="2.5" />
        <path d={line('invested')} fill="none" stroke="#C9A24A" strokeWidth="2" />
        {point && <circle cx={x(active)} cy={y(point.estimated)} r="4" fill="#0F3D2E" />}
      </svg>
      <div className="hf-year-badge">
        Year {series[series.length - 1]?.year} {formatTargetLabel(series[series.length - 1]?.estimated ?? 0)}
      </div>
      {point && (
        <div
          className={`hf-tip ${tipLeft > 72 ? 'is-end' : tipLeft < 18 ? 'is-start' : ''}`}
          style={tipLeft > 72 || tipLeft < 18 ? undefined : { left: `${tipLeft}%` }}
        >
          Year {point.year} {formatTargetLabel(point.estimated)}
        </div>
      )}
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
  const [storyDot, setStoryDot] = useState(0);
  const plan = useMemo(() => planIllustration(target, years, rate), [target, years, rate]);
  const funds = fundTab === 'Equity Funds'
    ? FUNDS.filter((fund) => fund.group !== 'Debt Funds')
    : FUNDS.filter((fund) => fund.group === fundTab);
  const whatsapp = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;

  const scrollStories = (dir: number) => {
    const el = storyRef.current;
    if (!el) return;
    const card = el.querySelector('article');
    const width = card ? card.getBoundingClientRect().width + 14 : el.clientWidth;
    el.scrollBy({ left: dir * width, behavior: 'smooth' });
  };

  return (
    <div className="hf">
      <section className="hf-hero">
        <img className="hf-hero-photo" src="/images/home/hero.webp" alt="A family sitting together, looking toward misty green mountains" width={1600} height={1068} fetchPriority="high" />
        <div className="hf-hero-scrim" />
        <div className="hf-hero-inner">
          <div className="hf-hero-copy">
            <span className="hf-eye">Goal-based wealth guidance</span>
            <p className="hf-script">
              A more secure tomorrow, together.
              <svg className="hf-script-arrow" viewBox="0 0 140 54" aria-hidden="true">
                <path d="M118 8 C 78 12, 46 30, 16 44" fill="none" stroke="#3e4a3d" strokeWidth="1.4" />
                <path d="M16 44 l12 -1 M16 44 l4 11" fill="none" stroke="#3e4a3d" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </p>
            <h1>Investing,<br /><em>without the noise.</em></h1>
            <p className="hf-lede">Your goals are personal. Your investment journey should be too. Farcon helps you approach mutual fund investing with clarity, discipline and purpose.</p>
            <div className="hf-cta-row">
              <button type="button" className="hf-btn hf-btn-green" onClick={() => document.getElementById('goals')?.scrollIntoView({ behavior: 'smooth' })}>
                Start with a Goal <ArrowRight size={16} />
              </button>
              <button type="button" className="hf-btn hf-btn-outline" onClick={() => onOpenConsultation('Book a Free 15-Minute Call')}>
                Book a Free 15-Minute Call
              </button>
            </div>
            <div className="hf-trust">
              <span><Target size={16} /> Goal-based</span>
              <span><BadgeCheck size={16} /> Transparent</span>
              <span><Shield size={16} /> In your name</span>
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
            <div className={`hf-quote-block ${indexFocus === 'nifty' ? 'is-focus' : ''}`}>
              <div className="hf-quote-row">
                <strong>NIFTY 50</strong>
                <span className="hf-up">{MARKET.nifty.change} {MARKET.nifty.pct}</span>
              </div>
              <p className="hf-level">{MARKET.nifty.value}</p>
              <MarketLine values={PATHS[period].nifty} label="NIFTY 50" />
            </div>
            <div className={`hf-quote-block ${indexFocus === 'sensex' ? 'is-focus' : ''}`}>
              <div className="hf-quote-row">
                <strong>SENSEX</strong>
                <span className="hf-up">{MARKET.sensex.change} {MARKET.sensex.pct}</span>
              </div>
              <p className="hf-level">{MARKET.sensex.value}</p>
              <MarketLine values={PATHS[period].sensex} label="SENSEX" />
            </div>
            <p className="hf-note">Illustrative snapshot · not a live quote</p>
          </article>
        </div>
      </section>

      <section className="hf-section" id="goals">
        <div className="hf-wrap">
          <div className="hf-goals">
            {GOALS.map((goal) => (
              <button key={goal.title} type="button" className="hf-goal" onClick={() => navigate(goal.href)}>
                <img src={goal.image} alt="" width={720} height={480} loading="lazy" />
                <span>
                  <h2>{goal.title}</h2>
                  <p>{goal.text}</p>
                </span>
                <span className="hf-arrow" aria-hidden="true"><ArrowRight size={16} /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="hf-section" id="planner">
        <div className="hf-wrap">
          <div className="hf-plan">
            <div className="hf-plan-copy">
              <span className="hf-eye">Interactive goal planning calculator</span>
              <h2>Your Goals.<br /><em>Our Planning.</em></h2>
              <p className="hf-lede">See how small, consistent steps today can create a brighter tomorrow.</p>
              <svg className="hf-plant" viewBox="0 0 280 360" aria-hidden="true">
                <ellipse cx="140" cy="332" rx="78" ry="16" fill="#E3F3E8" />
                <path d="M140 328 V150" stroke="#17693A" strokeWidth="7" strokeLinecap="round" />
                <path d="M140 250 C70 230 18 170 48 108 C92 142 124 200 140 250" fill="#1F9D55" />
                <path d="M140 228 C214 200 268 140 236 78 C188 118 156 176 140 228" fill="#0E3D2C" />
                <path d="M140 196 C78 176 40 128 62 82 C98 108 122 156 140 196" fill="#3CB371" />
                <path d="M140 172 C198 150 236 108 214 68 C176 96 152 136 140 172" fill="#146C43" />
                <path d="M140 150 C96 128 70 92 86 58 C112 78 128 116 140 150" fill="#8FCB6A" />
                <path d="M140 138 C182 116 210 82 196 50 C166 72 148 108 140 138" fill="#1B7A45" />
                <ellipse cx="140" cy="96" rx="16" ry="22" fill="#C9A24A" transform="rotate(-18 140 96)" />
                <ellipse cx="128" cy="88" rx="7" ry="12" fill="#E2C56A" transform="rotate(-30 128 88)" />
              </svg>
            </div>
            <div className="hf-plan-panel">
              <div className="hf-tabs">
                {PLAN_TABS.map((tab) => (
                  <button key={tab} type="button" className={planTab === tab ? 'is-on' : ''} onClick={() => setPlanTab(tab)}>{tab}</button>
                ))}
              </div>
              <div className="hf-plan-grid">
              <div>
              <label className="hf-slider">
                <span className="hf-slider-top"><span>Target Corpus</span><b>{formatINR(target)}</b></span>
                <input type="range" min={5_000_000} max={100_000_000} step={500_000} value={target} style={{ ['--pct' as string]: `${((target - 5_000_000) / 95_000_000) * 100}%` }} onChange={(e) => setTarget(Number(e.target.value))} />
                <span className="hf-scale"><span>₹50 L</span><span>₹10 Cr</span></span>
              </label>
              <label className="hf-slider">
                <span className="hf-slider-top"><span>Time Horizon</span><b>{years} Years</b></span>
                <input type="range" min={1} max={30} step={1} value={years} style={{ ['--pct' as string]: `${((years - 1) / 29) * 100}%` }} onChange={(e) => setYears(Number(e.target.value))} />
                <span className="hf-scale"><span>1 Yr</span><span>30 Yrs</span></span>
              </label>
              <label className="hf-slider">
                <span className="hf-slider-top"><span>Expected Return</span><b>{rate}%</b></span>
                <input type="range" min={6} max={18} step={1} value={rate} style={{ ['--pct' as string]: `${((rate - 6) / 12) * 100}%` }} onChange={(e) => setRate(Number(e.target.value))} />
                <span className="hf-scale"><span>6%</span><span>18%</span></span>
              </label>
              </div>
              <div className="hf-result" aria-live="polite">
                <span>Required Monthly SIP</span>
                <strong>{formatSip(plan.requiredMonthlySIP)}</strong>
                <dl>
                  <div><dt>Total Investment</dt><dd>{formatPlanCompact(plan.totalInvestment)}</dd></div>
                  <div><dt>Estimated Growth</dt><dd>{formatPlanCompact(plan.estimatedGrowth)}</dd></div>
                </dl>
                <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/calculators/goal')}>
                  View Detailed Plan <ArrowRight size={16} />
                </button>
              </div>
              <div>
                <AreaChart series={plan.series} />
                <p className="hf-note">This is an estimate based on the returns assumed. Actual results may vary. Illustrative planning aid for {planTab.toLowerCase()}.</p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hf-section">
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
          <p className="hf-note">Figures are illustrative, not live NAVs, and not a recommendation.</p>
          <div className="hf-fund-row">
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
                <span className="hf-pill" style={{ background: fund.tone }}>{fund.risk}</span>
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
          </div>
        </div>
      </section>

      <section className="hf-why">
        <img className="hf-why-photo" src="/images/home/why-mountains.webp" alt="" width={1400} height={834} />
        <svg className="hf-flag" viewBox="0 0 1200 640" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
          <path d="M760 560 C 820 470, 780 390, 900 330 S 860 180, 1020 120 S 980 40, 1120 28" fill="none" stroke="rgba(255,255,255,0.78)" strokeWidth="2.5" strokeDasharray="1.5 8" strokeLinecap="round" />
          <path d="M1112 28 v92" stroke="#F3D48A" strokeWidth="3" />
          <path d="M1112 28 h52 l-12 16 12 16 h-52 z" fill="#F3D48A" />
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
              <div className="hf-icon-tile"><Flag size={18} /></div>
              <h3>Transparent & Client-First</h3>
              <p>No hidden charges. No pressure. Just clear guidance, in your best interest.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="hf-section hf-tools-section">
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
      </section>

      <section className="hf-section">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Investor stories</span>
            <h2>What our investors say</h2>
            <p className="hf-lede">Real experiences, real journeys, a shared belief in long-term wealth creation.</p>
          </div>
          <div>
          <div className="hf-carousel">
            <button type="button" className="hf-side" onClick={() => scrollStories(-1)} aria-label="Previous stories">‹</button>
          <div
            className="hf-stories"
            ref={storyRef}
            onScroll={(event) => {
              const el = event.currentTarget;
              const card = el.querySelector('article');
              const width = card ? card.getBoundingClientRect().width + 14 : 1;
              setStoryDot(Math.round(el.scrollLeft / width));
            }}
          >
            {STORIES.map((story) => (
              <article key={story.initials} className="hf-story">
                <div className="hf-quote">“</div>
                <p>{story.quote}</p>
                <div className="hf-who">
                  <span className="hf-initials" aria-hidden="true">{story.initials.replace(/\./g, '')}</span>
                  <span className="hf-who-text">
                    <b>{story.initials}</b>
                    <small>{story.role}</small>
                  </span>
                </div>
              </article>
            ))}
          </div>
            <button type="button" className="hf-side" onClick={() => scrollStories(1)} aria-label="Next stories">›</button>
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
      </section>

      <section className="hf-section">
        <div className="hf-wrap hf-split">
          <div>
            <span className="hf-eye">Investor education</span>
            <h2>Learn, Plan &amp; Grow</h2>
            <p className="hf-lede">Simplified insights to help you make informed decisions.</p>
            <button type="button" className="hf-textlink" onClick={() => navigate('/education')}>Explore All Articles →</button>
          </div>
          <div className="hf-articles">
            {[
              ['/images/home/article-funds.webp', 'Mutual Funds 101', 'A beginner\'s guide to investing in mutual funds'],
              ['/images/home/article-sip.webp', 'SIP vs Lumpsum', 'Which strategy is right for you?'],
              ['/images/home/article-elss.webp', 'Tax Saving with ELSS', 'Save tax while building wealth'],
            ].map(([src, title, text]) => (
              <a key={title} className="hf-article" href="/education" onClick={(event) => { event.preventDefault(); navigate('/education'); }}>
                <img src={src} alt="" width={640} height={480} />
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                  <span className="hf-read">Read Article →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="hf-cta">
        <img className="bg" src="/images/home/cta-sunset.webp" alt="A person sitting on a rock above a mountain valley in warm evening light" width={1600} height={900} />
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
            <li><span><Sprout size={16} /></span> Our Guidance</li>
            <li><span><Flag size={16} /></span> A Brighter Tomorrow</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

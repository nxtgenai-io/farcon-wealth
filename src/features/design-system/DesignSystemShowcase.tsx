import React, { useMemo, useState } from 'react';
import {
  ArrowRight, BarChart3, Calculator, Check, ChevronDown, ChevronRight,
  GraduationCap, Landmark, MessageCircle, ShieldCheck, Sparkles, TrendingUp, Wallet
} from 'lucide-react';
import './design-system-showcase.css';

type Variant = 'Base' | 'Featured' | 'Selectable' | 'Metric';
const variantClass: Record<Variant, string> = {
  Base: 'showcase-card showcase-card--base',
  Featured: 'showcase-card showcase-card--featured',
  Selectable: 'showcase-card showcase-card--selectable',
  Metric: 'showcase-card showcase-card--metric',
};
const money = (n: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(n);

function MiniLineChart() {
  return (
    <svg viewBox="0 0 460 128" className="showcase-chart" role="img" aria-label="Illustrative upward projection line">
      <defs><linearGradient id="farconChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#78A832" stopOpacity=".18" /><stop offset="100%" stopColor="#78A832" stopOpacity="0" /></linearGradient></defs>
      {[24, 56, 88, 120].map((y) => <line key={y} x1="0" x2="460" y1={y} y2={y} stroke="#EAEFF5" strokeDasharray="3 5" />)}
      <path d="M8 110 C 65 104, 95 94, 142 88 S 230 62, 275 60 S 375 26, 452 14 L452 128 L8 128 Z" fill="url(#farconChartFill)" />
      <path d="M8 110 C 65 104, 95 94, 142 88 S 230 62, 275 60 S 375 26, 452 14" stroke="#78A832" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="275" cy="60" r="5" fill="#FFFFFF" stroke="#78A832" strokeWidth="3" /><circle cx="452" cy="14" r="5" fill="#78A832" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  );
}
function TargetIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="m12 2 2 2-2 2-2-2z"/></svg>;
}

export const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('SIP');
  const [selectedCard, setSelectedCard] = useState('Goal SIP');
  const [selectedFilter, setSelectedFilter] = useState('All funds');
  const [monthly, setMonthly] = useState(25000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [showAssumptions, setShowAssumptions] = useState(false);

  const projected = useMemo(() => {
    if (activeTab === 'Lumpsum') return monthly * Math.pow(1 + rate / 100, years);
    const r = rate / 1200;
    const months = years * 12;
    if (r === 0) return monthly * months;
    return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  }, [activeTab, monthly, rate, years]);
  const invested = activeTab === 'Lumpsum' ? monthly : monthly * years * 12;
  const gain = Math.max(0, projected - invested);

  const schemes = [
    { name: 'Balanced allocation', sample: 'Sample scheme A', category: 'Hybrid', ret: '8.4%*', risk: 'Moderate', type: 'Hybrid' },
    { name: 'Long-term growth', sample: 'Sample scheme B', category: 'Equity', ret: '12.1%*', risk: 'High', type: 'Equity' },
    { name: 'Capital stability', sample: 'Sample scheme C', category: 'Debt', ret: '−1.2%*', risk: 'Low–Moderate', type: 'Debt' },
  ].filter((s) => selectedFilter === 'All funds' || s.type === selectedFilter);

  return (
    <main className="design-showcase min-h-screen">
      <div className="showcase-topbar"><div className="showcase-container showcase-topbar-inner">
        <div className="showcase-brand"><span className="showcase-brand-mark">F</span><span>FARCON <b>WEALTH</b></span></div>
        <span className="showcase-private-label"><span className="showcase-status-dot" /> INTERNAL DESIGN PREVIEW</span>
      </div></div>
      <div className="showcase-container showcase-main">
        <header className="showcase-page-header"><div>
          <p className="showcase-eyebrow">FARCON DESIGN SYSTEM · V1</p>
          <h1>Clear by design.<br/><span>Confident by purpose.</span></h1>
          <p className="showcase-intro">A working component study for Farcon’s wealth-planning experience. Inspired by modern fintech clarity, built around Farcon’s navy and growth-green identity.</p>
        </div><div className="showcase-header-note"><div className="showcase-header-note-icon"><Sparkles size={18}/></div><p><strong>Design principle</strong><br/>One clear focal point per component. Less framing, better hierarchy.</p></div></header>

        <section className="showcase-section"><div className="showcase-section-heading"><div><p className="showcase-eyebrow">01 · COMPONENT FOUNDATIONS</p><h2>Cards with distinct roles</h2></div><p>Not every surface needs a border. Use contrast, spacing and typography to communicate hierarchy.</p></div>
          <div className="showcase-card-grid">
            <article className={variantClass.Base}><span className="showcase-card-kicker">STANDARD CARD</span><div className="showcase-icon-square"><Wallet size={20}/></div><h3>Build a steady habit</h3><p>Consistent investing starts with a goal you can measure and a plan you can maintain.</p><button className="showcase-text-action">Explore goal <ArrowRight size={15}/></button></article>
            <article className={variantClass.Featured}><div className="showcase-featured-top"><span className="showcase-brand-dot"/><span>FEATURED PLANNING TOOL</span></div><h3>Bring every goal into focus.</h3><p>A connected plan for the milestones that matter—built around your horizon and comfort with risk.</p><div className="showcase-featured-bottom"><span><ShieldCheck size={15}/> Suitability-led</span><ArrowRight size={17}/></div></article>
            <button type="button" aria-pressed={selectedCard === 'Goal SIP'} onClick={() => setSelectedCard(selectedCard === 'Goal SIP' ? '' : 'Goal SIP')} className={variantClass.Selectable + (selectedCard === 'Goal SIP' ? ' is-selected' : '')}><span className="showcase-select-check">{selectedCard === 'Goal SIP' ? <Check size={14}/> : null}</span><span className="showcase-card-kicker">SELECTABLE OPTION</span><div className="showcase-icon-square showcase-icon-green"><TargetIcon/></div><h3>Goal SIP</h3><p>Invest toward a defined future amount.</p><span className="showcase-option-foot">{selectedCard === 'Goal SIP' ? 'Selected plan' : 'Select this plan'} <ChevronRight size={15}/></span></button>
            <article className={variantClass.Metric}><span className="showcase-card-kicker">METRIC CARD</span><p className="showcase-metric-label">Illustrative future value</p><p className="showcase-metric-value">{money(projected)}</p><p className="showcase-metric-caption"><TrendingUp size={15}/> Modelled estimate · not a guarantee</p><div className="showcase-mini-bars"><span/><span/><span/><span/><span/><span/><span/></div></article>
          </div>
        </section>

        <section className="showcase-section"><div className="showcase-section-heading"><div><p className="showcase-eyebrow">02 · FINANCIAL WORKSPACE</p><h2>A calculator, not a stack of cards</h2></div><p>Inputs stay quiet. Results lead. Assumptions remain accessible without competing with the core number.</p></div>
          <div className="showcase-calculator"><div className="showcase-calculator-left">
            <div className="showcase-panel-heading"><div><span className="showcase-icon-inline"><Calculator size={18}/></span><div><h3>Plan your investment</h3><p>Adjust the assumptions to explore an illustrative scenario.</p></div></div><button className="showcase-reset" onClick={() => {setMonthly(25000);setRate(12);setYears(15);setActiveTab('SIP');}}>Reset</button></div>
            <div className="showcase-tabs" role="tablist" aria-label="Calculator type">{['SIP','Lumpsum','Goal SIP','Retirement'].map(t=><button key={t} role="tab" aria-selected={activeTab===t} className={activeTab===t?'is-active':''} onClick={()=>setActiveTab(t)}>{t}</button>)}</div>
            <div className="showcase-control-group"><div className="showcase-control-label"><label htmlFor="showcase-monthly">{activeTab==='Lumpsum'?'Initial investment':'Monthly investment'}</label><strong>{money(monthly)}</strong></div><input id="showcase-monthly" type="range" min="5000" max="100000" step="1000" value={monthly} onChange={e=>setMonthly(Number(e.target.value))}/><div className="showcase-range-ends"><span>₹5,000</span><span>₹1,00,000</span></div></div>
            <div className="showcase-control-group"><div className="showcase-control-label"><label htmlFor="showcase-rate">Illustrative annual return</label><strong>{rate}% <span>p.a.</span></strong></div><input id="showcase-rate" type="range" min="4" max="16" step=".5" value={rate} onChange={e=>setRate(Number(e.target.value))}/><div className="showcase-chip-row">{[8,10,12,14].map(n=><button key={n} className={rate===n?'showcase-chip is-active':'showcase-chip'} onClick={()=>setRate(n)}>{n}%</button>)}</div></div>
            <div className="showcase-control-group"><div className="showcase-control-label"><label htmlFor="showcase-years">Investment horizon</label><strong>{years} <span>years</span></strong></div><input id="showcase-years" type="range" min="3" max="30" value={years} onChange={e=>setYears(Number(e.target.value))}/><div className="showcase-chip-row">{[5,10,15,20,25,30].map(n=><button key={n} className={years===n?'showcase-chip is-active':'showcase-chip'} onClick={()=>setYears(n)}>{n}Y</button>)}</div></div>
            <button className="showcase-disclosure" aria-expanded={showAssumptions} onClick={()=>setShowAssumptions(!showAssumptions)}>Calculation assumptions <ChevronDown size={16} className={showAssumptions?'rotated':''}/></button>
            {showAssumptions&&<div className="showcase-assumptions"><p>Illustrative monthly contributions and constant assumed return. Actual returns vary and are not guaranteed.</p></div>}
          </div><aside className="showcase-result"><div className="showcase-result-top"><span className="showcase-eyebrow">ILLUSTRATIVE PROJECTION</span><span className="showcase-result-badge">Estimate only</span></div><p className="showcase-result-label">{activeTab==='Goal SIP'?'Illustrative goal corpus':activeTab==='Retirement'?'Illustrative retirement value':'Projected value'}</p><h3>{money(projected)}</h3><p className="showcase-result-note">Based on the assumptions you selected</p><MiniLineChart/><div className="showcase-result-breakdown"><div><span>Invested capital</span><strong>{money(invested)}</strong></div><div><span>Illustrative growth</span><strong className="showcase-positive">{money(gain)}</strong></div></div><div className="showcase-result-footer"><span><span className="showcase-status-dot"/> Assumptions can change the outcome</span></div><button className="showcase-primary-button">Explore your plan <ArrowRight size={16}/></button></aside></div>
          <p className="showcase-disclaimer">Design showcase only. Inputs are illustrative and are not connected to production calculator functions.</p>
        </section>

        <section className="showcase-section"><div className="showcase-section-heading"><div><p className="showcase-eyebrow">03 · DATA DENSITY</p><h2>Align data. Remove the noise.</h2></div><p>Financial information is easier to compare when values share a baseline and the row does the work.</p></div>
          <div className="showcase-data-layout"><div className="showcase-data-table-card"><div className="showcase-table-heading"><div><h3>Illustrative fund comparison</h3><p>Sample values for layout demonstration only</p></div><button className="showcase-view-link">View all <ArrowRight size={14}/></button></div>
            <div className="showcase-filter-row">{['All funds','Equity','Hybrid','Debt'].map(t=><button key={t} className={selectedFilter===t?'showcase-filter is-active':'showcase-filter'} onClick={()=>setSelectedFilter(t)}>{t}</button>)}</div>
            <div className="showcase-table-scroll"><table className="showcase-table"><thead><tr><th>Illustrative scheme</th><th>Category</th><th className="numeric">3Y return*</th><th className="numeric">Risk</th></tr></thead><tbody>{schemes.map(s=><tr key={s.name}><td><div className="showcase-scheme"><span className="showcase-scheme-mark"><Landmark size={17}/></span><div><strong>{s.name}</strong><small>{s.sample}</small></div></div></td><td><span className="showcase-type-tag">{s.category}</span></td><td className={'numeric '+(s.ret.startsWith('−')?'showcase-negative':'showcase-positive')}>{s.ret}</td><td className="numeric">{s.risk}</td></tr>)}</tbody></table></div><p className="showcase-table-footnote">*Fictional values for component demonstration only. Not fund performance or an investment recommendation.</p>
          </div><aside className="showcase-tools-card"><div className="showcase-tools-heading"><h3>Planning tools</h3><p>Everything for your next step</p></div><button><span className="showcase-tool-icon"><Calculator size={17}/></span><span><strong>SIP calculator</strong><small>Estimate a monthly plan</small></span><ChevronRight size={17}/></button><button><span className="showcase-tool-icon"><GraduationCap size={17}/></span><span><strong>Goal planner</strong><small>Map a future milestone</small></span><ChevronRight size={17}/></button><button><span className="showcase-tool-icon"><MessageCircle size={17}/></span><span><strong>Ask Farcon AI</strong><small>Understand the basics</small></span><ChevronRight size={17}/></button></aside></div>
        </section>

        <section className="showcase-section"><div className="showcase-section-heading"><div><p className="showcase-eyebrow">04 · BRAND IN CONTEXT</p><h2>Farcon, made recognizable</h2></div><p>Green signals progress. Navy brings authority. Neutral surfaces let financial information lead.</p></div>
          <div className="showcase-brand-showcase"><div className="showcase-brand-feature"><div className="showcase-brand-feature-top"><span><span className="showcase-brand-dot"/> FARCON HORIZON</span><span className="showcase-brand-tag">YOUR PLAN</span></div><h3>Wealth is built<br/>one milestone at a time.</h3><p>Bring your goals, horizon and risk comfort into one considered plan.</p><MiniLineChart/><div className="showcase-milestones"><span className="complete">01 Goal</span><span className="complete">02 Horizon</span><span className="current">03 Investor fit</span><span>04 Direction</span></div><button className="showcase-primary-button">Explore your goal <ArrowRight size={16}/></button></div><div className="showcase-brand-side"><div className="showcase-side-mark"><Sparkles size={20}/></div><p className="showcase-eyebrow">A BRAND WITH RESTRAINT</p><h3>Calm in appearance.<br/>Precise in the details.</h3><p>Soft surfaces make room for content. Farcon green signals action and progress, while navy keeps the experience grounded.</p><div className="showcase-token-row"><span className="token-swatch navy"/><span className="token-swatch green"/><span className="token-swatch canvas"/><span className="token-swatch blue"/><span>Core palette</span></div></div></div>
        </section>
        <footer className="showcase-footer"><div className="showcase-brand"><span className="showcase-brand-mark">F</span><span>FARCON <b>WEALTH</b></span></div><span>Internal design exploration · Not an investment product or financial advice</span></footer>
      </div>
    </main>
  );
};

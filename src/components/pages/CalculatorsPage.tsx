import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RoutePath } from '@/types';
import { calculateGoalSIP, calculateLumpsum, calculateRetirement, calculateSIP } from '@/lib/calculations/financial';
import { formatINR } from '@/lib/formatting/currency';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

interface CalculatorsPageProps {
  initialType?: 'sip' | 'lumpsum' | 'goal' | 'retirement';
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (subject?: string) => void;
}

type Tab = 'sip' | 'lumpsum' | 'goal' | 'retirement';

function axisAmount(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n >= 1e8 ? 0 : 1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n >= 1e6 ? 0 : 1)} L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}k`;
  return '₹0';
}

function Chart({ invested, value, startLabel, endLabel }: { invested: number[]; value: number[]; startLabel: string; endLabel: string }) {
  const w = 640;
  const h = 228;
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const measure = () => {
      const width = el.getBoundingClientRect().width;
      setScale(width > 0 ? width / w : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const safe = Math.max(scale, 0.3);
  const font = 12 / safe;
  const padL = 78 / safe;
  const padR = 12 / safe;
  const padT = 16 / safe;
  const padB = 22 / safe;
  const max = Math.max(...value, ...invested, 1);
  const x = (i: number, n: number) => padL + (i / Math.max(1, n - 1)) * (w - padL - padR);
  const y = (v: number) => padT + (1 - v / max) * (h - padT - padB);
  const path = (series: number[]) => series.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i, series.length).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${path(value)} L${x(value.length - 1, value.length).toFixed(1)} ${y(0)} L${x(0, value.length).toFixed(1)} ${y(0)} Z`;
  return (
    <svg ref={svgRef} className="hf-draw calc-chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Projected value and amount invested">
      {[max, max / 2, 0].map((tick) => (
        <g key={tick}>
          <line x1={padL} x2={w - padR} y1={y(tick)} y2={y(tick)} stroke="#e6e0d4" strokeWidth={1 / safe} />
          <text x={padL - 8 / safe} y={y(tick) + font * 0.35} textAnchor="end" fontSize={font} fill="#5c6b64">{tick === 0 ? '0' : axisAmount(tick)}</text>
        </g>
      ))}
      <path d={area} fill="rgba(31,157,85,0.15)" />
      <path className="hf-line" d={path(value)} fill="none" stroke="#1F9D55" strokeWidth={2.5 / safe} />
      <path className="hf-line" d={path(invested)} fill="none" stroke="#C9A24A" strokeWidth={2 / safe} />
      <text x={padL} y={h - 8 / safe} fontSize={font} fill="#5c6b64">{startLabel}</text>
      <text x={w - padR} y={h - 8 / safe} textAnchor="end" fontSize={font} fill="#5c6b64">{endLabel}</text>
    </svg>
  );
}

function Slider({ label, value, min, max, step, display, minLabel, maxLabel, onChange }: {
  label: string; value: number; min: number; max: number; step: number; display: string; minLabel: string; maxLabel: string; onChange: (n: number) => void;
}) {
  const money = display.trim().startsWith('₹');
  const percent = !money && display.trim().endsWith('%');
  const [draft, setDraft] = useState<string | null>(null);
  const [hint, setHint] = useState('');
  const pct = `${((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100}%`;
  return (
    <label className="hf-slider">
      <span className="hf-slider-top">
        <span>{label}</span>
        <input
          className={money ? 'hf-num-input is-money' : 'hf-num-input'}
          type="text"
          inputMode="decimal"
          aria-label={label}
          value={draft ?? (money ? display : percent ? `${value}%` : String(value))}
          onFocus={() => { setDraft(String(value)); setHint(''); }}
          onBlur={() => {
            const next = Number((draft ?? String(value)).replace(/[^\d.]/g, ''));
            setDraft(null);
            if (!Number.isFinite(next)) return;
            if (next < min || next > max) setHint(`Adjusted to stay between ${minLabel} and ${maxLabel}.`);
            else setHint('');
            onChange(Math.min(max, Math.max(min, next)));
          }}
          onChange={(event) => setDraft(event.target.value)}
        />
      </span>
      <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} style={{ ['--pct' as string]: pct }} onChange={(e) => { setHint(''); onChange(Number(e.target.value)); }} />
      <span className="hf-scale"><span>{minLabel}</span><span>{maxLabel}</span></span>
      {hint && <span className="hf-note">{hint}</span>}
    </label>
  );
}

function Legend() {
  return (
    <div className="calc-legend">
      <span><i style={{ background: '#1F9D55' }} />Estimated value</span>
      <span><i style={{ background: '#C9A24A' }} />Invested</span>
    </div>
  );
}

const RETIRE_INFLATION = 6;
const RETIRE_PRE = 12;
const RETIRE_POST = 8;

/** Chart series only. The SIP headline still comes from calculateRetirement. */
function retirementChartSeries(result: ReturnType<typeof calculateRetirement>) {
  const inf = result.inflationRate / 100;
  const post = result.postRetirementReturn / 100;
  const monthlyRate = result.preRetirementReturn / 100 / 12;
  const ages: number[] = [];
  for (let year = result.currentAge; year <= result.lifeExpectancy; year += 1) ages.push(year);
  const annualAtRetirement = result.monthlyExpenseAtRetirement * 12;
  const totalInvested = result.requiredMonthlySIP * 12 * result.yearsToRetire;
  const value = ages.map((year) => {
    if (year <= result.retirementAge) {
      const months = (year - result.currentAge) * 12;
      const sipFuture = months > 0
        ? result.requiredMonthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
        : 0;
      const existing = result.existingCorpusFutureValue > 0 && result.yearsToRetire > 0
        ? (result.existingCorpusFutureValue / Math.pow(1 + result.preRetirementReturn / 100, result.yearsToRetire)) * Math.pow(1 + result.preRetirementReturn / 100, year - result.currentAge)
        : 0;
      return Math.round(sipFuture + existing);
    }
    let corpus = result.requiredRetirementCorpus;
    const yearsIn = year - result.retirementAge;
    for (let step = 1; step <= yearsIn; step += 1) {
      const withdrawal = annualAtRetirement * Math.pow(1 + inf, step - 1);
      corpus = (corpus - withdrawal) * (1 + post);
    }
    return Math.max(0, Math.round(corpus));
  });
  const invested = ages.map((year) => {
    const contributedYears = Math.min(Math.max(year - result.currentAge, 0), result.yearsToRetire);
    return year >= result.retirementAge ? totalInvested : result.requiredMonthlySIP * 12 * contributedYears;
  });
  return { ages, value, invested };
}

const COPY: Record<Tab, { eye: string; h1: string; lede: string }> = {
  sip: { eye: 'SIP calculator', h1: 'SIP calculator', lede: 'A monthly amount, a rate and a number of years. The chart is an illustration from those assumptions.' },
  lumpsum: { eye: 'Lumpsum calculator', h1: 'Lumpsum calculator', lede: 'One amount, left invested. The chart shows the assumed path, not a promise.' },
  goal: { eye: 'Goal calculator', h1: 'Goal calculator', lede: 'Name a target and a date. The monthly SIP is what the formula needs at the rate you set.' },
  retirement: { eye: 'Retirement calculator', h1: 'Retirement calculator', lede: 'Today’s spending, grown to a retirement date. The corpus is illustrative.' },
};

export const CalculatorsPage: React.FC<CalculatorsPageProps> = ({ initialType = 'sip', navigate, onOpenConsultation }) => {
  const [tab, setTab] = useState<Tab>(initialType);
  useEffect(() => setTab(initialType), [initialType]);
  const [sipAmount, setSipAmount] = useState(25000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(15);
  const [lump, setLump] = useState(500000);
  const [lumpRate, setLumpRate] = useState(12);
  const [lumpYears, setLumpYears] = useState(10);
  const goalQuery = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const target = Number(params.get('target'));
    const years = Number(params.get('years'));
    const rate = Number(params.get('rate'));
    return {
      target: target >= 500000 ? target : 10000000,
      years: years >= 1 ? years : 15,
      rate: rate >= 6 ? rate : 12,
    };
  }, []);
  const [goal, setGoal] = useState(goalQuery.target);
  const [goalRate, setGoalRate] = useState(goalQuery.rate);
  const [goalYears, setGoalYears] = useState(goalQuery.years);
  const [goalSavings, setGoalSavings] = useState(0);
  const [goalInflation, setGoalInflation] = useState(6);
  const [age, setAge] = useState(32);
  const [retireAge, setRetireAge] = useState(60);
  const [lifeAge, setLifeAge] = useState(85);
  const [expense, setExpense] = useState(50000);
  const [retireSavings, setRetireSavings] = useState(0);
  const [retireInflation, setRetireInflation] = useState(RETIRE_INFLATION);
  const [retirePre, setRetirePre] = useState(RETIRE_PRE);
  const [retirePost, setRetirePost] = useState(RETIRE_POST);

  const sip = useMemo(() => calculateSIP(sipAmount, sipRate, sipYears), [sipAmount, sipRate, sipYears]);
  const lumpsum = useMemo(() => calculateLumpsum(lump, lumpRate, lumpYears), [lump, lumpRate, lumpYears]);
  const goalResult = useMemo(() => calculateGoalSIP(goal, goalRate, goalYears, goalInflation, goalSavings), [goal, goalRate, goalYears, goalInflation, goalSavings]);
  const retirement = useMemo(() => calculateRetirement(age, retireAge, lifeAge, expense, retireInflation, retirePre, retirePost, retireSavings), [age, retireAge, lifeAge, expense, retireInflation, retirePre, retirePost, retireSavings]);
  const retirementChart = useMemo(() => retirementChartSeries(retirement), [retirement]);

  const copy = COPY[tab];
  const [showYears, setShowYears] = useState(false);
  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">{copy.eye}</span>
        <h1>{copy.h1}</h1>
        <p className="lede">{copy.lede}</p>
        <div className="hf-tabs" style={{ margin: '16px 0' }}>
          {(['sip', 'lumpsum', 'goal', 'retirement'] as Tab[]).map((item) => (
            <button key={item} type="button" className={tab === item ? 'is-on' : ''} onClick={() => navigate(item === 'sip' ? '/calculators/sip' : `/calculators/${item}` as RoutePath)}>
              {item === 'sip' ? 'SIP' : item === 'lumpsum' ? 'Lumpsum' : item === 'goal' ? 'Goal' : 'Retirement'}
            </button>
          ))}
        </div>
        <div className="calc-card split">
          <div className="calc-side">
            {tab === 'sip' && (
              <>
                <Slider label="Monthly SIP" min={1000} max={200000} step={1000} value={sipAmount} display={formatINR(sipAmount)} minLabel="₹1,000" maxLabel="₹2 L" onChange={setSipAmount} />
                <Slider label="Expected return" min={6} max={18} step={1} value={sipRate} display={`${sipRate}%`} minLabel="6%" maxLabel="18%" onChange={setSipRate} />
                <Slider label="Years" min={1} max={30} step={1} value={sipYears} display={`${sipYears} years`} minLabel="1 year" maxLabel="30 years" onChange={setSipYears} />
              </>
            )}
            {tab === 'lumpsum' && (
              <>
                <Slider label="Amount" min={10000} max={5000000} step={10000} value={lump} display={formatINR(lump)} minLabel="₹10,000" maxLabel="₹50 L" onChange={setLump} />
                <Slider label="Expected return" min={6} max={18} step={1} value={lumpRate} display={`${lumpRate}%`} minLabel="6%" maxLabel="18%" onChange={setLumpRate} />
                <Slider label="Years" min={1} max={30} step={1} value={lumpYears} display={`${lumpYears} years`} minLabel="1 year" maxLabel="30 years" onChange={setLumpYears} />
              </>
            )}
            {tab === 'goal' && (
              <>
                <Slider label="Target corpus today" min={500000} max={100000000} step={500000} value={goal} display={formatINR(goal)} minLabel="₹5 L" maxLabel="₹10 Cr" onChange={setGoal} />
                <Slider label="Current savings" min={0} max={50000000} step={100000} value={goalSavings} display={formatINR(goalSavings)} minLabel="₹0" maxLabel="₹5 Cr" onChange={setGoalSavings} />
                <Slider label="Inflation" min={0} max={12} step={1} value={goalInflation} display={`${goalInflation}%`} minLabel="0%" maxLabel="12%" onChange={setGoalInflation} />
                <Slider label="Expected return" min={6} max={18} step={1} value={goalRate} display={`${goalRate}%`} minLabel="6%" maxLabel="18%" onChange={setGoalRate} />
                <Slider label="Years" min={1} max={30} step={1} value={goalYears} display={`${goalYears} years`} minLabel="1 year" maxLabel="30 years" onChange={setGoalYears} />
              </>
            )}
            {tab === 'retirement' && (
              <>
                <Slider label="Current age" min={18} max={70} step={1} value={age} display={`${age}`} minLabel="18" maxLabel="70" onChange={setAge} />
                <Slider label="Retirement age" min={age + 1} max={75} step={1} value={retireAge} display={`${retireAge}`} minLabel={`${age + 1}`} maxLabel="75" onChange={setRetireAge} />
                <Slider label="Life expectancy" min={retireAge + 5} max={100} step={1} value={lifeAge} display={`${lifeAge}`} minLabel={`${retireAge + 5}`} maxLabel="100" onChange={setLifeAge} />
                <Slider label="Monthly expense today" min={10000} max={300000} step={5000} value={expense} display={formatINR(expense)} minLabel="₹10,000" maxLabel="₹3 L" onChange={setExpense} />
                <Slider label="Current savings" min={0} max={50000000} step={100000} value={retireSavings} display={formatINR(retireSavings)} minLabel="₹0" maxLabel="₹5 Cr" onChange={setRetireSavings} />
                <Slider label="Inflation" min={0} max={12} step={1} value={retireInflation} display={`${retireInflation}%`} minLabel="0%" maxLabel="12%" onChange={setRetireInflation} />
                <Slider label="Return before retirement" min={6} max={18} step={1} value={retirePre} display={`${retirePre}%`} minLabel="6%" maxLabel="18%" onChange={setRetirePre} />
                <Slider label="Return after retirement" min={4} max={12} step={1} value={retirePost} display={`${retirePost}%`} minLabel="4%" maxLabel="12%" onChange={setRetirePost} />
              </>
            )}
            <button type="button" className="hf-btn hf-btn-outline" onClick={() => {
              setSipAmount(25000); setSipRate(12); setSipYears(15);
              setLump(500000); setLumpRate(12); setLumpYears(10);
              setGoal(goalQuery.target); setGoalRate(goalQuery.rate); setGoalYears(goalQuery.years); setGoalSavings(0); setGoalInflation(6);
              setAge(32); setRetireAge(60); setLifeAge(85); setExpense(50000); setRetireSavings(0); setRetireInflation(RETIRE_INFLATION); setRetirePre(RETIRE_PRE); setRetirePost(RETIRE_POST);
            }}>Reset</button>
            <button type="button" className="hf-btn hf-btn-outline" onClick={() => setShowYears((value) => !value)}>{showYears ? 'Hide year by year' : 'Show year by year'}</button>
            {showYears && tab === 'sip' && (
              <table className="year-table"><tbody>{sip.breakdown.map((row) => <tr key={row.year}><td>Year {row.year}</td><td>{formatINR(row.invested)}</td><td>{formatINR(row.value)}</td></tr>)}</tbody></table>
            )}
            {showYears && tab === 'lumpsum' && (
              <table className="year-table"><tbody>{lumpsum.breakdown.map((row) => <tr key={row.year}><td>Year {row.year}</td><td>{formatINR(row.invested)}</td><td>{formatINR(row.value)}</td></tr>)}</tbody></table>
            )}
            {showYears && tab === 'goal' && (
              <table className="year-table"><tbody>{goalResult.breakdown.map((row) => <tr key={row.year}><td>Year {row.year}</td><td>{formatINR(row.accumulated)}</td></tr>)}</tbody></table>
            )}
            {showYears && tab === 'retirement' && (
              <table className="year-table"><tbody>{retirementChart.ages.map((year, index) => <tr key={year}><td>Age {year}</td><td>{formatINR(retirementChart.invested[index])}</td><td>{formatINR(retirementChart.value[index])}</td></tr>)}</tbody></table>
            )}
            <details className="acc">
              <summary>How this is calculated</summary>
              <p>
                {tab === 'sip' && `Monthly SIP ${formatINR(sipAmount)} for ${sipYears} years at ${sipRate}% a year, compounded monthly. Invested ${formatINR(sip.investedAmount)}. Projected value ${formatINR(sip.projectedValue)}. Gain ${formatINR(sip.estimatedGain)}.`}
                {tab === 'lumpsum' && `A single amount of ${formatINR(lump)} for ${lumpYears} years at ${lumpRate}% a year. Projected value ${formatINR(lumpsum.projectedValue)}. Gain ${formatINR(lumpsum.estimatedGain)}.`}
                {tab === 'goal' && `Today’s target ${formatINR(goal)} grows at ${goalInflation}% inflation for ${goalYears} years, to ${formatINR(goalResult.futureInflationAdjustedGoal)}. Current savings of ${formatINR(goalSavings)} are assumed to grow at ${goalRate}% to ${formatINR(goalResult.existingFutureValue)}. ${goalResult.surplus > 0 ? `That leaves a surplus of ${formatINR(goalResult.surplus)}.` : `The shortfall is ${formatINR(goalResult.shortfall)}.`} The monthly SIP of ${formatINR(goalResult.requiredMonthlySIP)} is what closes that shortfall at ${goalRate}%.`}
                {tab === 'retirement' && `Spending of ${formatINR(expense)} a month, inflated at ${retireInflation}% for ${retirement.yearsToRetire} years (age ${age} to ${retireAge}, life expectancy ${lifeAge}). Corpus at retirement ${formatINR(retirement.requiredRetirementCorpus)}. Savings of ${formatINR(retireSavings)} grow at ${retirePre}% to ${formatINR(retirement.existingCorpusFutureValue)}. Funding gap ${formatINR(retirement.netCorpusDeficit)}. Required SIP ${formatINR(retirement.requiredMonthlySIP)} at ${retirePre}% before retirement and ${retirePost}% after.`}
                {' '}It is an estimate. Mutual fund investments are subject to market risks. Read all scheme related documents carefully.
              </p>
            </details>
          </div>
          <div className="hf-result">
            {tab === 'sip' && (
              <>
                <span>Projected value</span>
                <strong><AnimatedNumber value={sip.projectedValue} durationMs={480} /></strong>
                <p>Invested {formatINR(sip.investedAmount)} · Gain {formatINR(sip.estimatedGain)}</p>
                <span className="hf-year-chip">Year {sip.breakdown.at(-1)?.year} · {formatINR(sip.breakdown.at(-1)?.value ?? 0)}</span>
                <Chart invested={sip.breakdown.map((row) => row.invested)} value={sip.breakdown.map((row) => row.value)} startLabel="Year 1" endLabel={`Year ${sipYears}`} />
                <Legend />
              </>
            )}
            {tab === 'lumpsum' && (
              <>
                <span>Projected value</span>
                <strong><AnimatedNumber value={lumpsum.projectedValue} durationMs={480} /></strong>
                <p>Invested {formatINR(lumpsum.investedAmount)} · Gain {formatINR(lumpsum.estimatedGain)}</p>
                <span className="hf-year-chip">Year {lumpsum.breakdown.at(-1)?.year} · {formatINR(lumpsum.breakdown.at(-1)?.value ?? 0)}</span>
                <Chart invested={lumpsum.breakdown.map((row) => row.invested)} value={lumpsum.breakdown.map((row) => row.value)} startLabel="Year 1" endLabel={`Year ${lumpYears}`} />
                <Legend />
              </>
            )}
            {tab === 'goal' && (
              <>
                <span>Required monthly SIP</span>
                <strong><AnimatedNumber value={goalResult.requiredMonthlySIP} durationMs={480} /></strong>
                <p>Future target {formatINR(goalResult.futureInflationAdjustedGoal)} · Savings then {formatINR(goalResult.existingFutureValue)} · {goalResult.surplus > 0 ? `Surplus ${formatINR(goalResult.surplus)}` : `Shortfall ${formatINR(goalResult.shortfall)}`}</p>
                <span className="hf-year-chip">Year {goalResult.breakdown.at(-1)?.year} · {formatINR(goalResult.breakdown.at(-1)?.accumulated ?? 0)}</span>
                <Chart invested={goalResult.breakdown.map((row) => row.year * goalResult.requiredMonthlySIP * 12)} value={goalResult.breakdown.map((row) => row.accumulated)} startLabel="Year 1" endLabel={`Year ${goalYears}`} />
                <Legend />
              </>
            )}
            {tab === 'retirement' && (
              <>
                <span>Illustrative corpus</span>
                <strong><AnimatedNumber value={retirement.requiredRetirementCorpus} durationMs={480} /></strong>
                <p>Funding gap {formatINR(retirement.netCorpusDeficit)} · Required SIP {formatINR(retirement.requiredMonthlySIP)} · Expense at retirement {formatINR(retirement.monthlyExpenseAtRetirement)}</p>
                <span className="hf-year-chip">Age {retirement.retirementAge} · {formatINR(retirement.requiredRetirementCorpus)}</span>
                <Chart invested={retirementChart.invested} value={retirementChart.value} startLabel={`Age ${retirementChart.ages[0] ?? age}`} endLabel={`Age ${retirementChart.ages.at(-1) ?? retireAge}`} />
                <Legend />
              </>
            )}
            <button type="button" className="hf-btn hf-btn-green" onClick={() => onOpenConsultation(`${tab} calculator`)}>Discuss this plan</button>
            <p className="hf-note">Estimate only. Past performance is not indicative of future returns.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

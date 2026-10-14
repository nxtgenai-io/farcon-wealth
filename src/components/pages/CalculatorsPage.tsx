import React, { useEffect, useMemo, useState } from 'react';
import { RoutePath } from '@/types';
import { calculateGoalSIP, calculateLumpsum, calculateRetirement, calculateSIP } from '@/lib/calculations/financial';
import { formatINR } from '@/lib/formatting/currency';

interface CalculatorsPageProps {
  initialType?: 'sip' | 'lumpsum' | 'goal' | 'retirement';
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (subject?: string) => void;
}

type Tab = 'sip' | 'lumpsum' | 'goal' | 'retirement';

function Chart({ invested, value }: { invested: number[]; value: number[] }) {
  const w = 640;
  const h = 200;
  const max = Math.max(...value, ...invested, 1);
  const x = (i: number, n: number) => 12 + (i / Math.max(1, n - 1)) * (w - 24);
  const y = (v: number) => 16 + (1 - v / max) * (h - 32);
  const path = (series: number[]) => series.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i, series.length).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${path(value)} L${x(value.length - 1, value.length).toFixed(1)} ${y(0)} L${x(0, value.length).toFixed(1)} ${y(0)} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Projected value and amount invested">
      <path d={area} fill="rgba(31,157,85,0.15)" />
      <path d={path(value)} fill="none" stroke="#1F9D55" strokeWidth="2.5" />
      <path d={path(invested)} fill="none" stroke="#C9A24A" strokeWidth="2" />
    </svg>
  );
}

function Slider({ label, value, min, max, step, display, onChange }: {
  label: string; value: number; min: number; max: number; step: number; display: string; onChange: (n: number) => void;
}) {
  const pct = `${((value - min) / (max - min)) * 100}%`;
  return (
    <label className="hf-slider">
      <span className="hf-slider-top"><span>{label}</span><b>{display}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} style={{ ['--pct' as string]: pct }} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export const CalculatorsPage: React.FC<CalculatorsPageProps> = ({ initialType = 'sip', onOpenConsultation }) => {
  const [tab, setTab] = useState<Tab>(initialType);
  useEffect(() => setTab(initialType), [initialType]);
  const [sipAmount, setSipAmount] = useState(25000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(15);
  const [lump, setLump] = useState(500000);
  const [lumpRate, setLumpRate] = useState(12);
  const [lumpYears, setLumpYears] = useState(10);
  const [goal, setGoal] = useState(10000000);
  const [goalRate, setGoalRate] = useState(12);
  const [goalYears, setGoalYears] = useState(15);
  const [age, setAge] = useState(32);
  const [retireAge, setRetireAge] = useState(60);
  const [expense, setExpense] = useState(50000);

  const sip = useMemo(() => calculateSIP(sipAmount, sipRate, sipYears), [sipAmount, sipRate, sipYears]);
  const lumpsum = useMemo(() => calculateLumpsum(lump, lumpRate, lumpYears), [lump, lumpRate, lumpYears]);
  const goalResult = useMemo(() => calculateGoalSIP(goal, goalRate, goalYears, 0), [goal, goalRate, goalYears]);
  const retirement = useMemo(() => calculateRetirement(age, retireAge, 85, expense, 6, 12, 8, 0), [age, retireAge, expense]);

  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Calculators</span>
        <h1>Run the numbers.</h1>
        <p className="lede">SIP, lumpsum, goal and retirement estimates use Farcon’s existing formulas. They are illustrations, not promises.</p>
        <div className="hf-tabs" style={{ margin: '16px 0' }}>
          {(['sip', 'lumpsum', 'goal', 'retirement'] as Tab[]).map((item) => (
            <button key={item} type="button" className={tab === item ? 'is-on' : ''} onClick={() => setTab(item)}>
              {item === 'sip' ? 'SIP' : item === 'lumpsum' ? 'Lumpsum' : item === 'goal' ? 'Goal' : 'Retirement'}
            </button>
          ))}
        </div>
        <div className="calc-card split">
          <div>
            {tab === 'sip' && (
              <>
                <Slider label="Monthly SIP" min={1000} max={200000} step={1000} value={sipAmount} display={formatINR(sipAmount)} onChange={setSipAmount} />
                <Slider label="Expected return" min={6} max={18} step={1} value={sipRate} display={`${sipRate}%`} onChange={setSipRate} />
                <Slider label="Years" min={1} max={30} step={1} value={sipYears} display={`${sipYears} years`} onChange={setSipYears} />
              </>
            )}
            {tab === 'lumpsum' && (
              <>
                <Slider label="Amount" min={10000} max={5000000} step={10000} value={lump} display={formatINR(lump)} onChange={setLump} />
                <Slider label="Expected return" min={6} max={18} step={1} value={lumpRate} display={`${lumpRate}%`} onChange={setLumpRate} />
                <Slider label="Years" min={1} max={30} step={1} value={lumpYears} display={`${lumpYears} years`} onChange={setLumpYears} />
              </>
            )}
            {tab === 'goal' && (
              <>
                <Slider label="Target corpus" min={500000} max={100000000} step={500000} value={goal} display={formatINR(goal)} onChange={setGoal} />
                <Slider label="Expected return" min={6} max={18} step={1} value={goalRate} display={`${goalRate}%`} onChange={setGoalRate} />
                <Slider label="Years" min={1} max={30} step={1} value={goalYears} display={`${goalYears} years`} onChange={setGoalYears} />
              </>
            )}
            {tab === 'retirement' && (
              <>
                <Slider label="Current age" min={18} max={70} step={1} value={age} display={`${age}`} onChange={setAge} />
                <Slider label="Retirement age" min={age + 1} max={75} step={1} value={retireAge} display={`${retireAge}`} onChange={setRetireAge} />
                <Slider label="Monthly expense today" min={10000} max={300000} step={5000} value={expense} display={formatINR(expense)} onChange={setExpense} />
              </>
            )}
          </div>
          <div className="hf-result">
            {tab === 'sip' && (
              <>
                <span>Projected value</span>
                <strong>{formatINR(sip.projectedValue)}</strong>
                <p>Invested {formatINR(sip.investedAmount)} · Gain {formatINR(sip.estimatedGain)}</p>
                <Chart invested={sip.breakdown.map((row) => row.invested)} value={sip.breakdown.map((row) => row.value)} />
              </>
            )}
            {tab === 'lumpsum' && (
              <>
                <span>Projected value</span>
                <strong>{formatINR(lumpsum.projectedValue)}</strong>
                <p>Invested {formatINR(lumpsum.investedAmount)} · Gain {formatINR(lumpsum.estimatedGain)}</p>
                <Chart invested={lumpsum.breakdown.map((row) => row.invested)} value={lumpsum.breakdown.map((row) => row.value)} />
              </>
            )}
            {tab === 'goal' && (
              <>
                <span>Required monthly SIP</span>
                <strong>{formatINR(goalResult.requiredMonthlySIP)}</strong>
                <p>Target {formatINR(goalResult.futureInflationAdjustedGoal)} · Total investment {formatINR(goalResult.totalInvestment)}</p>
                <Chart invested={goalResult.breakdown.map((row) => row.year * goalResult.requiredMonthlySIP * 12)} value={goalResult.breakdown.map((row) => row.accumulated)} />
              </>
            )}
            {tab === 'retirement' && (
              <>
                <span>Illustrative corpus</span>
                <strong>{formatINR(retirement.requiredRetirementCorpus)}</strong>
                <p>Required SIP {formatINR(retirement.requiredMonthlySIP)} · Expense at retirement {formatINR(retirement.monthlyExpenseAtRetirement)}</p>
                <Chart invested={retirement.breakdown.map(() => 0)} value={retirement.breakdown.map((row) => row.accumulatedCorpus)} />
              </>
            )}
            <button type="button" className="hf-btn hf-btn-green" onClick={() => onOpenConsultation(`${tab} calculator`)}>Talk this through</button>
            <p className="hf-note">Estimate only. Mutual fund investments are subject to market risks.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

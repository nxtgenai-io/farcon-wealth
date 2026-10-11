import React, { useState } from 'react';
import {
  calculateSIP,
  calculateStepUpSIP,
  calculateLumpsum,
  calculateGoalSIP,
  calculateRetirement,
} from '@/lib/calculations/financial';
import { formatINR } from '@/lib/formatting/currency';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { RoutePath } from '@/types';
import { COMPLIANCE_REGISTRY } from '@/lib/compliance';
import { planningContextService } from '@/lib/planningContext';
import { analytics } from '@/lib/analytics';
import {
  TrendingUp,
  Target,
  Shield,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface CalculatorsHubProps {
  initialType?: 'sip' | 'lumpsum' | 'goal' | 'retirement';
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (goalName?: string) => void;
}

export const CalculatorsHub: React.FC<CalculatorsHubProps> = ({
  initialType = 'sip',
  navigate,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'sip' | 'lumpsum' | 'goal' | 'retirement'>(initialType);

  // Load any prior planning inputs from user planning context
  const savedContext = React.useMemo(() => planningContextService.getPlanningContext(), []);

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState<number>(savedContext.sipMonthly || 25000);
  const [sipRate, setSipRate] = useState<number>(savedContext.sipExpectedRate || 12);
  const [sipYears, setSipYears] = useState<number>(savedContext.sipTenureYears || 15);
  const [sipStepUp, setSipStepUp] = useState<number>(savedContext.sipStepUpPercent || 0); // 0%, 5%, 10% annual step-up
  const [showMilestones, setShowMilestones] = useState(false);

  // Lumpsum State
  const [lumpAmount, setLumpAmount] = useState<number>(savedContext.lumpsumAmount || 500000);
  const [lumpRate, setLumpRate] = useState<number>(savedContext.lumpsumExpectedRate || 12);
  const [lumpYears, setLumpYears] = useState<number>(savedContext.lumpsumTenureYears || 10);

  // Goal State
  const [goalTarget, setGoalTarget] = useState<number>(savedContext.goalTargetAmount || 10000000); // 1 Cr
  const [goalYears, setGoalYears] = useState<number>(savedContext.goalTenureYears || 15);
  const [goalRate, setGoalRate] = useState<number>(12);
  const [goalInflation, setGoalInflation] = useState<number>(savedContext.goalInflationRate || 6);
  const [goalExisting, setGoalExisting] = useState<number>(savedContext.goalExistingSavings || 500000);

  // Retirement State - all assumptions visible & configurable with labels
  const [retCurrentAge, setRetCurrentAge] = useState<number>(savedContext.retCurrentAge || 32);
  const [retAge, setRetAge] = useState<number>(savedContext.retRetirementAge || 60);
  const [retLifeExpectancy, setRetLifeExpectancy] = useState<number>(savedContext.retLifeExpectancy || 85);
  const [retExpense, setRetExpense] = useState<number>(savedContext.retCurrentExpense || 65000);
  const [retInflation, setRetInflation] = useState<number>(savedContext.retInflationRate || 6);
  const [retPreReturn, setRetPreReturn] = useState<number>(savedContext.retPreReturnRate || 12);
  const [retPostReturn, setRetPostReturn] = useState<number>(savedContext.retPostReturnRate || 8);
  const [retExistingCorpus, setRetExistingCorpus] = useState<number>(savedContext.retExistingCorpus || 1000000);

  // Sync state to planningContext on user interaction
  React.useEffect(() => {
    planningContextService.updatePlanningContext({
      sipMonthly,
      sipExpectedRate: sipRate,
      sipTenureYears: sipYears,
      sipStepUpPercent: sipStepUp,
      lumpsumAmount: lumpAmount,
      lumpsumExpectedRate: lumpRate,
      lumpsumTenureYears: lumpYears,
      goalTargetAmount: goalTarget,
      goalTenureYears: goalYears,
      goalInflationRate: goalInflation,
      goalExistingSavings: goalExisting,
      retCurrentAge,
      retRetirementAge: retAge,
      retLifeExpectancy,
      retCurrentExpense: retExpense,
      retInflationRate: retInflation,
      retPreReturnRate: retPreReturn,
      retPostReturnRate: retPostReturn,
      retExistingCorpus,
    });
  }, [
    sipMonthly,
    sipRate,
    sipYears,
    sipStepUp,
    lumpAmount,
    lumpRate,
    lumpYears,
    goalTarget,
    goalYears,
    goalInflation,
    goalExisting,
    retCurrentAge,
    retAge,
    retLifeExpectancy,
    retExpense,
    retInflation,
    retPreReturn,
    retPostReturn,
    retExistingCorpus,
  ]);

  const handleTabChange = (tabId: 'sip' | 'lumpsum' | 'goal' | 'retirement') => {
    setActiveTab(tabId);
    analytics.track('calculator_tab_changed', { tab: tabId });
  };

  // Deterministic calculation outputs
  const sipResult =
    sipStepUp > 0
      ? calculateStepUpSIP(sipMonthly, sipRate, sipYears, sipStepUp)
      : calculateSIP(sipMonthly, sipRate, sipYears);

  const lumpResult = calculateLumpsum(lumpAmount, lumpRate, lumpYears);
  const goalResult = calculateGoalSIP(goalTarget, goalRate, goalYears, goalInflation, goalExisting);
  const retResult = calculateRetirement(
    retCurrentAge,
    retAge,
    retLifeExpectancy,
    retExpense,
    retInflation,
    retPreReturn,
    retPostReturn,
    retExistingCorpus
  );

  // Ratio calculations for visual compounding bar
  const totalSIPVal = sipResult.projectedValue || 1;
  const sipInvestedPct = Math.round((sipResult.investedAmount / totalSIPVal) * 100);
  const sipGainPct = 100 - sipInvestedPct;

  const totalLumpVal = lumpResult.projectedValue || 1;
  const lumpInvestedPct = Math.round((lumpResult.investedAmount / totalLumpVal) * 100);
  const lumpGainPct = 100 - lumpInvestedPct;

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[#7BA238]">
          Deterministic Mathematical Modeling
        </span>
        <h1 className="mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-tight leading-tight">
          Financial Planning Calculators
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Mathematical projections to ground your financial aspirations in clarity, realistic compounding, and disciplined milestones.
        </p>

        {/* Tab Switcher */}
        <div className="mt-8 inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/90 shadow-2xs">
          {[
            { id: 'sip', label: 'SIP Compounding' },
            { id: 'lumpsum', label: 'Lumpsum Growth' },
            { id: 'goal', label: 'Goal Target SIP' },
            { id: 'retirement', label: 'Retirement Corpus' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`px-4 sm:px-6 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#0B131E] shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
        {/* Controls Column (Dual Inputs: Slider + Editable Field + Presets) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-7">
          {/* TAB 1: SIP CALCULATOR */}
          {activeTab === 'sip' && (
            <div className="space-y-7">
              {/* Field 1: Monthly Investment */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-700">Monthly Investment (SIP)</label>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-400 font-mono">₹</span>
                    <input
                      type="number"
                      min={500}
                      max={500000}
                      step={500}
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(Number(e.target.value))}
                      className="w-24 text-right font-mono font-bold text-sm text-slate-900 bg-transparent focus:outline-hidden"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={1000}
                  max={250000}
                  step={1000}
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSipMonthly(amt)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
                        sipMonthly === amt
                          ? 'bg-[#0B131E] text-white border-[#0B131E]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {formatINR(amt, { compact: true })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Expected Annual Return */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block">Expected Annual Return (CAGR)</label>
                    <span className="text-[10px] text-slate-400 font-mono">{COMPLIANCE_REGISTRY.calculator.note}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <input
                      type="number"
                      min={6}
                      max={18}
                      step={0.5}
                      value={sipRate}
                      onChange={(e) => setSipRate(Number(e.target.value))}
                      className="w-14 text-right font-mono font-bold text-sm text-slate-900 bg-transparent focus:outline-hidden"
                    />
                    <span className="text-xs text-slate-400 font-mono">%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={6}
                  max={18}
                  step={0.5}
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />

                {/* Benchmark Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { rate: 8, label: '8% (Conservative Hybrid)' },
                    { rate: 10, label: '10% (Balanced Advantage)' },
                    { rate: 12, label: '12% (Diversified Equity Index)' },
                    { rate: 14, label: '14% (Active Equity Growth)' },
                  ].map((item) => (
                    <button
                      key={item.rate}
                      onClick={() => setSipRate(item.rate)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
                        sipRate === item.rate
                          ? 'bg-[#0B131E] text-white border-[#0B131E]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Investment Tenure */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-700">Investment Tenure</label>
                  <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <input
                      type="number"
                      min={1}
                      max={35}
                      step={1}
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-12 text-right font-mono font-bold text-sm text-slate-900 bg-transparent focus:outline-hidden"
                    />
                    <span className="text-xs text-slate-400 font-mono">Yrs</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={35}
                  step={1}
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />

                {/* Tenure Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[3, 5, 10, 15, 20, 25].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSipYears(yr)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
                        sipYears === yr
                          ? 'bg-[#0B131E] text-white border-[#0B131E]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {yr} Years
                    </button>
                  ))}
                </div>
              </div>

              {/* Step-Up SIP Option (Beloved by Indian Investors) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">
                      Annual Step-Up (Top-Up SIP)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Increase your monthly SIP annually as income grows
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { val: 0, label: 'None' },
                      { val: 5, label: '+5%' },
                      { val: 10, label: '+10%' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setSipStepUp(opt.val)}
                        className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                          sipStepUp === opt.val
                            ? 'bg-[#7BA238] text-[#0B131E] font-bold shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LUMPSUM CALCULATOR */}
          {activeTab === 'lumpsum' && (
            <div className="space-y-7">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-700">Total Lumpsum Investment</label>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-400 font-mono">₹</span>
                    <input
                      type="number"
                      min={10000}
                      max={10000000}
                      step={10000}
                      value={lumpAmount}
                      onChange={(e) => setLumpAmount(Number(e.target.value))}
                      className="w-28 text-right font-mono font-bold text-sm text-slate-900 bg-transparent focus:outline-hidden"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={25000}
                  value={lumpAmount}
                  onChange={(e) => setLumpAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {[100000, 250000, 500000, 1000000, 2500000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setLumpAmount(amt)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
                        lumpAmount === amt
                          ? 'bg-[#0B131E] text-white border-[#0B131E]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {formatINR(amt, { compact: true })}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block">Expected Annual Return</label>
                    <span className="text-[10px] text-slate-400 font-mono">{COMPLIANCE_REGISTRY.calculator.note}</span>
                  </div>
                  <span className="text-sm font-semibold font-mono text-slate-900">{lumpRate}%</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={18}
                  step={0.5}
                  value={lumpRate}
                  onChange={(e) => setLumpRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-700">Investment Tenure</label>
                  <span className="text-sm font-semibold font-mono text-slate-900">{lumpYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={lumpYears}
                  onChange={(e) => setLumpYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: GOAL TARGET CALCULATOR */}
          {activeTab === 'goal' && (
            <div className="space-y-7">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-700">Target Goal in Today’s Value</label>
                  <span className="text-sm font-semibold font-mono text-slate-900">{formatINR(goalTarget)}</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={50000000}
                  step={500000}
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-slate-700">Years to Achieve Goal</label>
                    <span className="text-xs font-semibold font-mono">{goalYears} Yrs</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={goalYears}
                    onChange={(e) => setGoalYears(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <label className="text-xs font-medium text-slate-700 block">Assumed Inflation Rate</label>
                      <span className="text-[10px] text-slate-400 font-mono">{COMPLIANCE_REGISTRY.calculator.note}</span>
                    </div>
                    <span className="text-xs font-semibold font-mono">{goalInflation}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={goalInflation}
                    onChange={(e) => setGoalInflation(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block">Expected Growth Rate (CAGR)</label>
                    <span className="text-[10px] text-slate-400 font-mono">{COMPLIANCE_REGISTRY.calculator.note}</span>
                  </div>
                  <span className="text-sm font-semibold font-mono text-slate-900">{goalRate}%</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={18}
                  step={0.5}
                  value={goalRate}
                  onChange={(e) => setGoalRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-700">Existing Savings Earmarked for Goal</label>
                  <span className="text-sm font-semibold font-mono text-slate-900">{formatINR(goalExisting)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5000000}
                  step={100000}
                  value={goalExisting}
                  onChange={(e) => setGoalExisting(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: RETIREMENT CALCULATOR (ALL ASSUMPTIONS VISIBLE & CONFIGURABLE) */}
          {activeTab === 'retirement' && (
            <div className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-slate-700">Current Age</label>
                    <span className="text-xs font-semibold font-mono">{retCurrentAge}</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={60}
                    value={retCurrentAge}
                    onChange={(e) => setRetCurrentAge(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-slate-700">Retirement Age</label>
                    <span className="text-xs font-semibold font-mono">{retAge}</span>
                  </div>
                  <input
                    type="range"
                    min={Math.max(retCurrentAge + 1, 45)}
                    max={70}
                    value={retAge}
                    onChange={(e) => setRetAge(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <label className="text-xs font-medium text-slate-700 block">Life Expectancy</label>
                      <span className="text-[10px] text-slate-400 font-mono">Assumption</span>
                    </div>
                    <span className="text-xs font-semibold font-mono">{retLifeExpectancy}</span>
                  </div>
                  <input
                    type="range"
                    min={Math.max(retAge + 5, 75)}
                    max={100}
                    value={retLifeExpectancy}
                    onChange={(e) => setRetLifeExpectancy(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-700">Current Monthly Household Expenses</label>
                  <span className="text-sm font-semibold font-mono text-slate-900">{formatINR(retExpense)}</span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={400000}
                  step={5000}
                  value={retExpense}
                  onChange={(e) => setRetExpense(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />
              </div>

              {/* Assumptions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/90">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block">Inflation Rate</label>
                      <span className="text-[9px] text-slate-400 font-mono">{COMPLIANCE_REGISTRY.calculator.note}</span>
                    </div>
                    <span className="text-xs font-semibold font-mono">{retInflation}%</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={9}
                    step={0.5}
                    value={retInflation}
                    onChange={(e) => setRetInflation(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block">Pre-Ret. Return</label>
                      <span className="text-[9px] text-slate-400 font-mono">{COMPLIANCE_REGISTRY.calculator.note}</span>
                    </div>
                    <span className="text-xs font-semibold font-mono">{retPreReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={16}
                    step={0.5}
                    value={retPreReturn}
                    onChange={(e) => setRetPreReturn(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block">Post-Ret. Return</label>
                      <span className="text-[9px] text-slate-400 font-mono">{COMPLIANCE_REGISTRY.calculator.note}</span>
                    </div>
                    <span className="text-xs font-semibold font-mono">{retPostReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={10}
                    step={0.5}
                    value={retPostReturn}
                    onChange={(e) => setRetPostReturn(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-700">Existing Retirement Savings Earmarked</label>
                  <span className="text-sm font-semibold font-mono text-slate-900">{formatINR(retExistingCorpus)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={100000}
                  value={retExistingCorpus}
                  onChange={(e) => setRetExistingCorpus(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                />
              </div>
            </div>
          )}

          {/* Toggle Milestone Table View with Accessible Table Semantics */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <button
              onClick={() => setShowMilestones(!showMilestones)}
              className="font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#7BA238]" />
              <span>{showMilestones ? 'Hide Milestone Table' : 'Show Year-by-Year Milestones'}</span>
            </button>
            <span className="text-slate-400 font-mono text-[11px]">
              Compounding Projections
            </span>
          </div>

          {/* Milestone Table Accordion with Accessible Table Semantics */}
          {showMilestones && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3 animate-in fade-in duration-200">
              <span className="text-[11px] font-mono font-semibold uppercase text-slate-500 block">
                Yearly Compounding Milestones
              </span>
              <div className="max-h-60 overflow-y-auto pr-1">
                <table className="w-full text-xs font-mono border-collapse" role="table" aria-label="Compounding Milestones Table">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-left text-[11px]">
                      <th className="py-2 px-2 font-semibold">Year</th>
                      <th className="py-2 px-2 font-semibold text-right">Invested Capital</th>
                      <th className="py-2 px-2 font-semibold text-right">Future Value</th>
                      <th className="py-2 px-2 font-semibold text-right">Gain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(activeTab === 'sip' ? sipResult.breakdown : lumpResult.breakdown).map((row) => (
                      <tr key={row.year} className="hover:bg-white/80 transition-colors">
                        <td className="py-1.5 px-2 text-slate-700">Year {row.year < 10 ? `0${row.year}` : row.year}</td>
                        <td className="py-1.5 px-2 text-right text-slate-500">{formatINR(row.invested, { compact: true })}</td>
                        <td className="py-1.5 px-2 text-right font-bold text-[#0B131E]">{formatINR(row.value, { compact: true })}</td>
                        <td className="py-1.5 px-2 text-right text-[#7BA238]">+{formatINR(Math.max(0, row.value - row.invested), { compact: true })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Results Column (Elevated Editorial Dark Card) */}
        <div className="lg:col-span-5 bg-[#0B131E] text-white p-7 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-7">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#5B92D1] uppercase">
                {activeTab === 'sip' && (sipStepUp > 0 ? `STEP-UP SIP (+${sipStepUp}%/YR)` : 'SIP PROJECTION')}
                {activeTab === 'lumpsum' && 'LUMPSUM PROJECTION'}
                {activeTab === 'goal' && 'GOAL MILESTONE'}
                {activeTab === 'retirement' && 'RETIREMENT READINESS'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeTab === 'retirement' ? `Post-Ret. ${retPostReturn}%` : 'Deterministic Model'}
              </span>
            </div>

            {/* Dominant Projected Metric with Animated Transition */}
            <div className="mt-5 space-y-1">
              <span className="text-xs text-slate-400 font-mono block">
                {activeTab === 'goal'
                  ? 'Required Monthly SIP'
                  : activeTab === 'retirement'
                  ? 'Your Target Corpus (Illustrative)'
                  : 'Projected Compounded Value'}
              </span>
              <div className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-mono text-[#7BA238] tracking-tight">
                {activeTab === 'sip' && <AnimatedNumber value={sipResult.projectedValue} />}
                {activeTab === 'lumpsum' && <AnimatedNumber value={lumpResult.projectedValue} />}
                {activeTab === 'goal' && <AnimatedNumber value={goalResult.requiredMonthlySIP} />}
                {activeTab === 'retirement' && <AnimatedNumber value={retResult.requiredRetirementCorpus} compact />}
              </div>
            </div>

            {/* Visual Compounding Ratio Bar */}
            {(activeTab === 'sip' || activeTab === 'lumpsum') && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    Capital: {activeTab === 'sip' ? sipInvestedPct : lumpInvestedPct}%
                  </span>
                  <span className="flex items-center gap-1.5 text-[#7BA238]">
                    <span className="w-2 h-2 rounded-full bg-[#7BA238]" />
                    Compounding Gain: {activeTab === 'sip' ? sipGainPct : lumpGainPct}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    className="bg-slate-600 h-full transition-all duration-500"
                    style={{ width: `${activeTab === 'sip' ? sipInvestedPct : lumpInvestedPct}%` }}
                  />
                  <div
                    className="bg-[#7BA238] h-full transition-all duration-500"
                    style={{ width: `${activeTab === 'sip' ? sipGainPct : lumpGainPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Thin Architectural Trajectory SVG Visual */}
            <div className="mt-5 h-14 w-full bg-[#131F31]/80 rounded-xl p-2 border border-slate-800">
              <svg viewBox="0 0 320 50" fill="none" className="w-full h-full">
                <path
                  d="M 10 44 C 100 42, 190 32, 310 8"
                  stroke="#7BA238"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="310" cy="8" r="4" fill="#7BA238" />
                <path
                  d="M 10 44 L 310 8 L 310 50 L 10 50 Z"
                  fill="url(#calc-gradient)"
                  opacity="0.15"
                />
                <defs>
                  <linearGradient id="calc-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7BA238" />
                    <stop offset="100%" stopColor="#7BA238" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Breakdown Stats */}
            <div className="mt-5 pt-5 border-t border-slate-800 space-y-3.5 text-xs font-mono">
              {activeTab === 'sip' && (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>Total Invested ({sipYears} Yrs)</span>
                    <span className="text-white">{formatINR(sipResult.investedAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Compounding Gain</span>
                    <span className="text-[#7BA238]">+{formatINR(sipResult.estimatedGain)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Wealth Multiple</span>
                    <span className="text-white">
                      {(sipResult.projectedValue / (sipResult.investedAmount || 1)).toFixed(2)}x Capital
                    </span>
                  </div>
                </>
              )}

              {activeTab === 'lumpsum' && (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>Initial Capital</span>
                    <span className="text-white">{formatINR(lumpResult.investedAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Capital Gain</span>
                    <span className="text-[#7BA238]">+{formatINR(lumpResult.estimatedGain)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Wealth Multiple</span>
                    <span className="text-white">
                      {(lumpResult.projectedValue / (lumpResult.investedAmount || 1)).toFixed(2)}x Capital
                    </span>
                  </div>
                </>
              )}

              {activeTab === 'goal' && (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>Inflation-Adjusted Target</span>
                    <span className="text-white">{formatINR(goalResult.futureInflationAdjustedGoal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Goal Horizon</span>
                    <span className="text-white">{goalYears} Years</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Assumed Growth Rate</span>
                    <span className="text-[#7BA238]">{goalRate}% CAGR</span>
                  </div>
                </>
              )}

              {activeTab === 'retirement' && (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>Years to Retirement</span>
                    <span className="text-white">{retResult.yearsToRetire} Years</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Monthly Expense at Age {retAge}</span>
                    <span className="text-white">{formatINR(retResult.monthlyExpenseAtRetirement)}/mo</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Suggested Monthly SIP</span>
                    <span className="text-[#7BA238]">{formatINR(retResult.requiredMonthlySIP)}/mo</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => onOpenConsultation(`${activeTab.toUpperCase()} Planning Discussion`)}
              className="w-full py-3.5 px-4 text-xs font-semibold text-[#0B131E] bg-[#7BA238] hover:bg-[#8EB942] rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <span>Structure This Plan With Farcon</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/investor-quiz')}
              className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors text-center cursor-pointer"
            >
              Verify Your Investor Profile First
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimers (Cleanly Structured via COMPLIANCE_REGISTRY) */}
      <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2 text-xs text-slate-600 leading-relaxed">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Shield className="w-4 h-4 text-[#7BA238]" />
          <span>{COMPLIANCE_REGISTRY.distributor.amfiRegistration}</span>
        </div>
        <p className="text-slate-500 pl-6">
          {COMPLIANCE_REGISTRY.calculator.disclaimer} {COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk}
        </p>
      </div>
    </div>
  );
};

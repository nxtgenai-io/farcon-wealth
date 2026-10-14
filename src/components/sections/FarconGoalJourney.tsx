import React, { useState, useEffect } from 'react';
import { RoutePath } from '@/types';
import {
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Target,
  Calendar,
  Compass,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { COMPLIANCE_REGISTRY } from '@/lib/compliance';
import { planningContextService } from '@/lib/planningContext';
import { analytics } from '@/lib/analytics';

interface FarconGoalJourneyProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: () => void;
}

export type GoalJourneyCategory =
  | 'retirement'
  | 'childEducation'
  | 'wealthCreation'
  | 'taxSaving';

interface JourneyArchetype {
  id: GoalJourneyCategory;
  name: string;
  targetGoal: string;
  stages: {
    stageNumber: string;
    stageLabel: 'Goal' | 'Horizon' | 'Investor Profile' | 'Planning Direction';
    title: string;
    subtitle: string;
    metricLabel: string;
    metricNumericValue: number;
    metricPrefix?: string;
    metricSuffix?: string;
    metricDisplayOverride?: string;
    curveProgress: number; // 0 to 1 for trajectory position
    details: { label: string; value: string }[];
    architecturalPrinciple: string;
  }[];
}

const JOURNEYS: JourneyArchetype[] = [
  {
    id: 'retirement',
    name: 'Retirement Independence',
    targetGoal: 'Illustrative Target: ₹3.50 Cr',
    stages: [
      {
        stageNumber: '01',
        stageLabel: 'Goal',
        title: 'Retirement Independence',
        subtitle: 'Inflation-proof financial freedom for 30+ post-work years without compromising lifestyle',
        metricLabel: 'Illustrative Target Corpus',
        metricNumericValue: 35000000,
        curveProgress: 0.15,
        details: [
          { label: 'Current Household Expenses', value: '₹55,000 / month' },
          { label: 'Inflation Adjustment', value: '6.0% annual' },
          { label: 'Purchasing Power', value: 'Fully Preserved' },
        ],
        architecturalPrinciple: 'Milestone targets precede all fund selection; targets must be modeled on personal expenditure.',
      },
      {
        stageNumber: '02',
        stageLabel: 'Horizon',
        title: '15-Year Compounding Runway',
        subtitle: 'Multi-cycle runway allows equity compounding to absorb market volatility and corrections',
        metricLabel: 'Accumulation Span',
        metricNumericValue: 180,
        metricSuffix: ' Months',
        metricDisplayOverride: '15 Years',
        curveProgress: 0.45,
        details: [
          { label: 'Market Cycles Absorbed', value: '3 Full Cycles' },
          { label: 'Asset Glidepath Shift', value: 'Commences Year 12' },
          { label: 'Noise Filtering', value: 'Systematic Mandate' },
        ],
        architecturalPrinciple: 'Sufficient runway converts temporary volatility into long-term compounding.',
      },
      {
        stageNumber: '03',
        stageLabel: 'Investor Profile',
        title: 'Balanced & Goal-Oriented',
        subtitle: 'Structured equity growth complemented by a hybrid cushion to buffer psychological drawdowns',
        metricLabel: 'Strategic Asset Allocation',
        metricNumericValue: 65,
        metricSuffix: '% Equity / 35% Hybrid',
        metricDisplayOverride: '65% Eq / 35% Hyb',
        curveProgress: 0.72,
        details: [
          { label: 'Risk Comfort Band', value: 'Moderate Growth' },
          { label: 'Drawdown Protection', value: 'Hybrid Buffer' },
          { label: 'Rebalancing Cadence', value: 'Semi-Annual Checkpoint' },
        ],
        architecturalPrinciple: 'Suitability precedes returns. We never recommend aggressive products outside your comfort band.',
      },
      {
        stageNumber: '04',
        stageLabel: 'Planning Direction',
        title: 'Goal-Based Starting Point',
        subtitle: 'Automated disciplined SIP routed directly in your own name through official channels',
        metricLabel: 'Illustrative Monthly Starting Point',
        metricNumericValue: 22500,
        metricPrefix: '₹',
        metricSuffix: ' / month',
        curveProgress: 1.0,
        details: [
          { label: 'Annual Step-Up Option', value: '+10% Optional' },
          { label: 'Investment Route', value: 'Directly in Investor’s Name' },
          { label: 'Regulatory Registration', value: 'AMFI ARN: 329006' },
        ],
        architecturalPrinciple: 'Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.',
      },
    ],
  },
  {
    id: 'childEducation',
    name: "Child's Higher Education",
    targetGoal: 'Illustrative Target: ₹1.20 Cr',
    stages: [
      {
        stageNumber: '01',
        stageLabel: 'Goal',
        title: 'Global Higher Education Fund',
        subtitle: 'Disciplined mutual fund accumulation for premier undergraduate or international postgraduate education',
        metricLabel: 'Illustrative Target Corpus',
        metricNumericValue: 12000000,
        curveProgress: 0.15,
        details: [
          { label: 'Target Milestone Age', value: 'Age 18 Admission' },
          { label: 'Education Inflation Factor', value: '8.0% annual' },
          { label: 'Currency Drag Protection', value: 'Diversified Assets' },
        ],
        architecturalPrinciple: 'Education milestones have fixed non-negotiable dates requiring disciplined glidepaths.',
      },
      {
        stageNumber: '02',
        stageLabel: 'Horizon',
        title: '12-Year Academic Runway',
        subtitle: 'Adequate runway for early accumulation followed by timely capital preservation',
        metricLabel: 'Investment Timeline',
        metricNumericValue: 144,
        metricSuffix: ' Months',
        metricDisplayOverride: '12 Years',
        curveProgress: 0.45,
        details: [
          { label: 'Equity Phase Duration', value: 'Years 1 to 9' },
          { label: 'Capital De-risking Phase', value: 'Years 10 to 12' },
          { label: 'Discipline Mechanism', value: 'Auto-Debit SIP' },
        ],
        architecturalPrinciple: 'Glidepaths shift capital into ultra-safe liquid funds 3 years before college enrollment.',
      },
      {
        stageNumber: '03',
        stageLabel: 'Investor Profile',
        title: 'Disciplined Growth Architecture',
        subtitle: 'Core diversified equity mutual funds paired with disciplined index accumulation',
        metricLabel: 'Asset Allocation Mix',
        metricNumericValue: 75,
        metricSuffix: '% Equity / 25% Debt',
        metricDisplayOverride: '75% Eq / 25% Debt',
        curveProgress: 0.72,
        details: [
          { label: 'Primary Focus', value: 'Large & Flexi-Cap Funds' },
          { label: 'Volatility Shield', value: 'Systematic Step-In' },
          { label: 'Milestone Tracking', value: 'Annual Valuation Review' },
        ],
        architecturalPrinciple: 'Avoid speculative sectoral bets that risk permanent capital loss near milestone dates.',
      },
      {
        stageNumber: '04',
        stageLabel: 'Planning Direction',
        title: 'Structured Educational Starting Point',
        subtitle: 'Steady monthly contributions mapped directly to your child’s educational timeline',
        metricLabel: 'Illustrative Monthly Starting Point',
        metricNumericValue: 18000,
        metricPrefix: '₹',
        metricSuffix: ' / month',
        curveProgress: 1.0,
        details: [
          { label: 'Annual Top-Up Rate', value: '+8% Step-Up' },
          { label: 'Account Ownership', value: 'Registered in Parent Name' },
          { label: 'Direct AMC Units', value: 'Zero Middleman Holding' },
        ],
        architecturalPrinciple: 'Transparent execution ensures funds mature cleanly exactly when admission fee deposits occur.',
      },
    ],
  },
  {
    id: 'wealthCreation',
    name: 'Long-Term Wealth Freedom',
    targetGoal: 'Illustrative Target: ₹5.00 Cr',
    stages: [
      {
        stageNumber: '01',
        stageLabel: 'Goal',
        title: 'Financial Independence & Legacy',
        subtitle: 'Building a multi-generational corpus that produces durable passive resilience and freedom',
        metricLabel: 'Illustrative Target Corpus',
        metricNumericValue: 50000000,
        curveProgress: 0.15,
        details: [
          { label: 'Primary Target', value: 'Generational Freedom' },
          { label: 'Real Purchasing Power', value: 'Compound > Inflation' },
          { label: 'Financial Resilience', value: 'High Net-Worth Cushion' },
        ],
        architecturalPrinciple: 'Real wealth creation is about buying autonomy and time, not beating daily noise.',
      },
      {
        stageNumber: '02',
        stageLabel: 'Horizon',
        title: '20-Year Multi-Cycle Runway',
        subtitle: 'Patient capital harnessing the exponential compounding curve across cycles',
        metricLabel: 'Compounding Horizon',
        metricNumericValue: 240,
        metricSuffix: ' Months',
        metricDisplayOverride: '20 Years',
        curveProgress: 0.45,
        details: [
          { label: 'Compounding Phases', value: '4 Full Market Cycles' },
          { label: 'Correction Mindset', value: 'Accumulation Opportunity' },
          { label: 'Tax Efficiency', value: 'Long-Term Capital Gains' },
        ],
        architecturalPrinciple: 'In year 15 to 20, compounding generates more wealth annually than total original contributions.',
      },
      {
        stageNumber: '03',
        stageLabel: 'Investor Profile',
        title: 'Growth-Focused Compounding',
        subtitle: 'High emotional resilience through bear markets, focused on long-term capital expansion',
        metricLabel: 'Strategic Asset Allocation',
        metricNumericValue: 80,
        metricSuffix: '% Equity / 20% Dynamic',
        metricDisplayOverride: '80% Eq / 20% Dyn',
        curveProgress: 0.72,
        details: [
          { label: 'Core Categories', value: 'Flexi Cap + Mid Cap' },
          { label: 'Risk Temperament', value: 'Comfort with Drawdowns' },
          { label: 'Review Frequency', value: 'Structured Half-Yearly' },
        ],
        architecturalPrinciple: 'Disciplined investors view corrections as opportunities to lower average unit costs.',
      },
      {
        stageNumber: '04',
        stageLabel: 'Planning Direction',
        title: 'Disciplined Stepped Starting Point',
        subtitle: 'High-conviction systematic investing with an annual step-up to mirror rising professional income',
        metricLabel: 'Illustrative Monthly Starting Point',
        metricNumericValue: 35000,
        metricPrefix: '₹',
        metricSuffix: ' / month',
        curveProgress: 1.0,
        details: [
          { label: 'Recommended Step-Up', value: '+10% Every 12 Months' },
          { label: 'Direct Execution', value: 'AMFI ARN: 329006' },
          { label: 'Investor Custody', value: 'Held Directly in Your Name' },
        ],
        architecturalPrinciple: 'Disciplined automated debit ensures emotions never interrupt the compounding process.',
      },
    ],
  },
  {
    id: 'taxSaving',
    name: 'Tax Saving Through ELSS',
    targetGoal: 'Illustrative Example: ₹1.50 Lakh / Year',
    stages: [
      {
        stageNumber: '01',
        stageLabel: 'Goal',
        title: 'Tax Saving Through ELSS',
        subtitle: 'Disciplined tax-saving through ELSS equity mutual funds subject to applicable tax regime rules',
        metricLabel: 'Section 80C Annual Deduction Cap',
        metricNumericValue: 150000,
        metricPrefix: '₹',
        curveProgress: 0.15,
        details: [
          { label: 'Section 80C Cap', value: '₹1,50,000 / FY (Old Regime)' },
          { label: 'Tax Regime Rule', value: 'Subject to regime choice' },
          { label: 'Lock-in Period', value: '3 Years (Statutory)' },
        ],
        architecturalPrinciple: 'Tax benefits are subject to the applicable tax regime and prevailing tax laws. Spreading allocations prevents year-end rush.',
      },
      {
        stageNumber: '02',
        stageLabel: 'Horizon',
        title: '3 to 5 Year Rolling Horizon',
        subtitle: 'Statutory 3-year lock-in naturally enforces investor patience and prevents premature panic selling',
        metricLabel: 'Mandatory Lock-In Runway',
        metricNumericValue: 36,
        metricSuffix: ' Months',
        metricDisplayOverride: '3 Years (Rolling)',
        curveProgress: 0.45,
        details: [
          { label: 'Lock-in Mechanism', value: '36 Months per Installment' },
          { label: 'Ideal Holding Span', value: '5+ Years for Equity' },
          { label: 'Patience Enforcer', value: 'Statutory Mandate' },
        ],
        architecturalPrinciple: 'Mandatory lock-in acts as an emotional guardrail, allowing equity compounding to overcome market noise.',
      },
      {
        stageNumber: '03',
        stageLabel: 'Investor Profile',
        title: 'Disciplined Growth & Tax Awareness',
        subtitle: 'Diversified equity exposure with disciplined monthly spreading to avoid market-timing risks',
        metricLabel: 'Asset Allocation Mix',
        metricNumericValue: 70,
        metricSuffix: '% ELSS Equity / 30% Debt',
        metricDisplayOverride: '70% ELSS / 30% Fixed',
        curveProgress: 0.72,
        details: [
          { label: 'Category Selection', value: 'Diversified ELSS Funds' },
          { label: 'Investment Style', value: 'Monthly SIP vs Lump Sum' },
          { label: 'Risk Temperament', value: 'Comfort with 3Y Lock-in' },
        ],
        architecturalPrinciple: 'Avoid rushed March lump-sum investments at market peaks by deploying automated monthly SIPs.',
      },
      {
        stageNumber: '04',
        stageLabel: 'Planning Direction',
        title: 'Systematic Tax-Saving Starting Point',
        subtitle: 'Illustrative monthly SIP of ₹12,500 aligning with the ₹1.5L Section 80C ceiling under Old Regime',
        metricLabel: 'Illustrative Monthly Starting Point',
        metricNumericValue: 12500,
        metricPrefix: '₹',
        metricSuffix: ' / month',
        curveProgress: 1.0,
        details: [
          { label: 'Annual Total Saved', value: '₹1,50,000 / Year' },
          { label: 'Monthly Execution', value: 'Automated 1st of Month' },
          { label: 'Applicable Regime', value: 'Old Tax Regime' },
        ],
        architecturalPrinciple: 'Tax benefits are subject to the applicable tax regime and prevailing tax laws.',
      },
    ],
  },
];

export const FarconGoalJourney: React.FC<FarconGoalJourneyProps> = ({
  navigate,
  onOpenConsultation,
}) => {
  const [activeArchetypeIndex, setActiveArchetypeIndex] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const STAGE_DURATION_MS = 5500;
  const UPDATE_INTERVAL_MS = 50;

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const archetype = JOURNEYS[activeArchetypeIndex];
  const stage = archetype.stages[activeStageIndex];

  // Auto-progress timer with progress bar state (disabled if prefers-reduced-motion is true or hovered)
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const stepIncrement = (UPDATE_INTERVAL_MS / STAGE_DURATION_MS) * 100;
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          setActiveStageIndex((s) => (s + 1) % 4);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isHovered, activeStageIndex, prefersReducedMotion]);

  const handleStageSelect = (idx: number) => {
    setActiveStageIndex(idx);
    setProgressPercent(0);
    analytics.track('goal_journey_stage_changed', {
      archetype: archetype.id,
      stageIndex: idx,
      stageLabel: archetype.stages[idx]?.stageLabel,
    });
  };

  const handlePrevStage = () => {
    const nextIdx = activeStageIndex === 0 ? 3 : activeStageIndex - 1;
    setActiveStageIndex(nextIdx);
    setProgressPercent(0);
    analytics.track('goal_journey_stage_changed', {
      archetype: archetype.id,
      stageIndex: nextIdx,
    });
  };

  const handleNextStage = () => {
    const nextIdx = activeStageIndex === 3 ? 0 : activeStageIndex + 1;
    setActiveStageIndex(nextIdx);
    setProgressPercent(0);
    analytics.track('goal_journey_stage_changed', {
      archetype: archetype.id,
      stageIndex: nextIdx,
    });
  };

  const handleArchetypeSelect = (idx: number) => {
    setActiveArchetypeIndex(idx);
    setActiveStageIndex(0);
    setProgressPercent(0);
    const selected = JOURNEYS[idx];
    planningContextService.updatePlanningContext({
      activeGoalCategory: selected.id,
    });
    analytics.track('goal_journey_archetype_changed', {
      archetypeId: selected.id,
      name: selected.name,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white text-[#17243A] rounded-2xl border border-[#DCE4EE] shadow-xs overflow-hidden transition-all duration-300 group"
    >
      {/* Top Header: Instrument Mode & Archetype Switcher */}
      <div className="relative px-6 sm:px-8 pt-6 pb-4 border-b border-[#DCE4EE] bg-[#F2F6FB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#78A832]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-[#17243A]">
              Goal Journey Framework
            </span>
          </div>

          {/* Autoplay Status & Scrubber Pause Status */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#52647D]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                prefersReducedMotion ? 'bg-slate-400' : isHovered ? 'bg-amber-500' : 'bg-[#78A832]'
              }`}
            />
            <span>
              {prefersReducedMotion
                ? 'Manual Mode (Reduced Motion)'
                : isHovered
                ? 'Paused · Tap to inspect'
                : 'Auto-advancing (5.5s)'}
            </span>
          </div>
        </div>

        {/* 4 Archetype Selectors (Retirement, Child Education, Wealth Creation, Tax Saving) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-white rounded-xl border border-[#DCE4EE] shadow-2xs">
          {JOURNEYS.map((item, idx) => {
            const isSelected = activeArchetypeIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => handleArchetypeSelect(idx)}
                className={`py-2 px-2 text-center rounded-lg transition-all text-xs font-medium truncate ${
                  isSelected
                    ? 'bg-[#101A2C] text-white font-semibold shadow-xs'
                    : 'text-[#52647D] hover:text-[#17243A] hover:bg-slate-100/70'
                }`}
                title={item.name}
              >
                <span className="block truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Interactive Sequential Stages Rail (01 Goal → 02 Horizon → 03 Investor Profile → 04 Planning Direction) */}
      <div className="relative border-b border-[#DCE4EE] bg-[#FAFBFC]">
        <div className="grid grid-cols-4 divide-x divide-[#DCE4EE]">
          {archetype.stages.map((st, idx) => {
            const isActive = activeStageIndex === idx;
            const isCompleted = idx < activeStageIndex;

            return (
              <button
                key={st.stageNumber}
                onClick={() => handleStageSelect(idx)}
                className={`p-3.5 sm:p-4 text-left transition-all relative flex flex-col justify-between group/tab cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#17243A]'
                    : 'text-[#52647D] hover:text-[#17243A] hover:bg-[#F2F6FB]/70'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#78A832] text-[#101A2C]'
                        : isCompleted
                        ? 'bg-[#E8F5E9] text-[#78A832]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {st.stageNumber}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3 h-3 text-[#78A832] hidden sm:block" />
                  )}
                </div>

                <div className="mt-1">
                  <span className="text-[10px] sm:text-xs font-medium block truncate">
                    {st.stageLabel}
                  </span>
                </div>

                {/* Active Underline Progress Bar for Current Stage */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DCE4EE] overflow-hidden">
                    <div
                      className="h-full bg-[#78A832] transition-all duration-75 ease-linear"
                      style={{ width: prefersReducedMotion ? '100%' : `${progressPercent}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Content Panel */}
      <div className="p-6 sm:p-8 lg:p-9 space-y-6">
        {/* Top Header of Stage */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DCE4EE]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#78A832] uppercase">
                Stage {stage.stageNumber} · {stage.stageLabel}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-medium text-[#17243A] tracking-tight">
              {stage.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#52647D] mt-1 max-w-2xl leading-relaxed">
              {stage.subtitle}
            </p>
          </div>

          <div className="bg-[#F2F6FB] px-5 py-3.5 rounded-2xl border border-[#DCE4EE] shrink-0 text-left md:text-right shadow-2xs">
            <span className="text-[11px] font-mono text-[#52647D] block mb-0.5">
              {stage.metricLabel}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#78A832] flex items-baseline gap-2 md:justify-end">
              {stage.metricDisplayOverride ? (
                <span>{stage.metricDisplayOverride}</span>
              ) : (
                <>
                  {stage.metricPrefix}
                  <AnimatedNumber value={stage.metricNumericValue} />
                  {stage.metricSuffix}
                </>
              )}
            </div>
            <div className="mt-1 flex items-center md:justify-end">
              <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#52647D] border border-[#DCE4EE]">
                Illustrative example · Target value based on your inputs
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Trajectory SVG Visual (Communicates Goal Runway Progress, NOT Performance) */}
        <div className="bg-[#FAFBFC] p-4 sm:p-5 rounded-2xl border border-[#DCE4EE] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#52647D] font-mono">
            <span className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-[#78A832]" />
              <span className="text-[#17243A] font-medium">Goal Runway Trajectory</span>
            </span>
            <span className="text-[#78A832] font-semibold">
              {Math.round(stage.curveProgress * 100)}% Milestone Direction
            </span>
          </div>

          {/* SVG Trajectory Chart */}
          <div className="h-20 w-full relative bg-white rounded-xl border border-[#DCE4EE] p-2 shadow-2xs">
            <svg viewBox="0 0 500 80" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="journeyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#315FCE" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#78A832" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#78A832" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="areaFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#78A832" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#78A832" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Background Reference Grid Line */}
              <line x1="20" y1="70" x2="480" y2="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="40" x2="480" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="10" x2="480" y2="10" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

              {/* Base Compounding Curve */}
              <path
                d="M 20 70 Q 180 65, 300 45 T 480 12"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Active Milestone Progress Arc */}
              <path
                d={`M 20 70 Q 180 65, ${20 + 460 * stage.curveProgress} ${
                  70 - (70 - 12) * Math.pow(stage.curveProgress, 1.4)
                }`}
                fill="none"
                stroke="url(#journeyGlow)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* 4 Interactive Milestone Nodes along the trajectory */}
              {[
                { x: 90, y: 68, active: activeStageIndex >= 0 },
                { x: 220, y: 55, active: activeStageIndex >= 1 },
                { x: 350, y: 35, active: activeStageIndex >= 2 },
                { x: 480, y: 12, active: activeStageIndex >= 3 },
              ].map((node, i) => (
                <g key={i}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.active ? 4.5 : 2.5}
                    fill={node.active ? '#78A832' : '#94A3B8'}
                    className="transition-all duration-300"
                  />
                  {node.active && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={7}
                      stroke="#78A832"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                </g>
              ))}
            </svg>
            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-[#52647D]">
              Runway Trajectory
            </div>
          </div>

          {/* Trajectory Note */}
          <div className="text-[10px] font-mono text-[#52647D] pt-1">
            {COMPLIANCE_REGISTRY.journey.trajectoryNote}
          </div>
        </div>

        {/* Three Editorial Micro-Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1">
          {stage.details.map((d, i) => (
            <div key={i} className="p-3.5 bg-[#F2F6FB] rounded-xl border border-[#DCE4EE] space-y-1 shadow-2xs">
              <span className="text-[10px] text-[#52647D] font-mono block truncate">
                {d.label}
              </span>
              <strong className="text-xs font-mono text-[#17243A] block truncate">
                {d.value}
              </strong>
            </div>
          ))}
        </div>

        {/* Architectural Philosophy Note */}
        <div className="p-3.5 bg-[#EDF3FF] rounded-xl border border-[#DCE4EE] text-xs text-[#17243A] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#315FCE] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] text-[#17243A]">
            {stage.architecturalPrinciple}
          </p>
        </div>

        {/* Stage Navigation & Primary Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#DCE4EE]">
          {/* Previous / Next Stepper Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrevStage}
              className="p-2 rounded-lg bg-[#F2F6FB] hover:bg-slate-200/80 text-[#17243A] transition-colors border border-[#DCE4EE]"
              aria-label="Previous Stage"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-[#52647D] px-2 font-medium">
              0{activeStageIndex + 1} / 04
            </span>
            <button
              onClick={handleNextStage}
              className="p-2 rounded-lg bg-[#F2F6FB] hover:bg-slate-200/80 text-[#17243A] transition-colors border border-[#DCE4EE]"
              aria-label="Next Stage"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => navigate('/wealth-planner')}
              className="flex-1 sm:flex-none py-2.5 px-4 text-xs font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Explore Wealth Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenConsultation}
              className="py-2.5 px-4 text-xs font-semibold text-[#17243A] bg-white border border-[#DCE4EE] hover:bg-slate-50 rounded-md transition-colors shadow-2xs"
            >
              Discuss Planning Direction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

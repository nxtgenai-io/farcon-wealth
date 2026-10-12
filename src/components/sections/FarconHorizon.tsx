import React, { useState, useEffect, useRef } from 'react';
import { RoutePath } from '@/types';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export type HorizonGoalId = 'retirement' | 'childEducation' | 'wealthCreation' | 'taxSaving';

interface MilestoneNode {
  stageNumber: '01' | '02' | '03' | '04';
  stageLabel: 'Goal' | 'Horizon' | 'Investor Profile' | 'Planning Direction';
  title: string;
  metricLabel: string;
  metricValue: string;
  metricNote: string;
  explanation: string;
  governanceNote: string;
}

interface HorizonGoalArchetype {
  id: HorizonGoalId;
  label: string;
  shortLabel: string;
  tagline: string;
  nodes: MilestoneNode[];
}

const HORIZON_GOALS: HorizonGoalArchetype[] = [
  {
    id: 'retirement',
    label: 'Retirement Independence',
    shortLabel: 'Retirement',
    tagline: 'Preserving real purchasing power across 30+ post-work years.',
    nodes: [
      {
        stageNumber: '01',
        stageLabel: 'Goal',
        title: 'Target Retirement Corpus',
        metricLabel: 'Your Target Corpus',
        metricValue: '₹3.50 Cr',
        metricNote: 'Target value based on your inputs',
        explanation: 'Milestone targets precede scheme selection. We model your corpus on personal living expenditure rather than generic industry averages.',
        governanceNote: 'Target value based on your inputs. Illustrative mathematical projection.',
      },
      {
        stageNumber: '02',
        stageLabel: 'Horizon',
        title: 'Compounding Runway',
        metricLabel: 'Planning Runway',
        metricValue: '15 Years',
        metricNote: 'Illustrative planning runway',
        explanation: 'Your planning runway toward the selected goal. A multi-year horizon allows equity compounding to absorb temporary market corrections and capture full economic cycles.',
        governanceNote: 'Sufficient horizon converts temporary volatility into disciplined compounding.',
      },
      {
        stageNumber: '03',
        stageLabel: 'Investor Profile',
        title: 'Suitability & Risk Comfort',
        metricLabel: 'Investor Fit Profile',
        metricValue: 'Balanced & Goal-Oriented',
        metricNote: 'Educational diagnostic profile',
        explanation: 'A growth-oriented equity compounding engine cushioned with hybrid assets to limit drawdowns and preserve psychological comfort.',
        governanceNote: 'Suitability precedes returns. We never recommend products outside your comfort band.',
      },
      {
        stageNumber: '04',
        stageLabel: 'Planning Direction',
        title: 'Disciplined Execution Mandate',
        metricLabel: 'Monthly Starting Point',
        metricValue: '₹22,500 / mo',
        metricNote: 'Illustrative monthly pace',
        explanation: 'Automated disciplined SIP routed directly in your own name through official channels with zero intermediary fund custody.',
        governanceNote: 'Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.',
      },
    ],
  },
  {
    id: 'childEducation',
    label: "Child's Higher Education",
    shortLabel: 'Child Education',
    tagline: 'Earmarked funding for premier university admissions.',
    nodes: [
      {
        stageNumber: '01',
        stageLabel: 'Goal',
        title: 'Target Education Corpus',
        metricLabel: 'Your Target Corpus',
        metricValue: '₹1.20 Cr',
        metricNote: 'Target value based on your inputs',
        explanation: 'Education milestones have strict, non-negotiable admission dates that cannot be delayed for market cycles.',
        governanceNote: 'Target value based on your inputs. Illustrative mathematical projection.',
      },
      {
        stageNumber: '02',
        stageLabel: 'Horizon',
        title: 'Academic Compounding Runway',
        metricLabel: 'Planning Runway',
        metricValue: '12 Years',
        metricNote: 'Illustrative planning runway',
        explanation: 'Your planning runway toward university enrollment. An early compounding runway is paired with planned capital preservation 36 months before tuition dates.',
        governanceNote: 'Pre-scheduled glidepaths shift capital to low-volatility assets before fee dates.',
      },
      {
        stageNumber: '03',
        stageLabel: 'Investor Profile',
        title: 'Disciplined Growth Architecture',
        metricLabel: 'Investor Fit Profile',
        metricValue: 'Disciplined Growth Fit',
        metricNote: 'Educational diagnostic profile',
        explanation: 'Diversified equity mutual funds paired with steady debt allocations to avoid speculative risks near milestone dates.',
        governanceNote: 'Avoid concentrated sectoral bets near crucial academic deadlines.',
      },
      {
        stageNumber: '04',
        stageLabel: 'Planning Direction',
        title: 'Earmarked Folio Direction',
        metricLabel: 'Monthly Starting Point',
        metricValue: '₹18,000 / mo',
        metricNote: 'Illustrative monthly pace',
        explanation: 'Automated contributions mapped directly to admission milestones, held in the parent or guardian’s registered name.',
        governanceNote: 'Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.',
      },
    ],
  },
  {
    id: 'wealthCreation',
    label: 'Long-Term Wealth Creation',
    shortLabel: 'Wealth Creation',
    tagline: 'Unconstrained equity compounding over decades.',
    nodes: [
      {
        stageNumber: '01',
        stageLabel: 'Goal',
        title: 'Capital Compounding Milestone',
        metricLabel: 'Your Target Corpus',
        metricValue: '₹5.00 Cr',
        metricNote: 'Target value based on your inputs',
        explanation: 'Building generational independence by focusing strictly on multi-decade purchasing power growth rather than short-term speculative noise.',
        governanceNote: 'Target value based on your inputs. Illustrative mathematical projection.',
      },
      {
        stageNumber: '02',
        stageLabel: 'Horizon',
        title: 'Multi-Decade Horizon',
        metricLabel: 'Planning Runway',
        metricValue: '20+ Years',
        metricNote: 'Illustrative planning runway',
        explanation: 'Your multi-decade runway to capture uninterrupted equity compounding across numerous economic expansions.',
        governanceNote: 'Long horizons turn market volatility into an ally through consistent rupee-cost averaging.',
      },
      {
        stageNumber: '03',
        stageLabel: 'Investor Profile',
        title: 'Equity Compounding Mindset',
        metricLabel: 'Investor Fit Profile',
        metricValue: 'Disciplined Equity Growth',
        metricNote: 'Educational diagnostic profile',
        explanation: 'Broad market diversification structured to withstand cyclical corrections without panic-selling or emotional churn.',
        governanceNote: 'Behavioral discipline is the single greatest determinant of long-term mutual fund results.',
      },
      {
        stageNumber: '04',
        stageLabel: 'Planning Direction',
        title: 'Disciplined Step-Up Mandate',
        metricLabel: 'Monthly Starting Point',
        metricValue: '₹35,000 / mo',
        metricNote: 'Illustrative monthly pace',
        explanation: 'Systematic monthly SIP with disciplined annual step-up commitments, held directly in your own name.',
        governanceNote: 'Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.',
      },
    ],
  },
  {
    id: 'taxSaving',
    label: 'Tax Saving Through ELSS',
    shortLabel: 'Tax Saving',
    tagline: 'Annual Section 80C optimization paired with 3-year lock-in discipline.',
    nodes: [
      {
        stageNumber: '01',
        stageLabel: 'Goal',
        title: 'Section 80C Tax Efficiency',
        metricLabel: 'Annual Deductible Ceiling',
        metricValue: '₹1.50 Lakh',
        metricNote: 'Statutory 80C threshold',
        explanation: 'Maximizing deductions under the applicable tax regime while directing tax savings into productive long-term equity growth.',
        governanceNote: 'Tax benefits are subject to the applicable tax regime and prevailing tax laws.',
      },
      {
        stageNumber: '02',
        stageLabel: 'Horizon',
        title: 'Statutory Lock-in Runway',
        metricLabel: 'Planning Runway',
        metricValue: '3–5 Years',
        metricNote: 'Statutory 36-month lock-in',
        explanation: 'Your planning runway toward the tax milestone. The mandatory 3-year lock-in acts as an emotional guardrail, preventing premature reactions to short-term volatility.',
        governanceNote: 'Statutory 3-year lock-in applies to each respective monthly SIP installment.',
      },
      {
        stageNumber: '03',
        stageLabel: 'Investor Profile',
        title: 'Disciplined Tax Awareness',
        metricLabel: 'Investor Fit Profile',
        metricValue: 'Tax-Aware Equity Growth',
        metricNote: 'Educational diagnostic profile',
        explanation: 'Eliminating chaotic year-end March lump-sum decisions by automating 12 equal monthly contributions throughout the financial year.',
        governanceNote: 'Monthly spreading captures rupee-cost averaging across the entire financial year.',
      },
      {
        stageNumber: '04',
        stageLabel: 'Planning Direction',
        title: 'Automated Monthly Flow',
        metricLabel: 'Monthly Starting Point',
        metricValue: '₹12,500 / mo',
        metricNote: 'Illustrative monthly pace',
        explanation: 'Automating ₹12,500 per month fulfills the ₹1.5 Lakh Section 80C ceiling quietly without end-of-year liquidity strain.',
        governanceNote: 'Tax benefits are subject to the applicable tax regime and prevailing tax laws.',
      },
    ],
  },
];

interface FarconHorizonProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (goalName?: string) => void;
}

export const FarconHorizon: React.FC<FarconHorizonProps> = ({
  navigate,
  onOpenConsultation,
}) => {
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState(1); // Default to 02 Horizon to immediately showcase the runway
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeGoal = HORIZON_GOALS[activeGoalIndex];
  const activeNode = activeGoal.nodes[activeNodeIndex];

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 5.5s calm auto-progression through nodes
  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % 4);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prefersReducedMotion, isPaused, activeGoalIndex]);

  // Coordinates along the wide low-profile trajectory (viewBox: 640 x 140)
  const nodeCoords = [
    { x: 60, y: 112 },
    { x: 230, y: 92 },
    { x: 410, y: 56 },
    { x: 580, y: 28 },
  ];

  return (
    <div
      className="bg-white text-[#17243A] rounded-2xl border border-[#DCE4EE] shadow-xs overflow-hidden relative font-inter max-w-2xl mx-auto lg:max-w-none transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Farcon Investment Horizon visual instrument"
    >
      {/* TOP HEADER: Clean institutional label & Archetype Tabs */}
      <div className="px-5 py-2.5 sm:px-6 border-b border-[#DCE4EE] relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#FAFBFC]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#78A832]" />
          <span className="text-xs font-semibold text-slate-900 tracking-tight">
            Farcon Horizon
          </span>
          <span className="text-slate-300 text-xs">·</span>
          <span className="text-[11px] text-slate-500 font-normal">
            Milestone Trajectory
          </span>
        </div>

        {/* Goal Archetype Selector (Groww-inspired pill tabs) */}
        <div
          className="inline-flex items-center gap-1 p-0.5 bg-[#F2F6FB] rounded-lg border border-[#DCE4EE] overflow-x-auto max-w-full"
          role="tablist"
          aria-label="Select Goal Archetype"
        >
          {HORIZON_GOALS.map((goal, idx) => {
            const isSelected = activeGoalIndex === idx;
            return (
              <button
                key={goal.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveGoalIndex(idx);
                  setActiveNodeIndex(1); // Keep runway view
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs border border-[#DCE4EE]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {goal.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* HORIZON TRAJECTORY SVG (PALE CHART SURFACE, RESTRAINED GRIDLINES) */}
      <div className="px-5 pt-3 pb-2 sm:px-6 relative z-10 bg-white">
        <div className="relative w-full h-28 sm:h-32 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-2">
          <svg
            viewBox="0 0 640 140"
            fill="none"
            className="w-full h-full select-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="horizon-line-grad" x1="0" y1="0" x2="640" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="45%" stopColor="#315FCE" />
                <stop offset="100%" stopColor="#78A832" />
              </linearGradient>
              <linearGradient id="horizon-soft-glow" x1="0" y1="0" x2="0" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#78A832" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#78A832" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Restrained datum reference lines */}
            <line x1="30" y1="120" x2="610" y2="120" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 4" />
            <line x1="30" y1="70" x2="610" y2="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 4" />

            {/* Shaded Area */}
            <path
              d="M 30 120 C 180 115, 380 65, 610 24 L 610 135 L 30 135 Z"
              fill="url(#horizon-soft-glow)"
            />

            {/* Main Planning Trajectory Curve */}
            <path
              d="M 30 120 C 180 115, 380 65, 610 24"
              stroke="url(#horizon-line-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* 4 Milestone Nodes */}
            {nodeCoords.map((coord, idx) => {
              const isActive = activeNodeIndex === idx;
              const isPast = activeNodeIndex > idx;

              return (
                <g
                  key={idx}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setActiveNodeIndex(idx)}
                >
                  {/* Subtle active target ring */}
                  {isActive && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="14"
                      fill="#78A832"
                      fillOpacity="0.18"
                    />
                  )}

                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isActive ? '7' : '5'}
                    fill="#FFFFFF"
                    stroke={isActive ? '#78A832' : isPast ? '#315FCE' : '#CBD5E1'}
                    strokeWidth={isActive ? '2.5' : '2'}
                  />

                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isActive ? '3.5' : '2'}
                    fill={isActive ? '#78A832' : isPast ? '#315FCE' : '#94A3B8'}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* 4 Quiet Milestone Tabs Directly Below Curve */}
        <div className="grid grid-cols-4 gap-1.5 border-t border-[#DCE4EE] pt-2 mt-2">
          {activeGoal.nodes.map((node, idx) => {
            const isActive = activeNodeIndex === idx;
            return (
              <button
                key={node.stageNumber}
                onClick={() => setActiveNodeIndex(idx)}
                className={`text-left p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F2F6FB] border border-[#DCE4EE] text-slate-900 shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      isActive ? 'text-[#78A832]' : 'text-slate-400'
                    }`}
                  >
                    {node.stageNumber}
                  </span>
                  <span
                    className={`text-[11px] truncate ${
                      isActive ? 'text-slate-900 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    {node.stageLabel}
                  </span>
                </div>
                <div
                  className={`h-0.5 rounded-full mt-1.5 transition-all ${
                    isActive ? 'bg-[#78A832] w-full' : 'bg-slate-200 w-1/4'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE STAGE FOCUS: Clear Editorial Hierarchy on Pale Surface */}
      <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-[#F2F6FB] border-t border-[#DCE4EE] relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Context: Stage & Explanation */}
          <div className="space-y-1 sm:max-w-[62%]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#78A832]">
                Stage {activeNode.stageNumber} · {activeNode.stageLabel}
              </span>
              <span className="text-slate-300 text-xs">/</span>
              <span className="text-xs font-medium text-slate-900">
                {activeNode.title}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {activeNode.explanation}
            </p>
          </div>

          {/* Right Highlight: Single Clear Metric */}
          <div className="p-3.5 rounded-xl bg-white border border-[#DCE4EE] text-left sm:text-right shrink-0 min-w-[160px] shadow-2xs">
            <span className="text-[11px] text-slate-500 block font-medium">
              {activeNode.metricLabel}
            </span>
            <div className="text-xl sm:text-2xl font-semibold text-[#78A832] tracking-tight mt-0.5 font-poppins">
              {activeNode.metricValue}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {activeNode.metricNote}
            </span>
          </div>
        </div>

        {/* Footer line: Subtle statutory caption & Manual Stage Control */}
        <div className="pt-3 mt-3 border-t border-[#DCE4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-[11px] text-slate-500 leading-normal">
            <span className="text-slate-700 font-medium">Notice:</span> Conceptual planning journey — not investment performance.
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Prev / Next controls */}
            <button
              onClick={() => setActiveNodeIndex((prev) => (prev === 0 ? 3 : prev - 1))}
              aria-label="Previous milestone"
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveNodeIndex((prev) => (prev === 3 ? 0 : prev + 1))}
              aria-label="Next milestone"
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenConsultation(`${activeGoal.label} Plan Discussion`)}
              className="ml-2 px-3 py-1.5 text-[11px] font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer active:scale-[0.98]"
            >
              <span>Explore Goal</span>
              <ArrowRight className="w-3 h-3 text-[#78A832]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

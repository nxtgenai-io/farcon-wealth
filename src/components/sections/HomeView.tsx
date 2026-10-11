import React, { useState } from 'react';
import { RoutePath } from '@/types';
import { FARCON_SERVICES } from '@/content/services/servicesData';
import { FARCON_GOALS } from '@/content/goals/goalsData';
import { BLOG_POSTS } from '@/content/blogs/blogData';
import { Reveal } from '@/components/ui/Reveal';
import { FarconHorizon } from '@/components/sections/FarconHorizon';
import { formatINR } from '@/lib/formatting/currency';
import { calculateSIP, calculateLumpsum, calculateGoalSIP, calculateRetirement } from '@/lib/calculations/financial';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Bot,
} from 'lucide-react';

interface HomeViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (subject?: string) => void;
  onOpenAI: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  navigate,
  onOpenConsultation,
  onOpenAI,
}) => {
  // Goals hover state
  const [hoveredGoalIndex, setHoveredGoalIndex] = useState<number | null>(null);

  // Services hover state
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState<number | null>(null);

  // Financial Studio State
  const [studioTab, setStudioTab] = useState<'sip' | 'lumpsum' | 'goal' | 'retirement'>('sip');
  const [studioAmount, setStudioAmount] = useState<number>(25000);
  const [studioRate, setStudioRate] = useState<number>(12);
  const [studioTenure, setStudioTenure] = useState<number>(15);
  const [showStudioAssumptions, setShowStudioAssumptions] = useState<boolean>(false);

  // Financial Studio Calculations (deterministic, preserved formulas)
  const sipResult = calculateSIP(studioAmount, studioRate, studioTenure);
  const lumpResult = calculateLumpsum(studioAmount * 10, studioRate, studioTenure);
  const goalResult = calculateGoalSIP(10000000, studioRate, studioTenure, 6);
  const retResult = calculateRetirement(32, 60, 85, studioAmount * 2, 6, studioRate, 8);

  const activeStudioResult =
    studioTab === 'sip'
      ? {
          headlineLabel: 'Projected Value',
          headlineValue: sipResult.projectedValue,
          investedLabel: 'Total Capital Invested',
          investedValue: sipResult.investedAmount,
          gainLabel: 'Estimated Gain',
          gainValue: sipResult.estimatedGain,
        }
      : studioTab === 'lumpsum'
      ? {
          headlineLabel: 'Projected Value',
          headlineValue: lumpResult.projectedValue,
          investedLabel: 'Initial Investment',
          investedValue: lumpResult.investedAmount,
          gainLabel: 'Estimated Gain',
          gainValue: lumpResult.estimatedGain,
        }
      : studioTab === 'goal'
      ? {
          headlineLabel: 'Required Monthly SIP',
          headlineValue: goalResult.requiredMonthlySIP,
          investedLabel: 'Target Inflation-Adjusted Corpus',
          investedValue: goalResult.futureInflationAdjustedGoal,
          gainLabel: 'Illustrative Return',
          gainValue: studioRate,
          isRate: true,
        }
      : {
          headlineLabel: 'Your Target Corpus (Illustrative)',
          headlineValue: retResult.requiredRetirementCorpus,
          investedLabel: 'Required Monthly SIP',
          investedValue: retResult.requiredMonthlySIP,
          gainLabel: 'Monthly Expense at Retirement',
          gainValue: retResult.monthlyExpenseAtRetirement,
        };

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-40 pb-28 overflow-hidden font-inter">
      {/* =========================================================================
          SECTION 1 — SIGNATURE EDITORIAL HERO & FARCON HORIZON
          Desktop split: ~45% left / ~55% right. Low profile visual (360-430px).
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14">
        {/* Full-width subtle horizon curves background (3–5% opacity) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] overflow-hidden" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 1600 900" fill="none">
            <path d="M-100 800 C 400 750, 900 500, 1700 200" stroke="#0B131E" strokeWidth="2" />
            <path d="M-100 850 C 450 800, 950 550, 1700 280" stroke="#7BA238" strokeWidth="1.5" />
            <path d="M-100 720 C 350 670, 850 420, 1700 130" stroke="#5B92D1" strokeWidth="1" strokeDasharray="5 5" />
          </svg>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
            {/* LEFT COLUMN: ~45% Editorial Authority */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6 sm:space-y-7">
              {/* Eyebrow: Clean unboxed typography */}
              <div className="text-[11px] sm:text-xs font-mono font-medium uppercase tracking-[0.2em] text-[#7BA238]">
                GOAL-BASED WEALTH GUIDANCE
              </div>

              {/* Master Headline: Centralized type-hero token (Poppins 500, clamp 40px-84px) */}
              <h1 className="type-hero text-slate-900">
                Investing,
                <br />
                without the noise.
              </h1>

              {/* Calm, concise supporting copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg font-normal">
                Your goals are personal. Your investment journey should be too. Farcon helps you approach mutual fund investing with clarity, discipline and purpose.
              </p>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('purpose-goals-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/goals');
                  }}
                  className="px-6 sm:px-7 py-3.5 text-xs font-medium text-white bg-[#0B131E] hover:bg-[#1E293B] rounded-md transition-colors shadow-xs inline-flex items-center gap-2 group cursor-pointer active:scale-[0.98]"
                >
                  <span>Start with a Goal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7BA238] transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => onOpenConsultation('Hero Section Consultation')}
                  className="px-6 py-3.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                >
                  Book a Free 15-Minute Call
                </button>
              </div>

              {/* Clean Supporting Trust Line: Goal-based · Transparent · In your name */}
              <div className="pt-2 flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                <span className="text-slate-800 font-medium">Goal-based</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-800 font-medium">Transparent</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-800 font-medium">In your name</span>
              </div>
            </div>

            {/* RIGHT COLUMN: ~55% WIDE LOW-PROFILE FARCON HORIZON */}
            <div className="lg:col-span-7 xl:col-span-7">
              <FarconHorizon
                navigate={navigate}
                onOpenConsultation={(g) => onOpenConsultation(g || 'Farcon Horizon Consultation')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — INSTITUTIONAL TRUST STRIP (NO CARDS, HAIRLINE SEPARATORS)
          ========================================================================= */}
      <section className="border-y border-slate-200/90 bg-[#F8FAFC] py-8 sm:py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              <div className="pt-3 lg:pt-0 lg:pr-6 space-y-1">
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#7BA238] block">
                  REGULATORY REGISTRATION
                </span>
                <span className="text-sm sm:text-base font-poppins font-medium text-slate-900 block">
                  AMFI Registered Distributor
                </span>
                <span className="text-xs text-slate-500 font-mono block">ARN: 329006</span>
              </div>

              <div className="pt-3 lg:pt-0 lg:px-6 space-y-1">
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#5B92D1] block">
                  PLANNING FOCUS
                </span>
                <span className="text-sm sm:text-base font-poppins font-medium text-slate-900 block">
                  Goal-Based Approach
                </span>
                <span className="text-xs text-slate-500 block">Life milestones guide fund selection</span>
              </div>

              <div className="pt-3 lg:pt-0 lg:px-6 space-y-1">
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500 block">
                  TRANSPARENCY
                </span>
                <span className="text-sm sm:text-base font-poppins font-medium text-slate-900 block">
                  Transparent Process
                </span>
                <span className="text-xs text-slate-500 block">Zero hidden fees or exit surprises</span>
              </div>

              <div className="pt-3 lg:pt-0 lg:pl-6 space-y-1">
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500 block">
                  SECURITY & TITLE
                </span>
                <span className="text-sm sm:text-base font-poppins font-medium text-slate-900 block">
                  In Your Name
                </span>
                <span className="text-xs text-slate-500 block">Farcon does not hold investor funds</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — PURPOSE STATEMENT & GOALS (EDITORIAL ROWS, NOT CARDS)
          ========================================================================= */}
      <section id="purpose-goals-section" className="relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Major Editorial Brand Statement (Visually Large, NOT in a card) */}
          <Reveal className="max-w-3xl mb-12 sm:mb-16">
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#7BA238] block mb-2">
              PURPOSE-DRIVEN WEALTH
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-[-0.03em] leading-[1.12]">
              Your money has a purpose.
              <br />
              Your investment plan should too.
            </h2>
            <p className="mt-3.5 text-base text-slate-600 leading-relaxed font-normal">
              Investing without a milestone is merely reacting to daily headlines. We ground your capital around tangible destinations.
            </p>
          </Reveal>

          {/* Editorial Goal List (Hairline dividers, NO CARD BORDER, NO SHADOW) */}
          <div className="border-t border-slate-200 divide-y divide-slate-200">
            {FARCON_GOALS.map((goal, idx) => {
              const isHovered = hoveredGoalIndex === idx;
              return (
                <div
                  key={goal.id}
                  onMouseEnter={() => setHoveredGoalIndex(idx)}
                  onMouseLeave={() => setHoveredGoalIndex(null)}
                  onClick={() => navigate(`/goals/${goal.slug}` as RoutePath)}
                  className={`py-8 sm:py-10 transition-all duration-200 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isHovered ? 'bg-slate-50/70 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-xl' : ''
                  }`}
                >
                  {/* Left: Number + Goal Title */}
                  <div className="flex items-start sm:items-center gap-6 sm:gap-10 md:w-5/12">
                    <span className="text-xl sm:text-2xl font-mono font-medium text-slate-400 group-hover:text-[#7BA238] transition-colors">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-medium text-slate-900 group-hover:text-[#7BA238] transition-colors tracking-tight">
                        {goal.title}
                      </h3>
                      <span className="text-xs font-mono text-slate-400 block mt-1">
                        Timeline: {goal.typicalHorizon}
                      </span>
                    </div>
                  </div>

                  {/* Center: Curated Description */}
                  <div className="md:w-5/12 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p>{goal.description}</p>
                  </div>

                  {/* Right: Subdued Arrow Affordance */}
                  <div className="md:w-2/12 flex items-center md:justify-end gap-2 text-xs font-medium text-slate-900 group-hover:text-[#7BA238] transition-colors">
                    <span className="hidden sm:inline">Explore Journey</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — HOW FARCON WORKS (VERTICAL EDITORIAL TIMELINE, NO BOXES)
          ========================================================================= */}
      <section className="bg-[#FAF9F5] py-20 sm:py-28 border-y border-slate-200/90">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <Reveal className="max-w-2xl mb-16 sm:mb-20">
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#7BA238] block mb-2">
              DISCIPLINED PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-[-0.03em] leading-[1.12]">
              How Farcon Works
            </h2>
            <p className="mt-3.5 text-base text-slate-600 leading-relaxed">
              A clear, repeatable three-step advisory discipline to replace speculative confusion with quiet compounding.
            </p>
          </Reveal>

          {/* Vertical Editorial Timeline (No rounded boxes around steps) */}
          <div className="relative pl-8 sm:pl-16 border-l-2 border-slate-200 space-y-16 sm:space-y-24">
            {/* Step 01 */}
            <Reveal delayMs={0}>
              <div className="relative group">
                <div className="absolute -left-[41px] sm:-left-[73px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-[#7BA238]" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline">
                  <div className="lg:col-span-4">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-mono font-medium text-slate-300 block mb-2 group-hover:text-[#5B92D1] transition-colors">
                      01
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-medium text-slate-900 tracking-tight">
                      Understand your goals
                    </h3>
                  </div>
                  <div className="lg:col-span-8 space-y-2.5">
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                      Before recommending any mutual fund scheme or asset category, we quantify your target milestones, time horizons, cash flow surplus, and psychological comfort with market drawdowns.
                    </p>
                    <span className="text-xs font-mono text-slate-500 block">
                      Phase 1: Milestone Quantification & Suitability Profiling
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Step 02 */}
            <Reveal delayMs={100}>
              <div className="relative group">
                <div className="absolute -left-[41px] sm:-left-[73px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-[#5B92D1]" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline">
                  <div className="lg:col-span-4">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-mono font-medium text-slate-300 block mb-2 group-hover:text-[#7BA238] transition-colors">
                      02
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-medium text-slate-900 tracking-tight">
                      Build a clear plan
                    </h3>
                  </div>
                  <div className="lg:col-span-8 space-y-2.5">
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                      We design an asset allocation blueprint across suitable mutual fund categories and activate automated SIP mandates routed directly in your own name through official channels.
                    </p>
                    <span className="text-xs font-mono text-slate-500 block">
                      Phase 2: Asset Allocation Architecture & Direct Mandate Execution
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Step 03 */}
            <Reveal delayMs={200}>
              <div className="relative group">
                <div className="absolute -left-[41px] sm:-left-[73px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-slate-900" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline">
                  <div className="lg:col-span-4">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-mono font-medium text-slate-300 block mb-2 group-hover:text-slate-900 transition-colors">
                      03
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-medium text-slate-900 tracking-tight">
                      Review and stay on track
                    </h3>
                  </div>
                  <div className="lg:col-span-8 space-y-2.5">
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                      We review your portfolio trajectory periodically, rebalancing asset allocations calmly so you remain focused on your destination without succumbing to daily market noise.
                    </p>
                    <span className="text-xs font-mono text-slate-500 block">
                      Phase 3: Periodic Rebalancing & Trajectory Governance
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — SERVICES (HORIZONTAL EDITORIAL LIST, NO 2x3 CARD GRID)
          ========================================================================= */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#7BA238] block mb-2">
                PUBLISHED SERVICES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-[-0.03em] leading-[1.12]">
                Our Core Services
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-xl">
                Ground-level mutual fund distributor services executed with institutional clarity and transparency.
              </p>
            </div>

            <button
              onClick={() => navigate('/services')}
              className="text-xs font-medium text-slate-900 hover:text-[#7BA238] inline-flex items-center gap-2 self-start md:self-end group cursor-pointer"
            >
              <span>View All 6 Services</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>

          {/* Horizontal Editorial Rows */}
          <div className="border-t border-slate-200 divide-y divide-slate-200">
            {FARCON_SERVICES.slice(0, 6).map((service, idx) => {
              const isHovered = hoveredServiceIndex === idx;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setHoveredServiceIndex(idx)}
                  onMouseLeave={() => setHoveredServiceIndex(null)}
                  onClick={() => navigate(`/services/${service.slug}` as RoutePath)}
                  className={`py-7 sm:py-9 transition-all duration-200 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isHovered ? 'bg-slate-50/70 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-xl' : ''
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-6 md:w-5/12">
                    <span className="text-lg sm:text-xl font-mono font-medium text-slate-400 group-hover:text-[#7BA238] transition-colors">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-poppins font-medium text-slate-900 group-hover:text-[#7BA238] transition-colors">
                        {service.title}
                      </h3>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {service.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-5/12 text-xs text-slate-600 leading-relaxed">
                    <p className="line-clamp-2">{service.summary}</p>
                  </div>

                  <div className="md:w-2/12 flex items-center md:justify-end gap-2 text-xs font-medium text-slate-900 group-hover:text-[#7BA238] transition-colors">
                    <span className="hidden sm:inline">Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — FINANCIAL STUDIO (ONE COMPACT WORKSPACE, NO 4 CARDS)
          ========================================================================= */}
      <section className="bg-[#0B131E] text-white py-20 sm:py-28 border-y border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <Reveal className="max-w-2xl mb-12 sm:mb-16">
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#7BA238] block mb-2">
              FINANCIAL STUDIO
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-white tracking-[-0.03em] leading-[1.12]">
              Explore the numbers.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              Compounding projections to ground your financial aspirations in clarity and disciplined milestones.
            </p>
          </Reveal>

          {/* Single Surface Financial Studio: Left Selector + Right Interactive Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
            {/* Left Column: 4 Calculator Types */}
            <div className="lg:col-span-4 space-y-2.5">
              {[
                { id: 'sip', num: '01', title: 'SIP Compounding', desc: 'Monthly investment compounding over time' },
                { id: 'lumpsum', num: '02', title: 'Lumpsum Growth', desc: 'One-time capital deployed across cycles' },
                { id: 'goal', num: '03', title: 'Goal Target SIP', desc: 'Required monthly savings for future corpus' },
                { id: 'retirement', num: '04', title: 'Retirement Corpus', desc: 'Inflation-adjusted multi-decade security' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStudioTab(tab.id as any)}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-xl transition-colors cursor-pointer border ${
                    studioTab === tab.id
                      ? 'bg-[#131F31] border-slate-700 ring-1 ring-[#7BA238]/30'
                      : 'border-slate-800/80 hover:bg-[#131F31]/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-medium text-[#7BA238]">{tab.num}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Deterministic</span>
                  </div>
                  <h3 className="text-base font-poppins font-medium text-white mb-0.5">
                    {tab.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tab.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Right Column: Single Active Workspace */}
            <div className="lg:col-span-8 bg-[#131F31] p-6 sm:p-9 rounded-2xl border border-slate-800 space-y-7">
              {/* Sliders Area */}
              <div className="space-y-6">
                {/* Input 1: Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-slate-300 font-medium">
                      {studioTab === 'sip'
                        ? 'Monthly Investment (SIP)'
                        : studioTab === 'lumpsum'
                        ? 'One-Time Investment'
                        : studioTab === 'goal'
                        ? 'Target Goal Amount'
                        : 'Current Monthly Living Expense'}
                    </label>
                    <span className="text-base font-mono font-medium text-white">
                      {formatINR(studioAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={200000}
                    step={2500}
                    value={studioAmount}
                    onChange={(e) => setStudioAmount(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                  />
                </div>

                {/* Input 2: Rate & Tenure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="text-slate-300 font-medium">Illustrative Annual Return</label>
                      <span className="text-base font-mono font-medium text-[#7BA238]">
                        {studioRate}% p.a.
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={16}
                      step={0.5}
                      value={studioRate}
                      onChange={(e) => setStudioRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="text-slate-300 font-medium">Tenure Horizon</label>
                      <span className="text-base font-mono font-medium text-white">
                        {studioTenure} Years
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={30}
                      step={1}
                      value={studioTenure}
                      onChange={(e) => setStudioTenure(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#7BA238]"
                    />
                  </div>
                </div>
              </div>

              {/* Minimal SVG Growth Curve */}
              <div className="h-16 w-full bg-[#0B131E] rounded-xl p-2.5 border border-slate-800">
                <svg viewBox="0 0 400 50" fill="none" className="w-full h-full">
                  <path
                    d="M 10 44 C 120 42, 240 30, 390 8"
                    stroke="#7BA238"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="390" cy="8" r="4" fill="#7BA238" />
                  <path
                    d="M 10 44 L 390 8 L 390 50 L 10 50 Z"
                    fill="url(#studio-curve-fill)"
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="studio-curve-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7BA238" />
                      <stop offset="100%" stopColor="#7BA238" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Large Numbers Typography */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    {activeStudioResult.headlineLabel}
                  </span>
                  <div className="text-3xl sm:text-4xl font-poppins font-medium text-[#7BA238] tracking-tight">
                    <AnimatedNumber value={activeStudioResult.headlineValue} />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    {activeStudioResult.investedLabel}
                  </span>
                  <div className="text-xl sm:text-2xl font-poppins font-medium text-white">
                    {formatINR(activeStudioResult.investedValue, { compact: true })}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    {activeStudioResult.gainLabel}
                  </span>
                  <div className="text-xl sm:text-2xl font-poppins font-medium text-[#5B92D1]">
                    {activeStudioResult.isRate ? `${activeStudioResult.gainValue}%` : `+${formatINR(activeStudioResult.gainValue, { compact: true })}`}
                  </div>
                </div>
              </div>

              {/* Calculation Assumptions Drawer */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowStudioAssumptions(!showStudioAssumptions)}
                  className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5"
                >
                  <span>View Calculation Assumptions</span>
                  {showStudioAssumptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showStudioAssumptions && (
                  <div className="mt-3 p-4 bg-[#0B131E] rounded-xl border border-slate-800 space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Compounding Frequency:</span>
                      <span className="text-white">Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contribution Timing:</span>
                      <span className="text-white">Beginning of Month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inflation Assumption:</span>
                      <span className="text-white">6.0% p.a. (where applicable)</span>
                    </div>
                    <p className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80">
                      Illustrative calculation only. Actual investment outcomes may differ across market cycles and scheme categories.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={() => onOpenConsultation(`${studioTab.toUpperCase()} Planning Discussion`)}
                  className="px-6 py-3 text-xs font-medium text-[#0B131E] bg-[#7BA238] hover:bg-[#8EB942] rounded-md transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span>Structure This Plan With Farcon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate(`/calculators/${studioTab}` as RoutePath)}
                  className="px-4 py-3 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Open Full Dedicated Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — INVESTOR FIT EDITORIAL DIAGNOSTIC PREVIEW
          ========================================================================= */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="border border-slate-200 rounded-2xl p-8 sm:p-12 lg:p-14 bg-[#FAF9F5] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Editorial Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#7BA238] block">
                DIAGNOSTIC ASSESSMENT
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-[-0.03em] leading-[1.12]">
                Know where you stand before deciding where to invest.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                The Investor Fit assessment evaluates your personal risk comfort, time horizon, and behavioral reaction to market dips—grounding your plan in emotional suitability before any scheme is discussed.
              </p>

              {/* 5 Assessment Dimensions Rendered as Clean Unboxed Typography */}
              <div className="pt-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
                  5 Diagnostic Dimensions
                </span>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-700">
                  <span>01. Experience</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>02. Time Horizon</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>03. Risk Comfort</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>04. Goal</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>05. Financial Awareness</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/investor-quiz')}
                  className="px-7 py-3.5 text-xs font-medium text-white bg-[#0B131E] hover:bg-[#1E293B] rounded-md transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  <span>Take the Investor Fit</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7BA238]" />
                </button>
                <button
                  onClick={() => navigate('/investor-quiz')}
                  className="px-4 py-3.5 text-xs font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  See how it works
                </button>
              </div>
            </div>

            {/* Right: Question 01 / 08 Interactive Sample */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono pb-2.5 border-b border-slate-100 text-slate-500">
                <span className="text-[#7BA238] font-medium">01 / 08</span>
                <span>Experience Dimension</span>
              </div>
              <h3 className="text-base sm:text-lg font-poppins font-medium text-slate-900 leading-snug">
                How would you describe your familiarity with equity mutual funds?
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-normal flex items-center justify-between">
                  <span>A. First-time investor exploring options</span>
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
                <div className="p-3 rounded-lg border border-slate-900 bg-slate-50 text-slate-900 font-medium flex items-center justify-between">
                  <span>B. Running 1–3 SIPs currently</span>
                  <div className="w-2 h-2 rounded-full bg-[#7BA238]" />
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-normal flex items-center justify-between">
                  <span>C. Experienced across market cycles</span>
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
              </div>
              <div className="pt-1 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Takes ~3 minutes</span>
                <span>Zero sales push</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — PORTFOLIO REVIEW SPLIT LAYOUT
          ========================================================================= */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Atmospheric Architectural Quote */}
            <div className="lg:col-span-5 bg-[#0B131E] text-white p-8 sm:p-12 rounded-2xl border border-slate-800 space-y-6">
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#7BA238] block">
                PORTFOLIO CONSOLIDATION
              </span>
              <blockquote className="text-xl sm:text-2xl font-poppins font-medium text-slate-200 leading-relaxed italic">
                “True portfolio resilience comes not from collecting twenty different funds, but from eliminating redundancy, expense drag, and emotional churn.”
              </blockquote>
              <div className="pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                Farcon Wealth Portfolio Governance Principle
              </div>
            </div>

            {/* Right: Concrete Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#5B92D1] block">
                ALREADY INVESTING?
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-[-0.03em] leading-[1.12]">
                Make sure your portfolio still fits your goals.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                If you have accumulated mutual funds across multiple apps over the years, we perform a confidential overlap review to identify duplicate stock holdings, category imbalances, and expense drag.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/portfolio-review')}
                  className="px-7 py-3.5 text-xs font-medium text-white bg-[#0B131E] hover:bg-[#1E293B] rounded-md transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  <span>Request a Portfolio Review</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7BA238]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — FARCON AI ASSISTANT (QUIET, UNOBTRUSIVE)
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-[#FAF9F5] rounded-2xl border border-slate-200 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl space-y-2.5">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#7BA238]" />
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500">
                FARCON AI GUIDANCE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-poppins font-medium text-slate-900 leading-snug">
              Ask. Understand. Plan.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Have questions about SIP rupee-cost averaging, ELSS tax savings, or SWP monthly cash flows? Our knowledge assistant explains financial concepts without sales pressure.
            </p>
          </div>

          <button
            onClick={onOpenAI}
            className="px-6 py-3.5 text-xs font-medium text-white bg-[#0B131E] hover:bg-slate-800 rounded-md transition-colors shrink-0 flex items-center gap-2 shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <span>✦ Ask Farcon AI</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — EDUCATION / INSIGHTS (MAGAZINE COMPOSITION, NO 3-CARD CLONES)
          ========================================================================= */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#7BA238] block mb-2">
                EDITORIAL ESSAYS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-[-0.03em] leading-[1.12]">
                Investor Education
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-xl">
                First-principles thinking on market cycles, compounding, and behavioral sanity.
              </p>
            </div>

            <button
              onClick={() => navigate('/education')}
              className="text-xs font-medium text-slate-900 hover:text-[#7BA238] inline-flex items-center gap-2 self-start md:self-end group cursor-pointer"
            >
              <span>View All Essays</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>

          {/* Magazine Composition: 1 Large Feature Story + 2 Smaller Supporting Stories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Dominant Featured Story (7 cols) */}
            {BLOG_POSTS[0] && (
              <article
                onClick={() => navigate('/education')}
                className="lg:col-span-7 bg-[#FAF9F5] p-8 sm:p-11 rounded-2xl border border-slate-200 flex flex-col justify-between cursor-pointer group hover:border-slate-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="text-[#7BA238] font-medium uppercase">{BLOG_POSTS[0].category}</span>
                    <span>·</span>
                    <span>{BLOG_POSTS[0].readTime}</span>
                    <span>·</span>
                    <span>{BLOG_POSTS[0].publishedDate}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-medium text-slate-900 group-hover:text-[#7BA238] transition-colors leading-[1.15]">
                    {BLOG_POSTS[0].title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {BLOG_POSTS[0].excerpt}
                  </p>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">By {BLOG_POSTS[0].author}</span>
                  <span className="font-medium text-slate-900 group-hover:text-[#7BA238] inline-flex items-center gap-1.5">
                    Read Complete Essay <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            )}

            {/* 2 Supporting Stories (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {BLOG_POSTS.slice(1, 3).map((post) => (
                <article
                  key={post.id}
                  onClick={() => navigate('/education')}
                  className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 flex flex-col justify-between cursor-pointer group hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="text-[#5B92D1] font-medium">{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-poppins font-medium text-slate-900 group-hover:text-[#7BA238] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{post.publishedDate}</span>
                    <span className="font-medium text-slate-900 group-hover:text-[#7BA238] inline-flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11 — FULL-WIDTH DARK PREMIUM FINAL CTA
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <Reveal>
          <div className="bg-[#0B131E] text-white rounded-2xl p-10 sm:p-16 lg:p-20 border border-slate-800 text-center space-y-7">
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#7BA238] block">
              BEGIN YOUR QUIET COMPOUNDING JOURNEY
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-poppins font-medium max-w-3xl mx-auto tracking-[-0.03em] leading-[1.08]">
              Ready for a calmer investing approach?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
              Eliminate speculative noise. Align your savings with purpose, suitability, and transparent AMFI-registered execution.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onOpenConsultation('Homepage Final CTA')}
                className="px-7 py-3.5 text-xs font-medium text-[#0B131E] bg-[#7BA238] hover:bg-[#8EB942] rounded-md transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
              >
                Book a Free 15-Minute Call
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('purpose-goals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/goals');
                }}
                className="px-7 py-3.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Start with a Goal
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { RoutePath } from '@/types';
import { calculateGoalSIP } from '@/lib/calculations/financial';
import { formatINR } from '@/lib/formatting/currency';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle, ShieldCheck, Check } from 'lucide-react';

interface WealthPlannerViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (goalName?: string) => void;
}

export const WealthPlannerView: React.FC<WealthPlannerViewProps> = ({
  navigate,
  onOpenConsultation,
}) => {
  const [step, setStep] = useState(1);

  // Guided Data
  const [plannerData, setPlannerData] = useState({
    name: '',
    age: 32,
    goal: 'Retirement Independence',
    goalAmount: 15000000, // 1.5 Cr
    horizonYears: 15,
    existingSavings: 500000,
    monthlySurplus: 45000,
    assumedInflation: 6,
    assumedReturn: 12,
  });

  const nextStep = () => setStep((s) => Math.min(6, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  // Compute goal plan deterministically
  const goalCalculation = calculateGoalSIP(
    plannerData.goalAmount,
    plannerData.assumedReturn,
    plannerData.horizonYears,
    plannerData.assumedInflation,
    plannerData.existingSavings
  );

  const stepLabels = [
    'About You',
    'Your Goal',
    'Time Horizon',
    'Current Savings',
    'Planning Assumptions',
    'Planning Blueprint',
  ];

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
          Guided Diagnostic Experience
        </span>
        <h1 className="mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-tight">
          Farcon Wealth Planner Lite
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
          Structure your financial goals across 6 clear milestones. Eliminate emotional guesswork and see the exact monthly discipline required.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
          <span className="font-semibold text-slate-900">
            Step {step} of 6: {stepLabels[step - 1]}
          </span>
          <span className="font-mono text-[#78A832] font-bold">
            {Math.round((step / 6) * 100)}%
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#78A832] transition-all duration-300 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-12 lg:p-14">
        {/* Step 1: About You */}
        {step === 1 && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-[#315FCE] font-semibold block mb-1">
                STEP 01
              </span>
              <h2 className="text-xl sm:text-2xl font-poppins font-medium text-slate-900">
                Tell Us About Yourself
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your current life stage dictates appropriate investment compounding duration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Sen"
                  value={plannerData.name}
                  onChange={(e) => setPlannerData({ ...plannerData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-md border border-slate-300 focus:border-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Current Age</label>
                <input
                  type="number"
                  min={18}
                  max={75}
                  value={plannerData.age}
                  onChange={(e) => setPlannerData({ ...plannerData, age: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 text-xs rounded-md border border-slate-300 focus:border-slate-900 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-slate-700">
                  Estimated Monthly Surplus for Investing
                </label>
                <span className="text-sm font-semibold font-mono text-slate-900">
                  {formatINR(plannerData.monthlySurplus)}/mo
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={300000}
                step={5000}
                value={plannerData.monthlySurplus}
                onChange={(e) => setPlannerData({ ...plannerData, monthlySurplus: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#78A832]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Your Goal */}
        {step === 2 && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-[#315FCE] font-semibold block mb-1">
                STEP 02
              </span>
              <h2 className="text-xl sm:text-2xl font-poppins font-medium text-slate-900">
                Choose Your Primary Goal
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Every mutual fund allocation must serve a tangible life purpose.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Retirement Independence', desc: 'Secure lifetime post-work income with inflation shielding.' },
                { title: 'Child Higher Education', desc: 'Fund undergraduate or overseas university dreams.' },
                { title: 'Long-Term Wealth Creation', desc: 'Build generational net worth and financial freedom.' },
                { title: 'Home Purchase Down Payment', desc: 'Accumulate target equity corpus for property acquisition.' },
              ].map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => setPlannerData({ ...plannerData, goal: g.title })}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    plannerData.goal === g.title
                      ? 'border-[#101A2C] bg-slate-50 shadow-xs ring-1 ring-[#101A2C]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-900 block">{g.title}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">{g.desc}</span>
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-slate-700">Estimated Target Amount (in Today's Value)</label>
                <span className="text-sm font-semibold font-mono text-slate-900">{formatINR(plannerData.goalAmount)}</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={500000}
                value={plannerData.goalAmount}
                onChange={(e) => setPlannerData({ ...plannerData, goalAmount: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#78A832]"
              />
            </div>
          </div>
        )}

        {/* Step 3: Time Horizon */}
        {step === 3 && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-[#315FCE] font-semibold block mb-1">
                STEP 03
              </span>
              <h2 className="text-xl sm:text-2xl font-poppins font-medium text-slate-900">
                When Do You Need This Money?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Time horizon is the single most vital metric determining safe equity allocation.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-medium text-slate-700">Goal Timeline (Years)</label>
                <span className="text-lg font-bold font-mono text-[#78A832]">{plannerData.horizonYears} Years</span>
              </div>
              <input
                type="range"
                min={3}
                max={30}
                step={1}
                value={plannerData.horizonYears}
                onChange={(e) => setPlannerData({ ...plannerData, horizonYears: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#78A832]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                <span>3 Years</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Horizon Suitability:</strong> With a {plannerData.horizonYears}-year timeline, you have sufficient runway to benefit from equity compounding while navigating multiple market cycles.
            </div>
          </div>
        )}

        {/* Step 4: Current Savings */}
        {step === 4 && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-[#315FCE] font-semibold block mb-1">
                STEP 04
              </span>
              <h2 className="text-xl sm:text-2xl font-poppins font-medium text-slate-900">
                Existing Capital Earmarked
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Any savings already set aside directly lowers your required monthly SIP.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-medium text-slate-700">Current Dedicated Savings / Folios</label>
                <span className="text-sm font-semibold font-mono text-slate-900">{formatINR(plannerData.existingSavings)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5000000}
                step={50000}
                value={plannerData.existingSavings}
                onChange={(e) => setPlannerData({ ...plannerData, existingSavings: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#78A832]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                <span>₹0 (Starting Fresh)</span>
                <span>₹25 Lakhs</span>
                <span>₹50 Lakhs</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Planning Assumptions */}
        {step === 5 && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-[#315FCE] font-semibold block mb-1">
                STEP 05
              </span>
              <h2 className="text-xl sm:text-2xl font-poppins font-medium text-slate-900">
                Realistic Economic Assumptions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Farcon adheres to conservative, realistic modeling rather than unrealistic return promises.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Expected Inflation: <span className="font-mono">{plannerData.assumedInflation}%</span>
                </label>
                <input
                  type="range"
                  min={4}
                  max={9}
                  step={0.5}
                  value={plannerData.assumedInflation}
                  onChange={(e) => setPlannerData({ ...plannerData, assumedInflation: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#78A832]"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Indian long-term baseline ~6%</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Estimated Portfolio CAGR: <span className="font-mono">{plannerData.assumedReturn}%</span>
                </label>
                <input
                  type="range"
                  min={8}
                  max={15}
                  step={0.5}
                  value={plannerData.assumedReturn}
                  onChange={(e) => setPlannerData({ ...plannerData, assumedReturn: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#78A832]"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Diversified equity benchmark ~12%</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Planning Blueprint */}
        {step === 6 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832] font-mono">
                PLANNING BLUEPRINT
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-medium text-slate-900 mt-1">
                {plannerData.goal} Plan Summary
              </h2>
            </div>

            {/* Dominant Metric Box (Clean Light-First Surface) */}
            <div className="p-7 sm:p-8 bg-[#F2F6FB] text-[#17243A] rounded-2xl border border-[#DCE4EE] space-y-4 shadow-xs">
              <span className="text-xs text-[#52647D] block font-medium">
                Indicative Monthly SIP Required
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-[#78A832] tracking-tight">
                {formatINR(goalCalculation.requiredMonthlySIP)}/month
              </div>

              <div className="mt-6 pt-6 border-t border-[#DCE4EE] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#52647D] block text-[11px]">Today's Target</span>
                  <span className="font-mono font-medium text-[#17243A]">{formatINR(plannerData.goalAmount, { compact: true })}</span>
                </div>
                <div>
                  <span className="text-[#52647D] block text-[11px]">Future Target</span>
                  <span className="font-mono font-medium text-[#315FCE]">
                    {formatINR(goalCalculation.futureInflationAdjustedGoal, { compact: true })}
                  </span>
                </div>
                <div>
                  <span className="text-[#52647D] block text-[11px]">Horizon</span>
                  <span className="font-mono font-medium text-[#17243A]">{plannerData.horizonYears} Years</span>
                </div>
                <div>
                  <span className="text-[#52647D] block text-[11px]">Status</span>
                  <span className="font-mono font-medium text-[#78A832]">
                    {goalCalculation.requiredMonthlySIP <= plannerData.monthlySurplus
                      ? 'Within Surplus'
                      : 'Requires Step-up'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Next Suggested Action:</strong> Book a free consultation with Farcon Wealth. We will help you select the exact category blend (Flexi-Cap, Large-Cap, or Hybrid) and register the automated mandate directly in your own name.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onOpenConsultation(`${plannerData.goal} Blueprint Execution`)}
                className="px-6 py-3 text-xs font-semibold text-white bg-[#101A2C] hover:bg-slate-800 rounded-md transition-colors shadow-xs"
              >
                Book Free Consultation to Execute
              </button>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-5 py-3 text-xs font-medium text-slate-600 hover:text-slate-950 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Parameters</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Nav Buttons */}
        {step < 6 && (
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-6">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-[#101A2C] hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              <span>{step === 5 ? 'Review Blueprint' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

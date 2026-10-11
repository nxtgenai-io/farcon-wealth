import React from 'react';
import { FARCON_GOALS } from '@/content/goals/goalsData';
import { RoutePath } from '@/types';
import { ArrowRight, CheckCircle2, ShieldCheck, Target } from 'lucide-react';

interface GoalsViewProps {
  activeSlug?: string;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (goalName?: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  activeSlug,
  navigate,
  onOpenConsultation,
}) => {
  // If specific goal detail requested
  if (activeSlug) {
    const goal = FARCON_GOALS.find((g) => g.slug === activeSlug) || FARCON_GOALS[0];

    return (
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        <div className="border-b border-[var(--farcon-border)] pb-10">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <button onClick={() => navigate('/goals')} className="hover:text-[var(--farcon-text)]">
              Goals
            </button>
            <span>/</span>
            <span className="text-[var(--farcon-text)] font-medium">{goal.title}</span>
          </div>

          <span className="text-xs font-semibold tracking-wider uppercase text-[var(--farcon-primary)]">
            Purpose-Driven Capital
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-[var(--farcon-text)] tracking-tight">
            {goal.title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--farcon-text-muted)] max-w-2xl leading-relaxed">
            {goal.heroHeadline}
          </p>
          <p className="mt-4 text-xs sm:text-sm text-[var(--farcon-text-muted)] max-w-3xl leading-relaxed">
            {goal.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => onOpenConsultation(goal.title)}
              className="px-6 py-3 text-xs font-semibold text-white bg-[var(--farcon-navy)] hover:bg-slate-800 rounded-md transition-colors"
            >
              Start {goal.title} Planning
            </button>
            <button
              onClick={() => navigate(`/calculators/${goal.recommendedCalculator}` as RoutePath)}
              className="px-5 py-3 text-xs font-semibold text-[var(--farcon-text)] bg-[#EAF0F6] hover:bg-slate-200 rounded-md transition-colors"
            >
              Open Goal Calculator
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="farcon-card p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--farcon-text)] mb-4">
              Critical Considerations & Risks
            </h3>
            <ul className="space-y-3 text-xs text-[var(--farcon-text-muted)]">
              {goal.coreConsiderations.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="farcon-card p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--farcon-text)] mb-4">
              The Farcon Suitability Approach
            </h3>
            <ul className="space-y-3 text-xs text-[var(--farcon-text-muted)]">
              {goal.farconApproach.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--farcon-primary)] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action card */}
        <div className="bg-[var(--farcon-navy)] text-white p-8 rounded-xl border border-[var(--farcon-border-dark)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-poppins font-medium">
              Typical Horizon: {goal.typicalHorizon}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Begin by mapping your monthly cash flow with zero commitment.
            </p>
          </div>
          <button
            onClick={() => onOpenConsultation(goal.title)}
            className="px-6 py-3 text-xs font-semibold text-[var(--farcon-navy)] bg-[var(--farcon-primary)] hover:bg-[var(--farcon-primary-light)] rounded-md transition-colors"
          >
            Book Free Consultation
          </button>
        </div>
      </div>
    );
  }

  // Goals Hub Overview
  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--farcon-primary)]">
          Goal-Based Architecture
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-[var(--farcon-text)] tracking-tight">
          Your Money Has a Purpose. Your Investment Plan Should Too.
        </h1>
        <p className="mt-4 text-sm text-[var(--farcon-text-muted)] leading-relaxed">
          Investing without a defined goal is merely chasing market noise. Farcon roots every folio in a real-world destination.
        </p>
      </div>

      {/* Editorial Horizontal Goal List */}
      <div className="border-t border-[var(--farcon-border)] divide-y divide-[var(--farcon-border)]">
        {FARCON_GOALS.map((goal, idx) => (
          <div
            key={goal.id}
            onClick={() => navigate(`/goals/${goal.slug}` as RoutePath)}
            className="py-8 sm:py-10 transition-all duration-300 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#F7F9FC]/80 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-2xl"
          >
            <div className="flex items-start sm:items-center gap-6 sm:gap-8 md:w-5/12">
              <span className="text-xl sm:text-2xl font-mono text-slate-400 group-hover:text-[var(--farcon-primary)] transition-colors">
                0{idx + 1}
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-poppins font-medium text-[var(--farcon-text)] group-hover:text-[var(--farcon-primary)] transition-colors leading-snug">
                  {goal.title}
                </h2>
                <span className="text-xs font-mono text-slate-400 block mt-1">
                  Horizon: {goal.typicalHorizon}
                </span>
              </div>
            </div>

            <div className="md:w-5/12 text-xs sm:text-sm text-[var(--farcon-text-muted)] leading-relaxed">
              <p>{goal.description}</p>
            </div>

            <div className="md:w-2/12 flex items-center md:justify-end gap-3 text-xs font-semibold text-[var(--farcon-text)] group-hover:text-[var(--farcon-primary)] transition-colors">
              <span className="hidden sm:inline">Explore</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

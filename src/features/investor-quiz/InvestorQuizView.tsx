import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS, scoreQuiz, DIAGNOSTIC_DIMENSIONS, DiagnosticDimension } from './quizConfig';
import { RoutePath, LeadContext } from '@/types';
import { leadService } from '@/lib/api/leadService';
import { COMPLIANCE_REGISTRY } from '@/lib/compliance';
import { planningContextService } from '@/lib/planningContext';
import { analytics } from '@/lib/analytics';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Check,
  Clock,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface InvestorQuizViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (goalName?: string) => void;
}

export const InvestorQuizView: React.FC<InvestorQuizViewProps> = ({
  navigate,
  onOpenConsultation,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [quizConsent, setQuizConsent] = useState(false);
  const [quizPreference, setQuizPreference] = useState('');
  const [quizStartedAt] = useState(() => Date.now());
  const [leadPhone, setLeadPhone] = useState('');
  const [leadName, setLeadName] = useState('');
  const [savingLead, setSavingLead] = useState(false);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQ = QUIZ_QUESTIONS[currentStep];

  // Determine current active dimension from configurable DIAGNOSTIC_DIMENSIONS
  const activeDimension: DiagnosticDimension =
    DIAGNOSTIC_DIMENSIONS.find((dim) => dim.questionIds.includes(currentQ.id)) ||
    DIAGNOSTIC_DIMENSIONS[0];

  const handleSelectOption = (score: number) => {
    if (isTransitioning) return;
    const updated = { ...answers, [currentQ.id]: score };
    setAnswers(updated);
    analytics.track('quiz_question_answered', { questionId: currentQ.id, score });

    setTransitionDirection('next');
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep((s) => s + 1);
        setIsTransitioning(false);
      } else {
        const finalResult = scoreQuiz(updated);
        planningContextService.updatePlanningContext({
          quizScore: finalResult.totalScore,
          quizProfileTitle: finalResult.profile.title,
          quizCompletedAt: new Date().toISOString(),
        });
        analytics.track('quiz_completed', {
          totalScore: finalResult.totalScore,
          profile: finalResult.profile.title,
        });
        setSubmitted(true);
        setIsTransitioning(false);
      }
    }, 280);
  };

  const handlePrev = () => {
    if (currentStep > 0 && !isTransitioning) {
      setTransitionDirection('prev');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((s) => s - 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setSubmitted(false);
    setLeadCaptured(false);
  };

  // Keyboard shortcut listener for option selection (1, 2, 3)
  useEffect(() => {
    if (submitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3'].includes(e.key)) {
        const optionIndex = parseInt(e.key, 10) - 1;
        if (currentQ && currentQ.options[optionIndex]) {
          handleSelectOption(currentQ.options[optionIndex].score);
        }
      }
      if (e.key === 'ArrowLeft' && currentStep > 0) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, submitted, isTransitioning, currentQ]);

  const result = scoreQuiz(answers);

  // Personalized CTA determination based on quiz inputs
  const getPersonalizedGoalCTA = () => {
    const horizonScore = answers[2] || 2;
    const objectiveScore = answers[4] || 2;

    if (horizonScore === 3 && objectiveScore === 3) {
      return {
        label: 'Continue to Retirement Planning',
        route: '/goals/retirement' as RoutePath,
        calculator: '/calculators/retirement' as RoutePath,
        reason: 'Recommended for your 7+ year horizon and compounding goals.',
      };
    } else if (horizonScore === 2) {
      return {
        label: "Plan Your Child's Education",
        route: '/goals/child-education' as RoutePath,
        calculator: '/calculators/goal' as RoutePath,
        reason: 'Recommended for your medium-term milestone runway.',
      };
    } else if (objectiveScore === 1) {
      return {
        label: 'Explore Tax-Saving & Capital Preservation',
        route: '/goals/tax-saving' as RoutePath,
        calculator: '/calculators/sip' as RoutePath,
        reason: 'Recommended for capital preservation and essential buffers.',
      };
    }
    return {
      label: 'Explore Long-Term Wealth Creation',
      route: '/goals/wealth-creation' as RoutePath,
      calculator: '/calculators/sip' as RoutePath,
      reason: 'Recommended for disciplined goal-oriented compounding.',
    };
  };

  const personalizedCTA = getPersonalizedGoalCTA();

  const handleSaveResultWithConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || leadPhone.replace(/[^0-9]/g, '').length < 10) return;
    if (!quizConsent || !quizPreference) {
      setLeadError('Choose how we should reply, and tick consent, before sending.');
      return;
    }

    setSavingLead(true);
    setLeadError('');
    try {
      const payload: LeadContext = {
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: '',
        quizProfile: result.profile.title,
        quizScore: result.totalScore,
        source: 'Investor Fit Diagnostic Result',
        consent: quizConsent,
        contactPreference: quizPreference,
        formStartedAt: quizStartedAt,
      };
      const res = await leadService.submitLead(payload);
      if (!res.success) {
        setLeadError(res.message);
        return;
      }
      setLeadCaptured(true);
    } catch {
      setLeadError('We could not send this. Please message us on WhatsApp.');
    } finally {
      setSavingLead(false);
    }
  };

  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  return (
    <div className="pg quiz-page">
      <div className="pg-wrap">
      {!submitted && (
        <div className="quiz-page-title">
          <span className="hf-eye">Suitability diagnostic</span>
          <h1>Investor Fit Assessment</h1>
        </div>
      )}
      {!submitted ? (
        <div className="quiz-layout">
          <div className="quiz-rail pg-card">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Determine your objective risk capacity and optimal investment horizon before deploying capital.
            </p>

            {/* Diagnostic Metrics: Estimated Time & Overall Progress */}
            <div className="p-4 bg-white rounded-xl border border-[#DCE4EE] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-[#315FCE]" />
                  <span>Estimated Time: ~3 Minutes</span>
                </div>
                <span className="text-[#78A832] font-semibold">
                  Question {currentStep + 1} of {totalQuestions}
                </span>
              </div>

              {/* Smooth Progress Bar with Visible Green Indicator */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  className="bg-[#78A832] h-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Assessment Dimensions Rail (Configurable Dimensions) */}
            <div className="space-y-2.5 pt-1 quiz-dims">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Evaluation Framework
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {DIAGNOSTIC_DIMENSIONS.filter((dim) =>
                    dim.questionIds.some((qid) => answers[qid] !== undefined)
                  ).length} of {DIAGNOSTIC_DIMENSIONS.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {DIAGNOSTIC_DIMENSIONS.map((dim, idx) => {
                  const isCurrentDimension = dim.id === activeDimension.id;
                  const isCompletedDimension = dim.questionIds.every(
                    (qid) => answers[qid] !== undefined && qid < currentQ.id
                  );

                  return (
                    <div
                      key={dim.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrentDimension
                          ? 'bg-white border-[#78A832] text-slate-900 shadow-2xs'
                          : isCompletedDimension
                          ? 'bg-white/80 border-[#DCE4EE] text-slate-700'
                          : 'bg-transparent border-transparent text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                              isCurrentDimension
                                ? 'bg-[#78A832] text-white'
                                : isCompletedDimension
                                ? 'bg-[#E8F5E9] text-[#78A832]'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className={`text-xs ${
                              isCurrentDimension ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'
                            }`}
                          >
                            {dim.label}
                          </span>
                        </div>

                        {isCompletedDimension ? (
                          <Check className="w-3.5 h-3.5 text-[#78A832]" />
                        ) : isCurrentDimension ? (
                          <span className="text-[11px] font-semibold text-[#78A832]">
                            Current
                          </span>
                        ) : null}
                      </div>

                      {isCurrentDimension && (
                        <p className="text-[11px] text-slate-600 mt-1.5 pl-7 leading-relaxed">
                          {dim.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEPARATE LEGAL & REGULATORY DISCLOSURES */}
            <div className="pt-3 border-t border-[#DCE4EE] space-y-2 text-[11px] leading-relaxed">
              {/* Disclosure 1: AMFI Registration Disclosure */}
              <div className="p-3 bg-white rounded-xl border border-[#DCE4EE] text-slate-600 flex items-start gap-2.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#78A832] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold mb-0.5">
                    {COMPLIANCE_REGISTRY.quiz.distributorSeparateDisclosure}
                  </strong>
                  <span className="text-slate-500">
                    Registration ARN: 329006. Operating strictly under AMFI regulatory guidelines.
                  </span>
                </div>
              </div>

              {/* Disclosure 2: Educational Starting Point Notice */}
              <div className="p-3 bg-white rounded-xl border border-[#DCE4EE] text-slate-500 flex items-start gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {COMPLIANCE_REGISTRY.quiz.disclaimer}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CURRENT QUESTION INTERFACE */}
          <div className="quiz-q pg-card">
            <div>
              {/* Question Header & Micro Stepper */}
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="hf-eye">{activeDimension.label}</span>
                  <p className="quiz-progress-label">Question {currentStep + 1} of {totalQuestions}</p>
                  <div className="quiz-bar" aria-hidden="true"><i style={{ width: `${progressPercent}%` }} /></div>
                </div>

                {/* Subtle Dots & Line Stepper */}
                <div className="flex items-center justify-between gap-1 w-full pt-1">
                  {QUIZ_QUESTIONS.map((q, idx) => {
                    const isDone = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <React.Fragment key={q.id}>
                        <div
                          className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isDone
                              ? 'bg-[#78A832] text-white'
                              : isCurrent
                              ? 'bg-[#101A2C] ring-4 ring-slate-100'
                              : 'bg-slate-200'
                          }`}
                        >
                          {isDone && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        {idx < totalQuestions - 1 && (
                          <div
                            className={`flex-1 h-0.5 transition-colors ${
                              isDone ? 'bg-[#78A832]' : 'bg-slate-200'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Question Content (With Transition Animation) */}
              <div
                className={`space-y-6 pt-5 transition-all duration-300 ${
                  isTransitioning
                    ? transitionDirection === 'next'
                      ? 'opacity-0 -translate-x-5'
                      : 'opacity-0 translate-x-5'
                    : 'opacity-100 translate-x-0'
                }`}
              >
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-medium text-slate-900 leading-snug">
                    {currentQ.question}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                    {currentQ.context}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="space-y-3.5 pt-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentQ.id] === opt.score;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt.score)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all text-xs flex items-center justify-between gap-4 group cursor-pointer ${
                          isSelected
                            ? 'border-[#78A832] bg-[#E8F5E9]/30 shadow-2xs ring-1 ring-[#78A832]'
                            : 'border-[#DCE4EE] bg-white hover:border-slate-300 hover:bg-[#FAFBFC]'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <span
                            className={`text-xs font-bold w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#78A832] text-white'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-900 text-sm block">
                              {opt.label}
                            </span>
                            <span className="text-slate-600 leading-relaxed text-xs block">
                              {opt.description}
                            </span>
                          </div>
                        </div>

                        {/* Selection Check Indicator */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'border-[#78A832] bg-[#78A832] text-white'
                              : 'border-slate-300 group-hover:border-slate-400'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Question</span>
              </button>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                <span className="hidden sm:inline">Press [1, 2, 3] on keyboard or tap</span>
                <span>·</span>
                <span>Auto-advances</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PREMIUM FINAL RESULT PAGE (LIGHT-FIRST CARD) */
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-300">
          <div className="bg-white text-[#17243A] rounded-2xl border border-[#DCE4EE] shadow-xs p-8 sm:p-14 lg:p-16 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#DCE4EE]">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832] font-mono">
                  INVESTOR FIT DIAGNOSTIC · RESULT PROFILE
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium mt-2 tracking-tight text-slate-900">
                  {result.profile.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
                  {result.profile.tagline}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-950 transition-colors w-fit px-4 py-2.5 rounded-xl bg-[#F2F6FB] border border-[#DCE4EE] shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Retake Diagnostic</span>
              </button>
            </div>

            {/* Assessment Breakdown */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                  What This Profile Indicates
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {result.profile.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#F2F6FB] border border-[#DCE4EE]">
                  <span className="text-[11px] font-semibold text-[#315FCE] block mb-1 font-mono uppercase tracking-wide">
                    Recommended Horizon Runway
                  </span>
                  <span className="text-lg font-semibold font-mono text-slate-900 block mb-1">
                    {result.profile.recommendedHorizons}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A multi-year timeline allows compound growth to absorb temporary equity drawdowns.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F2F6FB] border border-[#DCE4EE]">
                  <span className="text-[11px] font-semibold text-[#78A832] block mb-1 font-mono uppercase tracking-wide">
                    Asset Allocation Philosophy
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {result.profile.assetAllocationPhilosophy}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 font-mono">
                  Contributing Factors from Your Diagnostic
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {result.profile.keyCharacteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#78A832] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* YOUR NEXT STEP (3 Explicit CTAs with Personalized Journey CTA) */}
            <div className="pt-8 border-t border-[#DCE4EE] space-y-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 block">
                YOUR NEXT STEP
              </span>
              <div className="flex flex-wrap gap-4">
                {/* Personalized Journey CTA */}
                <button
                  onClick={() => navigate(personalizedCTA.route)}
                  className="px-6 py-3.5 text-xs font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-md transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{personalizedCTA.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#78A832]" />
                </button>

                {/* Talk to Farcon */}
                <button
                  onClick={() => onOpenConsultation(`Discuss ${result.profile.title} Diagnostic`)}
                  className="px-6 py-3.5 text-xs font-semibold text-slate-800 bg-[#F2F6FB] hover:bg-slate-200/80 border border-[#DCE4EE] rounded-md transition-colors cursor-pointer"
                >
                  Talk to Farcon Advisor
                </button>

                {/* Use Calculator */}
                <button
                  onClick={() => navigate(personalizedCTA.calculator)}
                  className="px-5 py-3.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Use Financial Calculator
                </button>
              </div>
            </div>
          </div>

          {/* Quick Consultation Request Form (Groww-inspired clean white card) */}
          {!leadCaptured ? (
            <div className="bg-white rounded-2xl border border-[#DCE4EE] shadow-xs p-7 sm:p-9">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Save Your Profile & Request a 15-Minute Strategy Call
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Receive an institutional review from Farcon Wealth with zero sales push.
              </p>

              <form onSubmit={handleSaveResultWithConsultation} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="px-4 py-2.5 text-xs rounded-lg border border-[#DCE4EE] focus:border-slate-900 focus:outline-hidden bg-[#FAFBFC]"
                  required
                />
                <input
                  type="tel"
                  placeholder="10-Digit Mobile"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="px-4 py-2.5 text-xs rounded-lg border border-[#DCE4EE] focus:border-slate-900 focus:outline-hidden bg-[#FAFBFC]"
                  required
                />
                <select value={quizPreference} onChange={(e) => setQuizPreference(e.target.value)} className="px-4 py-2.5 text-xs rounded-lg border border-[#DCE4EE] bg-white" required>
                  <option value="">How should we reply?</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Call</option>
                </select>
                <label className="sm:col-span-3 flex items-start gap-2 text-[11px] text-slate-600">
                  <input type="checkbox" checked={quizConsent} onChange={(e) => setQuizConsent(e.target.checked)} />
                  <span>I agree Farcon may store this quiz result and reply about it. Read the <a href="/privacy">privacy policy</a>.</span>
                </label>
                <button
                  type="submit"
                  disabled={savingLead}
                  className="py-2.5 px-5 text-xs font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {savingLead ? 'Sending...' : 'Send to the Farcon team'}
                </button>
                {leadError && <p className="sm:col-span-3 text-[11px] text-red-700" role="alert">{leadError}</p>}
              </form>
            </div>
          ) : (
            <div className="p-5 bg-[#E8F5E9] rounded-2xl border border-[#C8E6C9] text-xs text-[#17243A] flex items-center gap-2.5 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-[#78A832] shrink-0" />
              <span>
                Your note is with the Farcon team. We will reply on {leadPhone}.
              </span>
            </div>
          )}

          {/* TWO EXPLICITLY SEPARATED REGULATORY NOTICES */}
          <div className="space-y-3">
            {/* Box 1: AMFI Distributor Identity */}
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#78A832] mt-0.5 shrink-0" />
              <div>
                <strong>{COMPLIANCE_REGISTRY.quiz.distributorSeparateDisclosure}</strong>
                <span className="text-slate-600 block mt-0.5">
                  Operating strictly under AMFI regulatory guidelines. Mutual Fund investments are subject to market risks; read all scheme related documents carefully.
                </span>
              </div>
            </div>

            {/* Box 2: Educational Starting Point (Distinct & Separate) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-500 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                {COMPLIANCE_REGISTRY.quiz.disclaimer}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

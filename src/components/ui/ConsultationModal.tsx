import React, { useState } from 'react';
import { leadService } from '@/lib/api/leadService';
import { LeadContext } from '@/types';
import { planningContextService } from '@/lib/planningContext';
import { analytics } from '@/lib/analytics';
import { X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledGoal?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  prefilledGoal = 'Retirement Planning',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    goal: prefilledGoal,
    investmentHorizon: '5–10 Years',
    monthlySavings: '₹10,000 – ₹25,000',
    notes: '',
    consent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [assignedLeadId, setAssignedLeadId] = useState('');

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.consent) {
      newErrors.consent = 'Consent is required to contact you regarding your investments.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const planningCtx = planningContextService.getPlanningContext();
      const payload: LeadContext = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        goal: formData.goal,
        investmentHorizon: formData.investmentHorizon,
        monthlySavings: formData.monthlySavings,
        notes: formData.notes.trim(),
        quizProfile: planningCtx.quizProfileTitle,
        quizScore: planningCtx.quizScore,
        plannerSummary: planningCtx.quizProfileTitle
          ? `User completed fit diagnostic: ${planningCtx.quizProfileTitle} (Score: ${planningCtx.quizScore})`
          : undefined,
        source: 'Consultation Modal',
        consent: formData.consent,
      };

      const res = await leadService.submitLead(payload);
      setAssignedLeadId(res.leadId);
      setSubmitted(true);
      analytics.track('consultation_submitted', {
        goal: formData.goal,
        hasQuizProfile: Boolean(planningCtx.quizProfileTitle),
      });
    } catch {
      setErrors({ form: 'An unexpected connection error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#DCE4EE] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#DCE4EE] bg-[#FAFBFC]">
          <div>
            <h3 id="consultation-modal-title" className="text-base font-semibold text-slate-900">
              Book a Free Financial Consultation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calm, confidential discussion with Farcon’s AMFI-registered advisory team.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-[#78A832]/10 text-[#78A832] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">
                Consultation Request Confirmed
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. A dedicated Farcon Wealth advisor will review your requested focus ({formData.goal}) and reach out calmly on <strong>{formData.phone}</strong>.
              </p>
              <div className="inline-block px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-500 font-mono">
                Reference ID: {assignedLeadId}
              </div>
              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#101A2C] rounded-md hover:bg-slate-800 transition-colors"
                >
                  Return to Exploration
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="p-3 text-xs bg-red-50 text-red-700 rounded-md border border-red-200">
                  {errors.form}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rajesh Sharma"
                  className={`w-full px-3 py-2 text-xs rounded-md border ${
                    errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-slate-900'
                  } focus:outline-hidden`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className={`w-full px-3 py-2 text-xs rounded-md border ${
                      errors.phone ? 'border-red-500' : 'border-slate-300 focus:border-slate-900'
                    } focus:outline-hidden`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className={`w-full px-3 py-2 text-xs rounded-md border ${
                      errors.email ? 'border-red-500' : 'border-slate-300 focus:border-slate-900'
                    } focus:outline-hidden`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Primary Goal
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 focus:outline-hidden bg-white"
                  >
                    <option value="Goal-Based SIP Planning">Goal-Based SIP Planning</option>
                    <option value="Portfolio Review & Consolidation">Portfolio Review & Consolidation</option>
                    <option value="Retirement Planning">Retirement Planning</option>
                    <option value="Child Education Fund">Child Education Fund</option>
                    <option value="ELSS / Tax Saving">ELSS / Tax Saving (80C)</option>
                    <option value="Systematic Withdrawal (SWP)">Systematic Withdrawal (SWP)</option>
                    <option value="General Mutual Fund Guidance">General Mutual Fund Guidance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Investment Horizon
                  </label>
                  <select
                    value={formData.investmentHorizon}
                    onChange={(e) => setFormData({ ...formData, investmentHorizon: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 focus:outline-hidden bg-white"
                  >
                    <option value="1–3 Years">1–3 Years (Near Term)</option>
                    <option value="3–5 Years">3–5 Years (Medium Term)</option>
                    <option value="5–10 Years">5–10 Years (Long Term)</option>
                    <option value="10+ Years">10+ Years (Retirement/Generational)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Specific Questions or Context <span className="text-slate-400">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Existing funds overlap, transitioning from fixed deposits, or starting first SIP"
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 focus:outline-hidden resize-none"
                />
              </div>

              {/* Regulatory Assurance Strip */}
              <div className="flex items-start gap-2.5 p-3 bg-[#F2F6FB] rounded-xl border border-[#DCE4EE] text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#78A832] shrink-0 mt-0.5" />
                <p>
                  Zero sales pressure. AMFI Registered (ARN: 229006). Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Securing Request...</span>
                  ) : (
                    <>
                      <span>Confirm Consultation Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

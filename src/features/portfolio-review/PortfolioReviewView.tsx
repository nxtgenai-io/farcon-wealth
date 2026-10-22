import React, { useState } from 'react';
import { RoutePath, LeadContext } from '@/types';
import { leadService } from '@/lib/api/leadService';
import { ShieldCheck, CheckCircle2, FileText, ArrowRight, Lock } from 'lucide-react';

interface PortfolioReviewViewProps {
  navigate: (path: RoutePath) => void;
}

export const PortfolioReviewView: React.FC<PortfolioReviewViewProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    approxPortfolioValue: '₹10 Lakhs – ₹25 Lakhs',
    estimatedFundCount: '8 – 15 Funds',
    primaryConcern: 'Too many duplicate funds & portfolio overlap',
    investorNotes: '',
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.replace(/[^0-9]/g, '').length < 10) return;

    setSubmitting(true);
    try {
      const payload: LeadContext = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        goal: 'Portfolio Review & Consolidation',
        notes: `Value: ${formData.approxPortfolioValue} | Count: ${formData.estimatedFundCount} | Concern: ${formData.primaryConcern}. Notes: ${formData.investorNotes}`,
        portfolioReviewRequested: true,
        source: 'Portfolio Review Dedicated Page',
        consent: formData.consent,
      };

      const res = await leadService.submitLead(payload);
      if (!res.success) return;
      setLeadId(res.leadId);
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
          Confidential Portfolio Diagnostic
        </span>
        <h1 className="mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-tight">
          Already Investing? Make Sure Your Portfolio Still Fits Your Goals.
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
          Over time, random tips and tax deadlines create an unwieldy collection of 15–25 mutual funds. We audit stock overlap, high expense ratios, and asset allocation to restore structural clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Editorial Guidance (Pale Blue-Grey Diagnostic Panel) */}
        <div className="lg:col-span-5 bg-[#F2F6FB] text-[#17243A] p-7 sm:p-9 rounded-2xl border border-[#DCE4EE] space-y-7 shadow-xs">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#315FCE]">
              The Farcon Diagnostic Process
            </h3>
            <p className="text-xs text-[#52647D] mt-1.5 leading-relaxed">
              We evaluate your Consolidated Account Statement (CAS) with institutional rigor.
            </p>
          </div>

          <div className="space-y-4 text-xs text-[#17243A]">
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#DCE4EE] shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-[#EDF3FF] border border-[#DCE4EE] flex items-center justify-center text-[10px] font-bold text-[#315FCE] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-[#17243A] block">Stock Overlap Audit</strong>
                <span className="text-[#52647D] text-[11px] leading-relaxed">Discover duplicate underlying holdings across multiple equity schemes.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#DCE4EE] shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-[#EDF3FF] border border-[#DCE4EE] flex items-center justify-center text-[10px] font-bold text-[#315FCE] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-[#17243A] block">Category Suitability</strong>
                <span className="text-[#52647D] text-[11px] leading-relaxed">Ensure your asset allocation matches your true retirement or education horizon.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#DCE4EE] shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-[#EDF3FF] border border-[#DCE4EE] flex items-center justify-center text-[10px] font-bold text-[#315FCE] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-[#17243A] block">Tax-Aware Consolidation</strong>
                <span className="text-[#52647D] text-[11px] leading-relaxed">Plan phased rebalancing without triggering avoidable capital gains taxation or exit loads.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DCE4EE] text-[11px] text-[#52647D] flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#78A832] shrink-0 mt-0.5" />
            <span>Strict confidentiality. Your statement data is evaluated strictly in-house and never shared.</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-2xl border border-[#DCE4EE] shadow-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-[#78A832]/10 text-[#78A832] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Portfolio Review Request Received
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our senior distributor team will contact you on <strong>{formData.phone}</strong> to guide you through securely sharing your CAMS/KFintech Consolidated Statement.
              </p>
              <div className="inline-block px-3 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                Reference ID: {leadId}
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#101A2C] rounded-md hover:bg-slate-800"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Approximate Portfolio Size
                  </label>
                  <select
                    value={formData.approxPortfolioValue}
                    onChange={(e) => setFormData({ ...formData, approxPortfolioValue: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 bg-white"
                  >
                    <option value="Under ₹10 Lakhs">Under ₹10 Lakhs</option>
                    <option value="₹10 Lakhs – ₹25 Lakhs">₹10 Lakhs – ₹25 Lakhs</option>
                    <option value="₹25 Lakhs – ₹75 Lakhs">₹25 Lakhs – ₹75 Lakhs</option>
                    <option value="₹75 Lakhs – ₹2 Crores">₹75 Lakhs – ₹2 Crores</option>
                    <option value="₹2 Crores+">₹2 Crores+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Number of Existing Funds
                  </label>
                  <select
                    value={formData.estimatedFundCount}
                    onChange={(e) => setFormData({ ...formData, estimatedFundCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 bg-white"
                  >
                    <option value="1 – 5 Funds">1 – 5 Funds</option>
                    <option value="6 – 10 Funds">6 – 10 Funds</option>
                    <option value="11 – 20 Funds">11 – 20 Funds</option>
                    <option value="More than 20 Funds">More than 20 Funds (High Clutter)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Area of Concern
                </label>
                <select
                  value={formData.primaryConcern}
                  onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 bg-white"
                >
                  <option value="Too many duplicate funds & portfolio overlap">Too many duplicate funds & portfolio overlap</option>
                  <option value="Underperforming schemes dragging down returns">Underperforming schemes dragging down returns</option>
                  <option value="Unsure if current funds match my retirement/child goal">Unsure if current funds match my retirement/child goal</option>
                  <option value="High expense ratios or confusing statements">High expense ratios or confusing statements</option>
                  <option value="General second opinion">General unbiased second opinion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.investorNotes}
                  onChange={(e) => setFormData({ ...formData, investorNotes: e.target.value })}
                  placeholder="Mention platform names (e.g. Zerodha Coin, Groww, CAMS, Bank RM) or specific concerns..."
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:border-slate-900 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Request Confidential Portfolio Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

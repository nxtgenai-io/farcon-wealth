import React from 'react';
import { FARCON_CONFIG } from '@/content/site/config';
import { RoutePath } from '@/types';
import { ShieldCheck, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ navigate, onOpenConsultation }) => {
  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20 space-y-16">
      {/* Editorial Headline */}
      <div className="border-b border-slate-200 pb-12 text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
          Our Philosophy
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-slate-900 tracking-tight leading-tight">
          Investing, Without the Noise.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
          Farcon Wealth Private Limited is an AMFI-registered Mutual Fund Distributor (ARN: 229006) established on the foundational belief that disciplined, calm compounding outperforms frantic financial speculation every single time.
        </p>
      </div>

      {/* The Farcon Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold font-mono text-[#315FCE] uppercase block mb-3">
            PRINCIPLE 01
          </span>
          <h2 className="text-lg font-poppins font-medium text-slate-900 mb-2">
            Clarity Over Complexity
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Financial jargon is often used to justify unnecessary churn. We explain mutual fund structures in plain human prose, ensuring you understand exactly what you own and why you own it.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold font-mono text-[#78A832] uppercase block mb-3">
            PRINCIPLE 02
          </span>
          <h2 className="text-lg font-poppins font-medium text-slate-900 mb-2">
            Suitability Before Returns
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Chasing the "top-performing scheme of last year" is a recipe for disappointment. We prioritize suitability—calibrating portfolio volatility against your exact timeline and emotional temperament.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold font-mono text-[#315FCE] uppercase block mb-3">
            PRINCIPLE 03
          </span>
          <h2 className="text-lg font-poppins font-medium text-slate-900 mb-2">
            Transparent Process
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name with institutional governance.
          </p>
        </div>
      </div>

      {/* Verified Corporate & Regulatory Details */}
      <div className="bg-[#101A2C] text-white p-8 sm:p-12 rounded-xl border border-[#20314F] space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78A832]">
            Regulatory Mandate
          </span>
          <h2 className="text-2xl font-poppins font-medium mt-1">
            Registered Mutual Fund Distributor
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block text-[11px]">Corporate Entity</span>
            <strong className="text-white text-sm block mt-0.5">{FARCON_CONFIG.legalName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">AMFI Registration Number</span>
            <strong className="text-white text-sm block mt-0.5">ARN: {FARCON_CONFIG.arn}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Registered Office</span>
            <span className="text-slate-300 block mt-0.5">{FARCON_CONFIG.registeredAddress}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Direct Official Contact</span>
            <a href={`mailto:${FARCON_CONFIG.email}`} className="text-[#315FCE] block mt-0.5 hover:underline">
              {FARCON_CONFIG.email}
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-[#20314F] flex flex-wrap gap-4 items-center justify-between">
          <p className="text-xs text-slate-400 max-w-xl">
            We partner with investors for decades across market cycles, helping families build enduring wealth quietly.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-6 py-2.5 text-xs font-semibold text-[#101A2C] bg-[#78A832] hover:bg-[#8EB942] rounded-md transition-colors"
          >
            Schedule a Confidential Discussion
          </button>
        </div>
      </div>
    </div>
  );
};

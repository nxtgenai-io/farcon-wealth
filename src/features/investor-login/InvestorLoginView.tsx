import React from 'react';
import { FARCON_CONFIG } from '@/content/site/config';
import { RoutePath } from '@/types';
import { Lock, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';

interface InvestorLoginViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: () => void;
}

export const InvestorLoginView: React.FC<InvestorLoginViewProps> = ({
  navigate,
  onOpenConsultation,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl border border-[#DCE4EE] shadow-xs p-8 sm:p-12 text-center">
        <div className="w-12 h-12 bg-[#F2F6FB] border border-[#DCE4EE] text-slate-900 rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xs">
          <Lock className="w-5 h-5 text-[#78A832]" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-[#78A832]">
          Client Access Portal
        </span>

        <h1 className="mt-2 text-2xl sm:text-3xl font-poppins font-semibold text-slate-900 tracking-tight">
          Existing Investor Login
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Farcon Wealth clients can securely access their consolidated mutual fund portfolio, statements, capital gains reports, and transaction history through our authorized client portal.
        </p>

        {/* Security & Official Channel Notice */}
        <div className="my-8 p-4 bg-[#F2F6FB] rounded-xl border border-[#DCE4EE] max-w-md mx-auto text-left text-xs text-slate-600 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#78A832] mt-0.5 shrink-0" />
            <span>
              <strong className="text-slate-800">Secure Infrastructure:</strong> Login credentials and two-factor authentication (2FA) are managed directly on the authorized client platform.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#315FCE] mt-0.5 shrink-0" />
            <span>
              <strong className="text-slate-800">Investor Custody:</strong> Farcon Wealth does not hold custody of your investment funds. All holdings remain officially registered under your PAN with official registrars (CAMS, KFintech) and respective AMCs.
            </span>
          </div>
        </div>

        {/* Primary Redirect Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={FARCON_CONFIG.investorLoginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Proceed to Secure Client Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-[#F2F6FB] hover:bg-slate-200/80 border border-[#DCE4EE] rounded-lg transition-colors cursor-pointer"
          >
            Need Help Accessing Your Account?
          </button>
        </div>

        {/* Support Note */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
          <span>First time logging in or forgot password? Contact Farcon Client Support at </span>
          <a href={`mailto:${FARCON_CONFIG.email}`} className="text-slate-900 font-semibold hover:underline">
            {FARCON_CONFIG.email}
          </a>
        </div>
      </div>
    </div>
  );
};

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="farcon-card shadow-sm p-8 sm:p-12 text-center">
        <div className="w-12 h-12 bg-[var(--farcon-navy)] text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-5 h-5 text-[var(--farcon-primary)]" />
        </div>

        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--farcon-primary)]">
          Client Access Portal
        </span>

        <h1 className="mt-2 text-2xl sm:text-3xl font-poppins font-medium text-[var(--farcon-text)] tracking-tight">
          Existing Investor Login
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-[var(--farcon-text-muted)] max-w-lg mx-auto leading-relaxed">
          Farcon Wealth clients can securely access their consolidated mutual fund portfolio, statements, capital gains reports, and transaction history through our authorized client portal.
        </p>

        {/* Security & Official Channel Notice */}
        <div className="my-8 p-4 bg-[var(--farcon-surface-soft)] rounded-lg border border-[var(--farcon-border)]/80 max-w-md mx-auto text-left text-xs text-[var(--farcon-text-muted)] space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[var(--farcon-primary)] mt-0.5 shrink-0" />
            <span>
              <strong>Secure Infrastructure:</strong> Login credentials and two-factor authentication (2FA) are managed directly on the authorized client platform.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[var(--farcon-secondary)] mt-0.5 shrink-0" />
            <span>
              <strong>Investor Custody:</strong> Farcon Wealth does not hold custody of your investment funds. All holdings remain officially registered under your PAN with official registrars (CAMS, KFintech) and respective AMCs.
            </span>
          </div>
        </div>

        {/* Primary Redirect Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={FARCON_CONFIG.investorLoginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[var(--farcon-navy)] hover:bg-[var(--farcon-navy-card)] rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Proceed to Secure Client Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[var(--farcon-text)] bg-[#EAF0F6] hover:bg-slate-200 rounded-md transition-colors"
          >
            Need Help Accessing Your Account?
          </button>
        </div>

        {/* Support Note */}
        <div className="mt-8 pt-6 border-t border-[var(--farcon-border)]/70 text-xs text-slate-500">
          <span>First time logging in or forgot password? Contact Farcon Client Support at </span>
          <a href={`mailto:${FARCON_CONFIG.email}`} className="text-[var(--farcon-text)] font-semibold hover:underline">
            {FARCON_CONFIG.email}
          </a>
        </div>
      </div>
    </div>
  );
};

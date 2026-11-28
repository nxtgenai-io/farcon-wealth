import React from 'react';
import { RoutePath } from '@/types';
import { COMPLIANCE_REGISTRY } from '@/lib/compliance';
import { FARCON_CONFIG } from '@/content/site/config';
import { ShieldCheck, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface MutualFundExplorerViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (fundName?: string) => void;
}

const EDUCATIONAL_CATEGORIES = [
  {
    name: 'Equity Categories',
    horizon: 'Long-term horizon (typically 5–7+ years)',
    role: 'Growth-oriented participation across Large Cap, Flexi Cap, and Mid Cap categories. Subject to short-term volatility.',
  },
  {
    name: 'Hybrid Categories',
    horizon: 'Medium to long-term horizon (3–5+ years)',
    role: 'Combines equity and debt allocations according to scheme mandate to moderate drawdown swings.',
  },
  {
    name: 'Debt & Liquid Categories',
    horizon: 'Short to medium horizon',
    role: 'Fixed-income categories focused on liquidity management and lower volatility relative to equities; subject to credit and interest-rate risks.',
  },
  {
    name: 'ELSS (Tax Saving)',
    horizon: 'Mandatory 3-year statutory lock-in per allotment',
    role: 'Equity-linked tax-saving category eligible under Section 80C (Old Tax Regime only, subject to prevailing law).',
  },
];

export const MutualFundExplorerView: React.FC<MutualFundExplorerViewProps> = ({
  navigate,
  onOpenConsultation,
}) => {
  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
          Category Overview · ARN {FARCON_CONFIG.arn}
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-poppins font-semibold text-slate-900 tracking-tight">
          Mutual Fund Categories &amp; Disclosures
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Farcon Wealth distributes Regular Plans only under AMFI ARN {FARCON_CONFIG.arn}. Scheme-level cards, NAVs, and performance tables are withheld until verified Regular Plan AMFI scheme codes, official SID/SAI/KIM links, current riskometer data, and AMC commission schedules are integrated.
        </p>

        <div className="mt-5 flex items-start gap-3 p-4 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <strong>Scheme Catalog Temporarily Unavailable (Non-Transactional):</strong> Live NAV feeds, scheme returns, and scheme-specific document links are not displayed here. Please refer directly to official AMFI or SEBI portals for scheme-level disclosures and latest NAVs.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {EDUCATIONAL_CATEGORIES.map((cat) => (
          <div key={cat.name} className="bg-white rounded-2xl border border-[#DCE4EE] p-6 flex flex-col justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0F3D2E]">{cat.horizon}</span>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{cat.name}</h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{cat.role}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenConsultation(`Discuss ${cat.name}`)}
              className="text-xs font-semibold text-[#0F3D2E] inline-flex items-center gap-1.5 hover:underline self-start"
            >
              <span>Discuss goal fit with our team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href="https://www.amfiindia.com/"
          target="_blank"
          rel="noreferrer"
          className="hf-btn hf-btn-outline"
        >
          Official AMFI India Portal <ExternalLink size={14} />
        </a>
        <a
          href="https://www.sebi.gov.in/filings/mutual-funds.html"
          target="_blank"
          rel="noreferrer"
          className="hf-btn hf-btn-outline"
        >
          SEBI Scheme Documents (SID / SAI / KIM) <ExternalLink size={14} />
        </a>
        <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/disclosures#commission' as RoutePath)}>
          Commission &amp; Regulatory Disclosures
        </button>
      </div>

      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs text-slate-600 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-[#0F3D2E]" />
          <span>{COMPLIANCE_REGISTRY.distributor.amfiRegistration}</span>
        </div>
        <p className="text-slate-600 pl-6">
          {COMPLIANCE_REGISTRY.scheme.disclaimer} {COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk}
        </p>
      </div>
    </div>
  );
};

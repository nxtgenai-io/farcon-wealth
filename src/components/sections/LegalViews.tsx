import React from 'react';
import { FARCON_CONFIG } from '@/content/site/config';
import { RoutePath } from '@/types';
import { ShieldCheck, Mail, MapPin } from 'lucide-react';

interface LegalViewProps {
  type: 'privacy' | 'terms' | 'disclosures' | 'grievance';
  navigate: (path: RoutePath) => void;
}

export const LegalViews: React.FC<LegalViewProps> = ({ type, navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-12 space-y-8">
        {type === 'disclosures' && (
          <>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
                Regulatory Disclosures
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-poppins font-medium text-slate-900">
                AMFI & Statutory Regulatory Disclosures
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Last updated: October 2026 · Pursuant to SEBI & AMFI Guidelines
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-6">
              <h3 className="text-sm font-semibold text-slate-900">1. Registration Status</h3>
              <p>
                {FARCON_CONFIG.legalName} is an AMFI-registered Mutual Fund Distributor with registration number <strong>ARN: {FARCON_CONFIG.arn}</strong>.
              </p>

              <h3 className="text-sm font-semibold text-slate-900">2. Nature of Service</h3>
              <p>
                Farcon acts as a mutual fund distributor. We provide information, category guidance, and execution facilitation in regular mutual fund schemes. Farcon does not offer Portfolio Management Services (PMS), Alternative Investment Funds (AIF), or direct equity brokerage.
              </p>

              <h3 className="text-sm font-semibold text-slate-900">3. Commission Disclosures</h3>
              <p>
                In accordance with SEBI circulars, Farcon receives standard distributor trail commissions from Asset Management Companies (AMCs) for mutual fund transactions executed through ARN: {FARCON_CONFIG.arn}. Commissions are paid directly by AMCs from the scheme expense ratios and are not separately billed to investors. Complete commission schedules for all schemes are available to clients upon request.
              </p>

              <h3 className="text-sm font-semibold text-slate-900">4. Risk Factor</h3>
              <p className="p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-900">
                <strong>Statutory Notice:</strong> Mutual fund investments are subject to market risks. Please read all scheme-related documents (Scheme Information Document, Statement of Additional Information, and Key Information Memorandum) carefully before investing. Past performance is not indicative of future returns.
              </p>

              <h3 className="text-sm font-semibold text-slate-900">5. Investor Funds Custody</h3>
              <p>
                Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name. All subscription and redemption funds move directly between the investor's verified bank account and the respective Asset Management Company.
              </p>
            </div>
          </>
        )}

        {type === 'grievance' && (
          <>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
                Investor Protection
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-poppins font-medium text-slate-900">
                Grievance Redressal Mechanism
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Prompt, transparent resolution of investor concerns.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-6">
              <p>
                At Farcon Wealth, client satisfaction and fair dealing are our highest priorities. If you have any grievance or service inquiry regarding your mutual fund investments, please follow the escalation matrix below:
              </p>

              <h3 className="text-sm font-semibold text-slate-900">Level 1: Farcon Client Support</h3>
              <p>
                You may write to our dedicated support desk with your folio details and description of the issue:
                <br />
                Email: <strong>{FARCON_CONFIG.email}</strong>
                <br />
                Address: {FARCON_CONFIG.registeredAddress}
                <br />
                Turnaround Time: We acknowledge all complaints within 24 business hours and aim to resolve them within 5 business days.
              </p>

              <h3 className="text-sm font-semibold text-slate-900">Level 2: Respective Asset Management Company (AMC) / Registrar</h3>
              <p>
                For technical folio issues, KYC updates, or bank mandate verifications, you may also directly contact the investor service centers of CAMS, KFintech, or the specific AMC managing your scheme.
              </p>

              <h3 className="text-sm font-semibold text-slate-900">Level 3: Regulatory Escalation (SEBI SCORES)</h3>
              <p>
                If your grievance remains unaddressed or you are dissatisfied with the response, you may lodge a complaint with SEBI through the SCORES portal at <strong>scores.gov.in</strong> or through the SEBI ODR portal.
              </p>
            </div>
          </>
        )}

        {type === 'privacy' && (
          <>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
                Confidentiality
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-poppins font-medium text-slate-900">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                How we protect and govern your financial and personal data.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-6">
              <p>
                Farcon Wealth Private Limited is committed to maintaining strict confidentiality of personal and financial information provided by visitors and clients.
              </p>
              <h3 className="text-sm font-semibold text-slate-900">Data Collection</h3>
              <p>
                We only collect information voluntarily submitted through consultation requests, calculators, or portfolio review forms (such as name, phone number, email, and stated investment goals).
              </p>
              <h3 className="text-sm font-semibold text-slate-900">Usage & Zero-Spam Policy</h3>
              <p>
                Your contact details are used exclusively to provide requested mutual fund guidance, schedule strategy calls, or process portfolio diagnostics. We never sell, rent, or lease client data to third-party telemarketers or credit agencies.
              </p>
            </div>
          </>
        )}

        {type === 'terms' && (
          <>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
                Terms & Conditions
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-poppins font-medium text-slate-900">
                Terms of Website Use
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Conditions governing access to Farcon Wealth digital tools.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-6">
              <p>
                By accessing this website, you agree to these terms. Content on this site is provided for educational and informational purposes. The calculators and tools produce illustrative projections based on standard mathematical compounding formulas and do not constitute guaranteed return forecasts.
              </p>
              <p>
                Users are encouraged to consult our AMFI-registered distributor team before committing financial capital.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

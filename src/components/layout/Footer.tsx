import React from 'react';
import { FarconLogo } from '@/components/ui/FarconLogo';
import { FARCON_CONFIG, SERVICE_NAV_ITEMS, GOAL_NAV_ITEMS, CALCULATOR_NAV_ITEMS } from '@/content/site/config';
import { RoutePath } from '@/types';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  navigate: (path: RoutePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[var(--farcon-navy)] text-slate-300 border-t border-[#1E2E45] pt-16 pb-12">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[var(--farcon-border-dark)]">
          {/* Brand & Regulatory Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="cursor-pointer inline-block"
              role="button"
              tabIndex={0}
            >
              <FarconLogo variant="horizontal" size="md" className="brightness-110" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Farcon Wealth Private Limited is an AMFI-registered Mutual Fund Distributor (ARN: 329006) dedicated to goal-based investing with clarity, suitability, and zero noise.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-[var(--farcon-primary)] shrink-0" />
                <span>{FARCON_CONFIG.registeredAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[var(--farcon-secondary)] shrink-0" />
                <a href={`mailto:${FARCON_CONFIG.email}`} className="hover:text-white transition-colors">
                  {FARCON_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--farcon-primary)] shrink-0" />
                <span>AMFI Registration ARN: <strong className="text-white">329006</strong></span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {SERVICE_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => navigate(item.href as RoutePath)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Goals & Calculators */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Goals & Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 mb-6">
              {GOAL_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => navigate(item.href as RoutePath)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Calculators
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {CALCULATOR_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => navigate(item.href as RoutePath)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Governance & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About Farcon
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/investor-quiz')} className="hover:text-white transition-colors">
                  Investor Fit Quiz
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/wealth-planner')} className="hover:text-white transition-colors">
                  Wealth Planner Lite
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/mutual-funds')} className="hover:text-white transition-colors">
                  Mutual Fund Explorer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclosures')} className="hover:text-white transition-colors">
                  Regulatory Disclosures
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/grievance')} className="hover:text-white transition-colors">
                  Grievance Redressal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclosure & Custody Statement */}
        <div className="pt-8 pb-4 text-[11px] leading-relaxed text-slate-500 border-b border-slate-900">
          <p className="mb-2">
            <strong className="text-slate-400">Statutory Regulatory Notice:</strong> Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing. Past performance is not an indicator of future returns.
          </p>
          <p>
            Farcon Wealth Private Limited is an AMFI-registered Mutual Fund Distributor (ARN: 329006). Farcon does not provide portfolio management services (PMS), alternative investment funds (AIF), or direct equity trading. Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Unboxed Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Farcon Wealth Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Investing, without the noise.</span>
            <span aria-hidden="true">·</span>
            <span>AMFI ARN 329006</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

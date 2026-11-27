import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Info, ShieldCheck } from 'lucide-react';
import { RoutePath } from '@/types';
import { FARCON_CONFIG } from '@/content/site/config';
import { COMPLIANCE_REGISTRY } from '@/lib/compliance';
import { Reveal } from '@/components/ui/Reveal';

interface FeaturedFundsSectionProps {
  navigate: (path: RoutePath) => void;
}

const CATEGORY_TABS = [
  'All Categories',
  'Equity',
  'Hybrid',
  'Debt',
  'Tax Saving (ELSS)',
] as const;

type CategoryTab = (typeof CATEGORY_TABS)[number];

interface CategoryCard {
  name: string;
  group: Exclude<CategoryTab, 'All Categories'>;
  horizon: string;
  riskLabel: string;
  role: string;
  note: string;
  href: RoutePath;
}

const CATEGORIES: CategoryCard[] = [
  {
    name: 'Flexi Cap & Large Cap Equity',
    group: 'Equity',
    horizon: 'Long-term horizon (5–7+ years)',
    riskLabel: 'Equity Market Risk',
    role: 'Designed for long-horizon wealth accumulation across diversified market capitalizations.',
    note: 'Subject to short-term equity market volatility; suitability depends on time horizon.',
    href: '/mutual-funds/equity' as RoutePath,
  },
  {
    name: 'Balanced Advantage & Hybrid',
    group: 'Hybrid',
    horizon: 'Medium to long-term horizon (3–5+ years)',
    riskLabel: 'Blended Equity & Debt Risk',
    role: 'Combines equity growth participation with fixed-income allocation per scheme mandate.',
    note: 'Asset mix varies by scheme category; still subject to market movement.',
    href: '/mutual-funds/hybrid' as RoutePath,
  },
  {
    name: 'Short Duration & Liquid Debt',
    group: 'Debt',
    horizon: 'Near-term to medium horizon (up to 3 years)',
    riskLabel: 'Interest Rate & Credit Risk',
    role: 'Fixed-income categories oriented toward liquidity management and relative stability.',
    note: 'Not risk-free; affected by interest-rate shifts and issuer credit quality.',
    href: '/mutual-funds/debt' as RoutePath,
  },
  {
    name: 'ELSS Tax Saver (Section 80C)',
    group: 'Tax Saving (ELSS)',
    horizon: 'Mandatory 3-year statutory lock-in',
    riskLabel: 'Equity Market Risk',
    role: 'Diversified equity schemes with Section 80C eligibility under the Old Tax Regime.',
    note: 'Tax benefit depends on the tax regime selected and prevailing tax law.',
    href: '/mutual-funds/elss' as RoutePath,
  },
];

export const FeaturedFundsSection: React.FC<FeaturedFundsSectionProps> = ({ navigate }) => {
  const [selectedTab, setSelectedTab] = useState<CategoryTab>('All Categories');

  const visibleCategories =
    selectedTab === 'All Categories'
      ? CATEGORIES
      : CATEGORIES.filter((item) => item.group === selectedTab);

  return (
    <Reveal as="section" className="hf-section" data-section="funds">
      <div className="hf-wrap hf-split">
        <div className="hf-funds-intro">
          <span className="hf-eye">Mutual Fund Categories · Regular Plans</span>
          <h2>
            Understand categories for your <em>goals.</em>
          </h2>
          <p className="hf-lede">
            Farcon Wealth distributes Regular Plans only under AMFI ARN {FARCON_CONFIG.arn}. Scheme-level cards, live NAVs, return tables, and SID/SAI/KIM links are withheld until verified Regular Plan AMFI scheme codes and official commission schedules are integrated.
          </p>
          <button
            type="button"
            className="hf-textlink hf-funds-all"
            onClick={() => navigate('/mutual-funds')}
          >
            Category Scope &amp; Official Sources <ArrowRight size={14} />
          </button>
        </div>

        <div className="hf-funds-stage">
          <div className="hf-funds-bar">
            <div className="hf-pills" role="tablist" aria-label="Filter mutual fund categories">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selectedTab === tab}
                  className={selectedTab === tab ? 'is-on' : ''}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {visibleCategories.map((cat) => (
              <article key={cat.name} className="hf-fund hf-fund-card">
                <div className="hf-fund-title-wrap">
                  <span className="hf-eye" style={{ marginBottom: 4 }}>{cat.group}</span>
                  <h3 className="hf-fund-title" style={{ minHeight: 'auto' }}>{cat.name}</h3>
                  <div className="hf-sub">{cat.horizon}</div>
                </div>
                <div className="hf-tags">
                  <span>{cat.riskLabel}</span>
                  <span>Regular Plan Scope</span>
                </div>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: '#3d4a42' }}>
                  {cat.role}
                </p>
                <p className="hf-note" style={{ margin: 0 }}>
                  {cat.note}
                </p>
                <div className="hf-fund-foot">
                  <button
                    type="button"
                    className="hf-fund-cta"
                    onClick={() => navigate(cat.href)}
                    aria-label={`View ${cat.name} category details`}
                  >
                    Category Overview <ArrowRight size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div
            className="pg-card"
            style={{
              padding: '16px 18px',
              background: '#fffdf8',
              borderColor: '#e4decb',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 13, color: '#243028' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: 2, color: '#0f3d2e' }} />
              <span>
                <strong>Individual Scheme Data Pending Verification:</strong> We do not display unverified NAVs, Direct Plans, or scheme rankings. Review official AMC/AMFI disclosures and our commission policy before making any investment decision.
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', fontSize: 12.5 }}>
              <button
                type="button"
                className="hf-textlink"
                onClick={() => navigate('/disclosures#commission' as RoutePath)}
              >
                <ShieldCheck size={14} /> Commission Disclosure Status
              </button>
              <a
                className="hf-textlink"
                href="https://www.amfiindia.com/"
                target="_blank"
                rel="noreferrer"
              >
                Official AMFI Portal <ExternalLink size={12} />
              </a>
              <a
                className="hf-textlink"
                href="https://www.sebi.gov.in/filings/mutual-funds.html"
                target="_blank"
                rel="noreferrer"
              >
                SEBI Scheme Documents (SID / SAI / KIM) <ExternalLink size={12} />
              </a>
            </div>
            <p className="hf-note" style={{ margin: 0 }}>
              {COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

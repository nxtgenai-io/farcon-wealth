import React from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ClipboardCheck,
  GraduationCap,
  Landmark,
  Layers,
  Receipt,
  Sprout,
  Target,
  TreePalm,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { RoutePath } from '@/types';
import { FARCON_CONFIG } from '@/content/site/config';
import { FARCON_SERVICES } from '@/content/services/servicesData';
import { AMC_WORDMARKS, SERVICE_GROUPS, SERVICE_LINES } from '@/content/services/serviceGroups';

const ICONS: Record<string, LucideIcon> = {
  'sip-planning': CalendarClock,
  'goal-based-planning': Target,
  retirement: TreePalm,
  'child-education': GraduationCap,
  'wealth-creation': Sprout,
  'mutual-fund-distribution': Landmark,
  lumpsum: Wallet,
  elss: Receipt,
  swp: ArrowDownToLine,
  'investment-solutions': Layers,
  'portfolio-review': ClipboardCheck,
};

const STROKE = 1.75;

interface ServiceShowcaseProps {
  navigate: (path: RoutePath) => void;
  /** full: heading, trust panel, cards, CTAs. cards: grouped cards. menu: compact grouped links. */
  variant?: 'full' | 'cards' | 'menu';
  heading?: 'h1' | 'h2';
}

const bySlug = new Map(FARCON_SERVICES.map((service) => [service.slug, service]));

export const ServiceShowcase: React.FC<ServiceShowcaseProps> = ({
  navigate,
  variant = 'full',
  heading = 'h2',
}) => {
  const go = (slug: string) => navigate(`/services/${slug}` as RoutePath);

  if (variant === 'menu') {
    return (
      <div className="svc-menu">
        {SERVICE_GROUPS.map((group) => (
          <div key={group.id} className="svc-menu-col">
            <p className="svc-kicker">{group.label}</p>
            {group.slugs.map((slug) => {
              const service = bySlug.get(slug);
              const Icon = ICONS[slug] ?? Target;
              if (!service) return null;
              return (
                <button key={slug} type="button" onClick={() => go(slug)}>
                  <span className="svc-ico" aria-hidden="true">
                    <Icon size={16} strokeWidth={STROKE} />
                  </span>
                  <span>{service.title}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  const Title = heading;

  return (
    <div className={`svc-show${variant === 'cards' ? ' is-cards' : ''}`}>
      {variant === 'full' && (
        <div className="svc-head">
          <div className="svc-intro">
            <span className="hf-eye">Services</span>
            <Title>Distribution, planned around a goal.</Title>
            <p className="hf-lede">
              Farcon Wealth is an AMFI-registered mutual fund distributor, ARN {FARCON_CONFIG.arn}. These are the conversations we have. We do not give investment advice.
            </p>
          </div>
          <aside className="svc-trust" aria-label="Registration and AMC partners">
            <div className="svc-badge">
              <span className="svc-ico" aria-hidden="true">
                <BadgeCheck size={20} strokeWidth={STROKE} />
              </span>
              <span>
                <strong>AMFI-registered</strong>
                <small>Mutual fund distributor · ARN {FARCON_CONFIG.arn}</small>
              </span>
            </div>
            <ul className="svc-chips">
              <li>Investments in your name</li>
              <li>Regular plans</li>
              <li>Commission disclosed</li>
            </ul>
            <p className="svc-kicker">AMC partners</p>
            <div className="svc-amc-fade">
              <ul className="svc-amc">
                {AMC_WORDMARKS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <p className="svc-amc-note">Logos are trademarks of their respective AMCs; shown to indicate funds we distribute.</p>
          </aside>
        </div>
      )}

      {SERVICE_GROUPS.map((group) => (
        <div key={group.id} className="svc-group">
          <p className="svc-kicker">{group.label}</p>
          <div className={`svc-grid${group.slugs.length === 5 ? ' is-five' : ''}${group.slugs.length === 1 ? ' is-one' : ''}`}>
            {group.slugs.map((slug) => {
              const service = bySlug.get(slug);
              const Icon = ICONS[slug] ?? Target;
              if (!service) return null;
              return (
                <button key={slug} type="button" className="svc-card" onClick={() => go(slug)}>
                  <span className="svc-ico" aria-hidden="true">
                    <Icon size={22} strokeWidth={STROKE} />
                  </span>
                  <span className="svc-card-copy">
                    <strong>{service.title}</strong>
                    <span>{SERVICE_LINES[slug] || service.tagline}</span>
                  </span>
                  <span className="svc-explore">
                    Explore <ArrowRight size={14} strokeWidth={STROKE} aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {variant === 'full' && (
        <div className="hf-cta-row svc-ctas">
          <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/start-investing')}>Start investing</button>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/portfolio-review')}>Request a portfolio review</button>
        </div>
      )}
    </div>
  );
};

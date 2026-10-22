import React from 'react';
import { FARCON_GOALS } from '@/content/goals/goalsData';
import { RoutePath } from '@/types';

interface GoalsViewProps {
  activeSlug?: string;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (goalName?: string) => void;
}

const IMAGES: Record<string, string> = {
  retirement: '/images/home/goal-retirement-1600.webp',
  'child-education': '/images/home/goal-education-1600.webp',
  'wealth-creation': '/images/home/goal-wealth-1600.webp',
  'tax-saving': '/images/home/goal-tax-1600.webp',
};

const RELATED: Record<string, { label: string; href: RoutePath }> = {
  retirement: { label: 'Retirement planning', href: '/services/retirement' },
  'child-education': { label: 'Child education', href: '/services/child-education' },
  'wealth-creation': { label: 'SIP planning', href: '/services/sip-planning' },
  'tax-saving': { label: 'ELSS / tax-saving', href: '/services/elss' },
};

export const GoalsView: React.FC<GoalsViewProps> = ({ activeSlug, navigate, onOpenConsultation }) => {
  if (activeSlug) {
    const goal = FARCON_GOALS.find((item) => item.slug === activeSlug) || FARCON_GOALS[0];
    const related = RELATED[goal.slug];
    return (
      <div className="pg">
        <div className="pg-wrap">
          <div className="breadcrumbs">
            <button type="button" onClick={() => navigate('/goals')}>Goals</button>
            <span aria-hidden="true">/</span>
            <span>{goal.title}</span>
          </div>
          <div className="page-hero split-hero">
            <div>
              <span className="hf-eye">Goal</span>
              <h1>{goal.title}</h1>
              <p className="lede">{goal.heroHeadline}</p>
              <p>{goal.description}</p>
              <p style={{ marginTop: 12 }}><span className="horizon">Horizon · {goal.typicalHorizon}</span></p>
              <div className="hf-cta-row" style={{ marginTop: 16 }}>
                <button type="button" className="hf-btn hf-btn-green" onClick={() => onOpenConsultation(goal.title)}>Talk about this goal</button>
                <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate(`/calculators/${goal.recommendedCalculator}` as RoutePath)}>
                  Open the calculator
                </button>
              </div>
            </div>
            <img src={IMAGES[goal.slug]} alt="" />
          </div>
          <div className="pg-grid cards">
            <article className="pg-card">
              <h2>Risks to keep in view</h2>
              <ul className="tick">{goal.coreConsiderations.map((item) => <li key={item}><i>✓</i><span>{item}</span></li>)}</ul>
            </article>
            <article className="pg-card">
              <h2>How Farcon approaches it</h2>
              <ul className="tick">{goal.farconApproach.map((item) => <li key={item}><i>✓</i><span>{item}</span></li>)}</ul>
            </article>
          </div>
          <article className="pg-card" style={{ marginTop: 18 }}>
            <span className="hf-eye">A short example</span>
            <p>
              A family with a {goal.typicalHorizon.toLowerCase()} horizon names the amount in today’s rupees, then looks at an illustrative monthly SIP. The calculator on this site uses stated assumptions. It is not a promise of what the market will do.
            </p>
            {related && (
              <button type="button" className="hf-textlink" onClick={() => navigate(related.href)}>Related service: {related.label} →</button>
            )}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Goals</span>
        <h1>Your money has a purpose.</h1>
        <p className="lede">Four destinations. Each one has a horizon, a conversation, and a calculator you can open before you book a call.</p>
        <div className="pg-grid goals">
          {FARCON_GOALS.map((goal) => (
            <button key={goal.id} type="button" className="pg-card goal-card" onClick={() => navigate(`/goals/${goal.slug}` as RoutePath)}>
              <img src={IMAGES[goal.slug]} alt="" />
              <div>
                <span className="horizon">{goal.typicalHorizon}</span>
                <h2>{goal.title}</h2>
                <p>{goal.description}</p>
                <span className="hf-textlink">Explore →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

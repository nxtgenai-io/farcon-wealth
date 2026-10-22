import React from 'react';
import { FARCON_SERVICES } from '@/content/services/servicesData';
import { BLOG_POSTS } from '@/content/blogs/blogData';
import { RoutePath } from '@/types';
import { FARCON_CONFIG } from '@/content/site/config';
import { NotFound } from '@/components/pages/NotFound';

interface ServicesViewProps {
  activeSlug?: string;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (serviceName?: string) => void;
}

const EYEBROW: Record<string, string> = {
  'sip-planning': 'SIP',
  'portfolio-review': 'Review',
  elss: 'Tax',
  retirement: 'Retirement',
  'child-education': 'Education',
  swp: 'Withdrawal',
  'mutual-fund-distribution': 'Distribution',
  lumpsum: 'Lump sum',
  'goal-based-planning': 'Planning',
  'wealth-creation': 'Wealth',
  'investment-solutions': 'Solutions',
};

const RELATED: Record<string, string> = {
  'sip-planning': 'why-sip-beats-market-timing',
  elss: 'demystifying-elss-tax-saving-beyond-80c',
  retirement: 'the-hidden-enemy-inflation-in-retirement',
  swp: 'the-hidden-enemy-inflation-in-retirement',
  'portfolio-review': 'portfolio-consolidation-trimming-the-foliage',
  'mutual-fund-distribution': 'the-mathematics-of-staying-calm',
  lumpsum: 'why-sip-beats-market-timing',
  'goal-based-planning': 'the-mathematics-of-staying-calm',
  'wealth-creation': 'why-sip-beats-market-timing',
  'investment-solutions': 'portfolio-consolidation-trimming-the-foliage',
  'child-education': 'the-mathematics-of-staying-calm',
};

const CALC_LABEL: Record<string, string> = {
  sip: 'SIP',
  lumpsum: 'Lumpsum',
  goal: 'Goal',
  retirement: 'Retirement',
};

const IMAGES: Record<string, string> = {
  'sip-planning': '/images/home/article-sip-800.webp',
  'portfolio-review': '/images/home/article-funds-800.webp',
  elss: '/images/home/goal-tax-800.webp',
  retirement: '/images/home/goal-retirement-800.webp',
  'child-education': '/images/home/goal-education-800.webp',
  swp: '/images/home/why-mountains-800.webp',
};

export const ServicesView: React.FC<ServicesViewProps> = ({ activeSlug, navigate, onOpenConsultation }) => {
  if (activeSlug) {
    const service = FARCON_SERVICES.find((item) => item.slug === activeSlug);
    if (!service) return <NotFound navigate={navigate} />;
    const article = BLOG_POSTS.find((post) => post.slug === RELATED[service.slug]);
    return (
      <div className="pg">
        <div className="pg-wrap">
          <div className="breadcrumbs">
            <button type="button" onClick={() => navigate('/services')}>Services</button>
            <span aria-hidden="true">/</span>
            <span>{service.title}</span>
          </div>
          <div className="page-hero split-hero">
            <div>
              <span className="hf-eye">Farcon service</span>
              <h1>{service.title}</h1>
              <p className="lede">{service.tagline}</p>
              <p>{service.summary}</p>
              <div className="hf-cta-row" style={{ marginTop: 16 }}>
                <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/start-investing')}>Start investing</button>
                <button type="button" className="hf-btn hf-btn-outline" onClick={() => onOpenConsultation(service.title)}>Book a consultation</button>
                {service.slug !== 'portfolio-review' && (
                  <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/portfolio-review')}>Portfolio review</button>
                )}
                <button
                  type="button"
                  className="hf-btn hf-btn-outline"
                  onClick={() => {
                    const path: RoutePath = service.slug === 'portfolio-review'
                      ? '/portfolio-review'
                      : `/calculators/${service.calculatorType}` as RoutePath;
                    navigate(path);
                  }}
                >
                  {service.slug === 'portfolio-review' ? 'Open the review form' : `Open the ${CALC_LABEL[service.calculatorType] || 'SIP'} calculator`}
                </button>
                <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/contact')}>Contact</button>
              </div>
            </div>
            <img src={IMAGES[service.slug] || IMAGES['sip-planning']} alt="" />
          </div>
          <div className="pg-grid cards">
            <article className="pg-card">
              <h2>What it covers</h2>
              <ul className="tick">{service.whatItIs.map((item) => <li key={item}><i>✓</i><span>{item}</span></li>)}</ul>
            </article>
            <article className="pg-card">
              <h2>Who it is for</h2>
              <ul className="tick">{service.whoItIsFor.map((item) => <li key={item}><i>✓</i><span>{item}</span></li>)}</ul>
            </article>
          </div>
          <h2 style={{ marginTop: 36 }}>How Farcon approaches it</h2>
          <div className="steps four">
            {service.howFarconApproaches.map((step) => (
              <article key={step.step} className="pg-card">
                <span className="step-num">{step.step}</span>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          {service.faqs.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h2>Common questions</h2>
              {service.faqs.map((faq) => (
                <details key={faq.question} className="acc">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          )}
          {article && (
            <p className="hf-note" style={{ marginTop: 20 }}>
              Related note: <button type="button" className="hf-textlink" onClick={() => navigate(`/blogs/${article.slug}` as RoutePath)}>{article.title}</button>
            </p>
          )}
          <p className="hf-note" style={{ marginTop: 12 }}>
            Related goal: <button type="button" className="hf-textlink" onClick={() => navigate(`/goals/${service.primaryGoalSlug}` as RoutePath)}>See the goal</button>
            {' '}· <button type="button" className="hf-textlink" onClick={() => navigate('/contact')}>Contact</button>
            {' '}· ARN {FARCON_CONFIG.arn}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Services</span>
        <h1>Goal-based mutual fund guidance</h1>
        <p className="lede">
          Farcon Wealth is an AMFI-registered Mutual Fund Distributor (ARN: {FARCON_CONFIG.arn}). Each service starts with a goal. Farcon distributes mutual funds. It does not hold the money and it does not give investment advice.
        </p>
        <div className="pg-grid services">
          {FARCON_SERVICES.map((service) => (
            <button key={service.id} type="button" className="pg-card svc" onClick={() => navigate(`/services/${service.slug}` as RoutePath)}>
              <img src={IMAGES[service.slug]} alt="" />
              <span className="hf-eye">{EYEBROW[service.slug] || 'Service'}</span>
              <h2>{service.title}</h2>
              <p className="svc-tagline">{service.tagline}</p>
              <p>{service.summary}</p>
              <span className="hf-textlink">View →</span>
            </button>
          ))}
        </div>
        <h2 style={{ marginTop: 40 }}>How a conversation goes</h2>
        <div className="steps four">
          {[
            ['01', 'The goal', 'What the money is for, and when you need it.'],
            ['02', 'The surplus', 'What can stay invested through a full cycle.'],
            ['03', 'The mix', 'Categories that fit the horizon. Not a product shelf.'],
            ['04', 'The review', 'A check when life or the market changes the plan.'],
          ].map(([n, title, text]) => (
            <article key={n} className="pg-card"><span className="step-num">{n}</span><h2>{title}</h2><p>{text}</p></article>
          ))}
        </div>
        <h2 style={{ marginTop: 36 }}>Common questions</h2>
        {FARCON_SERVICES.flatMap((service) => service.faqs.slice(0, 1)).map((faq) => (
          <details key={faq.question} className="acc">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

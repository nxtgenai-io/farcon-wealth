import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RoutePath } from '@/types';
import { FARCON_CONFIG } from '@/content/site/config';
import { BLOG_POSTS } from '@/content/blogs/blogData';
import { FAQ_ITEMS } from '@/content/faq/faqData';
import { LeadForm } from '@/components/pages/LeadForm';

interface PageProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (subject?: string) => void;
}

const whatsappHref = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;

const ARTICLE_IMAGES = [
  '/images/home/article-sip-800.webp',
  '/images/home/article-funds-800.webp',
  '/images/home/article-elss-800.webp',
  '/images/home/why-mountains-800.webp',
];

const ARTICLE_COVERS: Record<string, string> = {
  'the-mathematics-of-staying-calm': '/images/home/why-mountains-800.webp',
  'why-sip-beats-market-timing': '/images/home/article-funds-800.webp',
  'demystifying-elss-tax-saving-beyond-80c': '/images/home/svc-planning-800.webp',
  'the-hidden-enemy-inflation-in-retirement': '/images/home/goal-retirement-800.webp',
  'portfolio-consolidation-trimming-the-foliage': '/images/home/svc-wealth-800.webp',
};

const ARTICLE_SIZE = [
  { width: 800, height: 550 },
  { width: 800, height: 550 },
  { width: 800, height: 550 },
  { width: 800, height: 389 },
];

const COVER_SIZE: Record<string, { width: number; height: number }> = {
  'the-mathematics-of-staying-calm': { width: 800, height: 389 },
  'why-sip-beats-market-timing': { width: 800, height: 550 },
  'demystifying-elss-tax-saving-beyond-80c': { width: 800, height: 450 },
  'the-hidden-enemy-inflation-in-retirement': { width: 800, height: 550 },
  'portfolio-consolidation-trimming-the-foliage': { width: 800, height: 450 },
};

import fundBook from '@/content/funds/schemes.json';
import { FARCON_SERVICES } from '@/content/services/servicesData';
import { ServiceShowcase } from '@/components/sections/ServiceShowcase';
import { COMPLIANCE_REGISTRY } from '@/lib/compliance';

function VideoFacade({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <button type="button" className="yt-facade" aria-label={`Play ${title}`} onClick={() => setPlay(true)}>
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        width={480}
        height={360}
        onError={(event) => { (event.currentTarget as HTMLImageElement).src = '/images/home/article-funds-800.webp'; }}
      />
      <span aria-hidden="true">Play</span>
    </button>
  );
}

export const AboutPage: React.FC<PageProps> = ({ onOpenConsultation, navigate }) => (
  <div className="pg">
    <div className="pg-wrap">
      <div className="page-hero split-hero">
        <div>
          <span className="hf-eye">About Us</span>
          <h1>A distributor with a planning desk.</h1>
          <p className="lede">
            {FARCON_CONFIG.legalName} is an AMFI-registered mutual fund distributor, ARN {FARCON_CONFIG.arn}. We help families in and beyond Patna decide what the money is for, then use mutual funds only where they fit.
          </p>
        </div>
        <img src="/images/home/why-mountains-1440.webp" alt="A mountain ridge at sunset" width={1440} height={700} />
      </div>
      <h2>Why Farcon Wealth</h2>
      <div className="pg-grid cards three">
        <article className="pg-card"><span className="hf-eye">Goals first</span><h2>The date before the scheme</h2><p>A goal, a horizon and a surplus come before any fund name.</p></article>
        <article className="pg-card"><span className="hf-eye">In your name</span><h2>We do not hold the money</h2><p>Purchases sit with the AMC, the exchange and the registrar.</p></article>
        <article className="pg-card"><span className="hf-eye">ARN {FARCON_CONFIG.arn}</span><h2>A registered distributor</h2><p>Farcon Wealth is not a portfolio manager and does not promise returns.</p></article>
      </div>
      <div className="svc-about">
        <ServiceShowcase variant="cards" navigate={navigate} />
      </div>
      <h2 style={{ marginTop: 36 }}>How we work</h2>
      <div className="steps four">
        {[
          ['01', 'Listen', 'The goal, the date and what you can leave invested.'],
          ['02', 'Fit', 'A category mix that matches the horizon, not the headline.'],
          ['03', 'In your name', 'The folio is yours. Farcon Wealth does not keep the money.'],
          ['04', 'Review', 'A calm look when the goal or the surplus changes.'],
        ].map(([n, title, text]) => (
          <article key={n} className="pg-card">
            <span className="step-num">{n}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="split" style={{ marginTop: 36 }}>
        <article className="pg-card">
          <span className="hf-eye">Visit</span>
          <h2>Patna</h2>
          <p>{FARCON_CONFIG.registeredAddress}</p>
          <p>{FARCON_CONFIG.hours}</p>
          <p><a href={`mailto:${FARCON_CONFIG.email}`} style={{ color: 'inherit' }}>{FARCON_CONFIG.email}</a></p>
          <div style={{ margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {FARCON_CONFIG.phoneNumbers.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: '#0f3d2e', fontWeight: 600, textDecoration: 'none' }}>
                {phone}
              </a>
            ))}
          </div>
          <a className="hf-btn hf-btn-outline" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </article>
        <article className="pg-card">
          <span className="hf-eye">Mission</span>
          <h2>Investing, without the noise.</h2>
          <p>We would rather a smaller, suitable plan that you can stay with than a larger one you abandon in a bad year.</p>
          <button type="button" className="hf-btn hf-btn-green" onClick={() => onOpenConsultation('About Farcon Wealth')}>Book a Consultation</button>
        </article>
      </div>
    </div>
  </div>
);

export const ServicesPage: React.FC<PageProps> = ({ onOpenConsultation }) => (
  <div className="pg">
    <div className="pg-wrap">
      <span className="hf-eye">Our Services</span>
      <h1>What we actually do.</h1>
      <p className="lede">The work starts with a goal, a horizon and a conversation.</p>
      <button type="button" className="hf-btn hf-btn-green" onClick={() => onOpenConsultation('Services')}>Book a Consultation</button>
    </div>
  </div>
);

export const FundsPage: React.FC<{ navigate: (path: RoutePath) => void; categorySlug?: string; schemeSlug?: string }> = ({ navigate, categorySlug, schemeSlug }) => {
  const category = fundBook.categories.find((item) => item.slug === categorySlug);
  const scheme = category?.schemes.find((item) => item.slug === schemeSlug);
  if (categorySlug && !category) return null;
  if (schemeSlug && category && !scheme) return null;

  if (scheme && category) {
    return (
      <div className="pg">
        <div className="pg-wrap">
          <div className="breadcrumbs">
            <button type="button" onClick={() => navigate('/mutual-funds')}>Mutual funds</button>
            <span aria-hidden="true">/</span>
            <button type="button" onClick={() => navigate(`/mutual-funds/${category.slug}` as RoutePath)}>{category.name}</button>
            <span aria-hidden="true">/</span>
            <span>{scheme.name}</span>
          </div>
          <span className="hf-eye">Regular Plan Scope · ARN {FARCON_CONFIG.arn}</span>
          <h1>{scheme.name}</h1>
          <p className="lede">{scheme.amc} · {scheme.subCategory}. Educational category overview only.</p>
          <article className="pg-card" style={{ marginTop: 16 }}>
            <div className="hf-amc" style={{ marginBottom: 12 }}>
              <img className="hf-logo" src={scheme.logo} alt={`${scheme.amc} mark`} width={36} height={36} />
              <div>
                <h2>Scheme Data Pending Regular Plan Verification</h2>
                <div className="hf-sub">Category: {scheme.subCategory} · Horizon: {scheme.horizon}</div>
              </div>
            </div>
            <p>
              Farcon Wealth distributes Regular Plans only under AMFI ARN {FARCON_CONFIG.arn}. Scheme-level NAVs, returns, current riskometer grades, verified Regular Plan AMFI codes, official SID/SAI/KIM document links, and AMC commission schedules are temporarily withheld here until verified against official AMFI and AMC records.
            </p>
            <p className="hf-note" style={{ marginTop: 10 }}>
              {COMPLIANCE_REGISTRY.scheme.disclaimer}
            </p>
            <p className="hf-note" style={{ marginTop: 8 }}>
              <strong>{COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk}</strong>
            </p>
          </article>
          <div className="hf-cta-row" style={{ marginTop: 16 }}>
            <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/disclosures#commission' as RoutePath)}>Commission &amp; Regulatory Disclosures</button>
            <a className="hf-btn hf-btn-outline" href="https://www.amfiindia.com/" target="_blank" rel="noreferrer">Official AMFI Portal</a>
            <a className="hf-btn hf-btn-outline" href="https://www.sebi.gov.in/filings/mutual-funds.html" target="_blank" rel="noreferrer">SEBI SID / SAI / KIM Filings</a>
            <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/sip')}>SIP calculator</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Mutual Funds · Regular Plans Only (ARN {FARCON_CONFIG.arn})</span>
        <h1>{category ? `${category.name} Category` : 'Mutual fund categories and disclosures'}</h1>
        <p className="lede">
          {category
            ? category.summary
            : 'Understand mutual fund categories by horizon and risk characteristics. Scheme-level NAVs, performance figures, and transaction cards are withheld pending verified Regular Plan AMFI codes, current riskometer data, SID/SAI/KIM links, and commission schedules.'}
        </p>

        <div className="hf-pills" style={{ margin: '18px 0' }}>
          <button type="button" className={!category ? 'is-on' : ''} onClick={() => navigate('/mutual-funds')}>All Categories</button>
          {fundBook.categories.map((item) => (
            <button key={item.slug} type="button" className={category?.slug === item.slug ? 'is-on' : ''} onClick={() => navigate(`/mutual-funds/${item.slug}` as RoutePath)}>{item.name}</button>
          ))}
        </div>

        <article className="pg-card" style={{ marginBottom: 18, background: '#fffdf8', borderColor: '#dfd6c2' }}>
          <span className="hf-eye">Status Notice · Non-Transactional</span>
          <h2>Scheme Catalog Temporarily Withheld for Regulatory Verification</h2>
          <p>
            Under AMFI guidelines, an AMFI-registered Mutual Fund Distributor cannot offer Direct Plans for distributed client relationships and must provide verified Regular Plan identifiers alongside prominent commission-rate links and official Scheme Information Document (SID), Statement of Additional Information (SAI), and Key Information Memorandum (KIM) links. Until each scheme mapping, riskometer feed, and approved AMC commission schedule is finalized by Farcon Wealth, scheme-level cards and historical NAV/CAGR figures are intentionally omitted.
          </p>
          <div className="hf-cta-row" style={{ marginTop: 12 }}>
            <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/disclosures#commission' as RoutePath)}>View Commission Disclosure Policy</button>
            <a className="hf-btn hf-btn-outline" href="https://www.amfiindia.com/" target="_blank" rel="noreferrer">Official AMFI NAV &amp; Scheme Data</a>
            <a className="hf-btn hf-btn-outline" href="https://www.sebi.gov.in/filings/mutual-funds.html" target="_blank" rel="noreferrer">SEBI Mutual Fund Filings</a>
          </div>
        </article>

        <div className="pg-grid cards">
          {(category ? [category] : fundBook.categories).map((cat) => (
            <article key={cat.slug} className="pg-card">
              <span className="hf-eye">Category</span>
              <h2>{cat.name}</h2>
              <p>{cat.summary}</p>
              <p className="hf-note" style={{ marginTop: 8 }}>
                Distribution scope: Regular Plans via AMCs empanelled with ARN {FARCON_CONFIG.arn}. Investors may also consider alternatives not offered by Farcon Wealth.
              </p>
              <div className="hf-cta-row" style={{ marginTop: 12 }}>
                {!category && (
                  <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate(`/mutual-funds/${cat.slug}` as RoutePath)}>
                    Category details
                  </button>
                )}
                <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/start-investing')}>
                  Regular Plan enquiry
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="hf-note" style={{ marginTop: 18 }}>{COMPLIANCE_REGISTRY.scheme.disclaimer}</p>
        <p className="hf-note"><strong>{COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk}</strong></p>
        <div className="hf-cta-row" style={{ marginTop: 12 }}>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/sip')}>SIP calculator</button>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/lumpsum')}>Lumpsum calculator</button>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/disclosures#commission' as RoutePath)}>Commission disclosures</button>
        </div>
      </div>
    </div>
  );
};

export const ArticlePage: React.FC<PageProps & { slug: string }> = ({ navigate, slug }) => {
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) return null;
  const related = BLOG_POSTS.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 2);
  const more = related.length ? related : BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 2);
  const service = FARCON_SERVICES.find((item) => item.title.toLowerCase().includes(post.category.toLowerCase().split(' ')[0])) || FARCON_SERVICES[0];
  return (
    <div className="pg">
      <div className="pg-wrap" style={{ maxWidth: 760 }}>
        <div className="breadcrumbs">
          <button type="button" onClick={() => navigate('/blogs')}>Notes</button>
          <span aria-hidden="true">/</span>
          <span>{post.category}</span>
        </div>
        <span className="hf-eye">{post.category} · {post.readTime} · {post.publishedDate}</span>
        <h1>{post.title}</h1>
        <img className="article-cover" src={ARTICLE_COVERS[post.slug] || ARTICLE_IMAGES[0]} alt={post.title} width={(COVER_SIZE[post.slug] || ARTICLE_SIZE[0]).width} height={(COVER_SIZE[post.slug] || ARTICLE_SIZE[0]).height} loading="lazy" decoding="async" />
        <p className="lede">{post.excerpt}</p>
        <div className="article-prose">
          {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <p className="hf-note">Educational note from an AMFI-registered mutual fund distributor (ARN {FARCON_CONFIG.arn}). Not investment advice and not a scheme recommendation. {COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk}</p>
        <h2>Related</h2>
        <div className="related-notes">
          {more.map((item) => (
            <button key={item.id} type="button" className="pg-card" onClick={() => navigate(`/blogs/${item.slug}` as RoutePath)}>
              <span className="hf-eye">{item.category} · {item.readTime}</span>
              <h2>{item.title}</h2>
              <p>{item.excerpt}</p>
            </button>
          ))}
        </div>
        <div className="hf-cta-row" style={{ marginTop: 16 }}>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate(`/services/${(ARTICLE_SERVICE[post.category] || service.slug)}` as RoutePath)}>Related service</button>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/sip')}>SIP calculator</button>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/faq')}>FAQs</button>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, datePublished: post.publishedDate, description: post.seoDescription, author: { '@type': 'Organization', name: 'Farcon Wealth' } }) }} />
      </div>
    </div>
  );
};

export const StartInvestingPage: React.FC = () => (
  <div className="pg">
    <div className="pg-wrap split">
      <div>
        <span className="hf-eye">Regular Plan Distribution Enquiry</span>
        <h1>Tell us the goal, then the amount.</h1>
        <p className="lede">This is a Regular Plan mutual fund distribution enquiry under AMFI ARN {FARCON_CONFIG.arn}. It is separate from a general consultation and does not place any order online.</p>
        <p className="hf-note">Investments are held in your own name with the respective AMC/registrar. You can also <a href={whatsappHref} target="_blank" rel="noreferrer">message us on WhatsApp</a> or review our <a href="/disclosures#commission">commission disclosures</a>.</p>
      </div>
      <LeadForm form="Start Investing" submitLabel="Send the investing enquiry" showPreferences requireGoal />
    </div>
  </div>
);

export const PortfolioPage: React.FC = () => (
  <div className="pg">
    <div className="pg-wrap split">
      <div className="portfolio-aside">
        <span className="hf-eye">Portfolio Review</span>
        <h1>Tell us the goal before the scheme.</h1>
        <p className="lede">Share enough for a first conversation. This form does not place an order and does not upload a CAS.</p>
        <article className="pg-card">
          <span className="hf-eye">What happens next</span>
          <h2>A first look, then a call.</h2>
          <ol className="tick">
            <li><i>1</i><span>We read the note and reply on the contact you gave.</span></li>
            <li><i>2</i><span>A short call covers the goal, the horizon and what you already hold.</span></li>
            <li><i>3</i><span>Any investment stays in your name with the AMC or the registrar.</span></li>
          </ol>
          <h3>What you’ll get</h3>
          <ul className="tick">
            <li><i>✓</i><span>A category mix that matches the horizon, not the headline.</span></li>
            <li><i>✓</i><span>A plain note on what to keep, pause or add.</span></li>
            <li><i>✓</i><span>The folio stays in your name. Farcon Wealth does not hold the money.</span></li>
          </ul>
          <h3>What we need</h3>
          <p>The goal, the date, and a rough picture of what you already hold. No password, and no CAS upload on this form.</p>
          <p className="hf-note" style={{ marginTop: 12 }}>AMFI-registered Mutual Fund Distributor · ARN {FARCON_CONFIG.arn} · Investments are in your name. You can also <a href={whatsappHref}>message us on WhatsApp</a>.</p>
        </article>
      </div>
      <LeadForm form="Portfolio Review" submitLabel="Request a review" showPreferences />
    </div>
  </div>
);

export const LoginPage: React.FC<PageProps> = ({ onOpenConsultation }) => (
  <div className="pg">
    <div className="pg-wrap" style={{ maxWidth: 760 }}>
      <span className="hf-eye">Investor access &amp; folio records</span>
      <h1>Investor access and folio records.</h1>
      <p className="lede">
        Farcon Wealth does not store account passwords or hold custody of your mutual fund holdings. Folios remain in your own name with the respective AMC and official registrars (CAMS, KFintech, or MFCentral). Until a dedicated investor portal link is configured, use official registrar portals or ask our team for assistance with your statement.
      </p>
      <div className="hf-cta-row">
        <a className="hf-btn hf-btn-green" href="https://www.mfcentral.com/" target="_blank" rel="noreferrer">Open MFCentral</a>
        <a className="hf-btn hf-btn-outline" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        <button type="button" className="hf-btn hf-btn-outline" onClick={() => onOpenConsultation('Portfolio statement')}>Request statement guidance</button>
        {FARCON_CONFIG.investorLoginUrl ? (
          <a className="hf-btn hf-btn-outline" href={FARCON_CONFIG.investorLoginUrl} target="_blank" rel="noreferrer">Open the investor platform</a>
        ) : null}
      </div>
    </div>
  </div>
);

const ARTICLE_SERVICE: Record<string, string> = {
  SIP: 'sip-planning',
  'Tax Planning': 'elss',
  Retirement: 'retirement',
  'Mutual Funds': 'portfolio-review',
  Basics: 'goal-based-planning',
};

export const EducationPage: React.FC<PageProps & { focus?: 'education' | 'blogs' | 'faq' }> = ({ focus = 'education', navigate }) => {
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map((post) => post.category)))];
  const posts = category === 'All' ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === category);
  const title = focus === 'blogs' ? 'Notes on staying invested.' : focus === 'faq' ? 'Common questions.' : 'Learn, plan, and grow.';
  const lede = focus === 'blogs'
    ? 'Short notes on SIPs, volatility and staying with a plan.'
    : focus === 'faq'
      ? 'Answers we give most often, in plain language.'
      : 'Articles from Farcon, questions we hear often, a few public films, and short notes you can download.';
  const showArticles = focus !== 'faq';
  const showFaqs = focus !== 'blogs';
  const showRest = focus === 'education' || focus === 'faq';

  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">{focus === 'blogs' ? 'Notes' : focus === 'faq' ? 'FAQ' : 'Investor Education'}</span>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
        {focus === 'education' && (
          <div className="hf-pills" style={{ marginBottom: 18 }}>
            {[
              ['articles', 'Articles'],
              ['faqs', 'FAQs'],
              ['videos', 'Videos'],
              ['downloads', 'Downloads'],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}>{label}</button>
            ))}
          </div>
        )}
        {showFaqs && focus === 'faq' && FAQ_ITEMS.map((item) => (
          <details key={item.id} className="acc">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
        {showArticles && (
          <div id="articles">
            <div className="hf-pills" style={{ marginBottom: 16 }}>
              {categories.map((item) => (
                <button key={item} type="button" className={category === item ? 'is-on' : ''} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
            {posts[0] && (
              <button type="button" className="pg-card feature-article" onClick={() => navigate(`/blogs/${posts[0].slug}` as RoutePath)}>
                <img src={ARTICLE_IMAGES[0]} alt={posts[0].title} width={ARTICLE_SIZE[0].width} height={ARTICLE_SIZE[0].height} />
                <div>
                  <span className="hf-eye">{posts[0].category} · {posts[0].readTime}</span>
                  <h2>{posts[0].title}</h2>
                  <p>{posts[0].excerpt}</p>
                </div>
              </button>
            )}
            <div className="pg-grid articles-rest" style={{ marginTop: 16 }}>
              {posts.slice(1).map((post, index) => (
                <button key={post.id} type="button" className="pg-card article-card" onClick={() => navigate(`/blogs/${post.slug}` as RoutePath)}>
                  <img src={ARTICLE_IMAGES[(index + 1) % ARTICLE_IMAGES.length]} alt={post.title} width={ARTICLE_SIZE[(index + 1) % ARTICLE_SIZE.length].width} height={ARTICLE_SIZE[(index + 1) % ARTICLE_SIZE.length].height} />
                  <span className="hf-eye">{post.category} · {post.readTime}</span>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                </button>
              ))}
            </div>
            <div className="hf-cta-row" style={{ marginTop: 16 }}>
              <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/sip')}>SIP calculator</button>
              <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/services')}>Services</button>
            </div>
          </div>
        )}
        {showFaqs && focus !== 'faq' && (
          <>
            <h2 id="faqs" style={{ marginTop: 40 }}>Common questions</h2>
            {FAQ_ITEMS.map((item) => (
              <details key={item.id} className="acc">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </>
        )}
        {showRest && (
          <>
            <h2 id="videos" style={{ marginTop: 36 }}>Educational videos</h2>
            <p className="hf-note">Third-party films for general context. They are not Farcon Wealth advice and not scheme recommendations. Press play to load the film.</p>
            <div className="videos">
              <VideoFacade id="PHe0bXAIuk0" title="How The Economic Machine Works by Ray Dalio" />
              <VideoFacade id="fTTGALaRZoc" title="Banking Explained – Money and Credit" />
            </div>
          </>
        )}
        {focus === 'education' && (
          <>
            <h2 id="downloads" style={{ marginTop: 36 }}>Downloadable resources</h2>
            <div className="pg-grid downloads">
              {[
                ['/resources/sip-basics.pdf', 'SIP basics'],
                ['/resources/elss-checklist.pdf', 'ELSS checklist'],
                ['/resources/goal-planning-worksheet.pdf', 'Goal planning worksheet'],
              ].map(([href, label]) => (
                <a key={href} className="pg-card pdf-card" href={href} download>
                  <span className="hf-eye">PDF</span>
                  <strong>{label}</strong>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [mapOn, setMapOn] = useState(false);
  const map = 'https://maps.google.com/maps?q=4th%20Floor,%20Unison%20Tower,%20Near%20Rajeev%20Nagar%20Crossing,%20Atal%20Path,%20Patna%20800013&z=15&output=embed';
  const mapsLink = 'https://maps.google.com/?q=4th+Floor,+Unison+Tower,+Near+Rajeev+Nagar+Crossing,+Atal+Path,+Patna+800013';
  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Contact Us</span>
        <h1>A conversation, not a pitch.</h1>
        <p className="lede">{FARCON_CONFIG.hours}. {FARCON_CONFIG.registeredAddress}</p>
        <div className="split">
          <LeadForm form="Contact" submitLabel="Send inquiry" requireMessage />
          <article className="pg-card visit-card">
            <span className="hf-eye">Visit or message</span>
            <h2>The Patna desk</h2>
            <p>{FARCON_CONFIG.registeredAddress}</p>
            <p>{FARCON_CONFIG.hours}</p>
            <p><a href={`mailto:${FARCON_CONFIG.email}`} style={{ color: 'inherit' }}>{FARCON_CONFIG.email}</a></p>
            <div className="contact-tel-group" style={{ margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f3d2e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Telephone</span>
              {FARCON_CONFIG.phoneNumbers.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: '#0f3d2e', fontWeight: 600, textDecoration: 'none' }}>
                  {phone}
                </a>
              ))}
            </div>
            <a className="hf-btn hf-btn-green" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            {mapOn ? (
              <iframe className="map" title="Farcon Wealth office on Google Maps" src={map} />
            ) : (
              <div className="map-poster">
                <svg className="map-art" viewBox="0 0 360 240" aria-hidden="true">
                  <rect width="360" height="240" fill="#e4f0e8" />
                  <path d="M0 48h360M0 96h360M0 144h360M0 192h360M48 0v240M108 0v240M168 0v240M228 0v240M288 0v240" stroke="#c5ddd0" strokeWidth="10" />
                  <path d="M-10 78C70 62 120 118 190 96s90-48 180-8" fill="none" stroke="#f7f1e4" strokeWidth="16" strokeLinecap="round" />
                  <path d="M-10 168C80 150 140 196 220 176s90-20 160 8" fill="none" stroke="#d9c48a" strokeWidth="12" strokeLinecap="round" />
                  <path d="M24 16C90 70 70 150 150 214" fill="none" stroke="#8fb89a" strokeWidth="7" strokeLinecap="round" />
                  <path d="M188 86c-16 0-28 12-28 28 0 20 28 46 28 46s28-26 28-46c0-16-12-28-28-28zm0 36a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="#0f3d2e" />
                  <circle cx="188" cy="114" r="4" fill="#f3d48a" />
                  <text x="188" y="196" textAnchor="middle" fill="#0f3d2e" fontSize="18" fontFamily="Poppins, sans-serif" fontWeight="700">Patna</text>
                </svg>
                <div className="map-caption">
                  <strong>Patna office</strong>
                  <p>Atal Path · the map loads when you ask for it.</p>
                  <div className="hf-cta-row">
                    <button type="button" className="hf-btn hf-btn-outline" onClick={() => setMapOn(true)}>Show the map</button>
                    <a className="hf-btn hf-btn-outline" href={mapsLink} target="_blank" rel="noreferrer">Open in Google Maps</a>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

const LEGAL: Record<'privacy' | 'terms' | 'grievance' | 'disclosures', { eye: string; title: string }> = {
  privacy: { eye: 'Privacy & Data Protection', title: 'Privacy Policy' },
  terms: { eye: 'Terms', title: 'Terms of Use' },
  grievance: { eye: 'Grievance', title: 'Grievance Redressal' },
  disclosures: { eye: 'Disclosures', title: 'Regulatory Disclosures' },
};

export const DisclosuresPage: React.FC<{ section?: 'privacy' | 'terms' | 'grievance' | 'disclosures'; navigate?: (path: RoutePath) => void }> = ({ section = 'disclosures', navigate }) => {
  const heading = LEGAL[section];
  const cards = [
    {
      id: 'registration',
      title: 'Registration & Identity',
      show: section === 'disclosures',
      body: [
        `${FARCON_CONFIG.legalName} operates as an AMFI-registered Mutual Fund Distributor under ARN: ${FARCON_CONFIG.arn} and is not a SEBI-registered Investment Adviser.`,
        `Current office / correspondence address published by the business: ${FARCON_CONFIG.registeredAddress}. Email: ${FARCON_CONFIG.email}. Telephone: ${FARCON_CONFIG.phoneNumbers.join(', ')}. Documentary verification separating registered office vs operating address records and official ARN certificate attachment is tracked prior to final production release.`,
        'Investments are made through official AMC/exchange/RTA channels strictly in the investor’s own name; Farcon Wealth never holds custody of investor funds or securities.',
      ],
    },
    {
      id: 'commission',
      title: 'Commission Disclosure & Scheme Documents',
      show: section === 'disclosures',
      body: [
        `Farcon Wealth distributes Regular Plans only for mutual fund clients under ARN: ${FARCON_CONFIG.arn} and receives distributor trail commission from Asset Management Companies (AMCs) out of the Regular Plan scheme expense ratio. Farcon Wealth does not charge separate advisory fees.`,
        'Notice on Commission Schedule Status: Under the AMFI Master Circular for Mutual Fund Distributors (January 2026), digital platforms displaying investment facilities must prominently publish the applicable commission-rate schedule alongside links to each scheme’s SID, SAI, and KIM. Verified scheme-by-scheme AMC commission schedules and approved Regular Plan scheme mappings are currently pending owner upload/verification. Consequently, scheme-level cards and transactional facilities are intentionally disabled online.',
        'Official Scheme Documents & Market Data Sources: Investors can inspect all Scheme Information Documents (SID), Statements of Additional Information (SAI), Key Information Memoranda (KIM), and AMFI scheme disclosures directly at https://www.amfiindia.com/ and https://www.sebi.gov.in/filings/mutual-funds.html.',
      ],
    },
    {
      id: 'affiliation',
      title: 'AMC Affiliations & Scope of Products',
      show: section === 'disclosures',
      body: [
        'Under the AMFI Code of Conduct for Mutual Fund Distributors, information on this website is limited to mutual fund categories and schemes of AMCs with which Farcon Wealth is empanelled; investors are free to consider mutual fund schemes or alternatives not distributed by Farcon Wealth.',
        'AMC marks displayed on the website belong to their respective Asset Management Companies. Active empanelment confirmation for every displayed AMC logo is pending final owner verification.',
      ],
    },
    {
      id: 'risk',
      title: 'Risk Disclosure & Illustrative Calculators',
      show: section === 'disclosures',
      body: [
        COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk,
        'Past performance may or may not be sustained in future and is not indicative of any future return. Calculators, SIP estimators, and milestone models on this website produce purely mathematical, assumption-driven illustrations (using user-selected return rates and inflation inputs) and are not scheme-specific forecasts or guarantees.',
        'Where live market or scheme data feeds are not connected with proper licensing or verification, the website displays an unavailable state and official exchange/AMFI links rather than stale fallback figures.',
      ],
    },
    {
      id: 'grievance',
      title: 'Grievance Redressal',
      show: section === 'disclosures' || section === 'grievance',
      body: [
        `Level 1 — Internal Desk: Share your name, folio reference (if applicable), and details of your concern via email at ${FARCON_CONFIG.email}, telephone (${FARCON_CONFIG.phoneNumbers.join(' / ')}), or post at ${FARCON_CONFIG.registeredAddress}. Named Grievance Officer designation and committed response SLAs are pending owner confirmation prior to final production sign-off.`,
        'Level 2 — AMC & Registrar: For unit allotment, KYC, bank mandate, dividend, or redemption processing issues, investors may contact the respective Asset Management Company or Registrar & Transfer Agent (CAMS / KFintech / MFCentral).',
        'Level 3 — Regulatory Escalation: Unresolved complaints falling under SEBI jurisdiction may be escalated via AMFI or the SEBI SCORES portal (https://scores.sebi.gov.in/) and SMART ODR where applicable.',
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy Policy & Data Protection (DPDP)',
      show: section === 'disclosures' || section === 'privacy',
      body: [
        'Data Collected: Enquiry and consultation forms collect only the fields you submit — name, email address, 10-digit Indian mobile number, city, stated goal, optional investment type/amount/horizon/risk comfort, enquiry message, contact preference, source pathname, and explicit opt-in consent with timestamp. Optional UTM attribution tags are held transiently in browser sessionStorage. We never request folio passwords or CAS uploads via web forms.',
        'Purpose & Legal Basis: Collected details are used solely to respond to your requested goal-planning or mutual fund distribution enquiry via your preferred contact channel. All consent checkboxes start unchecked by default; Farcon Wealth does not bundle marketing consent with service-request consent.',
        'Actual Service Providers & Processors: Form submissions traverse Cloudflare Workers (hosting and optional Turnstile verification), may be recorded in a Farcon-controlled Google Sheet via Google Apps Script when webhook credentials are configured, or initiated externally via WhatsApp (wa.me) when clicked by you. Embedded educational videos load via YouTube privacy-enhanced mode (youtube-nocookie.com) only when you click play. No unauthorized third-party advertising trackers are active.',
        `Retention, Security & Rights: Submissions are transmitted over HTTPS with input sanitisation and server-side validation. Confirmed retention durations and privacy-officer details are pending owner/legal schedule approval. You may request access, correction, withdrawal of consent, or deletion of any enquiry record at any time by emailing ${FARCON_CONFIG.email}. Under the Digital Personal Data Protection Rules, 2025, statutory obligations take effect across phased commencement dates; this notice will be updated following legal review prior to full commencement.`,
      ],
    },
    {
      id: 'terms',
      title: 'Terms of Use',
      show: section === 'disclosures' || section === 'terms',
      body: [
        'Informational & Distributor Scope: Content on this website is published by an AMFI-registered Mutual Fund Distributor (ARN: 329006) for general education and mutual fund distribution facilitation. Nothing on this website constitutes investment advice under SEBI (Investment Advisers) Regulations, a research report, an offer, or a solicitation to buy or sell any security.',
        'Calculators & Assumptions: SIP, lump-sum, goal, and retirement calculators apply standard mathematical compounding formulas to user-chosen assumptions. Projected values are illustrative only and carry no assurance of return.',
        'External Links: Links to AMFI, SEBI, NSE, BSE, MFCentral, WhatsApp, or educational videos are provided for convenience; Farcon Wealth is not responsible for the availability or content of third-party websites.',
      ],
    },
  ].filter((card) => card.show);
  const ordered = [...cards].sort((a, b) => (a.id === section ? -1 : b.id === section ? 1 : 0));

  return (
    <div className="pg">
      <div className={`pg-wrap legal-layout${ordered.length > 1 ? '' : ' is-single'}`}>
        {ordered.length > 1 && (
          <nav className="legal-nav" aria-label="On this page">
            {ordered.map((card) => (
              <a key={card.id} href={`#${card.id}`}>{card.title}</a>
            ))}
            <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate?.('/contact')}>Contact Us</button>
            <a className="hf-btn hf-btn-outline" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </nav>
        )}
        <div className="legal-read">
          <span className="hf-eye">{heading.eye}</span>
          <h1>{heading.title}</h1>
          <p className="lede">Updated November 2026 · AMFI-Registered Mutual Fund Distributor · ARN {FARCON_CONFIG.arn}.</p>
          {ordered.map((card) => (
            <article key={card.id} className="pg-card" id={card.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ordered.length > 1 && <h2>{card.title}</h2>}
              {card.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
          {ordered.length === 1 && (
            <div className="hf-cta-row" style={{ marginTop: 16 }}>
              <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate?.('/disclosures')}>All Regulatory Disclosures</button>
              <a className="hf-btn hf-btn-outline" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

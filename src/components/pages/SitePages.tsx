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
import { RETURNS_LABEL, type LiveQuote } from '@/lib/api/liveNav';

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
      <h2>Why Farcon</h2>
      <div className="pg-grid cards three">
        <article className="pg-card"><span className="hf-eye">Goals first</span><h2>The date before the scheme</h2><p>A goal, a horizon and a surplus come before any fund name.</p></article>
        <article className="pg-card"><span className="hf-eye">In your name</span><h2>We do not hold the money</h2><p>Purchases sit with the AMC, the exchange and the registrar.</p></article>
        <article className="pg-card"><span className="hf-eye">ARN {FARCON_CONFIG.arn}</span><h2>A registered distributor</h2><p>Farcon is not a portfolio manager and does not promise returns.</p></article>
      </div>
      <div className="svc-about">
        <ServiceShowcase variant="cards" navigate={navigate} />
      </div>
      <h2 style={{ marginTop: 36 }}>How we work</h2>
      <div className="steps four">
        {[
          ['01', 'Listen', 'The goal, the date and what you can leave invested.'],
          ['02', 'Fit', 'A category mix that matches the horizon, not the headline.'],
          ['03', 'In your name', 'The folio is yours. Farcon does not keep the money.'],
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
          <p>{FARCON_CONFIG.email}</p>
          <a className="hf-btn hf-btn-outline" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </article>
        <article className="pg-card">
          <span className="hf-eye">Mission</span>
          <h2>Investing, without the noise.</h2>
          <p>We would rather a smaller, suitable plan that you can stay with than a larger one you abandon in a bad year.</p>
          <button type="button" className="hf-btn hf-btn-green" onClick={() => onOpenConsultation('About Farcon')}>Book a Consultation</button>
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

function pct(value: number | null | undefined) {
  return value == null ? '—' : `${value}%`;
}

function useLiveNav() {
  const [quotes, setQuotes] = useState<Record<number, LiveQuote>>({});
  useEffect(() => {
    let live = true;
    fetch('/api/nav')
      .then((response) => response.json())
      .then((body: { funds?: LiveQuote[] }) => {
        if (!live) return;
        const next: Record<number, LiveQuote> = {};
        for (const fund of body.funds || []) next[fund.code] = fund;
        setQuotes(next);
      })
      .catch(() => undefined);
    return () => { live = false; };
  }, []);
  return quotes;
}

function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const shownRef = useRef(value);
  shownRef.current = shown;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(value);
      return undefined;
    }
    const play = (from: number) => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 520);
        setShown(from + (value - from) * (1 - (1 - t) ** 3));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const arm = () => {
      const from = el.dataset.played === '1' ? shownRef.current : value * 0.94;
      el.dataset.played = '1';
      setShown(from);
      play(from);
    };
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) arm();
    else {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        arm();
      }, { threshold: 0.4 });
      observer.observe(el);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [value]);
  const finalText = value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const shownText = shown.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <span className="count-up" ref={ref}>
      <span className="count-up-sizer" aria-hidden="true">{finalText}</span>
      <span>{shownText}</span>
    </span>
  );
}

function Spark({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = 108;
  const height = 28;
  const d = values.map((point, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = max === min ? height / 2 : height - ((point - min) / (max - min)) * (height - 4) - 2;
    return `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const up = values[values.length - 1] >= values[0];
  return (
    <svg className="nav-spark" viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      <path d={d} fill="none" stroke={up ? '#1f9d55' : '#8a5a2a'} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export const FundsPage: React.FC<{ navigate: (path: RoutePath) => void; categorySlug?: string; schemeSlug?: string }> = ({ navigate, categorySlug, schemeSlug }) => {
  const [query, setQuery] = useState('');
  const [amc, setAmc] = useState('All');
  const [risen, setRisen] = useState(false);
  const quotes = useLiveNav();
  const category = fundBook.categories.find((item) => item.slug === categorySlug);
  const scheme = category?.schemes.find((item) => item.slug === schemeSlug);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const node = document.querySelector('.nav-grid');
    if (!node || reduce) {
      setRisen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRisen(true);
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [categorySlug, schemeSlug, query, amc]);
  if (categorySlug && !category) return null;
  if (schemeSlug && category && !scheme) return null;
  const live = (fund: { code?: number }) => {
    const quote = fund.code ? quotes[fund.code] : undefined;
    return quote && quote.date && Number.isFinite(Number(quote.nav)) ? quote : undefined;
  };
  const listed = category ? category.schemes : fundBook.categories.flatMap((item) => item.schemes.map((fund) => ({ ...fund, categoryName: item.name, categorySlug: item.slug })));
  const amcs = ['All', ...Array.from(new Set(listed.map((fund) => fund.amc)))];
  const needle = query.trim().toLowerCase();
  const shown = listed.filter((fund) => (amc === 'All' || fund.amc === amc) && (!needle || `${fund.name} ${fund.amc} ${fund.subCategory}`.toLowerCase().includes(needle)));
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
          <span className="hf-eye">{live(scheme) ? 'Live NAV' : 'Scheme'}</span>
          <h1>{scheme.name}</h1>
          <p className="lede">{scheme.amc}. {scheme.plan}. Educational only. Not a recommendation.</p>
          <article className={`pg-card nav-card nav-grid${risen ? ' is-in' : ''}`} style={{ marginTop: 16 }}>
            <div className="hf-amc">
              <img className="hf-logo" src={scheme.logo} alt={`${scheme.amc} mark`} width={28} height={28} />
              <div>
                <h2>{scheme.subCategory}</h2>
                <div className="hf-sub">Riskometer label: {scheme.risk}</div>
              </div>
            </div>
            <div className="nav-figure">
              <span>{live(scheme) ? 'NAV · AMFI' : 'NAV'}</span>
              <strong>₹<CountUp value={Number(live(scheme)?.nav ?? scheme.nav)} /></strong>
              <Spark values={live(scheme)?.spark || []} />
            </div>
            <p className="hf-note">{live(scheme)?.date ? `as of ${live(scheme)!.date}` : `Last updated ${fundBook.asOf}`}</p>
            {live(scheme)?.returns ? (
              <div className="hf-metrics">
                <span>1Y<b>{pct(live(scheme)!.returns['1Y'])}</b></span>
                <span>3Y<b>{pct(live(scheme)!.returns['3Y'])}</b></span>
                <span>5Y<b>{pct(live(scheme)!.returns['5Y'])}</b></span>
              </div>
            ) : null}
            <p className="hf-note">{live(scheme) ? RETURNS_LABEL : fundBook.source}</p>
            <p className="hf-note">{fundBook.disclaimer}</p>
          </article>
          <div className="hf-cta-row" style={{ marginTop: 16 }}>
            <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/start-investing')}>Enquire about this scheme</button>
            <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/sip')}>SIP calculator</button>
            <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/lumpsum')}>Lumpsum calculator</button>
            <a className="hf-btn hf-btn-outline" href="https://www.sebi.gov.in/filings/mutual-funds.html" target="_blank" rel="noreferrer">Scheme documents</a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Mutual Funds</span>
        <h1>{category ? category.name : 'Explore mutual funds'}</h1>
        <p className="lede">{category ? category.summary : 'Open a scheme for the latest AMFI NAV and point-to-point returns.'}</p>
        <span className="horizon">NAV where shown live is the latest published scheme NAV. Not a recommendation.</span>
        <div className="hf-pills" style={{ margin: '18px 0' }}>
          <button type="button" className={!category ? 'is-on' : ''} onClick={() => navigate('/mutual-funds')}>All</button>
          {fundBook.categories.map((item) => (
            <button key={item.slug} type="button" className={category?.slug === item.slug ? 'is-on' : ''} onClick={() => navigate(`/mutual-funds/${item.slug}` as RoutePath)}>{item.name}</button>
          ))}
        </div>
        <label className="field">Search schemes
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Scheme, AMC, or category" />
        </label>
        <div className="hf-pills" style={{ margin: '0 0 18px' }}>
          {amcs.map((item) => (
            <button key={item} type="button" className={amc === item ? 'is-on' : ''} onClick={() => setAmc(item)}>{item.replace(' Mutual Fund', '')}</button>
          ))}
        </div>
        <div className={`hf-fund-row nav-grid${risen ? ' is-in' : ''}`}>
          {shown.length === 0 && (
            <article className="pg-card">
              <h2>No scheme in this filter</h2>
              <p>Try another AMC, or clear the search.</p>
            </article>
          )}
          {shown.map((fund) => {
            const catSlug = 'categorySlug' in fund ? fund.categorySlug : category?.slug;
            const quote = live(fund);
            return (
              <button key={fund.slug} type="button" className="hf-fund nav-card" onClick={() => navigate(`/mutual-funds/${catSlug}/${fund.slug}` as RoutePath)}>
                <div className="hf-amc">
                  <img className="hf-logo" src={fund.logo} alt={`${fund.amc} mark`} width={28} height={28} />
                  <div>
                    <h2>{fund.name}</h2>
                    <div className="hf-sub">{fund.plan}</div>
                  </div>
                </div>
                <div className="hf-tags"><span>{fund.subCategory}</span><span>{fund.risk}</span></div>
                <div className="nav-figure">
                  <span>{quote ? 'NAV · AMFI' : 'NAV'}</span>
                  <strong>₹<CountUp value={Number(quote?.nav ?? fund.nav)} /></strong>
                  <Spark values={quote?.spark || []} />
                </div>
                <span className="hf-note">{quote ? `as of ${quote.date}` : `Last updated ${fundBook.asOf}`}</span>
                {quote?.returns ? (
                  <div className="hf-metrics">
                    <span>1Y<b>{pct(quote.returns['1Y'])}</b></span>
                    <span>3Y<b>{pct(quote.returns['3Y'])}</b></span>
                    <span>5Y<b>{pct(quote.returns['5Y'])}</b></span>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="hf-note" style={{ marginTop: 16 }}>{shown.some((fund) => live(fund)) ? RETURNS_LABEL : `Last updated ${fundBook.asOf}. ${fundBook.source}`}</p>
        <p className="hf-note">{fundBook.disclaimer}</p>
        <div className="hf-cta-row" style={{ marginTop: 12 }}>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/sip')}>SIP calculator</button>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators/lumpsum')}>Lumpsum calculator</button>
          <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/start-investing')}>Start investing</button>
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
        <p className="hf-note">Educational note from a mutual fund distributor. Not investment advice and not a scheme recommendation.</p>
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
        <span className="hf-eye">Start investing</span>
        <h1>Tell us the goal, then the amount.</h1>
        <p className="lede">This is a mutual fund distribution enquiry. It is separate from a general consultation. Farcon does not place an order from this form.</p>
        <p className="hf-note">AMFI-registered Mutual Fund Distributor · ARN {FARCON_CONFIG.arn}. You can also <a href={whatsappHref}>message us on WhatsApp</a>.</p>
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
            <li><i>✓</i><span>The folio stays in your name. Farcon does not hold the money.</span></li>
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
      <span className="hf-eye">Investor access</span>
      <h1>Online portfolio access is coming soon.</h1>
      <p className="lede">
        Farcon does not keep a password for your folios. Holdings stay with the mutual fund, the exchange or the registrar, in your name. Until portfolio access is available here, message us or ask for a statement.
      </p>
        <div className="hf-cta-row">
        <a className="hf-btn hf-btn-green" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        <button type="button" className="hf-btn hf-btn-outline" onClick={() => onOpenConsultation('Portfolio statement')}>Request a portfolio statement</button>
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
            <p className="hf-note">Third-party films for general context. They are not Farcon advice and not scheme recommendations. Press play to load the film.</p>
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
  const map = 'https://maps.google.com/maps?q=A-160%20P.C.%20Colony%20Kankarbagh%20Patna%20800020&z=15&output=embed';
  const mapsLink = 'https://maps.google.com/?q=A-160+P.C.+Colony+Kankarbagh+Patna+800020';
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
            <p>{FARCON_CONFIG.email}</p>
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
                  <p>Kankarbagh · the map loads when you ask for it.</p>
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
  privacy: { eye: 'Privacy', title: 'Privacy Policy' },
  terms: { eye: 'Terms', title: 'Terms of Use' },
  grievance: { eye: 'Grievance', title: 'Grievance Redressal' },
  disclosures: { eye: 'Disclosures', title: 'Regulatory Disclosures' },
};

export const DisclosuresPage: React.FC<{ section?: 'privacy' | 'terms' | 'grievance' | 'disclosures' }> = ({ section = 'disclosures' }) => {
  const heading = LEGAL[section];
  const cards = [
    {
      id: 'registration',
      title: 'Registration',
      show: section === 'disclosures',
      body: `${FARCON_CONFIG.legalName} is an AMFI-registered mutual fund distributor. ARN: ${FARCON_CONFIG.arn}. Registered office: ${FARCON_CONFIG.registeredAddress}. Email ${FARCON_CONFIG.email}. Farcon does not bill an upfront fee. On regular plans, the asset management company may pay Farcon a distributor commission from the scheme expense ratio. That commission is disclosed before you invest. Message us on WhatsApp from the button on this page.`,
    },
    {
      id: 'risk',
      title: 'Risk disclosure',
      show: section === 'disclosures',
      body: 'Mutual fund investments are subject to market risks. Read all scheme related documents carefully. Past performance is not indicative of future returns. Figures on this website that are marked illustrative are not live NAVs. Index levels on the home page come from Yahoo Finance and may be delayed.',
    },
    {
      id: 'grievance',
      title: 'Grievance redressal',
      show: section === 'disclosures' || section === 'grievance',
      body: `Write to ${FARCON_CONFIG.email} with your name, folio or PAN reference, and what went wrong. If you are not satisfied, you can approach AMFI or the SCORES portal of SEBI. Farcon will acknowledge a written complaint and share the next step.`,
    },
    {
      id: 'privacy',
      title: 'Privacy policy and DPDP',
      show: section === 'disclosures' || section === 'privacy',
      body: `Enquiry forms collect your name, contact details, city and the goal you describe so we can reply. We do not ask this website to store account passwords. Leads may be appended to a Google Sheet controlled by Farcon when a webhook is configured. You can ask us to correct or delete an enquiry by emailing ${FARCON_CONFIG.email}.`,
    },
    {
      id: 'terms',
      title: 'Terms of use',
      show: section === 'disclosures' || section === 'terms',
      body: 'This website is information from a mutual fund distributor. It is not a research report, not an offer, and not a promise of returns. Calculators are estimates from stated assumptions. Using the site does not create an advisory mandate.',
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
            <a className="hf-btn hf-btn-outline" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </nav>
        )}
        <div className="legal-read">
          <span className="hf-eye">{heading.eye}</span>
          <h1>{heading.title}</h1>
          <p className="lede">Last updated October 2026. ARN {FARCON_CONFIG.arn}.</p>
          {ordered.map((card) => (
            <article key={card.id} className="pg-card" id={card.id}>
              {ordered.length > 1 && <h2>{card.title}</h2>}
              <p>{card.body}</p>
            </article>
          ))}
          {ordered.length === 1 && (
            <a className="hf-btn hf-btn-outline" href={whatsappHref} target="_blank" rel="noreferrer" style={{ marginTop: 16 }}>Chat on WhatsApp</a>
          )}
        </div>
      </div>
    </div>
  );
};

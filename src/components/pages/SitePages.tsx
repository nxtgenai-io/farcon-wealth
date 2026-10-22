import React, { useEffect, useState } from 'react';
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

const FUNDS = [
  { name: 'SBI Small Cap Fund', group: 'Equity', tags: ['Equity', 'Small Cap'], cagr: '26.4%', nav: '₹164.72', risk: 'Very High Risk', tone: '#0E6B38', logo: '/images/amc/sbi.svg', spark: [12, 13, 15, 16, 18, 20, 22, 24, 26] },
  { name: 'HDFC Flexi Cap Fund', group: 'Equity', tags: ['Equity', 'Flexi Cap'], cagr: '21.8%', nav: '₹712.35', risk: 'High Risk', tone: '#9B2C2C', logo: '/images/amc/hdfc.svg', spark: [11, 13, 14, 16, 17, 18, 20, 21, 22] },
  { name: 'ICICI Prudential Balanced Advantage Fund', group: 'Hybrid', tags: ['Hybrid', 'Dynamic'], cagr: '14.6%', nav: '₹348.12', risk: 'Moderate Risk', tone: '#9A5410', logo: '/images/amc/icici.webp', spark: [12, 12.4, 13, 13.6, 14.2, 14.8, 15.4, 16.2, 17] },
  { name: 'Axis ELSS Tax Saver Fund', group: 'ELSS', tags: ['Equity', 'ELSS'], cagr: '18.2%', nav: '₹112.46', risk: 'High Risk', tone: '#9B2C2C', logo: '/images/amc/axis.svg', spark: [10, 11, 12.5, 13.5, 15, 16, 17.2, 18.2, 19] },
  { name: 'HDFC Short Term Debt Fund', group: 'Debt', tags: ['Debt', 'Short Duration'], cagr: '7.4%', nav: '₹28.16', risk: 'Moderate Risk', tone: '#9A5410', logo: '/images/amc/hdfc.svg', spark: [12, 12.2, 12.4, 12.7, 13, 13.2, 13.5, 13.8, 14] },
  { name: 'SBI Magnum Gilt Fund', group: 'Debt', tags: ['Debt', 'Gilt'], cagr: '7.1%', nav: '₹58.40', risk: 'Moderate Risk', tone: '#9A5410', logo: '/images/amc/sbi.svg', spark: [11, 11.4, 11.2, 11.8, 12.1, 12.4, 12.2, 12.8, 13.1] },
  { name: 'ICICI Prudential Corporate Bond Fund', group: 'Debt', tags: ['Debt', 'Corporate'], cagr: '7.6%', nav: '₹26.90', risk: 'Moderate Risk', tone: '#9A5410', logo: '/images/amc/icici.webp', spark: [10, 10.4, 10.8, 11.1, 11.4, 11.8, 12.1, 12.5, 12.8] },
  { name: 'Axis Treasury Advantage Fund', group: 'Debt', tags: ['Debt', 'Money Market'], cagr: '6.8%', nav: '₹2,746', risk: 'Low Risk', tone: '#9A5410', logo: '/images/amc/axis.svg', spark: [9, 9.2, 9.4, 9.5, 9.7, 9.9, 10.1, 10.3, 10.5] },
];

const CATEGORIES = [
  ['Equity', 'Long horizons. Very high volatility is normal, including years that finish lower.'],
  ['Hybrid', 'A mix of equity and debt. The split is defined by the scheme, not by the day’s news.'],
  ['Debt', 'Nearer goals and parking. Credit and interest-rate movement still matter.'],
  ['ELSS', 'Equity with a three-year lock-in on each allotment. Tax treatment depends on your regime.'],
];

function Spark({ values, color }: { values: number[]; color: string }) {
  const w = 180;
  const h = 64;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const d = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - 8 - ((v - min) / (max - min || 1)) * (h - 16);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg className="hf-spark" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={color} opacity="0.14" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

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
    <button type="button" className="yt-facade" onClick={() => setPlay(true)}>
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        onError={(event) => { (event.currentTarget as HTMLImageElement).src = '/images/home/article-funds-800.webp'; }}
      />
      <span>Play</span>
    </button>
  );
}

export const AboutPage: React.FC<PageProps> = ({ onOpenConsultation }) => (
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
        <img src="/images/home/why-mountains-1440.webp" alt="A mountain ridge at sunset" width={1440} height={800} />
      </div>
      <h2>Why Farcon</h2>
      <div className="pg-grid cards three">
        <article className="pg-card"><span className="hf-eye">Goals first</span><h2>The date before the scheme</h2><p>A goal, a horizon and a surplus come before any fund name.</p></article>
        <article className="pg-card"><span className="hf-eye">In your name</span><h2>We do not hold the money</h2><p>Purchases sit with the AMC, the exchange and the registrar.</p></article>
        <article className="pg-card"><span className="hf-eye">ARN {FARCON_CONFIG.arn}</span><h2>A registered distributor</h2><p>Farcon is not a portfolio manager and does not promise returns.</p></article>
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

export const FundsPage: React.FC = () => {
  const [tab, setTab] = useState('Equity');
  const shown = FUNDS.filter((fund) => fund.group === tab);
  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Mutual Funds</span>
        <h1>Explore mutual funds</h1>
        <p className="lede">Handpicked schemes across categories. The figures below are a teaching set.</p>
        <span className="horizon">Illustrative data, not live NAV</span>
        <div className="hf-pills" style={{ margin: '18px 0' }}>
          {['Equity', 'Hybrid', 'Debt', 'ELSS'].map((item) => (
            <button key={item} type="button" className={tab === item ? 'is-on' : ''} onClick={() => setTab(item)}>{item}</button>
          ))}
        </div>
        <div className="hf-fund-row">
          {shown.map((fund) => (
            <article key={fund.name} className="hf-fund">
              <div className="hf-amc">
                <img className="hf-logo" src={fund.logo} alt="" />
                <div>
                  <h2>{fund.name}</h2>
                  <div className="hf-sub">Direct Growth</div>
                </div>
              </div>
              <div className="hf-tags">{fund.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="hf-metrics">
                <span>3Y CAGR<b>{fund.cagr}</b></span>
                <span>NAV<b>{fund.nav}</b></span>
              </div>
              <Spark values={fund.spark} color={fund.tone} />
              <span className="hf-pill" style={{ background: fund.tone }}>{fund.risk}</span>
            </article>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          {CATEGORIES.map(([title, text]) => (
            <details key={title} className="acc">
              <summary>{title}</summary>
              <p>{text} Read the scheme information document from the AMC before acting.</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PortfolioPage: React.FC = () => (
  <div className="pg">
    <div className="pg-wrap split">
      <div>
        <span className="hf-eye">Portfolio Review</span>
        <h1>Tell us the goal before the scheme.</h1>
        <p className="lede">Share enough for a first conversation. This form does not place an order and does not upload a CAS.</p>
        <article className="pg-card">
          <span className="hf-eye">What happens next</span>
          <ol className="tick">
            <li><i>1</i><span>We read the note and reply on the contact you gave.</span></li>
            <li><i>2</i><span>A short call covers the goal, the horizon and what you already hold.</span></li>
            <li><i>3</i><span>Any investment stays in your name with the AMC or the registrar.</span></li>
          </ol>
          <p className="hf-note" style={{ marginTop: 12 }}>AMFI-registered Mutual Fund Distributor · ARN {FARCON_CONFIG.arn} · Investments are in your name.</p>
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
      </div>
    </div>
  </div>
);

export const EducationPage: React.FC<PageProps & { focus?: 'education' | 'blogs' | 'faq' }> = ({ focus = 'education' }) => {
  useEffect(() => {
    const id = focus === 'blogs' ? 'articles' : focus === 'faq' ? 'faqs' : '';
    if (!id) return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [focus]);

  const title = focus === 'blogs' ? 'Notes on staying invested.' : focus === 'faq' ? 'Common questions.' : 'Learn, plan, and grow.';
  const lede = focus === 'blogs'
    ? 'Short notes on SIPs, volatility and staying with a plan.'
    : focus === 'faq'
      ? 'Answers we give most often, in plain language.'
      : 'Articles from Farcon, questions we hear often, a few public films, and short notes you can download.';

  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Investor Education</span>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
        <article className="pg-card feature-article" id="articles">
          <img src={ARTICLE_IMAGES[0]} alt="" />
          <div>
            <span className="hf-eye">{BLOG_POSTS[0].category} · {BLOG_POSTS[0].readTime}</span>
            <h2>{BLOG_POSTS[0].title}</h2>
            <p>{BLOG_POSTS[0].excerpt}</p>
          </div>
        </article>
        <div className="pg-grid cards" style={{ marginTop: 16 }}>
          {BLOG_POSTS.slice(1, 4).map((post, index) => (
            <article key={post.id} className="pg-card article-card">
              <img src={ARTICLE_IMAGES[(index + 1) % ARTICLE_IMAGES.length]} alt="" />
              <span className="hf-eye">{post.category} · {post.readTime}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
        <h2 id="faqs" style={{ marginTop: 40 }}>Common questions</h2>
        {FAQ_ITEMS.map((item) => (
          <details key={item.id} className="acc">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
        <h2 style={{ marginTop: 36 }}>Educational videos</h2>
        <p className="hf-note">Third-party films for general context. They are not Farcon advice and not scheme recommendations. Press play to load the film.</p>
        <div className="videos">
          <VideoFacade id="PHe0bXAIuk0" title="How The Economic Machine Works by Ray Dalio" />
          <VideoFacade id="fTTGALaRZoc" title="Banking Explained – Money and Credit" />
        </div>
        <h2 style={{ marginTop: 36 }}>Downloadable resources</h2>
        <div className="pg-grid cards">
          {[
            ['/resources/sip-basics.pdf', 'SIP basics', '1 KB'],
            ['/resources/elss-checklist.pdf', 'ELSS checklist', '1 KB'],
            ['/resources/goal-planning-worksheet.pdf', 'Goal planning worksheet', '1 KB'],
          ].map(([href, label, size]) => (
            <a key={href} className="pg-card pdf-card" href={href} download>
              <span className="hf-eye">PDF · {size}</span>
              <strong>{label}</strong>
            </a>
          ))}
        </div>
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
                <div>
                  <strong>Patna office</strong>
                  <p>Kankarbagh · the map loads when you ask for it.</p>
                  <button type="button" className="hf-btn hf-btn-outline" onClick={() => setMapOn(true)}>Show the map</button>
                  <a className="hf-btn hf-btn-outline" href={mapsLink} target="_blank" rel="noreferrer">Open in Google Maps</a>
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
      body: `${FARCON_CONFIG.legalName} is an AMFI-registered mutual fund distributor. ARN: ${FARCON_CONFIG.arn}. Registered office: ${FARCON_CONFIG.registeredAddress}. Email ${FARCON_CONFIG.email}. Message us on WhatsApp from the button on this page.`,
    },
    {
      id: 'risk',
      title: 'Risk disclosure',
      show: section === 'disclosures',
      body: 'Mutual fund investments are subject to market risks. Read all scheme related documents carefully. Past performance is not indicative of future returns. Figures on this website that are marked illustrative are not live NAVs or index levels.',
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
      <div className="pg-wrap legal-layout">
        <nav className="legal-nav" aria-label="On this page">
          {ordered.map((card) => (
            <a key={card.id} href={`#${card.id}`}>{card.title}</a>
          ))}
          <a className="hf-btn hf-btn-outline" href={whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </nav>
        <div className="legal-read">
          <span className="hf-eye">{heading.eye}</span>
          <h1>{heading.title}</h1>
          <p className="lede">Last updated October 2026. ARN {FARCON_CONFIG.arn}.</p>
          {ordered.map((card) => (
            <article key={card.id} className="pg-card" id={card.id}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

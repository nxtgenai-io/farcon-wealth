import React, { useState } from 'react';
import { RoutePath } from '@/types';
import { FARCON_CONFIG } from '@/content/site/config';
import { BLOG_POSTS } from '@/content/blogs/blogData';
import { FAQ_ITEMS } from '@/content/faq/faqData';
import { LeadForm } from '@/components/pages/LeadForm';

interface PageProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (subject?: string) => void;
}

const SERVICES = [
  ['SIP', 'A fixed amount, on a date you choose, aimed at a goal rather than a headline.'],
  ['Lumpsum', 'One-time money with a horizon long enough for the category you pick.'],
  ['Mutual Fund Distribution', 'Execution in your name through official platforms. Farcon does not hold the money.'],
  ['Goal-Based Investment', 'The goal, the date and the surplus come before any scheme name.'],
  ['Portfolio Review', 'A calm look at overlap, cost and whether the mix still matches the goal.'],
  ['Investment Solutions', 'A simple mix across equity, hybrid and debt categories. Not a product shelf.'],
  ['Child Education', 'A dated corpus for fees, kept apart from retirement money.'],
  ['Retirement', 'Spending power across a long retirement, not a single maturity figure.'],
  ['Wealth Creation', 'Surplus that can stay invested through full market cycles.'],
  ['Tax Saving', 'ELSS explained against the tax regime that actually applies to you.'],
];

const CATEGORIES = [
  ['Equity', 'Long horizons. Very high volatility is normal, including years that finish lower.'],
  ['Hybrid', 'A mix of equity and debt. The split is defined by the scheme, not by the day’s news.'],
  ['Debt', 'Nearer goals and parking. Credit and interest-rate movement still matter.'],
  ['ELSS', 'Equity with a three-year lock-in on each allotment. Tax treatment depends on your regime.'],
];

export const AboutPage: React.FC<PageProps> = ({ onOpenConsultation }) => (
  <div className="pg">
    <div className="pg-wrap">
      <span className="hf-eye">About Us</span>
      <h1>A distributor with a planning desk.</h1>
      <p className="lede">
        {FARCON_CONFIG.legalName} is an AMFI-registered mutual fund distributor, ARN {FARCON_CONFIG.arn}. We help families in and beyond Patna decide what the money is for, then use mutual funds only where they fit.
      </p>
      <div className="split" style={{ marginTop: 18 }}>
        <article className="pg-card">
          <h2>Overview</h2>
          <p>Farcon does not run a portfolio management service, and it does not keep client money. Purchases and redemptions sit with the AMC, the exchange platform and the registrar, in the investor’s name.</p>
          <p>{FARCON_CONFIG.registeredAddress}</p>
        </article>
        <article className="pg-card">
          <h2>Mission</h2>
          <p>Investing, without the noise. We would rather a smaller, suitable plan that you can stay with than a larger one you abandon in a bad year.</p>
          <button type="button" className="hf-btn hf-btn-green" onClick={() => onOpenConsultation('About Farcon')}>Book a Consultation</button>
        </article>
      </div>
    </div>
  </div>
);

export const ServicesPage: React.FC<PageProps> = ({ navigate, onOpenConsultation }) => (
  <div className="pg">
    <div className="pg-wrap">
      <span className="hf-eye">Our Services</span>
      <h1>What we actually do.</h1>
      <p className="lede">Ten ways to work with Farcon. Each one starts with a goal, a horizon and a conversation.</p>
      <div className="pg-grid services" style={{ marginTop: 18 }}>
        {SERVICES.map(([title, text]) => (
          <button
            key={title}
            type="button"
            className="pg-card svc"
            onClick={() => (title === 'Portfolio Review' ? navigate('/portfolio-review') : onOpenConsultation(title))}
          >
            <span className="hf-eye">{title}</span>
            <p>{text}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export const FundsPage: React.FC = () => {
  const [tab, setTab] = useState<'categories' | 'scheme' | 'nav'>('categories');
  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Mutual Funds</span>
        <h1>Categories, schemes, and numbers you should not treat as live.</h1>
        <p className="lede">Everything on this page is an illustrative teaching set. It is not a ranking and not an offer to buy.</p>
        <div className="hf-tabs" style={{ margin: '16px 0' }}>
          <button type="button" className={tab === 'categories' ? 'is-on' : ''} onClick={() => setTab('categories')}>Fund Categories</button>
          <button type="button" className={tab === 'scheme' ? 'is-on' : ''} onClick={() => setTab('scheme')}>Scheme Information</button>
          <button type="button" className={tab === 'nav' ? 'is-on' : ''} onClick={() => setTab('nav')}>NAV / Performance</button>
        </div>
        {tab === 'categories' && (
          <div>
            {CATEGORIES.map(([title, text]) => (
              <details key={title} className="acc" open>
                <summary>{title}</summary>
                <p>{text}</p>
              </details>
            ))}
          </div>
        )}
        {tab === 'scheme' && (
          <div>
            {[
              ['SBI Small Cap Fund', 'Equity · Small cap · Direct Growth · Illustrative only'],
              ['HDFC Flexi Cap Fund', 'Equity · Flexi cap · Direct Growth · Illustrative only'],
              ['ICICI Prudential Balanced Advantage Fund', 'Hybrid · Dynamic · Direct Growth · Illustrative only'],
              ['Axis ELSS Tax Saver Fund', 'Equity · ELSS · Direct Growth · Illustrative only'],
            ].map(([title, text]) => (
              <details key={title} className="acc">
                <summary>{title}</summary>
                <p>{text}. Read the scheme information document from the AMC before acting. Farcon is not publishing a live factsheet here.</p>
              </details>
            ))}
          </div>
        )}
        {tab === 'nav' && (
          <div className="pg-card">
            <p className="hf-note">Illustrative NAVs and 3Y CAGR figures for layout only. Not live. Not a recommendation.</p>
            <div className="hf-metrics"><span>SBI Small Cap<b>26.4% · ₹164.72</b></span><span>Very High</span></div>
            <div className="hf-metrics"><span>HDFC Flexi Cap<b>21.8% · ₹712.35</b></span><span>High</span></div>
            <div className="hf-metrics"><span>ICICI Pru BAF<b>14.6% · ₹348.12</b></span><span>Moderate</span></div>
            <div className="hf-metrics"><span>Axis ELSS<b>18.2% · ₹112.46</b></span><span>High</span></div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PortfolioPage: React.FC = () => (
  <div className="pg">
    <div className="pg-wrap split">
      <div>
        <span className="hf-eye">Portfolio Review / Start Investing</span>
        <h1>Tell us the goal before the scheme.</h1>
        <p className="lede">Share enough for a first conversation. This form does not place an order and does not upload a CAS.</p>
      </div>
      <LeadForm form="Portfolio Review" submitLabel="Request a review" showPreferences />
    </div>
  </div>
);

export const LoginPage: React.FC<PageProps> = ({ onOpenConsultation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Investor Login</span>
        <h1>Account access stays with the AMC.</h1>
        <p className="lede">This screen is a secure-looking request desk. It does not sign you into a Farcon account, and it never stores a password.</p>
        <form
          className="form-card login-card"
          onSubmit={(event) => {
            event.preventDefault();
            setPassword('');
            if (username.trim().length < 3) {
              setNote('Enter the reference you use with your statement, such as a folio or email. Your password is cleared and is not sent.');
              return;
            }
            setNote('Nothing was signed in. Statements and transactions remain with the mutual fund, the exchange or the registrar, in your name. Ask Farcon for a call if you want help reading a statement.');
          }}
        >
          <label className="field">Username or folio<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" /></label>
          <label className="field">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
          <button className="hf-btn hf-btn-green" type="submit">Continue</button>
          <button className="hf-btn hf-btn-outline" type="button" onClick={() => onOpenConsultation('Login help')}>Request a call instead</button>
          {note && <p className="hf-note">{note}</p>}
        </form>
      </div>
    </div>
  );
};

export const EducationPage: React.FC<PageProps> = ({ navigate }) => (
  <div className="pg">
    <div className="pg-wrap">
      <span className="hf-eye">Investor Education</span>
      <h1>Learn, plan, and grow.</h1>
      <p className="lede">Articles from Farcon, questions we hear often, a few public films, and short notes you can download.</p>
      <div className="pg-grid cards" style={{ marginTop: 16 }}>
        {BLOG_POSTS.slice(0, 4).map((post) => (
          <article key={post.id} className="pg-card">
            <span className="hf-eye">{post.category}</span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/education')}>Read Article →</button>
          </article>
        ))}
      </div>
      <h2 style={{ marginTop: 28 }}>FAQs</h2>
      {FAQ_ITEMS.map((item) => (
        <details key={item.id} className="acc">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
      <h2 style={{ marginTop: 28 }}>Educational videos</h2>
      <p className="hf-note">Third-party films for general context. They are not Farcon advice and not scheme recommendations.</p>
      <div className="videos">
        <iframe title="How The Economic Machine Works by Ray Dalio" src="https://www.youtube-nocookie.com/embed/PHe0bXAIuk0" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen />
        <iframe title="Banking Explained – Money and Credit" src="https://www.youtube-nocookie.com/embed/fTTGALaRZoc" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen />
      </div>
      <h2 style={{ marginTop: 28 }}>Downloadable resources</h2>
      <div className="pg-grid cards">
        <a className="pg-card" href="/resources/sip-basics.pdf" download>SIP basics (PDF)</a>
        <a className="pg-card" href="/resources/elss-checklist.pdf" download>ELSS checklist (PDF)</a>
        <a className="pg-card" href="/resources/goal-planning-worksheet.pdf" download>Goal planning worksheet (PDF)</a>
      </div>
    </div>
  </div>
);

export const ContactPage: React.FC = () => {
  const whatsapp = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;
  const map = 'https://maps.google.com/maps?q=A-160%20P.C.%20Colony%20Kankarbagh%20Patna%20800020&z=15&output=embed';
  return (
    <div className="pg">
      <div className="pg-wrap">
        <span className="hf-eye">Contact Us</span>
        <h1>A conversation, not a pitch.</h1>
        <p className="lede">{FARCON_CONFIG.hours}. {FARCON_CONFIG.registeredAddress}</p>
        <div className="hf-cta-row">
          <a className="hf-btn hf-btn-green" href={whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          <a className="hf-btn hf-btn-outline" href={`tel:${FARCON_CONFIG.phoneNumber}`}>Call {FARCON_CONFIG.phoneNumber}</a>
        </div>
        <div className="split" style={{ marginTop: 18 }}>
          <LeadForm form="Contact" submitLabel="Send inquiry" requireMessage />
          <iframe className="map" title="Farcon Wealth office on Google Maps" src={map} loading="lazy" />
        </div>
      </div>
    </div>
  );
};

export const DisclosuresPage: React.FC<{ section?: 'privacy' | 'terms' | 'grievance' | 'disclosures' }> = ({ section = 'disclosures' }) => (
  <div className="pg">
    <div className="pg-wrap">
      <span className="hf-eye">Regulatory Disclosures</span>
      <h1>ARN 229006, in plain language.</h1>
      <article className="pg-card" id="registration">
        <h2>Registration</h2>
        <p>{FARCON_CONFIG.legalName} is an AMFI-registered mutual fund distributor. ARN: 229006. Registered office: {FARCON_CONFIG.registeredAddress}. Email {FARCON_CONFIG.email}.</p>
      </article>
      <article className="pg-card" id="risk" style={{ marginTop: 12 }}>
        <h2>Risk disclosure</h2>
        <p>Mutual fund investments are subject to market risks. Read all scheme related documents carefully. Past performance is not indicative of future returns. Figures on this website that are marked illustrative are not live NAVs or index levels.</p>
      </article>
      {(section === 'disclosures' || section === 'grievance') && (
        <article className="pg-card" id="grievance" style={{ marginTop: 12 }}>
          <h2>Grievance redressal</h2>
          <p>Write to {FARCON_CONFIG.email} with your name, folio or PAN reference, and what went wrong. If you are not satisfied, you can approach AMFI or the SCORES portal of SEBI. Farcon will acknowledge a written complaint and share the next step.</p>
        </article>
      )}
      {(section === 'disclosures' || section === 'privacy') && (
        <article className="pg-card" id="privacy" style={{ marginTop: 12 }}>
          <h2>Privacy policy and DPDP</h2>
          <p>Enquiry forms collect your name, contact details, city and the goal you describe so we can reply. We do not ask this website to store passwords. Leads may be appended to a Google Sheet controlled by Farcon when a webhook is configured. You can ask us to correct or delete an enquiry by emailing {FARCON_CONFIG.email}.</p>
        </article>
      )}
      {(section === 'disclosures' || section === 'terms') && (
        <article className="pg-card" id="terms" style={{ marginTop: 12 }}>
          <h2>Terms of use</h2>
          <p>This website is information from a mutual fund distributor. It is not a research report, not an offer, and not a promise of returns. Calculators are estimates from stated assumptions. Using the site does not create an advisory mandate.</p>
        </article>
      )}
    </div>
  </div>
);

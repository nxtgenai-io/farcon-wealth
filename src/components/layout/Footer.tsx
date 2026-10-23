import React from 'react';
import { RoutePath } from '@/types';
import { FARCON_CONFIG } from '@/content/site/config';
import { BrandLockup } from '@/components/layout/BrandLockup';

interface FooterProps {
  navigate: (path: RoutePath) => void;
}

const columns: { title: string; links: { label: string; href: RoutePath }[] }[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Mutual Funds', href: '/mutual-funds' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Calculators', href: '/calculators' },
      { label: 'Investor Quiz', href: '/investor-quiz' },
      { label: 'Wealth Planner', href: '/wealth-planner' },
      { label: 'Portfolio Review', href: '/portfolio-review' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Education', href: '/education' },
      { label: 'Blogs', href: '/blogs' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'DPDP Policy', href: '/privacy' },
      { label: 'Grievance Redressal', href: '/grievance' },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const whatsapp = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;
  return (
    <footer className="fw-footer">
      <div className="fw-footer-grid">
        <div>
          <BrandLockup size="footer" onClick={() => navigate('/')} />
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <button key={link.label} type="button" onClick={() => navigate(link.href)}>
                {link.label}
              </button>
            ))}
          </div>
        ))}
        <div>
          <h2>Connect With Us</h2>
          <a className="fw-wa-pill" href={whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          <div className="fw-social">
            {FARCON_CONFIG.social.linkedin ? (
              <a href={FARCON_CONFIG.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.7 3.3A1.7 1.7 0 1 0 4.7 6.7 1.7 1.7 0 0 0 4.7 3.3zM3.2 8.2h3v12h-3v-12zM9.2 8.2h2.9v1.6h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7v7.3h-3v-6.5c0-1.5 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.4v6.6h-3v-12z" /></svg>
              </a>
            ) : null}
            {FARCON_CONFIG.social.youtube ? (
              <a href={FARCON_CONFIG.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 15.5v-7l6 3.5-6 3.5zM23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6z" /></svg>
              </a>
            ) : null}
            {FARCON_CONFIG.social.instagram ? (
              <a href={FARCON_CONFIG.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.4 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" /></svg>
              </a>
            ) : null}
            <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2A8.7 8.7 0 0 0 4.6 16.3L3.4 20.6l4.4-1.2A8.7 8.7 0 1 0 12 3.2zm5 12.3c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.7 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.4-.3.5-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 2 1.1 2.3 1.3.2.1.4.1.5-.1.1-.2.6-.7.8-.9.2-.2.3-.2.6-.1.2.1 1.5.7 1.8.8.2.1.4.2.4.3.1.2 0 .8-.2 1.4z" /></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="fw-legal">
        <p>
          Mutual fund investments are subject to market risks. Read all scheme related documents carefully. | AMFI-registered Mutual Fund Distributor | ARN: {FARCON_CONFIG.arn}
        </p>
        <p>© {new Date().getFullYear()} Farcon Wealth. All rights reserved.</p>
      </div>
    </footer>
  );
};

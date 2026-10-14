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
          <BrandLockup tone="light" onClick={() => navigate('/')} />
          <p style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 280 }}>
            Goal-based mutual fund guidance. Investments are made in your name. Farcon does not hold your money.
          </p>
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
          <div className="fw-social">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><span className="sr-only">LinkedIn</span><span aria-hidden="true">in</span></a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><span className="sr-only">YouTube</span><span aria-hidden="true">▶</span></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><span className="sr-only">Instagram</span><span aria-hidden="true">◎</span></a>
            <a href={whatsapp} target="_blank" rel="noreferrer"><span className="sr-only">WhatsApp</span><span aria-hidden="true">✆</span></a>
          </div>
          <a href={`mailto:${FARCON_CONFIG.email}`}>{FARCON_CONFIG.email}</a>
          <a href={`tel:${FARCON_CONFIG.phoneNumber}`}>{FARCON_CONFIG.phoneNumber}</a>
        </div>
      </div>
      <div className="fw-legal">
        <p>
          Mutual fund investments are subject to market risks. Read all scheme related documents carefully. | AMFI-registered Mutual Fund Distributor | ARN: 229006
        </p>
        <p>© 2025 Farcon Wealth. All rights reserved.</p>
      </div>
    </footer>
  );
};

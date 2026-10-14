import { RoutePath } from '@/types';

export const PRIMARY_NAV: { label: string; href: RoutePath; short: string }[] = [
  { label: 'Home', short: 'Home', href: '/' },
  { label: 'About Us', short: 'About', href: '/about' },
  { label: 'Our Services', short: 'Services', href: '/services' },
  { label: 'Mutual Funds', short: 'Funds', href: '/mutual-funds' },
  { label: 'Calculators', short: 'Calculators', href: '/calculators' },
  { label: 'Portfolio Review', short: 'Portfolio', href: '/portfolio-review' },
  { label: 'Investor Education', short: 'Education', href: '/education' },
  { label: 'Contact Us', short: 'Contact', href: '/contact' },
  { label: 'Regulatory Disclosures', short: 'Disclosures', href: '/disclosures' },
];

export const SERVICE_LINKS: { label: string; href: RoutePath }[] = [
  { label: 'SIP', href: '/services' },
  { label: 'Lumpsum', href: '/services' },
  { label: 'Goal-Based Investment', href: '/services' },
  { label: 'Portfolio Review', href: '/portfolio-review' },
  { label: 'Child Education', href: '/goals/child-education' },
  { label: 'Retirement', href: '/goals/retirement' },
  { label: 'Tax Saving', href: '/goals/tax-saving' },
];

import { RoutePath } from '@/types';

export const PRIMARY_NAV: { label: string; href: RoutePath; short: string; later?: boolean }[] = [
  { label: 'Home', short: 'Home', href: '/' },
  { label: 'Services', short: 'Services', href: '/services' },
  { label: 'Goals', short: 'Goals', href: '/goals' },
  { label: 'Calculators', short: 'Calculators', href: '/calculators' },
  { label: 'Investor Quiz', short: 'Investor Quiz', href: '/investor-quiz', later: true },
  { label: 'Planner', short: 'Planner', href: '/wealth-planner' },
  { label: 'Funds', short: 'Funds', href: '/mutual-funds' },
  { label: 'Education', short: 'Education', href: '/education', later: true },
  { label: 'About', short: 'About', href: '/about', later: true },
];

export const SERVICE_LINKS: { label: string; href: RoutePath }[] = [
  { label: 'Goal-Based SIP Planning', href: '/services/sip-planning' },
  { label: 'Portfolio Review', href: '/services/portfolio-review' },
  { label: 'ELSS / Tax-Saving', href: '/services/elss' },
  { label: 'Retirement Planning', href: '/services/retirement' },
  { label: 'Child Education', href: '/services/child-education' },
  { label: 'Systematic Withdrawal (SWP)', href: '/services/swp' },
];

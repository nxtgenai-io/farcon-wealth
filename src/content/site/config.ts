export const SITE_URL = 'https://farconwealth.com';

export const FARCON_CONFIG = {
  siteUrl: SITE_URL,
  brandName: 'FARCON WEALTH',
  legalName: 'Farcon Wealth Private Limited',
  registrationType: 'AMFI Registered Mutual Fund Distributor',
  arn: '329006',
  tagline: 'Investing, without the noise.',
  subTagline: 'Clarity over complexity. Suitability before returns. Transparent process.',
  email: 'hello@farconwealth.com',
  registeredAddress: 'A-160, P.C. Colony, Kankarbagh, Patna, Bihar, India – 800020',
  whatsappNumber: '917673008502',
  /** Blank on purpose: the site must not publish a phone number or tel: link. */
  phoneNumber: '',
  /** Leave empty until Ankit shares the real investor-platform URL. The login page hides the link while this is blank. */
  investorLoginUrl: '',
  /** Leave empty until the real profiles exist. The footer hides each icon while its URL is blank. */
  social: { linkedin: '', youtube: '', instagram: '' },
  /** Leave empty to hide the Turnstile widget. The worker checks TURNSTILE_SECRET only when that secret is set. */
  turnstileSiteKey: '',
  /** Sample index levels are not a live feed. Do not stamp them with today's date. */
  illustrativeMarketAsOf: '30 Sep 2026',
  hours: 'Mon – Sat: 9:30 AM – 6:30 PM IST',
  regulatoryNotice:
    'Farcon Wealth Private Limited is an AMFI-registered Mutual Fund Distributor (ARN: 329006). Mutual fund investments are subject to market risks, read all scheme related documents carefully before investing. Past performance is not indicative of future returns. Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.',
  demoMode: true,
};

export const NAVIGATION_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Goals', href: '/goals' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Investor Quiz', href: '/investor-quiz' },
  { label: 'Wealth Planner', href: '/wealth-planner' },
  { label: 'Mutual Funds', href: '/mutual-funds' },
  { label: 'Education', href: '/education' },
  { label: 'Contact', href: '/contact' },
];

export const SERVICE_NAV_ITEMS = [
  { label: 'Goal-Based SIP Planning', href: '/services/sip-planning' },
  { label: 'Portfolio Review & Consolidation', href: '/services/portfolio-review' },
  { label: 'ELSS / Tax-Saving Investments', href: '/services/elss' },
  { label: 'Retirement Planning', href: '/services/retirement' },
  { label: 'Child Education Planning', href: '/services/child-education' },
  { label: 'Systematic Withdrawal (SWP)', href: '/services/swp' },
  { label: 'Mutual Fund Distribution', href: '/services/mutual-fund-distribution' },
  { label: 'Lump-Sum Investing', href: '/services/lumpsum' },
  { label: 'Goal-Based Planning', href: '/services/goal-based-planning' },
  { label: 'Wealth Creation', href: '/services/wealth-creation' },
  { label: 'Investment Solutions', href: '/services/investment-solutions' },
];

export const GOAL_NAV_ITEMS = [
  { label: 'Retirement Corpus', href: '/goals/retirement' },
  { label: 'Child Education', href: '/goals/child-education' },
  { label: 'Long-Term Wealth Creation', href: '/goals/wealth-creation' },
  { label: 'Tax-Saving (80C)', href: '/goals/tax-saving' },
];

export const CALCULATOR_NAV_ITEMS = [
  { label: 'SIP Calculator', href: '/calculators/sip' },
  { label: 'Lumpsum Calculator', href: '/calculators/lumpsum' },
  { label: 'Goal Planning Calculator', href: '/calculators/goal' },
  { label: 'Retirement Calculator', href: '/calculators/retirement' },
];

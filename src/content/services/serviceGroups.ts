/** Category order for the services showcase, menu, and about list. */
export const SERVICE_GROUPS: { id: string; label: string; slugs: string[] }[] = [
  {
    id: 'planning',
    label: 'Goal Planning',
    slugs: ['sip-planning', 'goal-based-planning', 'retirement', 'child-education', 'wealth-creation'],
  },
  {
    id: 'investing',
    label: 'Investing',
    slugs: ['mutual-fund-distribution', 'lumpsum', 'elss', 'swp', 'investment-solutions'],
  },
  {
    id: 'review',
    label: 'Review',
    slugs: ['portfolio-review'],
  },
];

/** One-line card copy. Kept concise and clear for first-time investors. */
export const SERVICE_LINES: Record<string, string> = {
  'sip-planning': 'Disciplined monthly investing tied directly to your timeline.',
  'goal-based-planning': 'Target corpus, timeline, and inflation modeled upfront.',
  retirement: 'Build long-term independence with inflation-adjusted income.',
  'child-education': 'Fund future higher-education costs while keeping retirement intact.',
  'wealth-creation': 'Patient equity compounding designed for a 7+ year horizon.',
  'mutual-fund-distribution': 'Registered AMFI distribution through official AMC platforms.',
  lumpsum: 'Deploy surplus capital systematically across curated fund categories.',
  elss: 'Tax-saving equity funds with the shortest statutory lock-in.',
  swp: 'Structured regular monthly cash flows from accumulated capital.',
  'investment-solutions': 'Coordinated portfolios balanced across debt, hybrid, and equity.',
  'portfolio-review': 'Less duplication, lower drag, and clear portfolio alignment.',
};

/** Text wordmarks only. Official AMC logos are not reproduced. */
export const AMC_WORDMARKS = [
  'SBI MF',
  'HDFC MF',
  'ICICI Prudential',
  'Nippon India',
  'Axis MF',
  'Kotak MF',
  'Mirae Asset',
  'Aditya Birla Sun Life',
] as const;

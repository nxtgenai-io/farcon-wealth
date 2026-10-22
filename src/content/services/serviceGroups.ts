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

/** One-line card copy. Kept short so a five-across row stays a single line. */
export const SERVICE_LINES: Record<string, string> = {
  'sip-planning': 'Compounding tied to a personal milestone.',
  'goal-based-planning': 'The date and the amount come first.',
  retirement: 'Independence, with inflation in the plan.',
  'child-education': 'Education funding, retirement left intact.',
  'wealth-creation': 'A long horizon, kept simple.',
  'mutual-fund-distribution': 'A registered distributor, not an adviser.',
  lumpsum: 'One amount, with a horizon attached.',
  elss: 'ELSS for tax saving and a long horizon.',
  swp: 'A predictable monthly cash flow.',
  'investment-solutions': 'A fit across the goals you already have.',
  'portfolio-review': 'Less duplication, lower drag, more clarity.',
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

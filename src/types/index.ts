export type RoutePath =
  | '/design-system'
  | '/'
  | '/about'
  | '/services'
  | '/services/sip-planning'
  | '/services/portfolio-review'
  | '/services/elss'
  | '/services/retirement'
  | '/services/child-education'
  | '/services/swp'
  | '/goals'
  | '/goals/retirement'
  | '/goals/child-education'
  | '/goals/wealth-creation'
  | '/goals/tax-saving'
  | '/calculators'
  | '/calculators/sip'
  | '/calculators/lumpsum'
  | '/calculators/goal'
  | '/calculators/retirement'
  | '/investor-quiz'
  | '/wealth-planner'
  | '/mutual-funds'
  | '/portfolio-review'
  | '/investor-login'
  | '/education'
  | '/blogs'
  | '/faq'
  | '/contact'
  | '/privacy'
  | '/terms'
  | '/disclosures'
  | '/grievance';

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  whatItIs: string[];
  whoItIsFor: string[];
  howFarconApproaches: { step: string; title: string; description: string }[];
  primaryGoalSlug: string;
  calculatorType: 'sip' | 'lumpsum' | 'goal' | 'retirement';
  faqs: { question: string; answer: string }[];
}

export interface GoalDetail {
  id: string;
  slug: string;
  title: string;
  heroHeadline: string;
  description: string;
  typicalHorizon: string;
  coreConsiderations: string[];
  farconApproach: string[];
  recommendedCalculator: 'sip' | 'goal' | 'retirement' | 'lumpsum';
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  context: string;
  options: {
    label: string;
    description: string;
    score: number; // 1 to 5
    riskWeight: 'conservative' | 'moderate' | 'growth';
  }[];
}

export type SchemeRiskometer =
  | 'Low'
  | 'Low to Moderate'
  | 'Moderate'
  | 'Moderately High'
  | 'High'
  | 'Very High';

export interface InvestorFitProfile {
  band: 'conservative' | 'moderate' | 'growth';
  title: string;
  tagline: string;
  description: string;
  keyCharacteristics: string[];
  recommendedHorizons: string;
  assetAllocationPhilosophy: string;
  nextSteps: string[];
}

export type QuizResultProfile = InvestorFitProfile;

export interface MutualFundItem {
  id: string;
  name: string;
  category: 'Equity - Flexi Cap' | 'Equity - Large & Mid Cap' | 'Equity - Large Cap' | 'Equity - ELSS Tax Saver' | 'Hybrid - Aggressive' | 'Debt - Short Term' | 'Debt - Liquid';
  assetClass: 'Equity' | 'Hybrid' | 'Debt';
  riskometer: SchemeRiskometer;
  nav: number;
  cagr3Y: number;
  cagr5Y: number;
  expenseRatio: number;
  benchmark: string;
  minSIP: number;
  minLumpsum: number;
  suitableHorizon: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'SIP' | 'Mutual Funds' | 'Retirement' | 'Tax Planning' | 'Goal Planning' | 'Basics';
  excerpt: string;
  readTime: string;
  publishedDate: string;
  author: string;
  content: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface LeadContext {
  name: string;
  phone: string;
  email: string;
  goal?: string;
  investmentHorizon?: string;
  monthlySavings?: string;
  quizProfile?: string;
  quizScore?: number;
  calculatorType?: string;
  calculatorInputs?: Record<string, number | string>;
  calculatorSummary?: string;
  plannerSummary?: string;
  portfolioReviewRequested?: boolean;
  notes?: string;
  source?: string;
  utmSource?: string;
  pageUrl?: string;
  timestamp?: string;
  consent: boolean;
}

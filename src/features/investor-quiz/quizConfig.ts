import { QuizQuestion, QuizResultProfile } from '@/types';

export interface DiagnosticDimension {
  id: string;
  label: string;
  shortLabel: string;
  questionIds: number[];
  description: string;
}

export const DIAGNOSTIC_DIMENSIONS: DiagnosticDimension[] = [
  {
    id: 'experience',
    label: 'Experience',
    shortLabel: 'Experience',
    questionIds: [1],
    description: 'Prior investment track record & asset familiarity',
  },
  {
    id: 'horizon',
    label: 'Time Horizon',
    shortLabel: 'Time Horizon',
    questionIds: [2],
    description: 'Capital deployment runway & milestone urgency',
  },
  {
    id: 'risk',
    label: 'Risk Comfort',
    shortLabel: 'Risk Comfort',
    questionIds: [3],
    description: 'Emotional reaction to market dips & volatility',
  },
  {
    id: 'goal',
    label: 'Goal',
    shortLabel: 'Goal',
    questionIds: [4, 5],
    description: 'Primary aspiration & emergency buffer resilience',
  },
  {
    id: 'awareness',
    label: 'Financial Awareness',
    shortLabel: 'Awareness',
    questionIds: [6, 7, 8],
    description: 'Cash-flow predictability, inflation & noise filtering',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Investment Experience',
    question: 'How would you describe your familiarity and track record with mutual funds and market investments?',
    context: 'This helps us understand your baseline comfort with market terminology and cycle behaviors.',
    options: [
      {
        label: 'First-time investor',
        description: 'I primarily save in fixed deposits, savings accounts, or provident funds with guaranteed returns.',
        score: 1,
        riskWeight: 'conservative',
      },
      {
        label: 'Occasional investor',
        description: 'I hold some mutual funds or ELSS started for tax saving, but do not actively monitor markets.',
        score: 2,
        riskWeight: 'moderate',
      },
      {
        label: 'Experienced investor',
        description: 'I have run SIPs across equity funds through ups and downs for multiple years and understand volatility.',
        score: 3,
        riskWeight: 'growth',
      },
    ],
  },
  {
    id: 2,
    category: 'Time Horizon',
    question: 'What is the primary time horizon for your current pool of capital?',
    context: 'Time horizon is the single most critical factor determining how much equity exposure is prudent.',
    options: [
      {
        label: 'Under 3 years',
        description: 'I might need access to this capital for near-term commitments or emergency needs.',
        score: 1,
        riskWeight: 'conservative',
      },
      {
        label: '3 to 7 years',
        description: 'Medium-term goals like higher education, property down payment, or milestone upgrades.',
        score: 2,
        riskWeight: 'moderate',
      },
      {
        label: 'More than 7 years',
        description: 'Long-term goals like retirement, child higher education fund, or lasting wealth creation.',
        score: 3,
        riskWeight: 'growth',
      },
    ],
  },
  {
    id: 3,
    category: 'Reaction to Volatility',
    question: 'If your portfolio drops by 15% due to a general market correction, how would you naturally respond?',
    context: 'Market dips are regular and normal. Your instinctive emotional tolerance matters more than theoretical models.',
    options: [
      {
        label: 'Severe distress',
        description: 'I would feel anxious, lose sleep, and want to exit immediately to prevent further loss.',
        score: 1,
        riskWeight: 'conservative',
      },
      {
        label: 'Cautious patience',
        description: 'I would feel uneasy but stick to my plan and wait for the market to recover.',
        score: 2,
        riskWeight: 'moderate',
      },
      {
        label: 'Strategic calm or opportunity',
        description: 'I understand corrections are part of compounding and would consider adding to my SIP.',
        score: 3,
        riskWeight: 'growth',
      },
    ],
  },
  {
    id: 4,
    category: 'Investment Objective',
    question: 'Which of the following best describes your primary financial aspiration?',
    context: 'Balancing capital security against inflation-beating capital appreciation.',
    options: [
      {
        label: 'Capital Preservation First',
        description: 'Safeguarding my principal is paramount; I am willing to accept modest, inflation-matching returns.',
        score: 1,
        riskWeight: 'conservative',
      },
      {
        label: 'Balanced Growth & Stability',
        description: 'I seek steady wealth expansion that comfortably beats inflation with manageable drawdowns.',
        score: 2,
        riskWeight: 'moderate',
      },
      {
        label: 'Maximum Long-Term Compounding',
        description: 'I want substantial real wealth accumulation over the next decade and can handle market swings along the way.',
        score: 3,
        riskWeight: 'growth',
      },
    ],
  },
  {
    id: 5,
    category: 'Emergency Liquidity',
    question: 'Do you have an emergency fund covering at least 6 months of mandatory household expenses?',
    context: 'An adequate liquidity buffer shields your long-term investments from premature distress liquidation.',
    options: [
      {
        label: 'No emergency buffer yet',
        description: 'Any unexpected emergency would force me to tap into my investment savings.',
        score: 1,
        riskWeight: 'conservative',
      },
      {
        label: 'Partial buffer (2–4 months)',
        description: 'I have some liquid savings set aside, but it might not withstand prolonged disruptions.',
        score: 2,
        riskWeight: 'moderate',
      },
      {
        label: 'Fully funded (6+ months in bank / liquid)',
        description: 'My living expenses and health insurance are well-insulated from any market investments.',
        score: 3,
        riskWeight: 'growth',
      },
    ],
  },
  {
    id: 6,
    category: 'Income Stability',
    question: 'How predictable and secure is your regular income or business cash flow over the next 3–5 years?',
    context: 'Consistent cash flow enables sustained SIP commitments through bull and bear markets.',
    options: [
      {
        label: 'Uncertain or highly cyclical',
        description: 'Cash flows fluctuate widely; I need maximum liquidity and flexibility.',
        score: 1,
        riskWeight: 'conservative',
      },
      {
        label: 'Moderately stable',
        description: 'Steady regular income with occasional fluctuations or career transitions.',
        score: 2,
        riskWeight: 'moderate',
      },
      {
        label: 'Highly predictable and stable',
        description: 'Established profession or strong business with reliable surplus savings every month.',
        score: 3,
        riskWeight: 'growth',
      },
    ],
  },
  {
    id: 7,
    category: 'Inflation Awareness',
    question: 'How do you view the impact of 6%–7% annual inflation on your purchasing power?',
    context: 'Fixed-income investments alone often lose purchasing power after taxes and inflation.',
    options: [
      {
        label: 'I prefer guaranteed numbers',
        description: 'Even if inflation bites slightly, the certainty of capital balance gives me greater peace of mind.',
        score: 1,
        riskWeight: 'conservative',
      },
      {
        label: 'I recognize the risk of inflation',
        description: 'I want a thoughtful blend of conservative assets and equity to preserve real purchasing power.',
        score: 2,
        riskWeight: 'moderate',
      },
      {
        label: 'Inflation is a primary long-term consideration',
        description: 'I prioritize building long-term capital growth to preserve purchasing power over 10+ years.',
        score: 3,
        riskWeight: 'growth',
      },
    ],
  },
  {
    id: 8,
    category: 'Decision-Making Style',
    question: 'When hearing about turbulent headlines or political events, what is your preferred approach?',
    context: 'At Farcon, our core positioning is "Investing, without the noise."',
    options: [
      {
        label: 'Constant monitoring',
        description: 'I check financial news daily and worry whenever negative headlines appear.',
        score: 1,
        riskWeight: 'conservative',
      },
      {
        label: 'Periodic guided reviews',
        description: 'I prefer having a trusted distributor guide me through quarterly checkpoints so I stay focused.',
        score: 2,
        riskWeight: 'moderate',
      },
      {
        label: 'Long-term goal commitment',
        description: 'I ignore daily media noise and let automated systematic plans work on autopilot.',
        score: 3,
        riskWeight: 'growth',
      },
    ],
  },
];

export const QUIZ_PROFILES: Record<'conservative' | 'moderate' | 'growth', QuizResultProfile> = {
  conservative: {
    band: 'conservative',
    title: 'Conservative & Capital-Focused',
    tagline: 'Prioritizing capital stability, lower volatility, and near-term liquidity.',
    description:
      'You value peace of mind and predictability over high-variance market gains. You are uncomfortable with sharp drawdowns, and your primary goal is to protect accumulated capital while generating modest returns that match or slightly outpace inflation.',
    keyCharacteristics: [
      'Low tolerance for capital loss or short-term portfolio drawdowns',
      'Prefers stability and predictable quarterly progress',
      'Shorter time horizon or building an essential emergency corpus first',
    ],
    recommendedHorizons: '1 to 4 Years',
    assetAllocationPhilosophy:
      'Typically emphasizes high-grade debt funds, conservative hybrid allocations, and liquid instruments, with only minimal or zero equity volatility.',
    nextSteps: [
      'Focus on establishing a robust 6-month emergency reserve',
      'Explore short-duration and conservative hybrid mutual fund categories',
      'Schedule a calm, one-on-one consultation with Farcon Wealth to review your liquidity needs',
    ],
  },
  moderate: {
    band: 'moderate',
    title: 'Balanced & Goal-Oriented',
    tagline: 'Seeking steady long-term growth with calculated risk mitigation.',
    description:
      'You understand that achieving real wealth requires beating inflation through equities, but you prefer a buffered journey. You are willing to endure moderate temporary volatility in exchange for healthy compounding over a medium-to-long term horizon.',
    keyCharacteristics: [
      'Willing to accept moderate paper fluctuations for superior 5+ year returns',
      'Believes in structured asset allocation across Equity and Hybrid categories',
      'Balances family milestones with disciplined regular SIP habits',
    ],
    recommendedHorizons: '4 to 8 Years',
    assetAllocationPhilosophy:
      'Typically pairs Flexi-Cap and Large-Cap equity with Aggressive Hybrid or Balanced Advantage strategies for automatic market counter-balancing.',
    nextSteps: [
      'Align specific monthly SIP amounts to tangible goals (Child Education, Home, Wealth Creation)',
      'Use the Farcon SIP Calculator to project your 5–7 year trajectory',
      'Connect with Farcon Wealth to structure a disciplined, multi-asset plan',
    ],
  },
  growth: {
    band: 'growth',
    title: 'Growth-Focused Compounding',
    tagline: 'Harnessing market cycles for long-term compounding over a 7+ year horizon.',
    description:
      'You possess both the time horizon and psychological temperament to view market corrections as opportunities rather than disasters. Your focus is firmly locked on long-term capital appreciation, inflation-beating returns, and financial independence.',
    keyCharacteristics: [
      'High emotional resilience through bear markets and macroeconomic noise',
      'Clear time horizon extending 7 to 15+ years',
      'Focuses on substantial wealth creation, retirement corpus, or legacy funds',
    ],
    recommendedHorizons: '7+ Years',
    assetAllocationPhilosophy:
      'Emphasizes diversified equity mutual funds (Flexi Cap, Large & Mid Cap, ELSS) with systematic periodic rebalancing and minimal near-term cash drag.',
    nextSteps: [
      'Calculate your target retirement corpus or wealth goal with the Farcon Planner',
      'Establish automated SIPs with an annual step-up increment of 10%',
      'Book a complimentary portfolio review with Farcon Wealth to optimize fund overlap',
    ],
  },
};

/**
 * Deterministic scoring engine for the Investor Quiz
 * Total possible score: 8 to 24 points.
 * 8 - 13: Conservative
 * 14 - 19: Moderate
 * 20 - 24: Growth
 */
export function scoreQuiz(answers: Record<number, number>): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  band: 'conservative' | 'moderate' | 'growth';
  profile: QuizResultProfile;
} {
  const maxScore = QUIZ_QUESTIONS.length * 3;
  let totalScore = 0;

  QUIZ_QUESTIONS.forEach((q) => {
    const selectedScore = answers[q.id] || 2;
    totalScore += selectedScore;
  });

  let band: 'conservative' | 'moderate' | 'growth' = 'moderate';
  if (totalScore <= 13) {
    band = 'conservative';
  } else if (totalScore <= 19) {
    band = 'moderate';
  } else {
    band = 'growth';
  }

  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    totalScore,
    maxScore,
    percentage,
    band,
    profile: QUIZ_PROFILES[band],
  };
}

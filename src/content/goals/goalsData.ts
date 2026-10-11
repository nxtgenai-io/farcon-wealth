import { GoalDetail } from '@/types';

export const FARCON_GOALS: GoalDetail[] = [
  {
    id: 'retirement',
    slug: 'retirement',
    title: 'Retirement Freedom',
    heroHeadline: 'Retire on your terms, with an inflation-proof lifetime corpus.',
    description:
      'Ensure 25 to 35 post-retirement years of uncompromised dignity, medical security, and self-reliance without depending on anyone.',
    typicalHorizon: '10 to 25 Years',
    coreConsiderations: [
      'Lifestyle inflation compounding at 6% to 7% annually',
      'Rising healthcare expenses in later decades',
      'The risk of outliving your accumulated savings (longevity risk)',
      'Balancing equity compounding now with capital protection later',
    ],
    farconApproach: [
      'Calculate true future monthly expenses rather than current numbers',
      'Build a robust equity-oriented SIP accumulation engine',
      'Execute a smooth glide path towards balanced and debt assets 3 years before retirement',
      'Establish a tax-optimized Systematic Withdrawal Plan (SWP) for monthly income',
    ],
    recommendedCalculator: 'retirement',
  },
  {
    id: 'child-education',
    slug: 'child-education',
    title: 'Child Education',
    heroHeadline: 'Fund world-class academic dreams without financial stress.',
    description:
      'Higher education costs in premier institutions double every 6 to 7 years. Build an earmarked education fund that matures right when admission calls arrive.',
    typicalHorizon: '5 to 15 Years',
    coreConsiderations: [
      'Education inflation frequently surpasses 10%–12% per annum',
      'Strict, non-negotiable admission deadlines that cannot be delayed for market recoveries',
      'Currency exchange rate impact for potential overseas degrees',
      'Protecting your own retirement fund from being compromised for tuition fees',
    ],
    farconApproach: [
      'Benchmark costs against target professional and international degrees',
      'Earmark dedicated mutual fund folios so capital is never co-mingled with discretionary expenses',
      'Gradually lock profits into liquid/debt funds 24 months before admission to shield against short-term volatility',
    ],
    recommendedCalculator: 'goal',
  },
  {
    id: 'wealth-creation',
    slug: 'wealth-creation',
    title: 'Wealth Creation',
    heroHeadline: 'Disciplined compounding for generational financial independence.',
    description:
      'Long-term capital appreciation that turns consistent surplus cash flow into enduring family net worth and milestone freedom.',
    typicalHorizon: '7+ Years',
    coreConsiderations: [
      'Patience through 3–4 full market cycles of expansion and correction',
      'Resisting the urge to react emotionally to daily financial news and market noise',
      'Maintaining disciplined diversification across Flexi-Cap, Large & Mid Cap, and hybrid strategies',
    ],
    farconApproach: [
      'Focus on broad-market asset allocation rather than speculative sector bets',
      'Automate monthly investments via SIP with systematic step-up increments',
      'Quarterly portfolio reviews to rebalance asset classes calmly without emotional churn',
    ],
    recommendedCalculator: 'sip',
  },
  {
    id: 'tax-saving',
    slug: 'tax-saving',
    title: 'Tax Saving Through ELSS',
    heroHeadline: 'Tax saving through ELSS alongside long-term equity wealth building.',
    description:
      'Equity Linked Savings Schemes combine a 3-year statutory lock-in period with disciplined equity compounding. Tax benefits are subject to the applicable tax regime and prevailing tax laws.',
    typicalHorizon: '3 to 5+ Years',
    coreConsiderations: [
      'Deductions up to ₹1,50,000 under Section 80C (applicable under the Old Tax Regime; tax benefits depend on individual tax regime choice)',
      'Statutory 3-year lock-in period applies to each investment allotment',
      'Long-term equity compounding potential managed by registered mutual fund managers',
    ],
    farconApproach: [
      'Audit applicability of Old vs New Tax Regime before committing capital',
      'Spread investments across 12 monthly SIPs to eliminate year-end cash crunch and panic',
      'Encourage treating ELSS as a 5–7 year compounding vehicle beyond the mandatory 3-year lock-in',
    ],
    recommendedCalculator: 'sip',
  },
];

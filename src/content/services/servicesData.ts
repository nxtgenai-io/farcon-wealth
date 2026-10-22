import { ServiceDetail } from '@/types';

export const FARCON_SERVICES: ServiceDetail[] = [
  {
    id: 'sip-planning',
    slug: 'sip-planning',
    title: 'Goal-Based SIP Planning',
    tagline: 'Disciplined compounding aligned with personal milestones.',
    summary:
      'We link every Systematic Investment Plan to a specific tangible goal, appropriate horizon, and risk tolerance—transforming speculative market anxiety into quiet, automated execution.',
    whatItIs: [
      'Structured recurring monthly investments allocated directly towards predetermined life milestones.',
      'Rupee-cost averaging across equity and hybrid market cycles without emotional market timing.',
      'Carefully calibrated asset allocation calibrated against your exact time horizon.',
      'Step-up and milestone review checkpoints to expand SIPs as your income expands.',
    ],
    whoItIsFor: [
      'Salaried professionals and entrepreneurs building steady wealth from recurring monthly cash flows.',
      'Investors tired of trying to time market tops and bottoms.',
      'Families planning defined 5, 10, or 20-year milestones such as a home, education, or legacy fund.',
    ],
    howFarconApproaches: [
      {
        step: '01',
        title: 'Define the Target & Timeline',
        description:
          'We quantify the inflation-adjusted future capital required for your specific goal before recommending any scheme.',
      },
      {
        step: '02',
        title: 'Asset Allocation Suitability',
        description:
          'We design an allocation blend (Equity, Hybrid, or Debt) appropriate for how long the money has to compound.',
      },
      {
        step: '03',
        title: 'Disciplined Automated Setup',
        description:
          'Direct mandate registration in your name with institutional transparency, zero intermediary fund holding.',
      },
      {
        step: '04',
        title: 'Periodic Milestone Tracking',
        description:
          'Quarterly or semi-annual check-ins to rebalance and ensure your trajectory remains intact despite market swings.',
      },
    ],
    primaryGoalSlug: 'wealth-creation',
    calculatorType: 'sip',
    faqs: [
      {
        question: 'What is the minimum amount required to start a SIP?',
        answer:
          'Most mutual fund schemes allow SIPs starting at ₹500 or ₹1,000 per month. The key advantage is consistency rather than starting with a large sum.',
      },
      {
        question: 'Can I increase or pause my SIP if cash flows fluctuate?',
        answer:
          'Yes. Mutual fund SIPs offer high flexibility. You can pause, modify, or activate top-up (step-up) SIPs at any time without penalty.',
      },
      {
        question: 'Does Farcon hold my investment money?',
        answer:
          'Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.',
      },
    ],
  },
  {
    id: 'portfolio-review',
    slug: 'portfolio-review',
    title: 'Portfolio Review & Consolidation',
    tagline: 'Eliminate fund duplication, trim hidden costs, restore clarity.',
    summary:
      'Over the years, investors often accumulate 15–25 disconnected mutual funds through random tips, tax deadlines, and apps. We provide a rigorous diagnostic to consolidate and rebalance your holdings.',
    whatItIs: [
      'Comprehensive audit of all existing mutual fund folios across different platforms and AMCs.',
      'Diagnostic overlap analysis to identify duplicate stock exposures across multiple equity schemes.',
      'Evaluation of category suitability, expense ratios, trailing risk-adjusted performance, and taxation impact.',
      'A structured, staged migration roadmap to streamline your portfolio into 4–6 purpose-driven schemes.',
    ],
    whoItIsFor: [
      'Investors with cluttered portfolios spread across multiple apps, brokers, or direct folios.',
      'Individuals who started funds years ago without an overarching strategy and have lost track of asset allocation.',
      'Investors seeking institutional clarity on whether their current investments still match their future needs.',
    ],
    howFarconApproaches: [
      {
        step: '01',
        title: 'Consolidated Statement Upload',
        description:
          'Upload your CAMS/KFintech Consolidated Account Statement (CAS) in encrypted, confidential storage.',
      },
      {
        step: '02',
        title: 'Institutional Diagnostic',
        description:
          'We evaluate portfolio concentration, category overlap, active risk, and alignment with your stated horizon.',
      },
      {
        step: '03',
        title: 'Actionable Consolidation Blueprint',
        description:
          'We provide a clear Keep / Trim / Switch plan, taking exit loads and capital gains taxation into account.',
      },
      {
        step: '04',
        title: 'Ongoing Governance',
        description:
          'Periodic half-yearly portfolio audits to ensure your consolidated core remains resilient.',
      },
    ],
    primaryGoalSlug: 'wealth-creation',
    calculatorType: 'lumpsum',
    faqs: [
      {
        question: 'Is the portfolio review confidential?',
        answer:
          'Completely. Your portfolio details are evaluated exclusively by our senior distributor team for diagnostic purposes and never shared.',
      },
      {
        question: 'Will consolidating trigger heavy capital gains taxes?',
        answer:
          'We structure all rebalancing transitions deliberately. Whenever feasible, we utilize tax-harvesting windows and avoid premature switches that trigger unnecessary exit loads or short-term taxes.',
      },
    ],
  },
  {
    id: 'elss',
    slug: 'elss',
    title: 'Tax Saving Through ELSS',
    tagline: 'Tax saving through ELSS equity mutual funds alongside long-term wealth creation.',
    summary:
      'Equity Linked Savings Schemes (ELSS) carry a 3-year statutory lock-in period combined with long-term equity compounding potential. Tax benefits are subject to the applicable tax regime and prevailing tax laws.',
    whatItIs: [
      'Deductions of up to ₹1,50,000 under Section 80C of the Income Tax Act (applicable under the Old Tax Regime).',
      'Diversified equity mutual fund portfolio managed by registered fund managers.',
      '3-year mandatory lock-in period from the date of each investment allotment.',
      'Option to invest via disciplined monthly SIPs or lump-sum installments during the financial year.',
    ],
    whoItIsFor: [
      'Taxpayers opting for the Old Tax Regime seeking Section 80C deductions (tax benefits are subject to the applicable tax regime and prevailing tax laws).',
      'Investors seeking equity market participation with a disciplined 3-year minimum lock-in period.',
      'Individuals aiming to replace year-end lump-sum allocations with automated monthly SIPs.',
    ],
    howFarconApproaches: [
      {
        step: '01',
        title: 'Assess Tax Regime Viability',
        description:
          'We check whether Old or New Tax Regime makes mathematical sense for your overall deductions.',
      },
      {
        step: '02',
        title: 'Eliminate Year-End Panic',
        description:
          'Instead of last-minute February scrambles, we set up year-round monthly SIPs in high-conviction ELSS schemes.',
      },
      {
        step: '03',
        title: 'Long-Term Horizon Focus',
        description:
          'While the statutory lock-in is 3 years, we help you treat ELSS as a 5–7 year wealth creation engine for superior outcomes.',
      },
      {
        step: '04',
        title: 'Post Lock-in Review',
        description:
          'We audit your mature units at the 36-month mark to decide whether to let them compound or re-deploy into goal funds.',
      },
    ],
    primaryGoalSlug: 'tax-saving',
    calculatorType: 'sip',
    faqs: [
      {
        question: 'What happens after the 3-year lock-in finishes?',
        answer:
          'Units unlock automatically. You are not forced to withdraw; you can let them stay invested and compound as long as you wish, or redeem without exit loads.',
      },
      {
        question: 'Can I do an SIP in ELSS?',
        answer:
          'Yes. Each monthly installment is subject to its own 3-year lock-in period from the date of unit allocation.',
      },
    ],
  },
  {
    id: 'retirement',
    slug: 'retirement',
    title: 'Retirement Planning',
    tagline: 'Engineering lifetime financial independence with inflation protection.',
    summary:
      'Retirement is not an age; it is the mathematical freedom to live on your own terms. We calculate the exact future corpus required to sustain your lifestyle for 25–30 post-working years.',
    whatItIs: [
      'Inflation-adjusted future cash-flow projection accounting for lifestyle inflation and medical contingencies.',
      'Two-phase strategy: aggressive wealth accumulation during earning years, transitioning into capital preservation and SWP generation later.',
      'Stress-testing retirement readiness against market drawdowns, longevity risk, and declining real interest rates.',
      'Integration of existing provident funds, gratuity, and assets into a single cohesive retirement roadmap.',
    ],
    whoItIsFor: [
      'Professionals in their 30s, 40s, and 50s preparing for a seamless transition into financial independence.',
      'Individuals who want to ensure they never outlive their capital or become financially reliant on children.',
      'Early retirement seekers (FIRE advocates) requiring an accelerated accumulation and sustainable withdrawal strategy.',
    ],
    howFarconApproaches: [
      {
        step: '01',
        title: 'Realistic Lifestyle Costing',
        description:
          'We compute your current living costs and project them forward using realistic 6%–7% long-term inflation.',
      },
      {
        step: '02',
        title: 'Longevity Corpus Math',
        description:
          'We model the corpus needed across a 30-year post-retirement span with conservative post-retirement returns.',
      },
      {
        step: '03',
        title: 'Core-Satellite Accumulation',
        description:
          'We build a disciplined SIP allocation combining broad-market equity index/flexi-cap funds with hybrid balance.',
      },
      {
        step: '04',
        title: 'Glide Path Transition',
        description:
          'As you approach retirement age, we gradually de-risk equity exposure to protect accrued capital against sudden market downturns.',
      },
    ],
    primaryGoalSlug: 'retirement',
    calculatorType: 'retirement',
    faqs: [
      {
        question: 'Why does inflation make retirement planning so critical?',
        answer:
          'At 6% inflation, a monthly expense of ₹50,000 today will require approximately ₹1.6 Lakhs per month in 20 years just to maintain the identical standard of living.',
      },
      {
        question: 'When should I start retirement planning?',
        answer:
          'The earlier you start, the more compounding does the heavy lifting. Starting at age 28 requires less than one-third the monthly SIP required if you begin at age 42.',
      },
    ],
  },
  {
    id: 'child-education',
    slug: 'child-education',
    title: 'Child Education Planning',
    tagline: 'Funding world-class academic dreams without dipping into retirement.',
    summary:
      'Higher education inflation in India and globally often exceeds 10% annually. We construct dedicated, non-negotiable education funds that mature precisely when tuition fees come due.',
    whatItIs: [
      'Goal-specific investment vehicle separated from family day-to-day reserves.',
      'Academic cost forecasting for undergraduate, postgraduate, domestic, or overseas university degrees.',
      'Strict time-horizon matching: aggressive compounding during the child’s early years, gradually de-risking 2 years before university admission.',
      'Prevents high-interest student debt and shields your own retirement nest egg from premature liquidation.',
    ],
    whoItIsFor: [
      'Parents of young children (ages 0 to 12) wanting to secure quality higher education without compromise.',
      'Families considering overseas education requiring currency-hedged long-term planning.',
      'Grandparents establishing a dedicated academic education fund for their grandchildren.',
    ],
    howFarconApproaches: [
      {
        step: '01',
        title: 'Target Institution Benchmarking',
        description:
          'We evaluate target fields (Engineering, Medicine, Management, Design, Overseas) and apply realistic educational inflation.',
      },
      {
        step: '02',
        title: 'Dedicated Goal Folios',
        description:
          'We earmark specific mutual fund folios tagged exclusively to the child’s education so the money is never co-mingled.',
      },
      {
        step: '03',
        title: 'Automated Monthly Compounding',
        description:
          'Automated SIPs ensure continuous accumulation without emotional second-guessing during market corrections.',
      },
      {
        step: '04',
        title: '2-Year Safety Lock Glidepath',
        description:
          '24 months before the expected university matriculation date, we systematically shift the target corpus into safe, high-liquidity debt funds.',
      },
    ],
    primaryGoalSlug: 'child-education',
    calculatorType: 'goal',
    faqs: [
      {
        question: 'Can mutual funds be invested in the minor child’s name?',
        answer:
          'Yes. Mutual funds can be opened in the name of a minor with either parent acting as guardian, or held in the parents’ names with the child designated as nominee.',
      },
      {
        question: 'Why not use traditional child insurance savings plans?',
        answer:
          'Traditional child insurance plans historically deliver low internal rates of return (typically 4%–5%), which fail to keep pace with 10% educational inflation. Goal-based mutual fund portfolios provide inflation-beating equity participation with disciplined de-risking.',
      },
    ],
  },
  {
    id: 'swp',
    slug: 'swp',
    title: 'Systematic Withdrawal Plans (SWP)',
    tagline: 'Creating a structured, predictable regular monthly cash flow.',
    summary:
      'Turn your accumulated mutual fund corpus into a predictable monthly cash-flow stream. Under an SWP, each periodic redemption is treated as a sale of units, meaning only the capital gain portion is subject to applicable mutual fund tax provisions.',
    whatItIs: [
      'Automated withdrawal of a fixed predetermined sum on a chosen date every month directly into your bank account.',
      'Remaining corpus continues to stay invested and compound in suitable conservative, hybrid, or debt mutual funds.',
      'Structured tax treatment: you are only taxed on the capital gain portion of each redeemed unit, rather than the entire principal value.',
      'Complete liquidity: you retain full ownership and can pause, increase, or withdraw the remainder at any time.',
    ],
    whoItIsFor: [
      'Retirees seeking a structured monthly pension-like income stream.',
      'Investors managing accumulated wealth or post-retirement funds.',
      'Individuals seeking structured periodic cash flows governed by mutual fund capital gains provisions.',
    ],
    howFarconApproaches: [
      {
        step: '01',
        title: 'Sustainable Withdrawal Rate Planning',
        description:
          'We evaluate a disciplined withdrawal rate (typically 5%–6% annually) to maintain corpus longevity.',
      },
      {
        step: '02',
        title: 'Multi-Bucket Allocation',
        description:
          'We allocate capital across short-term liquidity buffers, balanced hybrid funds, and long-term equity growth according to your risk comfort.',
      },
      {
        step: '03',
        title: 'Automated Direct Bank Credit',
        description:
          'Your chosen periodic sum is credited directly to your registered bank account on your preferred calendar date.',
      },
      {
        step: '04',
        title: 'Annual Sustainability Review',
        description:
          'We monitor corpus sustainability annually and help calibrate withdrawal amounts against inflation.',
      },
    ],
    primaryGoalSlug: 'retirement',
    calculatorType: 'retirement',
    faqs: [
      {
        question: 'How does taxation apply to SWP redemptions?',
        answer:
          'In mutual funds, an SWP transaction is treated as a redemption of units. Each redemption comprises both returned capital and a proportionate capital gains component. Tax applies solely to the realized capital gain according to the fund category (equity or debt) and your holding period, subject to prevailing tax laws.',
      },
      {
        question: 'Can the corpus sustain market volatility?',
        answer:
          'By structuring investments across appropriate asset classes and calibrating withdrawals to sustainable rates, the strategy is engineered to support long-term capital preservation.',
      },
    ],
  },
  servicePage('mutual-fund-distribution', 'Mutual Fund Distribution', 'goal', 'wealth-creation', 'A registered distributor, not an adviser.', 'Farcon Wealth distributes mutual fund schemes under ARN 329006. The folio is in your name. Farcon does not hold the money and does not promise a return.'),
  servicePage('lumpsum', 'Lump-Sum Investing', 'lumpsum', 'wealth-creation', 'One amount, with a horizon attached.', 'A lump sum is useful when money is already set aside and the goal is years away. The category still follows the horizon, not a market call.'),
  servicePage('goal-based-planning', 'Goal-Based Planning', 'goal', 'wealth-creation', 'The date and the amount come first.', 'Planning starts with what the money is for, when it is needed, and what is already saved. A SIP or a lump sum is only the way the gap is funded.'),
  servicePage('wealth-creation', 'Wealth Creation', 'sip', 'wealth-creation', 'A long horizon, kept simple.', 'Wealth creation here means a long-term mutual fund plan in your name, reviewed when life changes, not when the index moves for a week.'),
  servicePage('investment-solutions', 'Investment Solutions', 'goal', 'wealth-creation', 'A fit across the goals you already have.', 'When more than one goal is in play, Farcon maps each one to a horizon and a category mix. It is distribution and planning support, not a managed portfolio service.'),
];

function servicePage(
  slug: string,
  title: string,
  calculatorType: ServiceDetail['calculatorType'],
  primaryGoalSlug: string,
  tagline: string,
  summary: string,
): ServiceDetail {
  return {
    id: slug,
    slug,
    title,
    tagline,
    summary,
    whatItIs: [
      'A conversation that starts with the goal, the date and the surplus.',
      'Mutual fund categories chosen for that horizon. Not a product list.',
      'The purchase is in your name, through the AMC or exchange platform.',
      'A review when the goal or the surplus changes.',
    ],
    whoItIsFor: [
      'People who want a distributor they can name, with ARN 329006 on the record.',
      'Families who would rather a smaller suitable plan than a larger one they abandon.',
    ],
    howFarconApproaches: [
      { step: '01', title: 'Name the goal', description: 'What the money is for, and the year you expect to use it.' },
      { step: '02', title: 'See the gap', description: 'Inflation, current savings and the illustrative SIP or lump sum.' },
      { step: '03', title: 'Choose a category', description: 'Equity, hybrid, debt or ELSS only where the horizon and tax position fit.' },
      { step: '04', title: 'Keep it in your name', description: 'Farcon does not hold the money. The folio stays yours.' },
    ],
    primaryGoalSlug,
    calculatorType,
    faqs: [
      { question: `What does ${title} include?`, answer: 'A planning conversation and mutual fund distribution. It is not investment advice from a registered investment adviser, and it is not a promise of returns.' },
      { question: 'Does Farcon hold the money?', answer: 'No. Purchases sit with the mutual fund, the exchange and the registrar, in your name.' },
    ],
  };
}

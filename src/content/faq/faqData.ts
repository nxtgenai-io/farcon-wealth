export interface FAQItem {
  id: string;
  category: 'About Farcon' | 'Investments & SIP' | 'Safety & Transparency' | 'Process & Service';
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'About Farcon',
    question: 'What is Farcon Wealth and how is it regulated?',
    answer:
      'Farcon Wealth Private Limited is an AMFI-registered Mutual Fund Distributor holding ARN: 329006. We operate under the regulatory framework established by the Association of Mutual Funds in India (AMFI) and the Securities and Exchange Board of India (SEBI).',
  },
  {
    id: 'faq-2',
    category: 'Safety & Transparency',
    question: 'Does Farcon hold custody of my investment funds?',
    answer:
      'Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name. Your money moves directly from your verified bank account to the respective Mutual Fund Scheme in your own name.',
  },
  {
    id: 'faq-3',
    category: 'Safety & Transparency',
    question: 'What are the charges for Farcon’s services?',
    answer:
      'Farcon does not bill an upfront fee. As an AMFI-registered distributor, Farcon earns standard distributor commissions paid by the asset management companies out of the regular scheme expense ratio.',
  },
  {
    id: 'faq-4',
    category: 'Investments & SIP',
    question: 'What does "Investing, without the noise" mean in practice?',
    answer:
      'Most financial media encourages constant anxiety: daily market commentary, breaking headlines, hot stock tips, and urgent buy/sell calls. At Farcon, we eliminate this noise. We ground your investments in clear goals, appropriate time horizons, and automated SIP execution, letting compounding work quietly without daily stress.',
  },
  {
    id: 'faq-5',
    category: 'Process & Service',
    question: 'How do I get started with Farcon Wealth?',
    answer:
      'Getting started is simple and calm: 1) Book a free consultation or take our 2-minute Investor Quiz. 2) We discuss your life goals and investment timeline. 3) We formulate a suitable, personalized mutual fund plan. 4) Direct digital KYC and automated mandate registration in your name.',
  },
  {
    id: 'faq-6',
    category: 'Process & Service',
    question: 'How does the Portfolio Review service work?',
    answer:
      'If you already hold mutual funds across multiple platforms, you can share your Consolidated Account Statement (CAS). We perform an overlap analysis, evaluate your asset allocation against your goals, and deliver a clear Keep / Trim / Switch roadmap to eliminate clutter.',
  },
  {
    id: 'faq-7',
    category: 'Investments & SIP',
    question: 'Can I withdraw or stop my SIP at any time?',
    answer:
      'Yes. Open-ended mutual funds provide full liquidity. You can pause, increase, or cancel your SIP instructions at any time with zero penalties. Except for ELSS (which carries a statutory 3-year lock-in), you can redeem your money whenever needed.',
  },
  {
    id: 'faq-8',
    category: 'Process & Service',
    question: 'How often do you review my investments?',
    answer:
      'We conduct periodic portfolio reviews typically on a half-yearly or annual cadence, or whenever a major personal milestone or life event occurs, ensuring your plan stays calibrated without unnecessary churn.',
  },
];

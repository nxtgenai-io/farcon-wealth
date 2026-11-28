/**
 * Farcon Wealth Compliance Content Registry
 * Centralized compliance text, statutory notices, distributor registration,
 * and educational disclaimers.
 */

import { FARCON_CONFIG } from '@/content/site/config';

export const COMPLIANCE_REGISTRY = {
  distributor: {
    entityName: 'Farcon Wealth Private Limited',
    arn: FARCON_CONFIG.arn,
    phoneNumber: FARCON_CONFIG.phoneNumber,
    phoneNumbers: FARCON_CONFIG.phoneNumbers,
    amfiRegistration: `Farcon Wealth is an AMFI-registered Mutual Fund Distributor · ARN: ${FARCON_CONFIG.arn}`,
    amfiShortBadge: `AMFI-registered MFD · ARN: ${FARCON_CONFIG.arn}`,
    registeredOffice: `Farcon Wealth Private Limited, ${FARCON_CONFIG.registeredAddress}`,
    custodyStatement:
      'Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.',
  },

  statutoryMutualFund: {
    /** Exact SEBI (Mutual Funds) Regulations, 2026 Advertisement Code standard warning */
    standardRisk:
      'Mutual Fund investments are subject to market risks, read all scheme related documents carefully.',
    pastPerformance:
      'Past performance may or may not be sustained in future and is not a guarantee of any future returns.',
  },

  calculator: {
    title: 'Illustrative Mathematical Projection',
    disclaimer:
      'This calculation is an illustrative mathematical projection based on user-selected assumptions and monthly compounding formulas. It is not a scheme-specific return estimate, advice, or assurance of any outcome.',
    note: 'Illustrative assumption for calculation purposes.',
  },

  quiz: {
    title: 'Educational Starting Point',
    disclaimer:
      'This assessment is an educational starting point and does not constitute personalised investment advice or a recommendation to purchase a particular mutual fund.',
    distributorSeparateDisclosure:
      `Farcon Wealth is an AMFI-registered Mutual Fund Distributor · ARN: ${FARCON_CONFIG.arn}`,
  },

  scheme: {
    title: 'Mutual Fund Category & Distribution Scope',
    disclaimer:
      'Farcon Wealth acts strictly as an AMFI-registered Mutual Fund Distributor dealing in Regular Plans. Information is limited to mutual fund categories and distributed schemes; investors may also consider alternatives not offered by Farcon Wealth.',
  },

  journey: {
    trajectoryNote:
      'Trajectory indicates structural goal-planning direction, not investment performance or guaranteed capital appreciation.',
  },
} as const;

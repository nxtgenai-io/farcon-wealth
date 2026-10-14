/**
 * Farcon Wealth Compliance Content Registry
 * Centralized compliance text, statutory notices, distributor registration,
 * and educational disclaimers. ARN and phone come from FARCON_CONFIG.
 */

import { FARCON_CONFIG } from '@/content/site/config';

export const COMPLIANCE_REGISTRY = {
  distributor: {
    entityName: 'Farcon Wealth Private Limited',
    arn: FARCON_CONFIG.arn,
    phoneNumber: FARCON_CONFIG.phoneNumber,
    amfiRegistration: `Farcon Wealth is an AMFI-registered Mutual Fund Distributor · ARN: ${FARCON_CONFIG.arn}`,
    amfiShortBadge: `AMFI-registered MFD · ARN: ${FARCON_CONFIG.arn}`,
    registeredOffice: 'Farcon Wealth Private Limited, Bangalore, Karnataka, India',
    custodyStatement:
      'Farcon Wealth does not hold custody of your investment funds. Investments are made through official channels in the investor’s name.',
  },

  statutoryMutualFund: {
    standardRisk:
      'Mutual fund investments are subject to market risks; read all scheme related documents carefully before investing.',
    pastPerformance:
      'Past performance is not an indicator of future returns.',
  },

  calculator: {
    title: 'Illustrative Mathematical Projection',
    disclaimer:
      'This calculation is an educational, illustrative mathematical projection based on compound growth formulas and user inputs. It does not constitute personalised investment advice or guarantee any specific portfolio outcome. Actual returns vary across market cycles, scheme selections, and tax treatments.',
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
    title: 'Educational Fund Exploration',
    disclaimer:
      'Scheme details and historical performance metrics are provided for illustrative educational comparison only. Farcon does not offer unsolicited scheme recommendations online. Suitability must be assessed independently prior to any transaction.',
  },

  journey: {
    trajectoryNote:
      'Trajectory indicates structural goal-planning direction, not investment performance or guaranteed capital appreciation.',
  },
} as const;

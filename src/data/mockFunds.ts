import { MutualFundItem } from '@/types';

export interface FundDataProvider {
  getFunds(): Promise<MutualFundItem[]>;
  getFundById(id: string): Promise<MutualFundItem | undefined>;
  getCategories(): Promise<string[]>;
}

export interface FundDataProvenance {
  source: string;
  isSimulatedDemo: boolean;
  benchmarkSource: string;
  asOfDate: string;
  refreshFrequency: string;
  governanceNote: string;
}

export const FUND_DATA_PROVENANCE: FundDataProvenance = {
  source: 'Illustrative Prototype Catalog',
  isSimulatedDemo: true,
  benchmarkSource: 'NSE Indices & CRISIL Benchmark Data (Illustrative reference)',
  asOfDate: 'October 2024',
  refreshFrequency: 'Monthly Static Prototype Reference',
  governanceNote:
    'All scheme values, NAVs, and CAGR figures are simulated demonstration data intended exclusively for UI layout and educational category discovery. Farcon Wealth does not publish live transactional scheme rankings online.',
};

export const DEMO_MUTUAL_FUNDS: MutualFundItem[] = [
  {
    id: 'farcon-demo-01',
    name: 'Exemplar Indian Flexi Cap Fund (Demo)',
    category: 'Equity - Flexi Cap',
    assetClass: 'Equity',
    riskometer: 'Very High',
    nav: 98.42,
    cagr3Y: 17.8,
    cagr5Y: 16.4,
    expenseRatio: 0.88,
    benchmark: 'NIFTY 500 TRI',
    minSIP: 1000,
    minLumpsum: 5000,
    suitableHorizon: '5+ Years',
    description:
      'Demonstration equity scheme dynamically allocating across large, mid, and small cap companies according to market cycle valuations.',
  },
  {
    id: 'farcon-demo-02',
    name: 'Benchmark Large & Mid Cap Fund (Demo)',
    category: 'Equity - Large & Mid Cap',
    assetClass: 'Equity',
    riskometer: 'Very High',
    nav: 64.18,
    cagr3Y: 19.2,
    cagr5Y: 17.1,
    expenseRatio: 0.94,
    benchmark: 'NIFTY LargeMidcap 250 TRI',
    minSIP: 1000,
    minLumpsum: 5000,
    suitableHorizon: '5+ Years',
    description:
      'Demonstration blend providing stability of top 100 market leaders combined with growth momentum of high-potential mid-sized businesses.',
  },
  {
    id: 'farcon-demo-03',
    name: 'Foundation Bluechip Large Cap Fund (Demo)',
    category: 'Equity - Large Cap',
    assetClass: 'Equity',
    riskometer: 'Very High',
    nav: 124.55,
    cagr3Y: 14.5,
    cagr5Y: 13.8,
    expenseRatio: 0.72,
    benchmark: 'NIFTY 50 TRI',
    minSIP: 500,
    minLumpsum: 1000,
    suitableHorizon: '5+ Years',
    description:
      'Demonstration core portfolio anchored in India’s leading bluechip conglomerates and industry pioneers.',
  },
  {
    id: 'farcon-demo-04',
    name: 'Statutory ELSS Tax Advantage Fund (Demo)',
    category: 'Equity - ELSS Tax Saver',
    assetClass: 'Equity',
    riskometer: 'Very High',
    nav: 82.3,
    cagr3Y: 16.9,
    cagr5Y: 15.6,
    expenseRatio: 0.85,
    benchmark: 'BSE 500 TRI',
    minSIP: 500,
    minLumpsum: 500,
    suitableHorizon: '3+ Years (Mandatory lock-in)',
    description:
      'Demonstration tax-saving equity fund eligible for Section 80C deductions with statutory 36-month lock-in period.',
  },
  {
    id: 'farcon-demo-05',
    name: 'Balanced Hybrid Growth Fund (Demo)',
    category: 'Hybrid - Aggressive',
    assetClass: 'Hybrid',
    riskometer: 'High',
    nav: 48.9,
    cagr3Y: 13.2,
    cagr5Y: 12.8,
    expenseRatio: 0.82,
    benchmark: 'CRISIL Hybrid 35+65 Aggressive Index',
    minSIP: 1000,
    minLumpsum: 5000,
    suitableHorizon: '3 to 5 Years',
    description:
      'Demonstration asset allocation scheme maintaining 65%–80% in equities for growth and remainder in debt securities for drawdown cushion.',
  },
  {
    id: 'farcon-demo-06',
    name: 'Conservative Liquid & Reserve Fund (Demo)',
    category: 'Debt - Liquid',
    assetClass: 'Debt',
    riskometer: 'Low to Moderate',
    nav: 1145.2,
    cagr3Y: 6.8,
    cagr5Y: 6.2,
    expenseRatio: 0.25,
    benchmark: 'CRISIL Liquid Debt Index',
    minSIP: 1000,
    minLumpsum: 5000,
    suitableHorizon: '1 to 90 Days',
    description:
      'Demonstration parking vehicle for emergency liquidity, surplus family reserves, and systematic transfer plans (STP).',
  },
  {
    id: 'farcon-demo-07',
    name: 'Short Duration Debt Income Fund (Demo)',
    category: 'Debt - Short Term',
    assetClass: 'Debt',
    riskometer: 'Moderate',
    nav: 44.8,
    cagr3Y: 7.4,
    cagr5Y: 7.1,
    expenseRatio: 0.42,
    benchmark: 'CRISIL Short Term Bond Index',
    minSIP: 1000,
    minLumpsum: 5000,
    suitableHorizon: '1 to 3 Years',
    description:
      'Demonstration high-credit quality debt portfolio suitable for near-term capital preservation and SWP cash-flow backing.',
  },
];

export class MockFundDataProvider implements FundDataProvider {
  async getFunds(): Promise<MutualFundItem[]> {
    return DEMO_MUTUAL_FUNDS;
  }

  async getFundById(id: string): Promise<MutualFundItem | undefined> {
    return DEMO_MUTUAL_FUNDS.find((f) => f.id === id);
  }

  async getCategories(): Promise<string[]> {
    return Array.from(new Set(DEMO_MUTUAL_FUNDS.map((f) => f.category)));
  }
}

export const defaultFundDataProvider = new MockFundDataProvider();

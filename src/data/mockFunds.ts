import { MutualFundItem } from '@/types';

export interface FundDataProvider {
  getFunds(): Promise<MutualFundItem[]>;
  getFundById(id: string): Promise<MutualFundItem | undefined>;
  getCategories(): Promise<string[]>;
}

export interface FundDataProvenance {
  source: string;
  isSimulatedDemo: boolean;
  isVerifiedRegularCatalogAvailable: boolean;
  asOfDate: string;
  governanceNote: string;
}

/**
 * Regulatory Fail-Closed Notice:
 * Scheme-level prices, returns, riskometer labels, SID/SAI/KIM links, and commission
 * schedules must come from verified AMFI/AMC Regular Plan records. Absent verified
 * feeds, this provider intentionally returns an empty scheme catalog rather than
 * displaying stale or Direct Plan figures.
 */
export const FUND_DATA_PROVENANCE: FundDataProvenance = {
  source: 'Pending Verified AMFI / AMC Regular Plan Integration',
  isSimulatedDemo: false,
  isVerifiedRegularCatalogAvailable: false,
  asOfDate: 'Unavailable pending verification',
  governanceNote:
    'Individual scheme prices (NAVs), return figures, and scheme cards are withheld until verified Regular Plan AMFI scheme codes, official SID/SAI/KIM document links, current riskometer grades, and AMC commission schedules are confirmed.',
};

export const DEMO_MUTUAL_FUNDS: MutualFundItem[] = [];

export class VerifiedFundDataProvider implements FundDataProvider {
  async getFunds(): Promise<MutualFundItem[]> {
    return [];
  }

  async getFundById(_id: string): Promise<MutualFundItem | undefined> {
    return undefined;
  }

  async getCategories(): Promise<string[]> {
    return ['Equity', 'Hybrid', 'Debt', 'Tax Saving (ELSS)'];
  }
}

export const defaultFundDataProvider = new VerifiedFundDataProvider();

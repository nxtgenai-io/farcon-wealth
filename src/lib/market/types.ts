/**
 * Type definitions for Market Snapshot and Authorized Market Data Provider
 */

export type MarketIndexSymbol = 'nifty' | 'sensex';

export interface MarketQuoteData {
  symbol: MarketIndexSymbol;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  timestamp: number;
  asOfFormatted: string;
  source: string;
  isDelayedOrEOD: boolean;
  chartPoints?: [number, number][];
  stale?: boolean;
}

export interface OfficialMarketLink {
  name: string;
  exchange: string;
  url: string;
  description: string;
}

export type MarketApiResponse =
  | {
      ok: true;
      configured: true;
      quotes: Record<MarketIndexSymbol, MarketQuoteData>;
      stale?: boolean;
      source: string;
    }
  | {
      ok: false;
      configured: false;
      status: 'unconfigured';
      message: string;
      officialLinks: OfficialMarketLink[];
    }
  | {
      ok: false;
      configured: true;
      status: 'error';
      message: string;
      officialLinks: OfficialMarketLink[];
    };

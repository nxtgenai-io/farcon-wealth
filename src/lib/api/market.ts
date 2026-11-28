import { MarketApiResponse, MarketIndexSymbol, OfficialMarketLink } from '../market/types';

export const OFFICIAL_MARKET_LINKS: OfficialMarketLink[] = [
  {
    name: 'NIFTY 50',
    exchange: 'National Stock Exchange of India (NSE)',
    url: 'https://www.nseindia.com/market-data/live-equity-market',
    description: 'Official real-time index dashboard from the National Stock Exchange of India.',
  },
  {
    name: 'SENSEX',
    exchange: 'BSE India',
    url: 'https://www.bseindia.com/sensex/code/16/',
    description: 'Official benchmark equity index data from BSE India.',
  },
];

function jsonResponse(body: unknown, status: number, ttl = 0): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
  };
  if (ttl > 0) {
    headers['Cache-Control'] = `public, max-age=${ttl}`;
  } else {
    headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

/**
 * Server-side Market Data Provider Abstraction.
 *
 * Compliance Notice:
 * SEBI guidelines and stock exchange data sharing policies (NSE and BSE) require
 * a formal commercial redistribution agreement for publishing live or delayed market indices.
 *
 * To avoid unauthorized scraping or synthetic figures, this provider strictly requires
 * an authorized upstream data feed provider key (e.g. MARKET_DATA_API_KEY).
 *
 * When unconfigured, it returns a truthful 'unconfigured' state with verified official
 * exchange links rather than fabricating or displaying stale sample figures as live.
 */
export interface MarketDataProvider {
  isConfigured(): boolean;
  getQuotes(): Promise<MarketApiResponse>;
}

class AuthorizedMarketProvider implements MarketDataProvider {
  private apiKey: string | undefined;
  private endpoint: string | undefined;

  constructor() {
    // In Node or Cloudflare Workers, check process.env or global environment
    if (typeof process !== 'undefined' && process.env) {
      this.apiKey = process.env.MARKET_DATA_API_KEY;
      this.endpoint = process.env.MARKET_DATA_PROVIDER_URL;
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.endpoint);
  }

  async getQuotes(): Promise<MarketApiResponse> {
    if (!this.isConfigured()) {
      return {
        ok: false,
        configured: false,
        status: 'unconfigured',
        message:
          'Market data feed not connected. An authorized, licensed commercial market feed agreement (NSE/BSE) is required for real-time benchmark index display.',
        officialLinks: OFFICIAL_MARKET_LINKS,
      };
    }

    try {
      const response = await fetch(this.endpoint!, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        return {
          ok: false,
          configured: true,
          status: 'error',
          message: `Authorized market data feed returned status ${response.status}`,
          officialLinks: OFFICIAL_MARKET_LINKS,
        };
      }

      const data = await response.json() as any;
      return {
        ok: true,
        configured: true,
        quotes: data.quotes,
        source: data.source || 'Authorized Exchange Provider',
      };
    } catch (err: any) {
      return {
        ok: false,
        configured: true,
        status: 'error',
        message: `Market data feed connection error: ${err?.message || 'Network failure'}`,
        officialLinks: OFFICIAL_MARKET_LINKS,
      };
    }
  }
}

const provider = new AuthorizedMarketProvider();

export async function marketResponse(requestUrl: string): Promise<Response> {
  const url = new URL(requestUrl, 'https://farcon.local');
  const result = await provider.getQuotes();

  if (!result.configured) {
    // Return honest 200 with unconfigured state so client UI can render the graceful fallback
    return jsonResponse(result, 200, 300);
  }

  if (!result.ok) {
    return jsonResponse(result, 502, 60);
  }

  return jsonResponse(result, 200, 60);
}

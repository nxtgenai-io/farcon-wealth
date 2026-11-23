# Farcon Wealth — Market Data Provider Integration Specification

## 1. Regulatory & Licensing Context

Farcon Wealth is an AMFI-registered Mutual Fund Distributor (ARN: 329006).

Under SEBI regulations and Indian stock exchange data governance policies:
- **NSE India Data Sharing Policy:** The National Stock Exchange of India (NSE) explicitly restricts redistribution, public display, or commercial exploitation of index and market data without an executed Market Data Agreement.
  Reference: [NSE Data Policy](https://www.nseindia.com/static/market-data/nse-data-policy)
- **BSE India Data Policy:** SENSEX and BSE index values are proprietary to BSE Limited / Asia Index Private Limited and require licensing for digital redistribution.
- **Yahoo Finance Terms of Service:** Section 1.b of Yahoo's Terms of Service explicitly restricts commercial re-use, scraping, automated query distribution, and unauthenticated public embedding without prior commercial authorization.
  Reference: [Yahoo Legal Terms](https://legal.yahoo.com/in/en/yahoo/terms/otos/index.html)

## 2. Architecture & Data Integrity Standards

To maintain absolute data integrity and regulatory adherence:
1. **Zero Synthetic / Fabricated Data:** The website strictly avoids displaying hardcoded, simulated, or stale mock prices disguised as live data.
2. **Truthful Provider State:** When an authorized provider is not connected, the website displays an explicit **"Provider connection pending"** state alongside direct links to official exchange portals ([NSE India Live Market](https://www.nseindia.com/market-data/live-equity-market) and [BSE SENSEX](https://www.bseindia.com/sensex/code/16/)).
3. **Server-Side Key Isolation:** Provider secrets and API keys must NEVER be exposed in browser bundles, Git repositories, or client HTTP headers.

## 3. Provider Abstraction Contract

The provider contract is implemented in `src/lib/api/market.ts` and typed in `src/lib/market/types.ts`.

### TypeScript Interface:
```typescript
export interface MarketQuoteData {
  symbol: 'nifty' | 'sensex';
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
```

## 4. Connecting an Authorized Provider

When Farcon Wealth completes commercial licensing with an authorized exchange data vendor (such as TruData, NSE Data & Analytics, Refinitiv, or Bloomberg), set the following server-side environment variables:

```bash
# Server-side only (Cloudflare Workers Secret or Node runtime environment)
MARKET_DATA_PROVIDER_URL="https://api.authorized-provider.com/v1/indices/quotes"
MARKET_DATA_API_KEY="<AUTHORIZED_VENDOR_SECRET_KEY>"
```

### Flow:
1. Client requests `GET /api/market`.
2. Server checks `provider.isConfigured()`.
3. If unconfigured: returns HTTP 200 with `{ ok: false, configured: false, status: 'unconfigured', officialLinks: [...] }`.
4. If configured: calls the authorized provider over HTTPS, sanitizes and caches values, and serves typed `quotes`.

## 5. Client Component

The user interface is encapsulated in `src/components/sections/MarketSnapshot.tsx`, supporting:
- Clean loading skeleton states (`aria-busy="true"`).
- Honest "Awaiting Licensed Feed" fallback with official exchange links.
- Real-time / delayed quotes with explicit source attribution and timestamps once configured.
- Accessible SVG sparkline charts only when genuine data points are supplied.

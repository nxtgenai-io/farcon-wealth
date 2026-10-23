const YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const LAST_GOOD_TTL = 7 * 24 * 60 * 60;

const TICKERS = { nifty: '%5ENSEI', sensex: '%5EBSESN' } as const;
const RANGES = {
  '1d': { interval: '5m', range: '1d', ttl: 60 },
  '1w': { interval: '30m', range: '5d', ttl: 3600 },
  '1m': { interval: '1d', range: '1mo', ttl: 3600 },
  '1y': { interval: '1d', range: '1y', ttl: 3600 },
  '5y': { interval: '1wk', range: '5y', ttl: 3600 },
} as const;

export type MarketSymbol = keyof typeof TICKERS;
export type MarketRange = keyof typeof RANGES;

export type MarketQuote = {
  symbol: MarketSymbol;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  points: [number, number][];
  marketTime: number;
  marketState: string;
  stale?: boolean;
};

type MemoryEntry = { at: number; json: string; ttl: number };

const freshMemory = new Map<string, MemoryEntry>();
const lastMemory = new Map<string, string>();

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function cacheStore(): Cache | undefined {
  return (globalThis as { caches?: { default?: Cache } }).caches?.default;
}

function jsonResponse(body: unknown, status: number, ttl = 0): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json; charset=utf-8' };
  if (ttl > 0) headers['Cache-Control'] = `public, max-age=${ttl}`;
  return new Response(JSON.stringify(body), { status, headers });
}

async function fetchYahoo(symbol: MarketSymbol, range: MarketRange): Promise<MarketQuote> {
  const spec = RANGES[range];
  const response = await fetch(`${YAHOO}${TICKERS[symbol]}?interval=${spec.interval}&range=${spec.range}`, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`yahoo ${response.status}`);
  const payload = await response.json() as {
    chart?: {
      result?: Array<{
        meta?: { regularMarketPrice?: number; chartPreviousClose?: number; previousClose?: number; regularMarketTime?: number; marketState?: string };
        timestamp?: number[];
        indicators?: { quote?: Array<{ close?: Array<number | null> }> };
      }>;
    };
  };
  const result = payload.chart?.result?.[0];
  if (!result) throw new Error('yahoo empty');
  const stamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const points: [number, number][] = [];
  for (let i = 0; i < stamps.length; i += 1) {
    const close = closes[i];
    if (close == null || !Number.isFinite(close)) continue;
    points.push([stamps[i], round2(close)]);
  }
  if (!points.length) throw new Error('yahoo no closes');
  const meta = result.meta ?? {};
  const price = Number(meta.regularMarketPrice ?? points[points.length - 1][1]);
  const prevClose = Number(meta.chartPreviousClose ?? meta.previousClose ?? points[0][1]);
  const change = price - prevClose;
  return {
    symbol,
    price: round2(price),
    prevClose: round2(prevClose),
    change: round2(change),
    changePct: prevClose ? round2((change / prevClose) * 100) : 0,
    points,
    marketTime: Number(meta.regularMarketTime ?? points[points.length - 1][0]),
    marketState: String(meta.marketState || ''),
  };
}

export async function marketResponse(requestUrl: string): Promise<Response> {
  const url = new URL(requestUrl, 'https://farcon.local');
  const symbol = url.searchParams.get('symbol');
  const range = url.searchParams.get('range');
  if (symbol !== 'nifty' && symbol !== 'sensex') return jsonResponse({ ok: false }, 400);
  if (range !== '1d' && range !== '1w' && range !== '1m' && range !== '1y' && range !== '5y') return jsonResponse({ ok: false }, 400);

  const ttl = RANGES[range].ttl;
  const freshKey = `https://farcon.local/market/${symbol}/${range}`;
  const lastKey = `https://farcon.local/market-last/${symbol}/${range}`;
  const remembered = freshMemory.get(freshKey);
  if (remembered && Date.now() - remembered.at < remembered.ttl * 1000) {
    return jsonResponse(JSON.parse(remembered.json), 200, ttl);
  }

  const cache = cacheStore();
  if (cache) {
    const hit = await cache.match(freshKey);
    if (hit) return hit;
  }

  try {
    const quote = await fetchYahoo(symbol, range);
    const text = JSON.stringify(quote);
    freshMemory.set(freshKey, { at: Date.now(), json: text, ttl });
    lastMemory.set(lastKey, text);
    const response = jsonResponse(quote, 200, ttl);
    if (cache) {
      await cache.put(freshKey, response.clone());
      await cache.put(lastKey, new Response(text, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': `public, max-age=${LAST_GOOD_TTL}`,
        },
      }));
    }
    return response;
  } catch {
    const saved = lastMemory.get(lastKey);
    if (saved) {
      const body = JSON.parse(saved) as MarketQuote;
      body.stale = true;
      return jsonResponse(body, 200, 60);
    }
    if (cache) {
      const last = await cache.match(lastKey);
      if (last) {
        const body = await last.json() as MarketQuote;
        body.stale = true;
        return jsonResponse(body, 200, 60);
      }
    }
    return jsonResponse({ ok: false }, 503);
  }
}

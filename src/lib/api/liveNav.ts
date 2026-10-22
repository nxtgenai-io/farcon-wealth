import fundBook from '../../content/funds/schemes.json';

const AMFI_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';
const NAV_TTL = 6 * 60 * 60 * 1000;
const HISTORY_TTL = 12 * 60 * 60 * 1000;

export const RETURNS_LABEL =
  'Point-to-point returns computed from AMFI NAV history; past performance is not indicative of future returns.';

export type LiveQuote = {
  code: number;
  isin: string;
  name: string;
  nav: number;
  date: string;
  spark: number[];
  returns: { '1Y': number | null; '3Y': number | null; '5Y': number | null };
};

type Row = { date: string; nav: string };
type Memory = { at: number; text: string };

const memory = new Map<string, Memory>();

export function schemeCodes(): number[] {
  const found = new Set<number>();
  for (const category of fundBook.categories) {
    for (const scheme of category.schemes) {
      const code = Number(scheme.code);
      if (code > 0) found.add(code);
    }
  }
  return [...found];
}

function parseDate(value: string): number {
  const [day, month, year] = value.split('-').map(Number);
  return Date.UTC(year, (month || 1) - 1, day || 1);
}

function cagr(rows: Row[], years: number): number | null {
  if (!rows.length) return null;
  const end = parseDate(rows[0].date);
  const target = end - years * 365.25 * 86400000;
  let older: Row | undefined;
  for (const row of rows) {
    if (parseDate(row.date) <= target) {
      older = row;
      break;
    }
  }
  if (!older) return null;
  const span = (end - parseDate(older.date)) / (365.25 * 86400000);
  const latest = Number(rows[0].nav);
  const start = Number(older.nav);
  if (!latest || !start || span < years - 0.15) return null;
  return Math.round(((latest / start) ** (1 / span) - 1) * 1000) / 10;
}

async function cachedText(url: string, ttl: number): Promise<string> {
  const hit = memory.get(url);
  if (hit && Date.now() - hit.at < ttl) return hit.text;
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  const request = new Request(url);
  if (cache) {
    const stored = await cache.match(request);
    if (stored) {
      const text = await stored.text();
      memory.set(url, { at: Date.now(), text });
      return text;
    }
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed ${response.status}`);
  const text = await response.text();
  memory.set(url, { at: Date.now(), text });
  if (cache) {
    await cache.put(request, new Response(text, {
      headers: { 'Cache-Control': `public, max-age=${Math.floor(ttl / 1000)}` },
    }));
  }
  return text;
}

function parseAmfi(text: string, wanted: Set<number>) {
  const found = new Map<number, { code: number; isin: string; name: string; nav: number; date: string }>();
  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(';');
    const code = Number(parts[0]);
    if (!wanted.has(code) || parts.length < 6) continue;
    const wide = parts.length >= 8;
    const nav = Number(wide ? parts[6] : parts[4]);
    const date = (wide ? parts[7] : parts[5] || '').trim();
    if (!Number.isFinite(nav) || nav <= 0 || !date) continue;
    found.set(code, { code, isin: parts[1] === '-' ? '' : parts[1], name: parts[3], nav, date });
  }
  return found;
}

async function history(code: number): Promise<Row[]> {
  const text = await cachedText(`https://api.mfapi.in/mf/${code}`, HISTORY_TTL);
  const body = JSON.parse(text) as { data?: Row[] };
  return body.data || [];
}

export async function liveNavResponse() {
  const codes = schemeCodes();
  const amfi = parseAmfi(await cachedText(AMFI_URL, NAV_TTL), new Set(codes));
  const present = codes.filter((code) => amfi.has(code));
  const histories = await Promise.all(present.map((code) => history(code).catch(() => [] as Row[])));
  const funds: LiveQuote[] = present.map((code, index) => {
    const rows = histories[index];
    return {
      ...amfi.get(code)!,
      spark: rows.slice(0, 32).reverse().map((item) => Number(item.nav)).filter((value) => Number.isFinite(value)),
      returns: { '1Y': cagr(rows, 1), '3Y': cagr(rows, 3), '5Y': cagr(rows, 5) },
    };
  });
  return {
    ok: funds.length > 0,
    source: 'AMFI',
    label: RETURNS_LABEL,
    funds,
  };
}

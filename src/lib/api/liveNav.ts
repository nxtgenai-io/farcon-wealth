import fundBook from '../../content/funds/schemes.json';

export type LiveQuote = {
  code: number;
  nav: number;
  date: string;
  change: number;
  spark: number[];
  cagr3y: number | null;
};

type Row = { date: string; nav: string };

let cache: { at: number; body: { ok: boolean; source: string; funds: LiveQuote[] } } | null = null;

function codes(): number[] {
  const found = new Set<number>();
  for (const category of fundBook.categories) {
    for (const scheme of category.schemes) {
      const code = Number((scheme as { code?: number }).code);
      if (code > 0) found.add(code);
    }
  }
  return [...found];
}

function parseDate(value: string): number {
  const [day, month, year] = value.split('-').map(Number);
  return Date.UTC(year, (month || 1) - 1, day || 1);
}

function cagr3y(rows: Row[]): number | null {
  const latest = Number(rows[0]?.nav);
  const end = parseDate(rows[0].date);
  const target = end - 3 * 365.25 * 86400000;
  let older = rows[rows.length - 1];
  for (const row of rows) {
    if (parseDate(row.date) <= target) {
      older = row;
      break;
    }
  }
  const start = Number(older?.nav);
  const years = (end - parseDate(older.date)) / (365.25 * 86400000);
  if (!latest || !start || years < 2.5) return null;
  return Math.round(((latest / start) ** (1 / years) - 1) * 1000) / 10;
}

async function quote(code: number): Promise<LiveQuote | null> {
  const response = await fetch(`https://api.mfapi.in/mf/${code}`);
  if (!response.ok) return null;
  const body = await response.json() as { data?: Row[] };
  const rows = body.data || [];
  if (!rows.length) return null;
  const nav = Number(rows[0].nav);
  const prev = Number(rows[1]?.nav || nav);
  if (!Number.isFinite(nav)) return null;
  return {
    code,
    nav,
    date: rows[0].date,
    change: prev ? Math.round(((nav - prev) / prev) * 10000) / 100 : 0,
    spark: rows.slice(0, 32).reverse().map((row) => Number(row.nav)).filter((value) => Number.isFinite(value)),
    cagr3y: cagr3y(rows),
  };
}

export async function liveNavResponse() {
  if (cache && Date.now() - cache.at < 60 * 60 * 1000) return cache.body;
  const funds = (await Promise.all(codes().map((code) => quote(code).catch(() => null)))).filter((item): item is LiveQuote => Boolean(item));
  const body = {
    ok: funds.length > 0,
    source: 'AMFI scheme NAV history via mfapi.in. Not a recommendation.',
    funds,
  };
  if (funds.length) cache = { at: Date.now(), body };
  return body;
}

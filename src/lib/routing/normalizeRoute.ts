/**
 * Centralized Route Normalization for Farcon Wealth SPA
 *
 * Requirements:
 * - Strips trailing slashes, except for root '/'
 * - Normalizes redundant slashes (e.g. '//contact///' -> '/contact')
 * - Maps known plural aliases (e.g. '/faqs' -> '/faq')
 * - Preserves query strings (?utm_source=...&...) and URL fragments (#...)
 * - Does not turn unknown routes into valid routes
 * - Keeps canonical URLs consistent without trailing slashes
 */

export interface ParsedRoute {
  pathname: string;
  search: string;
  hash: string;
  fullPath: string;
}

const ROUTE_ALIASES: Record<string, string> = {
  '/faqs': '/faq',
};

/**
 * Normalizes a pathname:
 * - Collapses consecutive slashes
 * - Strips trailing slashes (unless it is just '/')
 * - Guarantees a leading slash
 * - Resolves explicit route aliases
 */
export function normalizePathname(rawPathname: string): string {
  if (!rawPathname) return '/';

  let path = rawPathname.replace(/\/+/g, '/');

  if (path.length > 1 && path.endsWith('/')) {
    path = path.replace(/\/+$/, '');
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  const normalized = path || '/';
  return ROUTE_ALIASES[normalized] ?? normalized;
}

/**
 * Parses and normalizes any URL path, preserving query parameters and hash fragments.
 */
export function parseAndNormalizeUrl(rawInput: string): ParsedRoute {
  if (!rawInput) {
    return { pathname: '/', search: '', hash: '', fullPath: '/' };
  }

  const hashIdx = rawInput.indexOf('#');
  const hash = hashIdx !== -1 ? rawInput.slice(hashIdx) : '';
  const beforeHash = hashIdx !== -1 ? rawInput.slice(0, hashIdx) : rawInput;

  const queryIdx = beforeHash.indexOf('?');
  const search = queryIdx !== -1 ? beforeHash.slice(queryIdx) : '';
  const rawPathname = queryIdx !== -1 ? beforeHash.slice(0, queryIdx) : beforeHash;

  const pathname = normalizePathname(rawPathname);
  const fullPath = `${pathname}${search}${hash}`;

  return { pathname, search, hash, fullPath };
}

/**
 * Centralized Route Normalization for Farcon Wealth SPA
 *
 * Requirements:
 * - Strips trailing slashes, except for root '/'
 * - Normalizes redundant slashes (e.g. '//contact///' -> '/contact')
 * - Preserves query strings (?utm_source=...&...) and URL fragments (#...)
 * - Does not turn unknown routes into valid routes
 * - Keeps canonical URLs consistent
 * - Does not break UTM parameter capture, hash navigation, or SPA routing
 */

export interface ParsedRoute {
  pathname: string;
  search: string;
  hash: string;
  fullPath: string;
}

/**
 * Normalizes a pathname:
 * - Collapses consecutive slashes
 * - Strips trailing slashes (unless it is just '/')
 * - Guarantees a leading slash
 */
export function normalizePathname(rawPathname: string): string {
  if (!rawPathname) return '/';

  // Collapse multiple consecutive slashes: e.g. "///" -> "/"
  let path = rawPathname.replace(/\/+/g, '/');

  // Strip trailing slashes, keeping root '/'
  if (path.length > 1 && path.endsWith('/')) {
    path = path.replace(/\/+$/, '');
  }

  // Ensure leading slash
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  return path || '/';
}

/**
 * Parses and normalizes any URL path, preserving query parameters and hash fragments.
 */
export function parseAndNormalizeUrl(rawInput: string): ParsedRoute {
  if (!rawInput) {
    return { pathname: '/', search: '', hash: '', fullPath: '/' };
  }

  // Split fragment first
  const hashIdx = rawInput.indexOf('#');
  const hash = hashIdx !== -1 ? rawInput.slice(hashIdx) : '';
  const beforeHash = hashIdx !== -1 ? rawInput.slice(0, hashIdx) : rawInput;

  // Split query string
  const queryIdx = beforeHash.indexOf('?');
  const search = queryIdx !== -1 ? beforeHash.slice(queryIdx) : '';
  const rawPathname = queryIdx !== -1 ? beforeHash.slice(0, queryIdx) : beforeHash;

  const pathname = normalizePathname(rawPathname);
  const fullPath = `${pathname}${search}${hash}`;

  return { pathname, search, hash, fullPath };
}

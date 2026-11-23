import { normalizePathname, parseAndNormalizeUrl } from './normalizeRoute';
import { metaFor } from '../../content/seo/meta';
import { SITE_URL } from '../../content/site/config';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

console.log('[TEST] Starting Route Normalization and Deep Link Tests...');

// 1. Root and Redundant Slashes
assert(normalizePathname('/') === '/', 'Root / must remain /');
assert(normalizePathname('//') === '/', 'Double slash // must normalize to /');
assert(normalizePathname('///') === '/', 'Triple slash /// must normalize to /');
assert(normalizePathname('') === '/', 'Empty path must normalize to /');
console.log('✓ Root slash normalization verified');

// 2. Trailing Slashes on Core Pages
const coreRoutes = [
  '/contact',
  '/about',
  '/disclosures',
  '/privacy',
  '/terms',
  '/grievance',
  '/services',
  '/goals',
  '/calculators',
  '/investor-quiz',
  '/wealth-planner',
  '/education',
  '/blogs',
  '/faq',
  '/portfolio-review',
  '/investor-login',
  '/start-investing',
];

coreRoutes.forEach((route) => {
  assert(normalizePathname(route) === route, `Route ${route} without trailing slash must remain unchanged`);
  assert(normalizePathname(`${route}/`) === route, `Route ${route}/ must normalize to ${route}`);
  assert(normalizePathname(`${route}///`) === route, `Route ${route}/// must normalize to ${route}`);
});
console.log('✓ All 17 core routes verified with and without trailing slashes');

// 3. Goal, Calculator, Service, and Blog Detail Routes
const representativeNestedRoutes = [
  '/goals/retirement',
  '/goals/child-education',
  '/goals/wealth-creation',
  '/goals/tax-saving',
  '/calculators/sip',
  '/calculators/lumpsum',
  '/calculators/goal',
  '/calculators/retirement',
  '/services/sip-planning',
  '/services/retirement',
  '/services/child-education',
  '/blogs/mutual-funds-101-beginners-guide',
  '/blogs/sip-vs-lumpsum-investing-guide',
  '/blogs/demystifying-elss-tax-saving-beyond-80c',
  '/blogs/why-sip-beats-market-timing',
  '/blogs/the-mathematics-of-staying-calm',
  '/mutual-funds/equity',
  '/mutual-funds/equity/large-cap-fund',
];

representativeNestedRoutes.forEach((route) => {
  assert(normalizePathname(route) === route, `Nested route ${route} must remain unchanged`);
  assert(normalizePathname(`${route}/`) === route, `Nested route ${route}/ must normalize to ${route}`);
});
console.log('✓ Representative nested goal, calculator, service, and blog routes verified');

// 4. Query Strings & Fragment Preservation
const complexUrl1 = '/contact/?utm_source=google&utm_medium=cpc&utm_campaign=brand#connect-form';
const parsed1 = parseAndNormalizeUrl(complexUrl1);
assert(parsed1.pathname === '/contact', 'Pathname must be stripped of trailing slash, search, and hash');
assert(parsed1.search === '?utm_source=google&utm_medium=cpc&utm_campaign=brand', 'Query string must be preserved exactly');
assert(parsed1.hash === '#connect-form', 'Fragment hash must be preserved exactly');
assert(parsed1.fullPath === '/contact?utm_source=google&utm_medium=cpc&utm_campaign=brand#connect-form', 'Full path must be correctly reconstructed without trailing slash');

const complexUrl2 = '/calculators/goal/?target=5000000&years=10&rate=12&inflation=6#estimator';
const parsed2 = parseAndNormalizeUrl(complexUrl2);
assert(parsed2.pathname === '/calculators/goal', 'Goal calculator path normalized');
assert(parsed2.search === '?target=5000000&years=10&rate=12&inflation=6', 'Calculator params preserved');
assert(parsed2.hash === '#estimator', 'Calculator hash preserved');
assert(parsed2.fullPath === '/calculators/goal?target=5000000&years=10&rate=12&inflation=6#estimator', 'Reconstructed path matches');
console.log('✓ Query parameter and fragment preservation verified');

// 5. Unknown routes do NOT turn into valid routes
const unknown1 = '/non-existent-page/';
const parsedUnknown = parseAndNormalizeUrl(unknown1);
assert(parsedUnknown.pathname === '/non-existent-page', 'Unknown path normalized without trailing slash');
const metaUnknown = metaFor(parsedUnknown.pathname);
assert(metaUnknown.title.startsWith('Page not found'), 'Unknown route must resolve to Page not found metadata');
console.log('✓ Unknown routes are not turned into valid routes');

// 6. Canonical URLs remain consistent
coreRoutes.forEach((route) => {
  const norm = normalizePathname(`${route}/`);
  const canonicalUrl = `${SITE_URL}${norm === '/' ? '/' : norm}`;
  assert(!canonicalUrl.endsWith('//'), `Canonical URL ${canonicalUrl} must not have double slash`);
  assert(canonicalUrl === `${SITE_URL}${route}`, `Canonical URL for ${route}/ must match ${SITE_URL}${route}`);
});
console.log('✓ Canonical URL consistency verified');

console.log('[ALL ROUTE NORMALIZATION TESTS PASSED]');

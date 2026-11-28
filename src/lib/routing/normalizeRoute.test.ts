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

// 2. Trailing Slashes on Core & Legal Pages + /faqs Alias
const coreRoutes = [
  '/contact',
  '/about',
  '/disclosures',
  '/commission-disclosure',
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
  '/mutual-funds',
  '/portfolio-review',
  '/investor-login',
  '/start-investing',
];

coreRoutes.forEach((route) => {
  assert(normalizePathname(route) === route, `Route ${route} without trailing slash must remain unchanged`);
  assert(normalizePathname(`${route}/`) === route, `Route ${route}/ must normalize to ${route}`);
  assert(normalizePathname(`${route}///`) === route, `Route ${route}/// must normalize to ${route}`);
  const meta = metaFor(route);
  assert(!meta.title.startsWith('Page not found'), `Route ${route} must resolve valid metadata`);
});

assert(normalizePathname('/faqs') === '/faq', '/faqs must alias to /faq');
assert(normalizePathname('/faqs/') === '/faq', '/faqs/ must alias to /faq');
console.log('✓ All 19 core/legal routes and /faqs alias verified with and without trailing slashes');

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
assert(parsed1.fullPath === '/contact?utm_source=google&utm_medium=cpc&utm_campaign=brand#connect-form', 'Full path must be correctly reconstructed');

const complexUrl2 = '/disclosures/#commission';
const parsed2 = parseAndNormalizeUrl(complexUrl2);
assert(parsed2.pathname === '/disclosures', 'Disclosures path normalized');
assert(parsed2.hash === '#commission', 'Commission fragment preserved');
console.log('✓ Query parameter and fragment preservation verified');

// 5. Unknown routes fail closed to Page not found
const unknown1 = '/non-existent-page/';
const parsedUnknown = parseAndNormalizeUrl(unknown1);
assert(parsedUnknown.pathname === '/non-existent-page', 'Unknown path normalized without trailing slash');
const metaUnknown = metaFor(parsedUnknown.pathname);
assert(metaUnknown.title.startsWith('Page not found'), 'Unknown route must resolve to Page not found metadata');
console.log('✓ Unknown routes fail closed cleanly');

// 6. Canonical URLs remain consistent
coreRoutes.forEach((route) => {
  const norm = normalizePathname(`${route}/`);
  const canonicalUrl = `${SITE_URL}${norm === '/' ? '/' : norm}`;
  assert(!canonicalUrl.endsWith('//'), `Canonical URL ${canonicalUrl} must not have double slash`);
  assert(canonicalUrl === `${SITE_URL}${route}`, `Canonical URL for ${route}/ must match ${SITE_URL}${route}`);
});
console.log('✓ Canonical URL consistency verified');

console.log('[ALL ROUTE NORMALIZATION TESTS PASSED]');

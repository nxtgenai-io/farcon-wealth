import { FARCON_SERVICES } from '../src/content/services/servicesData';
import { SERVICE_GROUPS } from '../src/content/services/serviceGroups';
import { isIndianMobile } from '../src/lib/phone';
import { sanitiseLead } from '../src/lib/api/sheetLead';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

console.log('[TEST] Starting Farcon routes and form validation tests...');

// 1. Service Routes Verification
const planningGroup = SERVICE_GROUPS.find((g) => g.id === 'planning');
const investingGroup = SERVICE_GROUPS.find((g) => g.id === 'investing');
assert(Boolean(planningGroup), 'Planning group must exist');
assert(Boolean(investingGroup), 'Investing group must exist');
assert(planningGroup!.slugs.length === 5, 'Must have exactly 5 Goal Planning cards');
assert(investingGroup!.slugs.length === 5, 'Must have exactly 5 Investing cards');

const allSlugs = new Set(FARCON_SERVICES.map((s) => s.slug));
[...planningGroup!.slugs, ...investingGroup!.slugs].forEach((slug) => {
  assert(allSlugs.has(slug), `Service slug ${slug} must exist in FARCON_SERVICES`);
});
console.log('✓ All 10 service cards and routes verified in source');

// 2. Phone Validation Tests
assert(isIndianMobile('9876543210') === true, 'Standard 10-digit mobile starting with 9 must pass');
assert(isIndianMobile('8765432109') === true, 'Standard 10-digit mobile starting with 8 must pass');
assert(isIndianMobile('7654321098') === true, 'Standard 10-digit mobile starting with 7 must pass');
assert(isIndianMobile('6543210987') === true, 'Standard 10-digit mobile starting with 6 must pass');
assert(isIndianMobile('5543210987') === false, 'Mobile starting with 5 must fail');
assert(isIndianMobile('12345') === false, 'Short number must fail');
assert(isIndianMobile('98765432100') === false, '11-digit number must fail');
console.log('✓ Indian mobile number validation verified');

// 3. Lead Sanitization Tests
const validLead = {
  form: 'Consultation Modal',
  name: 'Rajesh Sharma',
  phone: '9876543210',
  contactPreference: 'WhatsApp',
  consent: true,
  formStartedAt: Date.now() - 5000,
  companyWebsite: '',
};

const sanitisedValid = sanitiseLead(validLead);
assert(sanitisedValid.ok === true, 'Valid lead should pass sanitization');

// Honeypot test
const botLead = { ...validLead, companyWebsite: 'spam-bot.com' };
const sanitisedBot = sanitiseLead(botLead);
assert(sanitisedBot.ok === false, 'Honeypot lead must fail sanitization');

// Missing consent test
const noConsentLead = { ...validLead, consent: false };
const sanitisedNoConsent = sanitiseLead(noConsentLead);
assert(sanitisedNoConsent.ok === false, 'Missing consent must fail sanitization');

console.log('✓ Lead sanitization and security checks verified');
console.log('[ALL ROUTE & FORM TESTS PASSED]');

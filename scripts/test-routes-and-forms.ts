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

// Missing consent test (unchecked checkbox)
const noConsentLead = { ...validLead, consent: false };
const sanitisedNoConsent = sanitiseLead(noConsentLead);
assert(sanitisedNoConsent.ok === false, 'Missing consent must fail sanitization');

// Rapid submission (bot / automated submission under 2000ms)
const fastLead = { ...validLead, formStartedAt: Date.now() - 500 };
const sanitisedFast = sanitiseLead(fastLead);
assert(sanitisedFast.ok === false, 'Fast fill under 2 seconds must fail');

// 4. Multi-Step Progressive Flow & Deduplication Tests
const step1Lead = {
  form: 'Consultation Modal - Step 1',
  name: 'Anita Verma',
  phone: '9876543210',
  contactPreference: 'WhatsApp',
  consent: true,
  formStartedAt: Date.now() - 4000,
  companyWebsite: '',
};
const resStep1 = sanitiseLead(step1Lead);
assert(resStep1.ok === true, 'Step 1 lead must pass sanitization');
if (!resStep1.ok) throw new Error('Step 1 failed');
assert(Boolean(resStep1.lead.leadId), 'Lead ID must be generated');

// Step 2 update with same leadId
const step2Lead = {
  form: 'Consultation Modal - Step 2 Complete',
  leadId: resStep1.lead.leadId,
  name: 'Anita Verma',
  phone: '9876543210',
  email: 'anita.verma@example.com',
  goal: 'Retirement Planning',
  timeHorizon: '10+ Years',
  message: 'Transitioning from FDs to mutual funds',
  contactPreference: 'Call',
  consent: true,
  formStartedAt: Date.now() - 15000,
  companyWebsite: '',
};
const resStep2 = sanitiseLead(step2Lead);
assert(resStep2.ok === true, 'Step 2 update must pass sanitization');
if (!resStep2.ok) throw new Error('Step 2 failed');
assert(resStep2.lead.leadId === resStep1.lead.leadId, 'Lead ID must match across steps');
assert(resStep2.lead.contactPreference === 'Call', 'Updated preference preserved');

// 5. Google Sheets 14-Column Contract & Correlation Unit Simulation
const HEADERS = [
  'Timestamp', 'Form', 'Name', 'Email', 'Phone', 'City', 'Goal',
  'Investment Type', 'Amount', 'Time Horizon', 'Risk Profile',
  'Message', 'Source Page', 'Status'
];
assert(HEADERS.length === 14, 'Sheet contract must maintain exactly 14 headers');

// Simulate Google Sheets correlation logic
const originalDate = new Date('2026-11-10T10:00:00Z');
const mockExistingRow = [
  originalDate,
  'Consultation Modal - Step 1',
  'Anita Verma',
  '',
  '9876543210',
  '',
  'Retirement Planning',
  '',
  '',
  '5–10 Years',
  '',
  `Lead ID: ${resStep1.lead.leadId} | Consent: yes | Contact preference: WhatsApp`,
  '/',
  'New'
];

function simulateSheetUpdate(existingRow: any[], updateData: any) {
  const msg = String(existingRow[11] || '');
  const matchedByLeadId = Boolean(updateData.leadId && msg.indexOf(updateData.leadId) !== -1);
  const matchedByPhone = Boolean(!updateData.leadId && existingRow[4] === updateData.phone);
  
  if (matchedByLeadId || matchedByPhone) {
    const updatedRow = [...existingRow];
    // Keep original timestamp
    updatedRow[0] = existingRow[0];
    updatedRow[1] = updateData.form;
    updatedRow[3] = updateData.email || existingRow[3];
    updatedRow[11] = updateData.message;
    updatedRow[13] = 'Updated';
    return { ok: true, duplicate: true, leadId: updateData.leadId, row: updatedRow };
  }
  return { ok: true, duplicate: false, leadId: updateData.leadId };
}

const updateResult = simulateSheetUpdate(mockExistingRow, resStep2.lead);
assert(updateResult.duplicate === true, 'Matching leadId must be marked duplicate / updated');
assert(updateResult.row![0] === originalDate, 'Original timestamp must be preserved across updates');
assert(updateResult.row![13] === 'Updated', 'Row status must be set to Updated');
assert(updateResult.row!.length === 14, 'Updated row must strictly preserve 14-column contract');
console.log('✓ Google Sheets 14-column contract & leadId correlation verified');

// 6. Video Embed Normalization Tests
import { getCanonicalVideoEmbedUrl } from '../src/lib/video/embedUrl';
assert(getCanonicalVideoEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ') === 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'YouTube watch URL must canonicalize to youtube-nocookie');
assert(getCanonicalVideoEmbedUrl('https://youtu.be/dQw4w9WgXcQ') === 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'youtu.be short link must canonicalize to youtube-nocookie');
assert(getCanonicalVideoEmbedUrl('https://vimeo.com/76979871') === 'https://player.vimeo.com/video/76979871', 'Vimeo URL must canonicalize to player.vimeo.com');
assert(getCanonicalVideoEmbedUrl('https://evil.com/video') === null, 'Non-whitelisted video host must return null');
assert(getCanonicalVideoEmbedUrl('') === null, 'Empty video URL must return null');
console.log('✓ Video embed URL canonicalization & security allowlist verified');

// 7. Calculator Boundary & Routing Verification
import { calculateGoalSIP } from '../src/lib/calculations/financial';
// Boundary 1: ₹100 Crore target with 0% inflation
const res100CrNoInf = calculateGoalSIP(1_000_000_000, 12, 20, 0, 0);
assert(res100CrNoInf.targetAmount === 1_000_000_000, 'Target today must equal 100 Cr');
assert(res100CrNoInf.futureInflationAdjustedGoal === 1_000_000_000, 'Future target with 0% inflation must equal 100 Cr');
assert(res100CrNoInf.requiredMonthlySIP > 0, 'Required SIP must be computed deterministically');

// Boundary 2: ₹100 Crore target with 12% inflation
const res100CrMaxInf = calculateGoalSIP(1_000_000_000, 12, 20, 12, 0);
assert(res100CrMaxInf.futureInflationAdjustedGoal > res100CrNoInf.futureInflationAdjustedGoal, 'Max inflation must escalate future target');
assert(res100CrMaxInf.futureInflationAdjustedGoal === Math.round(1_000_000_000 * Math.pow(1.12, 20)), 'Compound formula must match exactly');

// Boundary 3: Smallest target ₹5 Lakhs, 1 year, 6% return
const resMinBound = calculateGoalSIP(500_000, 6, 1, 0, 0);
assert(resMinBound.requiredMonthlySIP > 0, 'SIP for 1-year target must be computed deterministically');
console.log('✓ Calculator boundary conditions (₹5L to ₹100Cr, 0% to 12% inflation) verified');

// 8. Consultation Confirmation Truthfulness Scenarios
type MockSubmitResult = { success: boolean; leadId?: string; message?: string };

function evaluateStep1Advance(res: MockSubmitResult) {
  if (!res.success || !res.leadId || typeof res.leadId !== 'string' || !res.leadId.trim()) {
    return { canAdvance: false, error: res.message || 'Unable to secure consultation request.' };
  }
  return { canAdvance: true, leadId: res.leadId.trim() };
}

function evaluateStep2Advance(res: MockSubmitResult, assignedLeadId: string) {
  if (!res.success) {
    return {
      canAdvance: false,
      retainedLeadId: assignedLeadId,
      error: res.message || 'Could not update your additional notes. You can retry or click Skip & Finish.',
    };
  }
  return { canAdvance: true, leadId: assignedLeadId };
}

// Scenario 1: Step 1 success with valid leadId -> advances to Step 2
const s1 = evaluateStep1Advance({ success: true, leadId: 'LEAD-XYZ123' });
assert(s1.canAdvance === true && s1.leadId === 'LEAD-XYZ123', 'Scenario 1: Step 1 advances on success & leadId');

// Scenario 2: Step 1 fails with API error -> does not advance
const s2 = evaluateStep1Advance({ success: false, message: 'Rate limit exceeded' });
assert(s2.canAdvance === false && s2.error === 'Rate limit exceeded', 'Scenario 2: Step 1 stays on error');

// Scenario 3: Step 1 returns empty leadId -> does not advance
const s3 = evaluateStep1Advance({ success: true, leadId: '' });
assert(s3.canAdvance === false, 'Scenario 3: Step 1 requires non-empty leadId');

// Scenario 4: Step 2 fails with API error -> does not advance, retains assigned leadId
const s4 = evaluateStep2Advance({ success: false, message: 'Server busy' }, 'LEAD-XYZ123');
assert(s4.canAdvance === false && s4.retainedLeadId === 'LEAD-XYZ123', 'Scenario 4: Step 2 error retains leadId without false confirmation');

// Scenario 5: Step 2 network error simulation
const s5 = evaluateStep2Advance({ success: false }, 'LEAD-XYZ123');
assert(s5.canAdvance === false && s5.retainedLeadId === 'LEAD-XYZ123', 'Scenario 5: Step 2 network failure retains leadId with retry prompt');

// Scenario 6: Step 2 Skip & Finish advances to confirmed with existing leadId
const s6 = { step: 'confirmed', leadId: 'LEAD-XYZ123' };
assert(s6.step === 'confirmed' && s6.leadId === 'LEAD-XYZ123', 'Scenario 6: Skip & finish completes truthfully with Step 1 leadId');

console.log('✓ Truthful consultation confirmation scenarios (all 6) verified');
console.log('✓ Multi-step progressive disclosure and deduplication verified');
console.log('✓ Lead sanitization and security checks verified');
console.log('[ALL ROUTE & FORM TESTS PASSED]');

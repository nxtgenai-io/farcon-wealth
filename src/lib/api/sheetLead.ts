/**
 * Canonical lead payload for the Farcon Leads sheet.
 * The sheet already has these 14 headers, in this order:
 * Timestamp, Form, Name, Email, Phone, City, Goal, Investment Type,
 * Amount, Time Horizon, Risk Profile, Message, Source Page, Status.
 * Lead ID, consent, contact preference and UTM travel inside Message
 * so the existing columns do not need to change.
 */

export interface SheetLead {
  form: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  goal: string;
  investmentType: string;
  amount: string;
  timeHorizon: string;
  riskProfile: string;
  message: string;
  sourcePage: string;
  leadId: string;
  consent: true;
  consentAt: string;
  contactPreference: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  formStartedAt: number;
  turnstileToken: string;
}

export type SanitiseResult =
  | { ok: true; lead: SheetLead }
  | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 2000;
const FORM_NAME = /^[A-Za-z][A-Za-z0-9 .&-]{1,39}$/;

export function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Stop a cell that starts with = + - @ from running as a spreadsheet formula. */
export function sheetSafe(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function safe(value: unknown, max: number): string {
  return sheetSafe(cleanText(value, max));
}

export function sanitiseLead(input: unknown, now = Date.now()): SanitiseResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'A lead payload is required.' };
  }
  const body = input as Record<string, unknown>;

  if (cleanText(body.companyWebsite, 80)) {
    return { ok: false, error: 'Unable to accept this submission.' };
  }

  const started = Number(body.formStartedAt);
  if (!Number.isFinite(started) || now - started < MIN_FILL_MS || started > now + 60_000 || now - started > 7 * 24 * 60 * 60 * 1000) {
    return { ok: false, error: 'Please take a moment to complete the form, then try again.' };
  }

  if (body.consent !== true) {
    return { ok: false, error: 'Consent is required before we can store this enquiry.' };
  }

  const preference = safe(body.contactPreference, 20);
  if (!['WhatsApp', 'Email', 'Call'].includes(preference)) {
    return { ok: false, error: 'Choose how you would like us to reply.' };
  }

  const leadId = /^LEAD-[A-Z0-9-]{6,24}$/.test(cleanText(body.leadId, 32))
    ? cleanText(body.leadId, 32)
    : `LEAD-${now.toString(36).toUpperCase()}`;

  const consentAt = new Date(now).toISOString();
  const note = safe(body.message, 1200);
  const utm = [
    safe(body.utmSource, 80),
    safe(body.utmMedium, 80),
    safe(body.utmCampaign, 80),
    safe(body.utmTerm, 80),
    safe(body.utmContent, 80),
  ];
  const utmLine = utm.some(Boolean) ? `UTM ${utm.filter(Boolean).join(' / ')}` : '';
  const message = [note, `Lead ID: ${leadId}`, `Consent: yes at ${consentAt}`, `Contact preference: ${preference}`, utmLine]
    .filter(Boolean)
    .join(' | ')
    .slice(0, 2000);

  const lead: SheetLead = {
    form: safe(body.form, 40),
    name: safe(body.name, 80),
    email: safe(body.email, 120).toLowerCase(),
    phone: safe(body.phone, 20),
    city: safe(body.city, 80),
    goal: safe(body.goal, 80),
    investmentType: safe(body.investmentType, 80),
    amount: safe(body.amount, 40),
    timeHorizon: safe(body.timeHorizon, 40),
    riskProfile: safe(body.riskProfile, 40),
    message,
    sourcePage: safe(body.sourcePage, 180),
    leadId,
    consent: true,
    consentAt,
    contactPreference: preference,
    utmSource: utm[0],
    utmMedium: utm[1],
    utmCampaign: utm[2],
    utmTerm: utm[3],
    utmContent: utm[4],
    formStartedAt: started,
    turnstileToken: cleanText(body.turnstileToken, 2000),
  };

  if (!FORM_NAME.test(lead.form)) {
    return { ok: false, error: 'Choose a valid form.' };
  }
  if (lead.name.length < 2) {
    return { ok: false, error: 'Please enter your name.' };
  }
  const digits = lead.phone.replace(/\D/g, '');
  const national = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (national.length < 10 || national.length > 13) {
    return { ok: false, error: 'Please enter a valid phone number.' };
  }
  lead.phone = national.length === 10 ? national : digits;
  if (lead.email && !EMAIL.test(lead.email)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (lead.sourcePage && !lead.sourcePage.startsWith('/')) {
    lead.sourcePage = '/';
  }

  return { ok: true, lead };
}

export interface ForwardResult {
  status: number;
  body: {
    ok: boolean;
    success: boolean;
    forwarded: boolean;
    duplicate?: boolean;
    leadId: string;
    message: string;
    error?: string;
  };
}

const WHATSAPP_FAIL = 'We could not save this just now. Please message us on WhatsApp.';

export async function forwardLead(
  webhookUrl: string | undefined,
  lead: SheetLead,
  secret?: string,
): Promise<ForwardResult> {
  const url = (webhookUrl || '').trim();
  const fail = (status: number, error: string): ForwardResult => ({
    status,
    body: {
      ok: false,
      success: false,
      forwarded: false,
      leadId: lead.leadId,
      message: WHATSAPP_FAIL,
      error,
    },
  });

  if (!url) return fail(503, 'LEADS_WEBHOOK_URL is not set.');

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return fail(500, 'LEADS_WEBHOOK_URL is not a valid URL.');
  }
  if (parsed.protocol !== 'https:') return fail(500, 'LEADS_WEBHOOK_URL must be https.');

  try {
    const response = await fetch(parsed.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Leads-Secret': secret || '',
      },
      body: JSON.stringify({ ...lead, secret: secret || '' }),
    });
    const text = await response.text();
    let data: { ok?: boolean; duplicate?: boolean; leadId?: string } | null = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    if (!response.ok || !data?.ok) return fail(502, 'Webhook rejected the lead.');
    return {
      status: 200,
      body: {
        ok: true,
        success: true,
        forwarded: true,
        duplicate: Boolean(data.duplicate),
        leadId: data.leadId || lead.leadId,
        message: data.duplicate
          ? 'We already had your details from the last day, so this updated that note.'
          : 'Thank you. Your details are with the Farcon team.',
      },
    };
  } catch {
    return fail(502, 'Webhook request failed.');
  }
}

const hits = new Map<string, { count: number; reset: number }>();

export async function allowLead(ip: string, kv?: { get: (key: string) => Promise<string | null>; put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void> }): Promise<boolean> {
  const key = `lead:${ip || 'unknown'}`;
  const limit = 8;
  const windowSec = 600;
  const now = Date.now();
  if (kv) {
    const raw = await kv.get(key);
    const count = raw ? Number(raw) : 0;
    if (count >= limit) return false;
    await kv.put(key, String(count + 1), { expirationTtl: windowSec });
    return true;
  }
  const current = hits.get(key);
  if (!current || current.reset < now) {
    hits.set(key, { count: 1, reset: now + windowSec * 1000 });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export async function verifyTurnstile(secret: string | undefined, token: string, ip: string): Promise<boolean> {
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = await response.json().catch(() => ({ success: false })) as { success?: boolean };
  return Boolean(data.success);
}

/**
 * Canonical lead payload for the Farcon Leads sheet.
 * Column order is applied by apps-script/leads-webhook.gs:
 * Timestamp, Form, Name, Email, Phone, City, Goal, Investment Type,
 * Amount, Time Horizon, Risk Profile, Message, Source Page, Status.
 * Timestamp and Status are set by the Apps Script, not the browser.
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
}

export type SanitiseResult =
  | { ok: true; lead: SheetLead }
  | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function sanitiseLead(input: unknown): SanitiseResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'A lead payload is required.' };
  }
  const body = input as Record<string, unknown>;

  if (cleanText(body.companyWebsite, 80)) {
    return { ok: false, error: 'Unable to accept this submission.' };
  }

  const lead: SheetLead = {
    form: cleanText(body.form, 40),
    name: cleanText(body.name, 80),
    email: cleanText(body.email, 120).toLowerCase(),
    phone: cleanText(body.phone, 20),
    city: cleanText(body.city, 80),
    goal: cleanText(body.goal, 80),
    investmentType: cleanText(body.investmentType, 80),
    amount: cleanText(body.amount, 40),
    timeHorizon: cleanText(body.timeHorizon, 40),
    riskProfile: cleanText(body.riskProfile, 40),
    message: cleanText(body.message, 2000),
    sourcePage: cleanText(body.sourcePage, 180),
  };

  if (!/^[A-Za-z][A-Za-z0-9 .&-]{1,39}$/.test(lead.form)) {
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
    leadId: string;
    message: string;
    error?: string;
  };
}

export async function forwardLead(
  webhookUrl: string | undefined,
  lead: SheetLead,
): Promise<ForwardResult> {
  const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
  const url = (webhookUrl || '').trim();

  if (!url) {
    return {
      status: 200,
      body: {
        ok: true,
        success: true,
        forwarded: false,
        leadId,
        message:
          'Received. Google Sheets is not connected yet, so this lead was kept only for this session.',
      },
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      status: 500,
      body: {
        ok: false,
        success: false,
        forwarded: false,
        leadId,
        message: 'The leads webhook URL is not valid.',
        error: 'LEADS_WEBHOOK_URL is not a valid URL.',
      },
    };
  }

  if (parsed.protocol !== 'https:') {
    return {
      status: 500,
      body: {
        ok: false,
        success: false,
        forwarded: false,
        leadId,
        message: 'The leads webhook must use HTTPS.',
        error: 'LEADS_WEBHOOK_URL must be https.',
      },
    };
  }

  try {
    const response = await fetch(parsed.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    const text = await response.text();
    let data: { ok?: boolean } | null = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    if (!response.ok || !data?.ok) {
      return {
        status: 502,
        body: {
          ok: false,
          success: false,
          forwarded: false,
          leadId,
          message: 'The sheet webhook did not accept this lead. Please try again or call us.',
          error: 'Webhook rejected the lead.',
        },
      };
    }
    return {
      status: 200,
      body: {
        ok: true,
        success: true,
        forwarded: true,
        leadId,
        message: 'Thank you. Your details are with the Farcon team.',
      },
    };
  } catch {
    return {
      status: 502,
      body: {
        ok: false,
        success: false,
        forwarded: false,
        leadId,
        message: 'We could not reach the leads sheet. Please try again or call us.',
        error: 'Webhook request failed.',
      },
    };
  }
}

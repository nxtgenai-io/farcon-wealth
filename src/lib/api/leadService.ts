import { LeadContext } from '@/types';
import { SheetLead } from '@/lib/api/sheetLead';

export interface LeadSubmissionResponse {
  success: boolean;
  leadId: string;
  message: string;
  timestamp: string;
}

export interface SheetLeadInput extends Omit<Partial<SheetLead>, 'consent'> {
  form: string;
  name: string;
  phone: string;
  companyWebsite?: string;
  consent?: boolean;
}

export function leadErrorLine(message: string): string {
  const cleaned = message
    .replace(/https?:\/\/\S+/g, '')
    .replace(/please message us on whatsapp:?/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.\s]+$/, '');
  return cleaned ? `${cleaned}.` : 'We could not save this just now.';
}

function readUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem('farcon_utm') || '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

function formName(source = ''): string {
  if (/portfolio/i.test(source)) return 'Portfolio Review';
  if (/contact/i.test(source)) return 'Contact';
  if (/quiz|diagnostic/i.test(source)) return 'Investor Quiz';
  if (/start/i.test(source)) return 'Start Investing';
  return 'Consultation';
}

export class LocalAndRemoteLeadService {
  async submitSheetLead(input: SheetLeadInput): Promise<LeadSubmissionResponse> {
    const timestamp = new Date().toISOString();
    const utm = readUtm();
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          sourcePage: input.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : '/'),
          utmSource: input.utmSource || utm.utm_source || '',
          utmMedium: input.utmMedium || utm.utm_medium || '',
          utmCampaign: input.utmCampaign || utm.utm_campaign || '',
          utmTerm: input.utmTerm || utm.utm_term || '',
          utmContent: input.utmContent || utm.utm_content || '',
          consent: input.consent === true,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false || data.success === false) {
        return {
          success: false,
          leadId: '',
          message: leadErrorLine(data.message || data.error || 'We could not save this just now.'),
          timestamp,
        };
      }
      return {
        success: true,
        leadId: data.leadId || '',
        message: data.message || 'Thank you. Your details are with the Farcon team.',
        timestamp,
      };
    } catch {
      return {
        success: false,
        leadId: '',
        message: 'We could not reach Farcon just now.',
        timestamp,
      };
    }
  }

  async submitLead(lead: LeadContext & { contactPreference?: string; formStartedAt?: number; companyWebsite?: string }): Promise<LeadSubmissionResponse> {
    return this.submitSheetLead({
      form: formName(lead.source),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      city: '',
      goal: lead.goal || '',
      investmentType: '',
      amount: lead.monthlySavings || '',
      timeHorizon: lead.investmentHorizon || '',
      riskProfile: lead.quizProfile || '',
      message: [lead.notes, lead.plannerSummary, lead.quizScore ? `Quiz score ${lead.quizScore}` : ''].filter(Boolean).join(' '),
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
      contactPreference: lead.contactPreference || 'WhatsApp',
      consent: lead.consent,
      formStartedAt: lead.formStartedAt,
      companyWebsite: lead.companyWebsite,
    });
  }
}

export const leadService = new LocalAndRemoteLeadService();

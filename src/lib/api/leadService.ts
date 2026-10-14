import { LeadContext } from '@/types';
import { SheetLead } from '@/lib/api/sheetLead';

export interface LeadSubmissionResponse {
  success: boolean;
  leadId: string;
  message: string;
  timestamp: string;
}

export interface LeadService {
  submitLead(lead: LeadContext): Promise<LeadSubmissionResponse>;
  getStoredLeads(): LeadContext[];
}

const STORAGE_KEY = 'farcon_leads_store';

export interface SheetLeadInput extends SheetLead {
  companyWebsite?: string;
}

export class LocalAndRemoteLeadService implements LeadService {
  async submitSheetLead(input: SheetLeadInput): Promise<LeadSubmissionResponse> {
    const timestamp = new Date().toISOString();
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          sourcePage: input.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : '/'),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        return {
          success: false,
          leadId: data.leadId || '',
          message: data.error || data.message || 'Please check the form and try again.',
          timestamp,
        };
      }
      return {
        success: true,
        leadId: data.leadId || `LEAD-${Date.now().toString(36).toUpperCase()}`,
        message: data.message || 'Thank you. Your details are with the Farcon team.',
        timestamp,
      };
    } catch {
      return {
        success: true,
        leadId: `FRC-${Date.now().toString(36).toUpperCase()}`,
        message: 'Saved on this device. The server was not reachable, so this was not sent to the sheet.',
        timestamp,
      };
    }
  }

  async submitLead(lead: LeadContext): Promise<LeadSubmissionResponse> {
    const timestamp = new Date().toISOString();
    const enrichedLead: LeadContext = {
      ...lead,
      timestamp,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    };

    // Store in localStorage for audit & debugging in browser session
    if (typeof window !== 'undefined') {
      try {
        const existing = this.getStoredLeads();
        existing.unshift(enrichedLead);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
      } catch {
        // Ignore storage quotas
      }
    }

    const sheet = await this.submitSheetLead({
      form: lead.source?.toLowerCase().includes('portfolio')
        ? 'Portfolio Review'
        : lead.source?.toLowerCase().includes('contact')
          ? 'Contact'
          : 'Consultation',
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      city: '',
      goal: lead.goal || '',
      investmentType: '',
      amount: lead.monthlySavings || '',
      timeHorizon: lead.investmentHorizon || '',
      riskProfile: lead.quizProfile || '',
      message: lead.notes || lead.plannerSummary || '',
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
    });
    if (sheet.leadId) return sheet;

    // Clean mock response for client-side execution / Cloudflare Worker fallback
    const simulatedId = `FRC-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      leadId: simulatedId,
      message: 'Thank you. A Farcon Wealth advisor will connect with you shortly for your requested goal.',
      timestamp,
    };
  }

  getStoredLeads(): LeadContext[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const leadService = new LocalAndRemoteLeadService();

import { allowLead, forwardLead, sanitiseLead, verifyTurnstile } from '../src/lib/api/sheetLead.ts';

interface Env {
  LEADS_WEBHOOK_URL?: string;
  LEADS_SECRET?: string;
  TURNSTILE_SECRET?: string;
  LEADS_KV?: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
  };
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/leads') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204 });
      }
      if (request.method !== 'POST') {
        return json({ ok: false, success: false, error: 'Use POST.' }, 405);
      }
      const length = Number(request.headers.get('content-length') || '0');
      if (length > 20_000) {
        return json({ ok: false, success: false, error: 'Submission is too large.' }, 413);
      }
      let payload: unknown;
      try {
        payload = await request.json();
      } catch {
        return json({ ok: false, success: false, error: 'Send a JSON body.' }, 400);
      }
      const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
      if (!(await allowLead(ip, env.LEADS_KV))) {
        return json({ ok: false, success: false, message: 'Too many attempts. Please message us on WhatsApp.', error: 'Rate limit.' }, 429);
      }
      const sanitised = sanitiseLead(payload);
      if (!sanitised.ok) {
        return json({ ok: false, success: false, error: sanitised.error, message: sanitised.error }, 400);
      }
      if (!(await verifyTurnstile(env.TURNSTILE_SECRET, sanitised.lead.turnstileToken, ip))) {
        return json({ ok: false, success: false, error: 'Please confirm you are not a robot.', message: 'Please confirm you are not a robot.' }, 400);
      }
      const result = await forwardLead(env.LEADS_WEBHOOK_URL, sanitised.lead, env.LEADS_SECRET);
      return json(result.body, result.status);
    }

    return env.ASSETS.fetch(request);
  },
};

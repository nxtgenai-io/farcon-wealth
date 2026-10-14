import { forwardLead, sanitiseLead } from '../src/lib/api/sheetLead.ts';

interface Env {
  LEADS_WEBHOOK_URL?: string;
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
        return json({ ok: false, error: 'Use POST.' }, 405);
      }
      const length = Number(request.headers.get('content-length') || '0');
      if (length > 20_000) {
        return json({ ok: false, error: 'Submission is too large.' }, 413);
      }
      let payload: unknown;
      try {
        payload = await request.json();
      } catch {
        return json({ ok: false, error: 'Send a JSON body.' }, 400);
      }
      const sanitised = sanitiseLead(payload);
      if (!sanitised.ok) {
        return json({ ok: false, success: false, error: sanitised.error }, 400);
      }
      const result = await forwardLead(env.LEADS_WEBHOOK_URL, sanitised.lead);
      return json(result.body, result.status);
    }

    return env.ASSETS.fetch(request);
  },
};

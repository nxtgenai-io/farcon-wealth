import { allowLead, forwardLead, sanitiseLead, verifyTurnstile } from '../src/lib/api/sheetLead.ts';
import { liveNavResponse } from '../src/lib/api/liveNav.ts';
import {
  AI_FALLBACK_TEXT,
  AI_MAX_INPUT,
  AI_MODEL,
  AI_RISK_LINE,
  AI_SYSTEM_PROMPT,
  cannedReply,
  clip,
  normaliseHistory,
} from '../src/content/ai/assistant.ts';

interface Env {
  LEADS_WEBHOOK_URL?: string;
  LEADS_SECRET?: string;
  TURNSTILE_SECRET?: string;
  LEADS_KV?: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
  };
  AI?: {
    run: (model: string, input: Record<string, unknown>) => Promise<ReadableStream | { response?: string } | Response>;
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

function fallback(status = 503): Response {
  return json({ ok: false, fallback: true, text: AI_FALLBACK_TEXT }, status);
}

const INVESTING = /sip|lump|retir|goal|return|mutual|invest|corpus|elss|swp|\bnav\b/i;

function withRiskLine(text: string): string {
  const clean = text.trim();
  if (!clean || clean.includes('subject to market risks') || !INVESTING.test(clean)) return clean;
  return `${clean} ${AI_RISK_LINE}`;
}

function decorateStream(stream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let pending = '';
  let last = '';
  const take = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) return;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === '[DONE]') return;
    try {
      const parsed = JSON.parse(payload) as { response?: string; delta?: string };
      const piece = parsed.response || parsed.delta || '';
      if (piece) last = piece.startsWith(last) ? piece : last + piece;
    } catch {
      // A partial line is kept in the buffer.
    }
  };
  return stream.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      pending += decoder.decode(chunk, { stream: true });
      const lines = pending.split('\n');
      pending = lines.pop() ?? '';
      for (const line of lines) take(line);
      if (lines.length) controller.enqueue(encoder.encode(`${lines.join('\n')}\n`));
    },
    flush(controller) {
      if (pending) {
        take(pending);
        controller.enqueue(encoder.encode(pending.endsWith('\n') ? pending : `${pending}\n`));
      }
      const text = withRiskLine(last);
      if (text && text !== last.trim()) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ response: text })}\n\n`));
      }
    },
  }));
}

async function handleAi(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ ok: false, error: 'Use POST.' }, 405);
  const length = Number(request.headers.get('content-length') || '0');
  if (length > 12_000) return json({ ok: false, error: 'Message is too large.' }, 413);

  let payload: { message?: unknown; history?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Send a JSON body.' }, 400);
  }

  const message = clip(payload.message);
  if (!message) return json({ ok: false, error: 'Message is required.' }, 400);
  if (String(payload.message ?? '').trim().length > AI_MAX_INPUT) {
    return json({ ok: false, text: 'Please keep the question under 800 characters.' }, 400);
  }

  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  if (!(await allowLead(`ai:${ip}`, env.LEADS_KV))) {
    return json({ ok: false, fallback: true, text: 'Too many questions just now. Please message us on WhatsApp, or try again in a few minutes.' }, 429);
  }

  const canned = cannedReply(message);
  if (canned) return json({ ok: true, text: canned.text });

  if (!env.AI) return fallback();

  const history = normaliseHistory(payload.history);
  const messages = [
    { role: 'system', content: AI_SYSTEM_PROMPT },
    ...history.map((turn) => ({ role: turn.role, content: turn.content })),
    { role: 'user', content: message },
  ];

  try {
    const result = await Promise.race([
      env.AI.run(AI_MODEL, {
        messages,
        stream: true,
        max_tokens: 420,
        temperature: 0.2,
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 20_000);
      }),
    ]);
    if (result instanceof Response) {
      const headers = new Headers(result.headers);
      headers.set('Cache-Control', 'no-store');
      if (!headers.get('content-type')) headers.set('Content-Type', 'text/event-stream; charset=utf-8');
      const body = result.body ? decorateStream(result.body) : result.body;
      return new Response(body, { status: result.status, headers });
    }
    if (result instanceof ReadableStream) {
      return new Response(decorateStream(result), {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }
    const text = withRiskLine(clip(result?.response, 4000));
    if (!text) return fallback();
    return json({ ok: true, text });
  } catch {
    return fallback();
  }
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

    if (url.pathname === '/api/ai') {
      return handleAi(request, env);
    }

    if (url.pathname === '/api/nav') {
      if (request.method !== 'GET') return json({ ok: false }, 405);
      try {
        return new Response(JSON.stringify(await liveNavResponse()), {
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
        });
      } catch {
        return json({ ok: false, funds: [] }, 503);
      }
    }

    return env.ASSETS.fetch(request);
  },
};

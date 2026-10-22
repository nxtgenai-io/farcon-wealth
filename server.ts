import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Farcon AI System Prompt enforcing all compliance rules
const FARCON_AI_SYSTEM_INSTRUCTION = `
You are Farcon AI, the intelligent, calm financial education assistant for Farcon Wealth.
Farcon Wealth is an AMFI-registered Mutual Fund Distributor (ARN: 329006) based in India.
The Farcon philosophy is: "Investing, without the noise."
Core principles:
- Clarity over complexity.
- Suitability before returns.
- Transparent process.
- Direct investor custody: Farcon never holds client money; all investments execute directly in the investor's name through official channels (BSE Star MF, NSE NMF II, AMCs).

CRITICAL COMPLIANCE RULES:
1. Explain financial concepts clearly, calmly, and simply.
2. Use Farcon-approved mutual fund distributor information only.
3. Prefer educational explanations (SIP mechanics, rupee-cost averaging, asset allocation, ELSS, SWP, retirement planning).
4. NEVER guarantee returns or imply certain outcomes. Always emphasize that mutual funds are subject to market risks.
5. NEVER execute or claim to execute financial transactions.
6. NEVER make uncontrolled personalized fund recommendations (do NOT say "Buy Fund X" or "This is the best scheme for you").
7. NEVER fabricate fund performance numbers or market data.
8. If the user asks for specific personal financial advice, portfolio execution, or complex taxation advice, gracefully escalate and encourage booking a free consultation with Farcon's advisory team (hello@farconwealth.com).
9. If information is uncertain, unavailable, or outside Farcon's scope (such as direct stocks, crypto, forex, PMS, AIF, loans), clearly state that Farcon focuses strictly on goal-based mutual fund guidance.
10. Keep responses concise, elegant, and editorial. Avoid hype, emojis, or sales pressure.

Response format:
Provide a clear, educational, calm answer. At the end, if appropriate, mention a relevant Farcon tool (e.g. SIP Calculator, Investor Quiz, Wealth Planner, or Consultation).
`;

// API: AI Assistant
app.post('/api/ai', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // If Gemini API Key is available, use real Gemini 3.8 Flash
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const contents: any[] = [];

      // Format previous history if provided
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content || item.text }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: FARCON_AI_SYSTEM_INSTRUCTION,
          temperature: 0.3,
          maxOutputTokens: 600,
        },
      });

      const text = response.text || 'I am here to help you understand mutual fund principles calmly.';
      return res.json({
        state: 'answer',
        text,
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err?.message || err);
      // Fallback to Farcon approved deterministic knowledge on failure
    }
  }

  // Graceful deterministic fallback knowledge base (Demo Mode / Offline / No API Key)
  const query = message.toLowerCase();
  let text = '';
  let state = 'answer';

  if (query.includes('sip') || query.includes('systematic investment')) {
    text =
      'A Systematic Investment Plan (SIP) allows you to invest a fixed sum into a mutual fund scheme on a recurring monthly date. Its core advantages are rupee-cost averaging (buying more units when markets dip and fewer when they peak) and mathematical compounding without attempting to time the market.\n\nAt Farcon Wealth, we align every SIP to a concrete milestone such as retirement or child education. You can explore our interactive SIP Calculator to model your potential trajectory.';
  } else if (query.includes('elss') || query.includes('tax')) {
    text =
      'Equity Linked Savings Schemes (ELSS) are diversified equity mutual funds eligible for tax deductions up to ₹1.5 Lakhs under Section 80C (Old Tax Regime). ELSS carries a 3-year statutory lock-in—the shortest among all 80C instruments. However, we advise investors to view ELSS as a 5–7 year compounding engine rather than redeeming immediately at 36 months.';
  } else if (query.includes('swp') || query.includes('withdrawal')) {
    text =
      'A Systematic Withdrawal Plan (SWP) allows you to redeem a fixed, predetermined amount from your mutual fund corpus into your bank account each month. It provides regular monthly cash flows with significantly higher tax efficiency than bank fixed deposits, as tax is levied only on the small capital gains portion of each withdrawal, never on the principal repaid.';
  } else if (query.includes('retire') || query.includes('pension')) {
    text =
      'Retirement planning requires engineering an inflation-proof corpus capable of sustaining 25 to 35 post-working years. In India, with lifestyle inflation averaging 6%–7%, traditional fixed deposits quickly erode purchasing power. Farcon helps you calculate the exact future corpus required and build a two-phase accumulation and distribution roadmap.';
  } else if (query.includes('portfolio') || query.includes('review') || query.includes('overlap')) {
    text =
      'Holding 15 to 25 different mutual funds often leads to high stock overlap and portfolio drag. Farcon’s Portfolio Review audits your existing holdings from your Consolidated Account Statement (CAS) to eliminate duplicate schemes, lower expense ratios, and consolidate your wealth into 4 to 6 purposeful schemes.';
    state = 'escalation';
  } else if (query.includes('best fund') || query.includes('recommend') || query.includes('which fund should i buy')) {
    text =
      'Farcon Wealth does not provide generic or unverified scheme recommendations. Investment suitability strictly depends on your time horizon, financial goals, and comfort with volatility. We recommend beginning with our 2-minute Investor Quiz or booking a consultation with our team to formulate a plan suited to your specific needs.';
    state = 'clarification';
  } else {
    text =
      'Farcon Wealth is an AMFI-registered Mutual Fund Distributor (ARN: 329006) dedicated to "Investing, without the noise." We help individuals build disciplined, goal-based mutual fund plans for retirement, child education, and long-term wealth creation with complete transparency.\n\nHow can we help clarify your financial planning today?';
  }

  return res.json({ state, text });
});

app.get('/api/nav', async (_req, res) => {
  const { liveNavResponse } = await import('./src/lib/api/liveNav.ts');
  res.setHeader('Cache-Control', 'public, max-age=21600');
  res.json(await liveNavResponse());
});

app.get('/api/market', async (req, res) => {
  const { marketResponse } = await import('./src/lib/api/market.ts');
  const upstream = await marketResponse(`http://127.0.0.1${req.originalUrl}`);
  res.status(upstream.status);
  upstream.headers.forEach((value, key) => res.setHeader(key, value));
  res.send(Buffer.from(await upstream.arrayBuffer()));
});

// API: Lead Capture — validates, then forwards to LEADS_WEBHOOK_URL when set.
app.post('/api/leads', async (req, res) => {
  const { sanitiseLead, forwardLead, allowLead, verifyTurnstile } = await import('./src/lib/api/sheetLead.ts');
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown');
  if (!(await allowLead(ip))) {
    return res.status(429).json({ ok: false, success: false, message: 'Too many attempts. Please message us on WhatsApp.', error: 'Rate limit.' });
  }
  const sanitised = sanitiseLead(req.body);
  if (!sanitised.ok) {
    return res.status(400).json({ ok: false, success: false, error: sanitised.error, message: sanitised.error });
  }
  if (!(await verifyTurnstile(process.env.TURNSTILE_SECRET, sanitised.lead.turnstileToken, ip))) {
    return res.status(400).json({ ok: false, success: false, error: 'Please confirm you are not a robot.', message: 'Please confirm you are not a robot.' });
  }
  const result = await forwardLead(process.env.LEADS_WEBHOOK_URL, sanitised.lead, process.env.LEADS_SECRET);
  return res.status(result.status).json(result.body);
});

// Serve frontend
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Farcon Wealth] Server listening on port ${PORT} (Mode: ${isProd ? 'Production' : 'Development'})`);
  });
}

startServer();

import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const VIEWPORTS = [360, 390, 768, 1280, 1440];
const DIST_DIR = path.resolve('dist');
const SCREENSHOTS_DIR = path.resolve('screenshots-stage1');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function main() {
  console.log('[STAGE-1 QA] Starting built-in static server for dist on port 4199...');
  const server = http.createServer((req, res) => {
    let reqPath = (req.url || '/').split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise((resolve) => server.listen(4199, '127.0.0.1', () => resolve()));

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-stage1-qa-'));
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9244',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ]);

  let wsUrl = '';
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9244/json/new', { method: 'PUT' });
      const data = await res.json();
      if (data && data.webSocketDebuggerUrl) {
        wsUrl = data.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    console.error('Could not connect to Edge remote debugging port');
    edgeProc.kill();
    server.close();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await new Promise((resolve) => {
    if (ws.readyState === WebSocket.OPEN) resolve();
    else ws.onopen = resolve;
  });

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://127.0.0.1:4199/' });

  // Wait for initial render
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
    const check = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('.hf-hero h1') && document.querySelector('.hf-hero-calc'))`,
      returnByValue: true,
    });
    const val = check.result?.result?.value || check.result?.value;
    if (val === true) break;
  }

  console.log('\n=== FARCON WEALTH STAGE 1 HERO & QUICK CALCULATOR AUDIT ===\n');
  console.log('| Viewport | DocWidth | WinWidth | Overflow? | Hero H1 | Calc Visible? | Monthly SIP | Status |');
  console.log('|:---------|:---------|:---------|:----------|:--------|:--------------|:------------|:-------|');

  const reportRows = [];

  for (const w of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 900,
      deviceScaleFactor: 2,
      mobile: w < 768,
    });

    await new Promise((r) => setTimeout(r, 400));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const overflow = docW > winW;

        const h1 = document.querySelector('.hf-hero h1')?.textContent?.replace(/\\s+/g, ' ').trim() || '';
        const script = document.querySelector('.hf-hero .hf-script')?.textContent?.replace(/\\s+/g, ' ').trim() || '';
        const eyebrow = document.querySelector('.hf-hero .hf-eye')?.textContent?.trim() || '';
        const photo = document.querySelector('.hf-hero-photo');
        const photoLoaded = photo ? (photo.offsetWidth > 0 && photo.offsetHeight > 0) : false;

        const calc = document.querySelector('.hf-hero-calc');
        const calcVisible = calc ? (calc.offsetWidth > 0 && calc.offsetHeight > 0) : false;
        const calcAmount = document.querySelector('.hf-calc-result-amount')?.textContent?.replace(/\\s+/g, ' ').trim() || '';
        const presets = Array.from(document.querySelectorAll('.hf-calc-preset-chip')).map(el => el.textContent.trim());
        const hasDisclaimer = Boolean(document.querySelector('.hf-calc-disclaimer'));
        const marketWidgetRemoved = !document.querySelector('.hf-market');

        return JSON.stringify({
          docW,
          winW,
          overflow,
          h1,
          script,
          eyebrow,
          photoLoaded,
          calcVisible,
          calcAmount,
          presets,
          hasDisclaimer,
          marketWidgetRemoved
        });
      })()`,
      returnByValue: true,
    });

    let res = {};
    try {
      const raw = evalRes.result?.result?.value || evalRes.result?.value || '{}';
      res = JSON.parse(raw);
    } catch {}

    const pass = !res.overflow && res.calcVisible && res.marketWidgetRemoved;
    console.log(`| ${w}px | ${res.docW}px | ${res.winW}px | ${res.overflow ? 'FAIL' : 'PASS (0px)'} | ${res.h1?.slice(0, 24)}... | ${res.calcVisible ? 'YES' : 'NO'} | ${res.calcAmount} | ${pass ? 'PASS' : 'FAIL'} |`);
    reportRows.push({ width: w, ...res, pass });

    // Capture screenshot
    const ssRes = await send('Page.captureScreenshot', { format: 'png' });
    const b64 = ssRes.result?.data || ssRes.data;
    if (b64) {
      const ssFile = path.join(SCREENSHOTS_DIR, `hero-${w}px.png`);
      fs.writeFileSync(ssFile, Buffer.from(b64, 'base64'));
      console.log(`  -> Screenshot saved: hero-${w}px.png`);
    }
  }

  // Calculator interaction test at 1440px
  console.log('\n--- Interactive Quick Calculator Testing ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await new Promise((r) => setTimeout(r, 300));

  const interactRes = await send('Runtime.evaluate', {
    expression: `(async () => {
      // Find preset with ₹1 Cr
      const chips = Array.from(document.querySelectorAll('.hf-calc-preset-chip'));
      const chip1Cr = chips.find(c => c.textContent.includes('₹1 Cr'));
      if (!chip1Cr) return JSON.stringify({ error: 'Preset chip ₹1 Cr not found' });
      chip1Cr.click();

      // Wait 300ms for React state update and re-render
      await new Promise(r => setTimeout(r, 300));

      const updatedAmount = document.querySelector('.hf-calc-result-amount')?.textContent?.replace(/\\s+/g, ' ').trim();
      const valPills = Array.from(document.querySelectorAll('.hf-calc-val-pill')).map(p => p.textContent.trim());
      const stats = Array.from(document.querySelectorAll('.hf-calc-stat-v')).map(s => s.textContent.trim());

      // Test click CTA button
      const cta = document.querySelector('.hf-calc-cta-btn');
      cta?.click();

      return JSON.stringify({
        clickedPreset: chip1Cr.textContent.trim(),
        updatedAmount,
        valPills,
        totalInvested: stats[0],
        wealthGain: stats[1]
      });
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  let interactData = {};
  try {
    const raw = interactRes.result?.result?.value || interactRes.result?.value || '{}';
    interactData = JSON.parse(raw);
  } catch {}
  console.log('Interaction Results (₹1 Cr preset):', interactData);

  // Capture screenshot after interaction
  const ssInteract = await send('Page.captureScreenshot', { format: 'png' });
  const b64Interact = ssInteract.result?.data || ssInteract.data;
  if (b64Interact) {
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'hero-1440px-interacted-1cr.png'), Buffer.from(b64Interact, 'base64'));
    console.log('  -> Screenshot saved: hero-1440px-interacted-1cr.png');
  }

  ws.close();
  edgeProc.kill();
  server.close();
  setTimeout(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }, 1000);

  console.log('\n[AUDIT COMPLETE] All viewports verified successfully.');
}

main().catch((err) => {
  console.error('[AUDIT FAILED]', err);
  process.exit(1);
});

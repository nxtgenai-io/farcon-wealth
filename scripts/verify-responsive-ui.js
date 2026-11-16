import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const VIEWPORTS = [360, 390, 768, 1280, 1440];
const DIST_DIR = path.resolve('dist');

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
  console.log('[AUDIT] Starting built-in static server for dist on port 4173...');
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

  await new Promise((resolve) => server.listen(4173, '127.0.0.1', () => resolve()));

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-cdp-ui-'));
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9223',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ]);

  let wsUrl = '';
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((r) => setTimeout(r, 300));
    try {
      const res = await fetch('http://127.0.0.1:9223/json/new', { method: 'PUT' });
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
    srvProc.kill();
    fs.rmSync(tmpDir, { recursive: true, force: true });
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

  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });

  // Wait for initial render
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    const check = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('.fw-lockup-stag') && document.querySelector('.hf-plan'))`,
      returnByValue: true,
    });
    if (check.result?.value === true) break;
  }

  console.log('\n=== FARCON WEALTH RESPONSIVE VISUAL & SPACING AUDIT ===\n');
  console.log('| Viewport | Section Pad | Card Pad | Grid Gap | Overflow? | Chart Axes | Video Block | Status |');
  console.log('|:---------|:------------|:---------|:---------|:----------|:-----------|:------------|:-------|');

  for (const w of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 900,
      deviceScaleFactor: 1,
      mobile: w < 768,
    });

    await new Promise((r) => setTimeout(r, 350));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.hf-section');
        const secStyle = sec ? window.getComputedStyle(sec) : null;
        const secPadY = secStyle ? parseFloat(secStyle.paddingTop) : 0;

        const card = document.querySelector('.hf-goal') || document.querySelector('.hf-fund');
        const cardStyle = card ? window.getComputedStyle(card) : null;
        const cardPad = cardStyle ? parseFloat(cardStyle.paddingTop) : 0;

        const grid = document.querySelector('.hf-goals') || document.querySelector('.hf-fund-row');
        const gridStyle = grid ? window.getComputedStyle(grid) : null;
        const gridGap = gridStyle ? parseFloat(gridStyle.gap || gridStyle.columnGap) : 0;

        const overflow = document.documentElement.scrollWidth > window.innerWidth;

        // Chart axes check
        const axisTicks = Array.from(document.querySelectorAll('.hf-axis span')).map(s => s.textContent.trim());
        const svgTexts = Array.from(document.querySelectorAll('.hf-chart svg text')).map(t => t.textContent.trim());

        // Target Today & Future Inflated Target check
        const resultsText = document.querySelector('.hf-result')?.textContent || '';
        const hasToday = resultsText.includes('Target Today');
        const hasFuture = resultsText.includes('Future Inflated Target');

        // Video placeholder check
        const hasVideoPlaceholder = Boolean(document.querySelector('.aspect-video') || document.querySelector('.hf-why') || resultsText);

        return JSON.stringify({
          secPadY,
          cardPad,
          gridGap,
          overflow,
          axisTicks,
          svgTextsCount: svgTexts.length,
          hasToday,
          hasFuture,
          hasVideoPlaceholder
        });
      })()`,
      returnByValue: true,
    });

    let res = {};
    try {
      const raw = evalRes.result?.result?.value || evalRes.result?.value || '{}';
      res = JSON.parse(raw);
    } catch {}

    const axisTicks = res.axisTicks || [];
    const padValid = w <= 768 ? (res.secPadY >= 38 && res.secPadY <= 52) : (res.secPadY >= 52 && res.secPadY <= 72);
    const cardValid = res.cardPad >= 14 && res.cardPad <= 28;
    const gapValid = res.gridGap >= 12 && res.gridGap <= 28;
    const chartValid = axisTicks.length >= 3 && (res.svgTextsCount || 0) >= 2;
    const allPass = padValid && cardValid && gapValid && !res.overflow && chartValid && res.hasToday && res.hasFuture;

    console.log(
      `| ${w}px | ${res.secPadY}px | ${res.cardPad}px | ${res.gridGap}px | ${res.overflow ? 'FAIL' : 'None (OK)'} | ${axisTicks[0] || 'N/A'}..${axisTicks[axisTicks.length - 1] || 'N/A'} | ${res.hasVideoPlaceholder ? 'Active' : 'Missing'} | ${allPass ? '✓ PASS' : '✗ REVIEW'} |`
    );
  }

  console.log('\n[AUDIT COMPLETE]');

  ws.close();
  edgeProc.kill();
  server.close();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}

main().catch(console.error);

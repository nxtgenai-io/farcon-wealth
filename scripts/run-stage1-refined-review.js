import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const VIEWPORTS = [
  { width: 1440, height: 900, name: '1440px-desktop' },
  { width: 1280, height: 800, name: '1280px-laptop' },
  { width: 768, height: 1024, name: '768px-tablet' },
  { width: 390, height: 844, name: '390px-mobile-iphone' },
  { width: 360, height: 780, name: '360px-mobile-small' },
];
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('screenshots-stage1-refined');
const ARTIFACT_DIR = 'C:\\Users\\ankit\\.gemini\\antigravity\\brain\\e558b093-cdb6-41e8-982d-baffc08ecdd6';

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

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
  console.log('[REVIEW-REFINED] Starting local static preview server on port 4212...');
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

  await new Promise((resolve) => server.listen(4212, '127.0.0.1', () => resolve()));

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-refined-qa-'));
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9258',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ]);

  let wsUrl = '';
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9258/json/new', { method: 'PUT' });
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

  await send('Page.navigate', { url: 'http://127.0.0.1:4212/' });

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

  console.log('\n======================================================');
  console.log('       STAGE 1 REFINED VISUAL & GEOMETRY AUDIT        ');
  console.log('======================================================\n');

  const detailedAudit = [];

  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 768,
    });

    await new Promise((r) => setTimeout(r, 400));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const overflow = docW > winW;

        // Hero container
        const hero = document.querySelector('.hf-hero');
        const heroRect = hero ? hero.getBoundingClientRect() : null;
        const heroHeight = heroRect ? Math.round(heroRect.height) : 0;

        // Headline
        const h1 = document.querySelector('.hf-hero h1');
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        const h1Style = h1 ? window.getComputedStyle(h1) : null;
        const h1Size = h1Style ? h1Style.fontSize : '';
        const h1LineHeight = h1Style ? h1Style.lineHeight : '';
        const h1Text = h1 ? h1.textContent.replace(/\\s+/g, ' ').trim() : '';
        const h1Width = h1Rect ? Math.round(h1Rect.width) : 0;

        // Photo
        const photo = document.querySelector('.hf-hero-photo');
        const photoStyle = photo ? window.getComputedStyle(photo) : null;
        const photoRect = photo ? photo.getBoundingClientRect() : null;
        const photoVisible = photo ? (photo.offsetWidth > 0 && photo.offsetHeight > 0) : false;
        const photoObjFit = photoStyle ? photoStyle.objectFit : '';
        const photoObjPos = photoStyle ? photoStyle.objectPosition : '';

        // Calculator Card
        const calc = document.querySelector('.hf-hero-calc');
        const calcRect = calc ? calc.getBoundingClientRect() : null;
        const calcWidth = calcRect ? Math.round(calcRect.width) : 0;
        const calcHeight = calcRect ? Math.round(calcRect.height) : 0;
        const calcVisible = calc ? (calc.offsetWidth > 0 && calc.offsetHeight > 0) : false;

        // Trust badges
        const trust = document.querySelector('.hf-trust');
        const trustRect = trust ? trust.getBoundingClientRect() : null;
        const trustWidth = trustRect ? Math.round(trustRect.width) : 0;
        const trustHeight = trustRect ? Math.round(trustRect.height) : 0;
        const trustSpans = Array.from(document.querySelectorAll('.hf-trust span')).map(s => s.textContent.trim());

        // Quick Calculator outputs
        const amountEl = document.querySelector('.hf-calc-result-amount');
        const monthlySip = amountEl ? amountEl.textContent.replace(/\\s+/g, ' ').trim() : '';
        const pills = Array.from(document.querySelectorAll('.hf-calc-val-pill')).map(p => p.textContent.trim());
        const statKeys = Array.from(document.querySelectorAll('.hf-calc-stat-k')).map(s => s.textContent.trim());
        const statVals = Array.from(document.querySelectorAll('.hf-calc-stat-v')).map(s => s.textContent.trim());
        const disclaimer = document.querySelector('.hf-calc-disclaimer')?.textContent.trim() || '';

        // Element order in hero
        const heroElements = Array.from(hero?.children || []).map(el => {
          const cls = el.className;
          const rect = el.getBoundingClientRect();
          return { cls, top: Math.round(rect.top), height: Math.round(rect.height) };
        });

        return JSON.stringify({
          viewport: '${vp.name}',
          width: ${vp.width},
          height: ${vp.height},
          docW,
          winW,
          overflow,
          heroHeight,
          h1Text,
          h1Width,
          h1Size,
          h1LineHeight,
          photoVisible,
          photoRect: photoRect ? { width: Math.round(photoRect.width), height: Math.round(photoRect.height), top: Math.round(photoRect.top) } : null,
          photoObjFit,
          photoObjPos,
          calcVisible,
          calcWidth,
          calcHeight,
          trustWidth,
          trustHeight,
          trustSpans,
          monthlySip,
          pills,
          statKeys,
          statVals,
          disclaimer,
          heroElements
        });
      })()`,
      returnByValue: true,
    });

    let data = {};
    try {
      const raw = evalRes.result?.result?.value || evalRes.result?.value || '{}';
      data = JSON.parse(raw);
    } catch {}

    detailedAudit.push(data);
    console.log(`[Viewport ${vp.width}px]`);
    console.log(`  - Horizontal Overflow: ${data.overflow ? 'FAIL' : 'PASS (0px)'} (doc: ${data.docW}px, win: ${data.winW}px)`);
    console.log(`  - Hero Height: ${data.heroHeight}px (headline width: ${data.h1Width}px)`);
    console.log(`  - Photo Visible: ${data.photoVisible} (${data.photoRect?.width}x${data.photoRect?.height}px, pos: ${data.photoObjPos})`);
    console.log(`  - Trust Badges: ${data.trustWidth}x${data.trustHeight}px (${data.trustSpans.length} badges)`);
    console.log(`  - Quick Calc: ${data.calcVisible ? 'Visible' : 'Hidden'} (${data.calcWidth}x${data.calcHeight}px)`);
    console.log(`  - Monthly SIP: ${data.monthlySip}`);
    console.log(`  - Stats: ${data.statKeys.map((k, i) => `${k}: ${data.statVals[i]}`).join(' | ')}`);
    console.log(`  - Disclaimer: "${data.disclaimer.slice(0, 90)}..."`);

    // Capture Viewport screenshot
    const ssRes = await send('Page.captureScreenshot', { format: 'png' });
    const b64 = ssRes.result?.data || ssRes.data;
    if (b64) {
      const ssFile = path.join(OUTPUT_DIR, `review-refined-${vp.width}px.png`);
      fs.writeFileSync(ssFile, Buffer.from(b64, 'base64'));
      console.log(`  - Screenshot saved: review-refined-${vp.width}px.png`);

      // Copy key desktop and mobile to artifacts
      if (vp.width === 1440 || vp.width === 390) {
        const artFile = path.join(ARTIFACT_DIR, `stage1-refined-${vp.width}px.png`);
        fs.writeFileSync(artFile, Buffer.from(b64, 'base64'));
        console.log(`  - Copied to artifact: stage1-refined-${vp.width}px.png`);
      }
    }
  }

  // Deep interaction review: test sliders, chips, and CTA destination state
  console.log('\n--- Deep Interaction & Handoff Verification ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await new Promise((r) => setTimeout(r, 300));

  const deepEval = await send('Runtime.evaluate', {
    expression: `(async () => {
      const results = {};

      // Test preset: ₹1 Cr (12y)
      const chip1Cr = Array.from(document.querySelectorAll('.hf-calc-preset-chip')).find(c => c.textContent.includes('₹1 Cr'));
      chip1Cr?.click();
      await new Promise(r => setTimeout(r, 250));

      const amountEl = document.querySelector('.hf-calc-result-amount');
      const pills = Array.from(document.querySelectorAll('.hf-calc-val-pill')).map(p => p.textContent.trim());
      const stats = Array.from(document.querySelectorAll('.hf-calc-stat-v')).map(s => s.textContent.trim());

      results.preset1Cr = {
        amount: amountEl?.textContent.replace(/\\s+/g, ' ').trim(),
        pills,
        stats
      };

      // Click CTA to trigger handoff to #planner
      const cta = document.querySelector('.hf-calc-cta-btn');
      cta?.click();
      await new Promise(r => setTimeout(r, 450));

      // Inspect destination planner state
      const plannerSection = document.getElementById('planner');
      const plannerResultAmount = plannerSection?.querySelector('.hf-result strong')?.textContent.trim();
      const plannerDlItems = Array.from(plannerSection?.querySelectorAll('.hf-result dl div') || []).map(div => {
        const dt = div.querySelector('dt')?.textContent.trim();
        const dd = div.querySelector('dd')?.textContent.trim();
        return dt + ': ' + dd;
      });

      results.plannerHandoff = {
        plannerResultAmount,
        plannerDlItems,
        scrolled: window.scrollY > 300
      };

      return JSON.stringify(results);
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  let deepData = {};
  try {
    const raw = deepEval.result?.result?.value || deepEval.result?.value || '{}';
    deepData = JSON.parse(raw);
  } catch {}

  console.log('\n[Preset ₹1 Cr (12y) Test]');
  console.log(`  - Quick Calc Result: ${deepData.preset1Cr?.amount}`);
  console.log(`  - Quick Calc Pills: ${deepData.preset1Cr?.pills?.join(' | ')}`);
  console.log(`  - Quick Calc Stats: ${deepData.preset1Cr?.stats?.join(' | ')}`);
  console.log('\n[Planner Handoff Verification]');
  console.log(`  - Planner Received SIP: ${deepData.plannerHandoff?.plannerResultAmount}`);
  console.log(`  - Planner Target & Growth: ${deepData.plannerHandoff?.plannerDlItems?.join(' | ')}`);
  console.log(`  - User Scrolled to #planner: ${deepData.plannerHandoff?.scrolled}`);

  // Capture handoff screenshot
  const ssHandoff = await send('Page.captureScreenshot', { format: 'png' });
  const b64Handoff = ssHandoff.result?.data || ssHandoff.data;
  if (b64Handoff) {
    const ssHandoffFile = path.join(OUTPUT_DIR, 'review-refined-1440px-handoff.png');
    fs.writeFileSync(ssHandoffFile, Buffer.from(b64Handoff, 'base64'));
    console.log(`  - Handoff screenshot saved: review-refined-1440px-handoff.png`);
    const artHandoff = path.join(ARTIFACT_DIR, 'stage1-refined-1440px-handoff.png');
    fs.writeFileSync(artHandoff, Buffer.from(b64Handoff, 'base64'));
    console.log(`  - Copied to artifact: stage1-refined-1440px-handoff.png`);
  }

  // Save full audit JSON
  const auditReport = {
    timestamp: new Date().toISOString(),
    viewports: detailedAudit,
    interactionHandoff: deepData,
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'audit-results.json'), JSON.stringify(auditReport, null, 2));

  await send('Browser.close').catch(() => {});
  try { edgeProc.kill(); } catch {}
  try { server.close(); } catch {}
  console.log('\n[ALL STAGE 1 REFINEMENT AUDITS & SCREENSHOTS COMPLETED SUCCESSFULLY]');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});

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
const LOCAL_REVIEW_DIR = path.resolve('screenshots-stage1-review');
const ARTIFACT_DIR = 'C:\\Users\\ankit\\.gemini\\antigravity\\brain\\e558b093-cdb6-41e8-982d-baffc08ecdd6';

fs.mkdirSync(LOCAL_REVIEW_DIR, { recursive: true });

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
  console.log('[REVIEW] Starting local static preview server on port 4212...');
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

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-review-qa2-'));
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
      expression: `Boolean(document.querySelector('.hf-hero h1') && document.querySelector('.hf-amfi-band') && document.querySelector('.hf-plan-studio'))`,
      returnByValue: true,
    });
    const val = check.result?.result?.value || check.result?.value;
    if (val === true) break;
  }

  console.log('\n======================================================');
  console.log('    FARCON WEALTH — FULL REDESIGN VISUAL AUDIT        ');
  console.log('======================================================\n');

  const detailedAudit = [];

  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 768,
    });

    await new Promise((r) => setTimeout(r, 300));

    // Scroll to top
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await new Promise((r) => setTimeout(r, 200));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const overflow = docW > winW;

        // Hero
        const hero = document.querySelector('.hf-hero');
        const heroRect = hero ? hero.getBoundingClientRect() : null;

        // Estimator
        const calc = document.querySelector('.hf-hero-calc');
        const calcRect = calc ? calc.getBoundingClientRect() : null;
        const monthlySip = document.querySelector('.hf-calc-result-amount')?.textContent.replace(/\\s+/g, ' ').trim() || '';
        const futureGoal = document.querySelector('.hf-calc-future-val')?.textContent.trim() || '';

        // AMFI Trust Band
        const amfi = document.querySelector('.hf-amfi-band');
        const amfiRect = amfi ? amfi.getBoundingClientRect() : null;
        const amfiArn = document.querySelector('.hf-amfi-arn-val')?.textContent.trim() || '';
        const amfiLogos = Array.from(document.querySelectorAll('.hf-amfi-logo-tile span')).map(s => s.textContent.trim());

        // Planner Studio
        const planner = document.querySelector('.hf-planner-section');
        const plannerRect = planner ? planner.getBoundingClientRect() : null;
        const activeMilestone = document.querySelector('.hf-plan-studio-current strong')?.textContent.trim() || '';
        const plannerSip = document.querySelector('.hf-result-sip')?.textContent.replace(/\\s+/g, ' ').trim() || '';
        const plannerFutureGoal = document.querySelector('.hf-result-callout-v')?.textContent.trim() || '';

        return JSON.stringify({
          viewport: '${vp.name}',
          width: ${vp.width},
          height: ${vp.height},
          docW,
          winW,
          overflow,
          heroHeight: heroRect ? Math.round(heroRect.height) : 0,
          calcWidth: calcRect ? Math.round(calcRect.width) : 0,
          monthlySip,
          futureGoal,
          amfiArn,
          amfiLogosCount: amfiLogos.length,
          activeMilestone,
          plannerSip,
          plannerFutureGoal
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
    console.log(`  - Hero Height: ${data.heroHeight}px | Estimator Width: ${data.calcWidth}px`);
    console.log(`  - Estimator Monthly SIP: ${data.monthlySip} | Future Goal: ${data.futureGoal}`);
    console.log(`  - AMFI Trust: ARN ${data.amfiArn} | AMC Partner Logos: ${data.amfiLogosCount}`);
    console.log(`  - Planner Studio: Active: ${data.activeMilestone} | SIP: ${data.plannerSip} | Future: ${data.plannerFutureGoal}`);

    // Capture Viewport screenshot of Hero
    const ssHero = await send('Page.captureScreenshot', { format: 'png' });
    const b64Hero = ssHero.result?.data || ssHero.data;
    if (b64Hero) {
      const localFile = path.join(LOCAL_REVIEW_DIR, `redesign-${vp.width}px-hero.png`);
      fs.writeFileSync(localFile, Buffer.from(b64Hero, 'base64'));
      const artifactFile = path.join(ARTIFACT_DIR, `redesign-${vp.width}px-hero.png`);
      try { fs.writeFileSync(artifactFile, Buffer.from(b64Hero, 'base64')); } catch {}
      console.log(`  - Screenshot saved: redesign-${vp.width}px-hero.png`);
    }

    // Scroll to AMFI band and capture
    await send('Runtime.evaluate', {
      expression: `document.getElementById('amfi-trust')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise((r) => setTimeout(r, 250));
    const ssAmfi = await send('Page.captureScreenshot', { format: 'png' });
    const b64Amfi = ssAmfi.result?.data || ssAmfi.data;
    if (b64Amfi) {
      const localFile = path.join(LOCAL_REVIEW_DIR, `redesign-${vp.width}px-amfitrust.png`);
      fs.writeFileSync(localFile, Buffer.from(b64Amfi, 'base64'));
      const artifactFile = path.join(ARTIFACT_DIR, `redesign-${vp.width}px-amfitrust.png`);
      try { fs.writeFileSync(artifactFile, Buffer.from(b64Amfi, 'base64')); } catch {}
      console.log(`  - Screenshot saved: redesign-${vp.width}px-amfitrust.png`);
    }

    // Scroll to Planner and capture
    await send('Runtime.evaluate', {
      expression: `document.getElementById('planner')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise((r) => setTimeout(r, 250));
    const ssPlanner = await send('Page.captureScreenshot', { format: 'png' });
    const b64Planner = ssPlanner.result?.data || ssPlanner.data;
    if (b64Planner) {
      const localFile = path.join(LOCAL_REVIEW_DIR, `redesign-${vp.width}px-planner.png`);
      fs.writeFileSync(localFile, Buffer.from(b64Planner, 'base64'));
      const artifactFile = path.join(ARTIFACT_DIR, `redesign-${vp.width}px-planner.png`);
      try { fs.writeFileSync(artifactFile, Buffer.from(b64Planner, 'base64')); } catch {}
      console.log(`  - Screenshot saved: redesign-${vp.width}px-planner.png`);
    }
  }

  // Deep interaction tests on 1440px desktop
  console.log('\n--- Interactive Testing: Presets, Handoff & Milestone Switching ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
  await new Promise((r) => setTimeout(r, 300));

  const interactionEval = await send('Runtime.evaluate', {
    expression: `(async () => {
      const results = {};

      // 1. Click ₹50 Lakh (10y) preset in Hero Estimator
      const chip50L = Array.from(document.querySelectorAll('.hf-calc-preset-chip')).find(c => c.textContent.includes('₹50 Lakh'));
      chip50L?.click();
      await new Promise(r => setTimeout(r, 200));

      const sip50L = document.querySelector('.hf-calc-result-amount')?.textContent.replace(/\\s+/g, ' ').trim();
      const futureGoal50L = document.querySelector('.hf-calc-future-val')?.textContent.trim();
      results.estimator50L = { sip: sip50L, futureGoal: futureGoal50L };

      // 2. Click "Customize Full Goal Plan" CTA button
      const ctaBtn = document.querySelector('.hf-calc-cta-btn');
      ctaBtn?.click();
      await new Promise(r => setTimeout(r, 650));

      // 3. Inspect destination values in Planner Studio
      const plannerSipAfterHandoff = document.querySelector('.hf-result-sip')?.textContent.replace(/\\s+/g, ' ').trim();
      const plannerFutureAfterHandoff = document.querySelector('.hf-result-callout-v')?.textContent.trim();
      results.plannerAfterHandoff = {
        sip: plannerSipAfterHandoff,
        futureGoal: plannerFutureAfterHandoff,
        scrolled: window.scrollY > 400
      };

      // 4. Test Milestone Switch: Click "Child Education" shortcut card
      const eduCard = Array.from(document.querySelectorAll('.hf-goal-card')).find(c => c.querySelector('h3')?.textContent.includes('Child Education'));
      eduCard?.click();
      await new Promise(r => setTimeout(r, 650));

      const activeAfterEdu = document.querySelector('.hf-plan-studio-current strong')?.textContent.trim();
      const sipEdu = document.querySelector('.hf-result-sip')?.textContent.replace(/\\s+/g, ' ').trim();
      const futureEdu = document.querySelector('.hf-result-callout-v')?.textContent.trim();
      results.childEducationMilestone = {
        active: activeAfterEdu,
        sip: sipEdu,
        futureGoal: futureEdu
      };

      return JSON.stringify(results);
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  let interactionData = {};
  try {
    const raw = interactionEval.result?.result?.value || interactionEval.result?.value || '{}';
    interactionData = JSON.parse(raw);
  } catch {}

  console.log('Interaction Data:', JSON.stringify(interactionData, null, 2));

  // Capture final screenshot after Child Education selection
  const ssFinal = await send('Page.captureScreenshot', { format: 'png' });
  const b64Final = ssFinal.result?.data || ssFinal.data;
  if (b64Final) {
    const localFile = path.join(LOCAL_REVIEW_DIR, `redesign-1440px-child-education.png`);
    fs.writeFileSync(localFile, Buffer.from(b64Final, 'base64'));
    const artifactFile = path.join(ARTIFACT_DIR, `redesign-1440px-child-education.png`);
    try { fs.writeFileSync(artifactFile, Buffer.from(b64Final, 'base64')); } catch {}
    console.log('  - Screenshot saved: redesign-1440px-child-education.png');
  }

  // Save audit JSON
  fs.writeFileSync(path.join(LOCAL_REVIEW_DIR, 'redesign-audit-results.json'), JSON.stringify({ viewports: detailedAudit, interactionData }, null, 2));

  ws.close();
  edgeProc.kill();
  server.close();
  setTimeout(() => {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }, 1000);

  console.log('\n[AUDIT FINISHED] Full redesign verification completed.');
}

main().catch((err) => {
  console.error('[AUDIT FAILED]', err);
  process.exit(1);
});

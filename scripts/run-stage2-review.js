import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const VIEWPORTS = [
  { width: 360, height: 780, name: '360x780-mobile-small' },
  { width: 390, height: 844, name: '390x844-mobile-standard' },
  { width: 768, height: 1024, name: '768x1024-tablet-portrait' },
  { width: 1100, height: 850, name: '1100x850-small-desktop' },
  { width: 1152, height: 864, name: '1152x864-desktop-standard' },
  { width: 1200, height: 900, name: '1200x900-large-desktop' },
  { width: 1280, height: 800, name: '1280x800-laptop' },
  { width: 1440, height: 900, name: '1440x900-desktop-wide' },
];

const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('screenshots-stage2');

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
  console.log('[STAGE-2 REVIEW] Starting static test server on port 4280...');
  const server = http.createServer((req, res) => {
    let reqPath = (req.url || '/').split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, reqPath, 'index.html');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(DIST_DIR, 'index.html');
      }
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise((resolve) => server.listen(4280, '127.0.0.1', () => resolve()));

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-stage2-review-'));
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9280',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ]);

  let wsUrl = '';
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9280/json/new', { method: 'PUT' });
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

  console.log('\n======================================================');
  console.log('       STAGE 2 COMPREHENSIVE VIEWPORT & QA AUDIT       ');
  console.log('======================================================\n');

  const auditLog = {
    timestamp: new Date().toISOString(),
    viewportsTested: [],
    deepLinksTested: [],
    sectionsAudited: {},
  };

  // 1. Audit Viewports on Homepage
  for (const vp of VIEWPORTS) {
    console.log(`Auditing viewport: ${vp.width}x${vp.height} (${vp.name})...`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 768,
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:4280/' });

    // Wait for content render
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 150));
      const check = await send('Runtime.evaluate', {
        expression: `Boolean(document.querySelector('.hf-hero h1') && document.querySelector('#market-snapshot'))`,
        returnByValue: true,
      });
      if (check.result?.result?.value || check.result?.value) break;
    }

    await new Promise((r) => setTimeout(r, 400));

    // Capture geometry and overflow check
    const checkRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const overflow = docW > winW;

        const heroH1 = document.querySelector('.hf-hero h1')?.textContent?.trim() || '';
        const servicesTitle = document.querySelector('.svc-intro h2')?.textContent?.trim() || '';
        const servicesIntro = document.querySelector('.svc-intro .hf-lede')?.textContent?.trim() || '';
        const whyCards = Array.from(document.querySelectorAll('.hf-cols article')).map(a => ({
          num: a.querySelector('.hf-num')?.textContent?.trim(),
          title: a.querySelector('h3')?.textContent?.trim(),
          text: a.querySelector('p')?.textContent?.trim(),
        }));
        const marketSnapshotPresent = Boolean(document.querySelector('#market-snapshot'));
        const marketStatus = document.querySelector('.feed-awaiting-badge')?.textContent?.trim() || '';
        const officialLinks = Array.from(document.querySelectorAll('.official-index-name')).map(el => el.textContent.trim());
        const approachTitle = document.querySelector('[data-section="approach"] h2')?.textContent?.trim() || '';
        const articleLinks = Array.from(document.querySelectorAll('.hf-articles a')).map(a => ({
          title: a.querySelector('h2')?.textContent?.trim(),
          href: a.getAttribute('href'),
        }));

        return JSON.stringify({
          width: winW,
          docW,
          overflow,
          heroH1,
          servicesTitle,
          servicesIntro,
          whyCardCount: whyCards.length,
          whyCards,
          marketSnapshotPresent,
          marketStatus,
          officialLinks,
          approachTitle,
          articleLinks,
        });
      })()`,
      returnByValue: true,
    });

    const parsedAudit = JSON.parse(checkRes.result?.result?.value || checkRes.result?.value || '{}');
    auditLog.viewportsTested.push({ viewport: vp.name, ...parsedAudit });

    console.log(`  -> docW: ${parsedAudit.docW}px, winW: ${parsedAudit.width}px, overflow: ${parsedAudit.overflow}`);
    console.log(`  -> Why Farcon cards: ${parsedAudit.whyCardCount}, Market feed status: "${parsedAudit.marketStatus}"`);

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (shot.result?.data) {
      const filePath = path.join(OUTPUT_DIR, `homepage-${vp.width}x${vp.height}.png`);
      fs.writeFileSync(filePath, Buffer.from(shot.result.data, 'base64'));
      console.log(`  ✓ Screenshot saved: ${path.basename(filePath)}`);
    }
  }

  // 2. Focused Section Screenshots at 1440px
  console.log('\nCapturing focused desktop section screenshots (1440x900)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  const sectionsToCapture = [
    { selector: '.svc-band', name: 'section-services.png' },
    { selector: '.hf-why', name: 'section-why-farcon.png' },
    { selector: '#market-snapshot', name: 'section-market-snapshot.png' },
    { selector: '[data-section="approach"]', name: 'section-leadership-approach.png' },
    { selector: '[data-section="articles"]', name: 'section-learn-and-grow.png' },
  ];

  for (const sec of sectionsToCapture) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${sec.selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`,
    });
    await new Promise((r) => setTimeout(r, 400));
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (shot.result?.data) {
      const filePath = path.join(OUTPUT_DIR, sec.name);
      fs.writeFileSync(filePath, Buffer.from(shot.result.data, 'base64'));
      console.log(`  ✓ Section screenshot saved: ${sec.name}`);
    }
  }

  // 3. Test Deep Links and Trailing Slashes
  console.log('\nTesting deep links and route normalization with & without trailing slashes...');
  const deepLinks = [
    { path: '/contact', withSlash: '/contact/' },
    { path: '/about', withSlash: '/about/' },
    { path: '/disclosures', withSlash: '/disclosures/' },
    { path: '/privacy', withSlash: '/privacy/' },
    { path: '/terms', withSlash: '/terms/' },
    { path: '/grievance', withSlash: '/grievance/' },
    { path: '/goals/retirement', withSlash: '/goals/retirement/' },
    { path: '/calculators/sip', withSlash: '/calculators/sip/' },
    { path: '/blogs/mutual-funds-101-beginners-guide', withSlash: '/blogs/mutual-funds-101-beginners-guide/' },
    { path: '/blogs/sip-vs-lumpsum-investing-guide', withSlash: '/blogs/sip-vs-lumpsum-investing-guide/' },
    { path: '/blogs/demystifying-elss-tax-saving-beyond-80c', withSlash: '/blogs/demystifying-elss-tax-saving-beyond-80c/' },
  ];

  for (const item of deepLinks) {
    // Test trailing slash navigation
    await send('Page.navigate', { url: `http://127.0.0.1:4280${item.withSlash}` });
    await new Promise((r) => setTimeout(r, 350));

    const checkRoute = await send('Runtime.evaluate', {
      expression: `(() => {
        const h1 = document.querySelector('h1')?.textContent?.trim() || '';
        const isNotFound = h1.toLowerCase().includes('not found') || document.title.includes('Page not found');
        const currentPath = window.location.pathname;
        return JSON.stringify({ h1, isNotFound, currentPath });
      })()`,
      returnByValue: true,
    });

    const routeData = JSON.parse(checkRoute.result?.result?.value || checkRoute.result?.value || '{}');
    console.log(`  Route: ${item.withSlash} -> Title: "${routeData.h1}", 404: ${routeData.isNotFound}`);
    auditLog.deepLinksTested.push({
      testedUrl: item.withSlash,
      canonicalPath: routeData.currentPath,
      heading: routeData.h1,
      isNotFound: routeData.isNotFound,
    });
  }

  // Capture standalone page screenshots
  console.log('\nCapturing standalone page screenshots...');
  const pagesToScreenshot = [
    { url: '/contact', file: 'page-contact.png' },
    { url: '/about', file: 'page-about.png' },
    { url: '/disclosures', file: 'page-disclosures.png' },
    { url: '/blogs/mutual-funds-101-beginners-guide', file: 'article-mutual-funds-101.png' },
    { url: '/blogs/sip-vs-lumpsum-investing-guide', file: 'article-sip-vs-lumpsum.png' },
    { url: '/blogs/demystifying-elss-tax-saving-beyond-80c', file: 'article-tax-saving-elss.png' },
  ];

  for (const page of pagesToScreenshot) {
    await send('Page.navigate', { url: `http://127.0.0.1:4280${page.url}` });
    await new Promise((r) => setTimeout(r, 450));
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (shot.result?.data) {
      const filePath = path.join(OUTPUT_DIR, page.file);
      fs.writeFileSync(filePath, Buffer.from(shot.result.data, 'base64'));
      console.log(`  ✓ Page screenshot saved: ${page.file}`);
    }
  }

  // Save audit log
  fs.writeFileSync(path.join(OUTPUT_DIR, 'audit-results.json'), JSON.stringify(auditLog, null, 2));
  console.log('\n✓ Comprehensive audit completed and saved to screenshots-stage2/audit-results.json');

  ws.close();
  edgeProc.kill();
  server.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error during review execution:', err);
  process.exit(1);
});

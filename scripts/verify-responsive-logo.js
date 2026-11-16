import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PREVIEW_URL = 'https://fix-farcon-postdeploy-qa-gaps-farcon-wealth.farcon-wealth.workers.dev/';
const VIEWPORTS = [360, 390, 768, 1280, 1440];

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-cdp-'));
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ]);

  let wsUrl = '';
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((r) => setTimeout(r, 300));
    try {
      const res = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
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

  console.log(`\n=== COMPUTED DIMENSIONS AUDIT: ${PREVIEW_URL} ===\n`);
  console.log('| Viewport | Header Height | Stag Dimensions (W × H) | Wordmark Dimensions (W × H) | Total Lockup Height | Status |');
  console.log('|:---------|:--------------|:------------------------|:----------------------------|:--------------------|:-------|');

  // Navigate once
  await send('Page.navigate', { url: PREVIEW_URL });

  // Poll until .fw-lockup-stag is rendered
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    const check = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('.fw-lockup-stag'))`,
      returnByValue: true,
    });
    if (check.result?.value === true) break;
  }

  for (const w of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 800,
      deviceScaleFactor: 1,
      mobile: w < 768,
    });

    await new Promise((r) => setTimeout(r, 400));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('.fw-header-bar');
        const stag = document.querySelector('.fw-lockup-stag');
        const wordmark = document.querySelector('.fw-lockup-wordmark-img');
        const unit = document.querySelector('.fw-lockup-unit');
        const hRect = header ? header.getBoundingClientRect() : null;
        const sRect = stag ? stag.getBoundingClientRect() : null;
        const wRect = wordmark ? wordmark.getBoundingClientRect() : null;
        const uRect = unit ? unit.getBoundingClientRect() : null;
        return JSON.stringify({
          hHeight: hRect ? Math.round(hRect.height) : 0,
          sWidth: sRect ? Math.round(sRect.width) : 0,
          sHeight: sRect ? Math.round(sRect.height) : 0,
          wWidth: wRect ? Math.round(wRect.width) : 0,
          wHeight: wRect ? Math.round(wRect.height) : 0,
          uHeight: uRect ? Math.round(uRect.height) : 0,
        });
      })()`,
      returnByValue: true,
    });

    let val = {};
    try {
      val = JSON.parse(evalRes.result?.result?.value || evalRes.result?.value || '{}');
    } catch {}
    const pass = val.sHeight >= 20 && val.wHeight >= 14 && val.wWidth >= 38;
    console.log(
      `| ${w}px | ${val.hHeight}px | ${val.sWidth} × ${val.sHeight}px | ${val.wWidth} × ${val.wHeight}px | ${val.uHeight}px | ${pass ? '✓ Legible' : '✗ Check'} |`
    );
  }

  ws.close();
  edgeProc.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}

main().catch(console.error);

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { seoEntries } from '../src/content/seo/meta.ts';

const dist = join(process.cwd(), 'dist');
const shell = readFileSync(join(dist, 'index.html'), 'utf8');

function attr(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

for (const entry of seoEntries()) {
  let html = shell;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${attr(entry.title)}</title>`);
  html = html.replace(/(name="description" content=")[^"]*/, `$1${attr(entry.description)}`);
  html = html.replace(/(property="og:title" content=")[^"]*/, `$1${attr(entry.title)}`);
  html = html.replace(/(property="og:description" content=")[^"]*/, `$1${attr(entry.description)}`);
  html = html.replace(/(property="og:url" content=")[^"]*/, `$1${attr(entry.url)}`);
  html = html.replace(/(name="twitter:title" content=")[^"]*/, `$1${attr(entry.title)}`);
  html = html.replace(/(name="twitter:description" content=")[^"]*/, `$1${attr(entry.description)}`);
  html = html.replace(/(rel="canonical" href=")[^"]*/, `$1${attr(entry.url)}`);
  const ld = `<script type="application/ld+json">${JSON.stringify(entry.jsonLd)}</script>`;
  html = html.replace('</head>', `    ${ld}\n  </head>`);
  const file = entry.path === '/' ? join(dist, 'index.html') : join(dist, entry.path.slice(1), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

console.log(`Prerendered ${seoEntries().length} routes.`);

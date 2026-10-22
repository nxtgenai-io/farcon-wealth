import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { seoEntries } from '../src/content/seo/meta.ts';

const root = process.cwd();
const dist = join(root, 'dist');
const shell = readFileSync(join(dist, 'index.html'), 'utf8');
const noindex = process.env.NOINDEX === '1';

function attr(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function text(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const entries = seoEntries();

for (const entry of entries) {
  let html = shell;
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${attr(entry.title)}</title>`);
  html = html.replace(/(name="description" content=")[^"]*/, `$1${attr(entry.description)}`);
  html = html.replace(/(property="og:title" content=")[^"]*/, `$1${attr(entry.title)}`);
  html = html.replace(/(property="og:description" content=")[^"]*/, `$1${attr(entry.description)}`);
  html = html.replace(/(property="og:url" content=")[^"]*/, `$1${attr(entry.url)}`);
  html = html.replace(/(property="og:image" content=")[^"]*/, `$1${attr(entry.image)}`);
  html = html.replace(/(name="twitter:image" content=")[^"]*/, `$1${attr(entry.image)}`);
  html = html.replace(/(name="twitter:title" content=")[^"]*/, `$1${attr(entry.title)}`);
  html = html.replace(/(name="twitter:description" content=")[^"]*/, `$1${attr(entry.description)}`);
  html = html.replace(/(rel="canonical" href=")[^"]*/, `$1${attr(entry.url)}`);
  const ld = `<script type="application/ld+json">${JSON.stringify(entry.jsonLd).replace(/</g, '\\u003c')}</script>`;
  const robots = noindex ? '    <meta name="robots" content="noindex, nofollow">\n' : '';
  html = html.replace('</head>', `    ${ld}\n${robots}  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root"><h1>${text(entry.h1)}</h1></div>`);
  const file = entry.path === '/' ? join(dist, 'index.html') : join(dist, entry.path.slice(1), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url><loc>${entry.url}</loc><changefreq>${entry.path === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${entry.path === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(join(root, 'public', 'sitemap.xml'), sitemap);

console.log(`Prerendered ${entries.length} routes.`);

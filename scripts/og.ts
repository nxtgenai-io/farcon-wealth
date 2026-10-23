import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { seoEntries } from '../src/content/seo/meta.ts';

const root = process.cwd();
const dir = join(root, 'public', 'og');
mkdirSync(dir, { recursive: true });
const manifest = seoEntries().map((entry) => {
  const slug = entry.path === '/' ? 'home' : entry.path.slice(1).replace(/\//g, '-');
  return { file: join(dir, `${slug}.jpg`), title: entry.h1 };
});
const manifestPath = join(dir, 'manifest.json');
writeFileSync(manifestPath, JSON.stringify(manifest));
const drawn = spawnSync('python3', [join(root, 'scripts', 'og.py'), manifestPath], { stdio: 'inherit' });
if (drawn.status !== 0) process.exit(drawn.status || 1);

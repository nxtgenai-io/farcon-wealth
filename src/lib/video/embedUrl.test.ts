import assert from 'node:assert/strict';
import { getCanonicalVideoEmbedUrl } from './embedUrl';

console.log('Testing video URL normalization...');

// 1. YouTube standard watch URLs
assert.equal(
  getCanonicalVideoEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
);
assert.equal(
  getCanonicalVideoEmbedUrl('https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s'),
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
);

// 2. YouTube short links (youtu.be)
assert.equal(
  getCanonicalVideoEmbedUrl('https://youtu.be/dQw4w9WgXcQ'),
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
);

// 3. YouTube embed URLs
assert.equal(
  getCanonicalVideoEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ'),
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
);
assert.equal(
  getCanonicalVideoEmbedUrl('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'),
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
);

// 4. YouTube shorts
assert.equal(
  getCanonicalVideoEmbedUrl('https://youtube.com/shorts/dQw4w9WgXcQ'),
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
);

// 5. Vimeo links
assert.equal(
  getCanonicalVideoEmbedUrl('https://vimeo.com/76979871'),
  'https://player.vimeo.com/video/76979871'
);
assert.equal(
  getCanonicalVideoEmbedUrl('https://player.vimeo.com/video/76979871'),
  'https://player.vimeo.com/video/76979871'
);

// 6. Invalid domains & malicious payloads (must reject)
assert.equal(getCanonicalVideoEmbedUrl('https://attacker.com/watch?v=dQw4w9WgXcQ'), null);
assert.equal(getCanonicalVideoEmbedUrl('javascript:alert(1)'), null);
assert.equal(getCanonicalVideoEmbedUrl('https://youtube.com/watch?v=invalid_short_id'), null);
assert.equal(getCanonicalVideoEmbedUrl('https://vimeo.com/not-digits'), null);
assert.equal(getCanonicalVideoEmbedUrl(''), null);
assert.equal(getCanonicalVideoEmbedUrl(undefined), null);

console.log('✓ Video embed normalization tests passed (12 test cases).');

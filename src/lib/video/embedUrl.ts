/**
 * Normalizes video URLs from YouTube and Vimeo into safe, privacy-preserving canonical embed URLs.
 * Rejects untrusted domains, malformed IDs, scripts, and non-embeddable links.
 */
export function getCanonicalVideoEmbedUrl(rawUrl?: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    // YouTube URLs: www.youtube.com, youtube.com, m.youtube.com, youtube-nocookie.com
    if (
      host === 'www.youtube.com' ||
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'www.youtube-nocookie.com' ||
      host === 'youtube-nocookie.com'
    ) {
      let videoId: string | null = null;
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v');
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.slice('/embed/'.length).split('/')[0] || null;
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.slice('/shorts/'.length).split('/')[0] || null;
      }

      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
      return null;
    }

    // YouTube Short URLs: youtu.be/<id>
    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace(/^\/+/, '').split('/')[0] || null;
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
      return null;
    }

    // Vimeo URLs: vimeo.com/<id>, www.vimeo.com/<id>
    if (host === 'vimeo.com' || host === 'www.vimeo.com') {
      const videoId = parsed.pathname.replace(/^\/+/, '').split('/')[0] || null;
      if (videoId && /^\d+$/.test(videoId)) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return null;
    }

    // Vimeo Embed URLs: player.vimeo.com/video/<id>
    if (host === 'player.vimeo.com') {
      if (parsed.pathname.startsWith('/video/')) {
        const videoId = parsed.pathname.slice('/video/'.length).split('/')[0] || null;
        if (videoId && /^\d+$/.test(videoId)) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }
      return null;
    }

    // Any other host is rejected for safety
    return null;
  } catch {
    return null;
  }
}

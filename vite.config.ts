import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'farcon-nav',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const path = req.url?.split('?')[0];
            if (path !== '/api/nav' && path !== '/api/market') return next();
            try {
              if (path === '/api/market') {
                const { marketResponse } = await server.ssrLoadModule('/src/lib/api/market.ts') as { marketResponse: (url: string) => Promise<Response> };
                const upstream = await marketResponse(`http://127.0.0.1${req.url}`);
                res.statusCode = upstream.status;
                upstream.headers.forEach((value, key) => res.setHeader(key, value));
                res.end(Buffer.from(await upstream.arrayBuffer()));
                return;
              }
              const { liveNavResponse } = await server.ssrLoadModule('/src/lib/api/liveNav.ts') as { liveNavResponse: () => Promise<unknown> };
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'public, max-age=21600');
              res.end(JSON.stringify(await liveNavResponse()));
            } catch {
              res.statusCode = 503;
              res.end(JSON.stringify({ ok: false, funds: [] }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

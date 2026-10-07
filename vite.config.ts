import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages project sites are served below /<repo>/.
  // Local development remains available at /.
  base: process.env.GITHUB_ACTIONS ? '/GMB-HUB/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});

import { defineConfig } from 'astro/config';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  site: 'https://www.samidev.me',
  redirects: { '/playful/': '/' },
  vite: {
    build: { assetsInlineLimit: 0 },
    css: { postcss: { plugins: [tailwindcss({ config: './tailwind.original.config.cjs' }), autoprefixer()] } },
  },
});

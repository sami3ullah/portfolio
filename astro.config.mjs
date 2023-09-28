import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwind from "@astrojs/tailwind";
// const env = loadEnv("", process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()]
});
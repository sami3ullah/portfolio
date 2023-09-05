import { defineConfig } from 'astro/config';
import storyblok from '@storyblok/astro';
import { loadEnv } from 'vite';

// https://astro.build/config
const env = loadEnv("", process.cwd(), 'STORYBLOK');

export default defineConfig({
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      components: {
        blogPost: 'storyblok/BlogPost',
      },
      apiOptions: {
        // Choose your Storyblok space region
        region: 'eu', // optional,  or 'eu' (default)
      },
    })
  ],
});

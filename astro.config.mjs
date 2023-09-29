import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sanity from "astro-sanity";
import { loadEnv } from "vite";
const { PUBLIC_SANITY_PROJECT_ID } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sanity({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2021-03-25',
    useCdn: true,
  })]
});
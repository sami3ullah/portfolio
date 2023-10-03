import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";
// import react from "@astrojs/react";
const {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET
} = loadEnv(process.env.NODE_ENV, process.cwd(), "");


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sanity({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET,
    useCdn: true,
  })]
});
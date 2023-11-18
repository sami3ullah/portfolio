import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import { loadEnv } from "vite";
import partytown from '@astrojs/partytown'
import sanity from "@sanity/astro";
// import react from "@astrojs/react";
const {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET
} = loadEnv(process.env.NODE_ENV, process.cwd(), "");


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(),
    partytown({
      config: {
        forward: ["dataLayer.push"]
      }
    }), 
    sanity({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET,
    useCdn: true,
  })]
});
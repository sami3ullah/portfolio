import type { APIRoute } from 'astro';
import profile from '../data/profile.json';

export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${profile.site}</loc></url><url><loc>${profile.site}focused/</loc></url></urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );

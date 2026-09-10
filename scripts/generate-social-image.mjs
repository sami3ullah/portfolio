import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const profile = JSON.parse(
  await readFile(new URL('../src/data/profile.json', import.meta.url), 'utf8')
);
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[char]
  );
const portrait = await sharp(
  new URL('../public/hero-image.webp', import.meta.url).pathname
)
  .resize(510, 630, { fit: 'cover', position: 'top' })
  .png()
  .toBuffer();
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="630" fill="#101110"/>
<image x="710" y="0" width="510" height="630" href="data:image/png;base64,${portrait.toString('base64')}"/>
<defs><linearGradient id="fade"><stop stop-color="#101110"/><stop offset="1" stop-color="#101110" stop-opacity="0"/></linearGradient></defs>
<rect x="700" width="160" height="630" fill="url(#fade)"/>
<g font-family="Arial, Helvetica, sans-serif">
<text x="64" y="88" font-size="25" fill="#f1f3ea">${escape(profile.name)}</text>
<text x="64" y="222" font-size="80" font-weight="700" fill="#f1f3ea">Senior</text>
<text x="64" y="308" font-size="80" font-weight="700" fill="#d5ff3f">Frontend</text>
<text x="64" y="394" font-size="80" font-weight="700" fill="#f1f3ea">Engineer</text>
<text x="64" y="465" font-size="23" fill="#b1b6a9">React · TypeScript · Design systems</text>
<path d="M64 512 H665" stroke="#3b4034"/>
<text x="64" y="555" font-size="20" fill="#b1b6a9">${escape(profile.location)}</text>
<text x="510" y="555" font-size="20" fill="#d5ff3f">samidev.me</text>
</g></svg>`;
await sharp(Buffer.from(svg))
  .png()
  .toFile(new URL('../public/og-image.png', import.meta.url).pathname);
// Keep previously shared preview URLs aligned with the current profile.
await sharp(new URL('../public/og-image.png', import.meta.url).pathname)
  .webp({ quality: 85 })
  .toFile(new URL('../public/og-image.webp', import.meta.url).pathname);
console.log('Generated 1200 × 630 social preview from src/data/profile.json.');

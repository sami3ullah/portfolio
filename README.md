# Muhammad Samiullah's portfolio

Two portfolio views, connected by a floating switch:

- `/`: **Playful side**, the original design restored from commit `f4e04d2`. Includes its original intro, portrait, headline, story sequence, scrolling effects, cursor, and footer. Its gallery starts with the Innoscripta case study, followed by all nine original Sanity video showcases.
- `/focused/`: **To the point**, the concise version with case studies and career history.
- `/playful/` redirects to `/` for existing links.

The switch stays at the bottom center in both views, with Playful on the left and To the point on the right. It uses a dark glass surface, a sliding lime active pill, and sparkle and target icons. Switching uses a staggered charcoal curtain and client navigation, keeping the same document session and switch element. Without JavaScript, the links still navigate normally. There is no motion control.

## Run locally

Use Node 22.19 or newer. From this project directory:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open the URL printed by Astro, normally `http://localhost:4321`. The original playful version opens by default. Use the floating switch or visit `http://localhost:4321/focused/` for the concise version. Stop the server with Ctrl+C.

## Verify

```sh
npm run build
npm run check
npx playwright install chromium
npm test
```

Browser tests run against the production build and start a preview on port 4321 if needed. Build first. For manual production preview, run `npm run preview`.

`npm run measure` measures the focused page using a defined local mobile lab profile and requires a preview on port 4321. `npm run measure -- /` measures the original page, including its intro delay. Results are local lab measurements, not production field Core Web Vitals.

## Content

- `src/data/profile.json` is the shared record for confirmed career facts. It was transcribed from `career-ops/cv.md` on 2026-09-10. Keep public claims attached to confirmed employers; do not import private job-search preferences.
- `src/utils/dates.mjs` calculates whole calendar years from June 1, 2019. Both views update their experience text in the browser without a rebuild, including when returning to the tab. Both views refresh once a minute. Their static HTML uses the build date. The focused hero shows the experience count beside the location, on desktop and mobile.
- Innoscripta appears in the original About employer list and career summary, using the confirmed 2024 - 2026 role dates. The career summary uses a compact experience total and aligned employer, role, and date rows. Location, terminology, and unconfirmed achievement copy have text corrections.
- `src/original/` contains the restored original components, styles, and animations. `tailwind.original.config.cjs` preserves the original design tokens. Its CSS is loaded only on `/`.
- `src/data/case-studies.ts` supplies the focused view with Innoscripta, REI Blackbook, and LAAM case studies. LAAM covers building its system from scratch and helping the business reach PKR 2 million+ in daily sales. The playful gallery follows the same featured order, then keeps the remaining videos in their published order. Matching REI Blackbook and LAAM videos share their contribution copy with the focused cases. The playful view keeps the original white showcase rows, large employer headings, text reveal, and pill-shaped action. “Read case study” expands the full problem, decisions, outcome, and focus areas with native keyboard support.
- `src/components/Projects/CaseArtwork.astro` supplies the focused conceptual illustrations. The playful Innoscripta row uses `src/original/components/Projects/ComponentArtwork.astro`, a responsive CSS animation without exterior labels or a caption. It pauses offscreen and in hidden tabs and respects reduced motion. These are illustrations of the work, not employer screenshots. `src/data/sanity-projects.ts` reads all published project records in sort order at build time. A failed or empty response fails the build instead of publishing an incomplete gallery. The video loader starts muted, inline playback when visible, pauses offscreen, supports native controls, and respects reduced motion. No Sanity content is modified.
- A fresh visit to the original view uses its original five-word intro and timings. Switching into it uses the shared curtain without replaying the full intro. The focused view shows the dynamic experience count in place of its former word sequence and retains reduced-motion support. Page effects initialize on each route entry and release scroll triggers, timers, text splits, and listeners on exit.

The recommendations use a CSS sticky portrait column contained within their section, with responsive quote/portrait widths. The work cards use native horizontal scrolling and snapping on touch devices and narrow screens; fine-pointer desktop devices retain the scroll-driven sequence. Both horizontal touch swipes and vertical page gestures work. The floating mobile Skip Story button is removed. Card 03 reads “AI Ready” on two lines, and Innoscripta is included in both copies of the looping header logo carousel.

## Navigation and focused hero

`src/components/ViewTransition.astro` coordinates the ten-panel curtain with [Astro's navigation lifecycle](https://docs.astro.build/en/guides/view-transitions/#lifecycle-events). The persisted switch and curtain survive page swaps. `src/utils/page-lifecycle.ts` owns per-visit setup/cleanup; `src/original/utils/page-effects.ts` scopes the original GSAP effects. Keep new effects inside this lifecycle so repeated switches cannot leave stale animations or listeners.

The focused header and hero fill at least one viewport on desktop. On mobile, the hero follows its content height, with 24px of padding above and below the availability message. The headline is uppercase. On mobile, the hero and footer are centered and the portrait is hidden. The header spans the full viewport width in one row, with the logo, Work, Experience, Contact, and a compact Resume download icon. The header stays sticky with no divider and contracts to a glass bar while scrolling (72px desktop, 64px mobile). Its original layout space remains reserved to prevent content jumps. It reveals Resume only after the hero has scrolled past it, beside the email on desktop and to the right of the navigation on mobile. The button hides again on return to the hero, with its space reserved to keep navigation steady. Anchor offsets follow the visible header height. Native smooth anchors retain normal keyboard navigation and reduced-motion behavior. The hero Resume and Contact actions have inset circular icons with a brief directional hover/focus animation. The header Resume uses the same treatment at a smaller size. Reduced motion keeps these interactions still. The header email and portrait have no decorative arrows. The focused desktop footer keeps its green arrow directly beside the heading, aligned to its bottom edge. Its social links have no arrows, and Back to top is an outlined pill with a lime upward icon. The footer has no Resume button. The CV remains available in the header and hero.

`src/components/Hero/BrandMark.astro` is shared by both views and preserves the original SVG geometry, with a transparent eye mask for blinking. Both marks use the original GSAP entrance: one full spin, scaling from 2.5 times normal size over 1.3 seconds with `power4.inOut`. A fresh playful visit retains its 6.5-second entrance delay. Both logos wink on arrival and returning to the top, then repeat at random 2 to 4 second intervals while visible. Their timers pause offscreen or in a hidden tab and are cleared on route departure. Reduced motion disables the logo effects.

The focused hero and footer share the permanent “Reach out for availability” message from `profile.availabilityMessage`. The hero message links to Contact and uses a neutral outlined marker. It does not claim a current job-search status or depend on LinkedIn, so accepting a job requires no website update.

## Resume and generated assets

`public/Muhammad_Samiullah_Resume_2026.pdf` is an exact copy of the PDF selected by the owner. It is the only public resume. Both views use the same content-hashed download URL. The old PDFs and generator are removed; builds never rewrite the supplied file.

The supplied PDF still lists Innoscripta as current and has a fixed experience count. It is preserved as requested. The website uses the confirmed end date and a dynamic experience count. To replace the CV later, replace that one PDF and update its expected filename/SHA-256 in `tests/resume-source.json`; `src/data/site.ts` derives the download URL hash automatically.

`npm run assets` rebuilds only the social preview from the shared profile. Development and production builds run it automatically. Edit `scripts/generate-social-image.mjs`, not the generated social-image files.

The separately managed Sanity studio under `sanity/` remains outside the root dependency audit. The portfolio build reads its public production dataset through the Sanity query API without a token or client dependency.

## Hosting and implementation notes

Build with `npm run build` and publish `dist/` only when authorized. Fonts are served locally. No analytics or third-party scripts are needed. Fonts and interface assets are local. The playful gallery loads its original posters and videos from `cdn.sanity.io`; both routes permit that image/media origin so client navigation can restore playback. The focused view itself makes no third-party runtime requests.

`vercel.json` configures security headers and revalidation for both routes, PDFs, and the social preview. Local preview does not apply hosting headers. Purge cached HTML and retired PDF URLs when deploying, and verify the redirects and current download.

See [current restoration notes](docs/portfolio-views.md) and the [earlier audit report](docs/portfolio-audit-resolution.md). The account-level Cloudflare loader investigation remains outstanding; restoring the design does not resolve it.

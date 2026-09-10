# Original playful view restored as the default

## Latest layout and gallery fixes

The fresh-visit intro reads “Curious”, “Passionate”, then “Engineer”. Its letters are rendered in the initial HTML and CSS starts the sequence at the first paint, so Curious animates immediately and advances even while page scripts are downloading. The 650ms letter transitions ease gently into and out of motion, with the original 20ms entrance stagger and 10ms exit stagger. Word changes overlap every 1.15 seconds. The curtain starts moving as soon as Engineer's final letter settles, then gradually accelerates and settles over 1.2 seconds per panel, with a 400ms stagger across the curtain. Words, panels, page visibility, and scroll release share the timing in `src/data/intro.ts`: the reveal begins at 3.09 seconds and finishes at 4.69 seconds. During the final 600ms, the view switch fades in and rises 18px into place, completing with the curtain. The switch skips this movement with reduced motion and stays available without JavaScript. The title, tagline, social links, logo, and brand carousel follow the reveal event; late scripts read the current CSS state without replaying the intro. Client navigation skips the intro before the document swap. Plain content stays available without JavaScript, and failed page scripts cannot stop the CSS intro from finishing and releasing the page.

The focused case studies now separate project identity from category, use clearer heading and body spacing, highlight outcomes with a lime accent, and present focus areas as quiet inline metadata. REI Blackbook has tighter copy and a warm sand workflow illustration connecting investors, business tools, and daily workflows to one platform. The illustration is a responsive, decorative SVG/CSS concept with no additional JavaScript. Its mobile layout uses smaller tiles and less vertical space. The production build, Astro check, and five existing accessibility/reflow tests pass; visual checks cover 320, 390, 768, 1024, and 1440px. Project content also renders without JavaScript. Screenshots: [REI desktop](verification/rei-refined-1440.png), [REI mobile](verification/rei-refined-390.png).

Both galleries start with Innoscripta, REI Blackbook, and LAAM. The playful view keeps all nine published Sanity videos, with the remaining projects in their published order. REI Blackbook and LAAM share their contribution copy with the focused case studies. LAAM includes building its system from scratch and helping the business reach PKR 2 million+ in daily sales. The build reads Sanity without changing its data and fails if the query fails or returns no projects. Videos load when visible with native playback controls, muted inline autoplay, offscreen pausing, and reduced-motion support. Both route policies and hosting headers allow Sanity image/video assets.

The header carousel includes Innoscripta. The career summary now uses a compact experience total and aligned employer, role, and date rows. Recommendations use a contained CSS sticky portrait column instead of GSAP pinning. Touch devices use a native swipeable, snapping work-card row with normal vertical page scrolling; desktop retains its scroll-driven presentation with a measured travel distance. Card 03 is “AI Ready.” All header carousel logos share the same grey treatment. Video backgrounds are transparent so poster/video aspect-ratio differences do not expose grey strips, and the project action uses the shared SVG arrow.

The fresh-visit intro sits above the page and locks wheel, touch, and keyboard scrolling until its last panel clears. The playful footer includes an outlined Back to top link with a lime arrow, with additional reveal space for its row. It uses the existing Lenis instance to return to the top, moves keyboard focus to the beginning of the page, and skips scrolling animation with reduced motion. The desktop work row uses CSS sticky positioning with measured scroll space; Lenis and ScrollTrigger share an animation clock, without a second scrub delay. Scroll triggers refresh in document order after effect setup and font loading so the earlier story pin is accounted for before measuring the work section.

The career rows are about 25% shorter. Innoscripta's heading stays on one line, and its playful illustration is now a responsive CSS animation with a floating component card, palette, check mark, grid tile, and toggle. Exterior labels and the caption are removed. Animation pauses offscreen and in hidden tabs, and respects reduced motion. The focused hero's visible capital edges align with the surrounding copy.

The view switch uses a dark glass surface with a subtle border, equal-width buttons, a sliding lime active pill, and sparkle and target icons. Reduced motion disables the slide, and reduced transparency uses a solid surface. The focused header has no divider and becomes a compact glass bar while scrolling: 72px on desktop and 64px on mobile. Its original layout space stays reserved, preventing a content jump; anchor offsets follow the visible header height. Both layouts keep the body in the root transition snapshot so backdrop blur samples text and images correctly.

The focused headline is uppercase. The mobile hero follows its content height, with 24px of padding above and below the availability message. The floating mobile Skip Story button and its animation are removed. On mobile, the hero and footer are centered and the portrait is hidden. The header spans the full viewport width in one row, keeping the logo, Work, Experience, Contact, and a compact Resume download icon together. Story highlights preserve spaces at the inline boundaries around “Software Engineer” and “PlayStation.”

All ten playful project rows share their responsive columns, section padding, label and heading spacing, typography, and action styles in `src/original/components/Projects/projects.css`. The gallery owns the line reveals for both Innoscripta and the video projects. Reveals wait for fonts, reflow on resize without replaying visible text, and skip animation with reduced motion. Innoscripta's case-study disclosure continues to expand below its artwork.

The glass and project consistency changes pass the production build, Astro check, and 15 gallery, artwork, video, and navigation browser tests. Additional browser checks verified matching project layouts without overflow at 320, 390, 768, 1024, and 1440px, motion preference changes, resizing, switch accessibility, and disclosure without JavaScript. Fresh screenshots: [desktop projects](verification/consistent-projects-1440.png), [mobile projects](verification/consistent-projects-390.png), and [compact glass header](verification/clear-glass-header-1440.png).

The historical notes below describe earlier restoration decisions. The latest changes above supersede the earlier removal of the Sanity gallery and preservation of the broken recommendation pinning.

Validation from the earlier layout pass: the production build, Astro check (zero errors, warnings, or hints), all 48 browser tests, and all 3 date tests passed. The regression checks cover intro scroll and focus locking, touch unlocking after the intro, immediate card movement across the pin boundary, portrait containment after client navigation, quote/portrait alignment, phone and tablet swipes, complete cards at snap positions, the last desktop card, all nine live Sanity media URLs, actual playback, illustration animation and offscreen pausing, reduced motion, header compaction without layout movement, and navigation. Desktop and mobile screenshots were visually reviewed.

Screenshots: [career desktop](verification/playful-career-1440.png), [career mobile](verification/playful-career-390.png), [recommendations desktop](verification/playful-recommendations-1440.png), [recommendations mobile](verification/playful-recommendations-390.png), [AI card on mobile](verification/playful-ai-card-390.png), [restored video gallery](verification/playful-sanity-video-1440.png).

## Earlier restoration notes

Updated locally on 2026-09-10 following the owner's request to restore the original exactly, with text/CV updates and a floating switch. This supersedes the earlier reconstructed playful page. The owner then selected the confirmed case studies for the playful showcases and requested a more compact, aligned contact section in the focused view. The latest refinement adds client navigation with curtains, a stationary switch, a full-viewport focused hero, updated hero copy/icons, and a subtle logo animation. Nothing has been deployed.

## Current routes

- `/` is the original playful portfolio, restored directly from Git commit `f4e04d2` into `src/original/`.
- `/focused/` preserves the concise portfolio.
- `/playful/` redirects to `/`.
- The switch keeps **Playful side** on the left and **To the point** on the right, with sparkle and focus icons. Its bottom-center position and DOM element persist across both routes. The active route is marked; the “Two sides of Sami” caption is removed. The floating mobile Skip Story control is removed. The pause-motion control remains removed.

## Preserved original presentation

The original Tailwind design tokens and component styles are restored. The original portrait composition, “Making Epic Shit Since 2019” headline, five-word full-screen intro and timing on fresh visits, logo column, story-first section order, GSAP scroll choreography, Lenis scrolling, custom cursor, marquees, horizontal Why Work With Me sequence, testimonial behavior, and original footer remain.

The playful showcases now use the same three confirmed Innoscripta, Tkxel, and LAAM records as the focused view. They retain the original white rows, large employer headings, contribution copy on the left, visuals on the right, GSAP text reveal, and pill-shaped action. Each native disclosure expands the complete case study. Opening or closing it refreshes the positions of the original scrolling sections. The old nine-brand gallery and its video loader are removed. The shared conceptual artwork contains no private screenshots or invented project scope.

The former reconstructed `src/components/Playful/` and `src/styles/playful.css` are removed. The focused page's stylesheet is not imported into the original page, and original Tailwind/animation scripts are not imported into the focused page.

Compatibility changes include relocated imports, TypeScript annotations, equivalent GSAP duration syntax, and locally rendered SVG icons. All scroll effects use the same `gsap/ScrollTrigger` module, avoiding duplicate plugin instances during client navigation. Client navigation now initializes original effects on every visit and cleans up GSAP, Lenis, timers, text splits, and event listeners on departure. The full opening intro is skipped when switching into Playful, while its hero and scrolling effects are initialized normally. Local fonts reproduce the original Manrope weights. Analytics are not reinstated.

## Text and CV updates

- Experience numbers use the shared June 2019 calendar-year calculation and refresh in the browser without rebuilding.
- The original About list includes Innoscripta and uses Munich, Germany.
- The original career-summary typography now lists the confirmed employers and years from the shared profile, including Innoscripta 2024 - 2026, replacing the stale business-category totals.
- Technology names and unsupported achievement copy have factual text corrections within the original elements and styles.
- Both views use `public/Muhammad_Samiullah_Resume_2026.pdf`, an exact copy of the supplied CV. Its SHA-256 is `78633e0eca287be68f02883a99a894acc348e6f9fefd8a8c45f75ba6c4b5cf79`.
- The two old PDFs and PDF generator remain removed. The supplied PDF retains its Current Innoscripta status and fixed 7-year summary, per the owner's instruction to use the file unchanged.

## Client navigation and focused hero

The persisted ten-panel charcoal curtain covers the old view and unfolds to reveal the next. Astro handles the document-content swap, styles, history, and route announcements without reloading the browser document. The curtain has a fallback for browsers without native View Transitions and skips its animation for reduced motion. Plain links remain usable without JavaScript.

The focused header and hero fill at least the viewport, with room to grow on short or narrow displays. Updated copy describes React/TypeScript applications, shared UI systems, accessibility, maintainability, and business workflows. The hero Resume and Contact actions use inset circular icons with a brief directional hover/focus animation; the header Resume shares the same treatment at a smaller size. These interactions respect reduced motion. Work remains in the main navigation; the duplicate Selected work action is removed. Same-page navigation scrolls smoothly and respects reduced motion.

The portrait caption reads “Reusable components. Reliable, accessible applications.” The dynamically calculated experience count sits beside Munich, Germany, replacing the duplicate Engineer word sequence. It stays visible in that position on mobile, wrapping when needed. The portrait arrow, header email arrow, and dot after the name are removed.

Both views share the original logo geometry with a transparent eye mask. The focused header shows only the logo. Both logos use the original full spin and 2.5-to-1 scale entrance over 1.3 seconds with the same GSAP easing. The playful entrance retains its original fresh-visit delay. Both wink on arrival and returning to the top, then repeat at random intervals between 2 and 4 seconds while visible. Hidden tabs and offscreen logos pause the timer; route cleanup clears it. Reduced motion disables these logo animations.

## Focused navigation and contact

The focused header stays visible during scrolling. Its Resume download sits beside the email and appears only once the hero has scrolled past the sticky header; it hides again on return. Scroll and resize updates account for the compact bar and viewport changes, and the reserved button space prevents navigation from shifting. Anchor offsets account for its desktop and mobile height. A top-of-document anchor lets the logo and footer link return to the actual top. The footer has no Resume button; downloads remain in the header and hero. Its green arrow sits immediately after the heading, with their bottom edges aligned. The social links have no arrows. Back to top is an outlined pill with a lime circular icon that points upward toward a top boundary. Compact spacing and room for the floating switch remain.

The hero and footer share the permanent “Reach out for availability” copy. The hero message links to Contact and uses a neutral outlined marker. There is no job-search flag to maintain or LinkedIn runtime dependency.

## Verification scope

Latest local validation passed the production build, Astro check, all 38 browser checks, and 3 date tests. They cover persistent document/switch identity, repeated navigation, browser history, viewport height, sticky header behavior, conditional header downloads, hero actions, footer alignment and back-to-top navigation, case-study disclosures, smooth anchors, recurring logo timing in both views, reduced motion, and the transition fallback. Desktop and mobile screenshots verify the updated header/footer, and close-up images verify the playful logo's transparent eye in both blink states.

The restored desktop hero was visually compared with the original audit screenshot; the portrait, headline, typography, and composition match. Mobile was also visually reviewed, accounting for the original animated logo/headline capture timing. The updated text and switch are the intended visible differences in the hero.

Build, type checks, and browser checks cover route separation, switch icons/navigation/history, original section counts and order, intro completion, current facts, automatic experience updates, gallery navigation, exact CV downloads, and removal of obsolete URLs. The focused view retains its accessibility, reduced-motion, JavaScript-disabled, blocked-bundle, responsive, touch, and reflow checks.

The original component styles outside the authorized showcase changes retain the restored presentation. Verification includes all three case-study disclosures at 320, 390, 768, and 1440 px, matching approved content, keyboard open/close, layout reflow, scrolling after expansion, and no external media requests. The focused footer is visually inspected at desktop and mobile sizes.

At 320 px, the restored page has 5 px of horizontal overflow outside the gallery, including with the gallery removed. The showcase checks verify that every expanded row fits the viewport and adds no overflow, preserving the owner's requested original presentation elsewhere.

The original version deliberately regains its original motion and loading behavior. The previous report's claims that both views have immediate no-JavaScript content, reduced-motion behavior, a pause control, or no scroll choreography no longer describe the default page. Its restoration is the owner's explicit preference; do not silently redesign it in a later maintenance pass.

The [Cloudflare account follow-up](portfolio-audit-resolution.md#runtime-loader-evidence-and-account-follow-up) is unchanged. No hosting or account changes have been made.

Screenshots: [refined focused desktop](verification/focused-hero-refined-1440.png), [refined focused mobile](verification/focused-hero-refined-390.png), [restored desktop](verification/original-restored-1440.png), [restored mobile](verification/original-restored-390.png), [confirmed desktop showcases](verification/confirmed-showcase-1440.png), [confirmed mobile showcases](verification/confirmed-showcase-390.png), [focused contact](verification/focused-contact-1440.png), [original footer](verification/original-footer.png). Local run instructions are in the [README](../README.md).

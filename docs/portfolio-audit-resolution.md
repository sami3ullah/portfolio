# Portfolio audit implementation

> Historical implementation report. The owner subsequently requested the original playful design and behavior restored at `/`, with the concise page moved to `/focused/`. The current scope is in [restoration notes](portfolio-views.md). The earlier two-view behavior and test claims below describe the superseded implementation. The Cloudflare account investigation remains outstanding.


Implemented locally on 2026-09-10 against the supplied `career-ops/reports/portfolio-audit-2026-09-10.md` and confirmed `career-ops/cv.md`. No deployment or Cloudflare account change has been made.

The repository fixes apply to both the focused `/` page and the restored `/playful/` page. The owner subsequently requested two views and an exact supplied CV, superseding the initial generated-resume approach. See [two-view implementation notes](portfolio-views.md). The original runtime loader's actual integration and account history still require Cloudflare access. Current HTTP responses alone cannot close that investigation.

## Audit coverage

| Audit item | Implementation |
| --- | --- |
| 01. Unexpected runtime loader | Inspected source, root dependencies, build output, original inert evidence, and fresh desktop/mobile HTTP responses. No matching loader in the repository/build. Removed Google Analytics and Partytown. Added a restrictive CSP in HTML and Vercel headers. See the account follow-up below. |
| 02. Obsolete resume | Replaced the old resume with the exact two-page PDF subsequently selected by the owner. All four download links across the two views share one content-hashed URL. Both old PDFs and the generator are removed; old URLs return 404 locally. The supplied PDF retains its Current Innoscripta status and fixed experience count, per the owner’s instruction to use that file. The website retains the confirmed September 2026 end date and dynamic count. |
| 03. Incorrect location | Munich, Germany appears in the hero, About, contact area, resume, description, social image, and Person structured data. Lahore remains only on historical roles. |
| 04. Stale experience | One UTC calendar-year function counts from June 2019, including the anniversary. It refreshes without rebuilding the static site. Static/no-JavaScript copy uses “since June 2019.” Replaced category counters with a dated employment timeline. |
| 05. Frontend positioning | One H1 identifies Senior Frontend Engineer. React, TypeScript, UI architecture, Resume, Contact, and Selected work appear in the first view. |
| 06. Missing recent work | Added Innoscripta with confirmed title, dates, and past-tense work on the component library and enterprise applications. |
| 07. Contribution-focused work | Added Innoscripta, Tkxel, and LAAM case studies with problem, individual contribution, decisions, and supported outcomes. Focus areas are limited to confirmed technologies and work. Original brand showcases were retired because their individual contribution details are not confirmed. The conceptual graphics are original CSS illustrations, not employer screenshots. |
| 08. Skills and assistant | Grouped frontend, testing/tooling, AI tools, and prior backend exposure. Included Claude/Codex without productivity claims. Added the personal assistant's confirmed capabilities and explicit local-only status. No invented stack, public demo, repository, date, or adoption. |
| 09. Unconfirmed claims | Removed startup counts, team-of-15 leadership, and women's-health-startup claims. |
| 10. Intro delay | Three descriptors, Analytical, Pragmatic, Precise, followed by Engineer. Four 420 ms steps: 1.68 seconds total. Timing derives from the actual word list; no dependent hero delays remain. |
| 11. Blank no-JavaScript overlay | Removed the overlay and all content-hiding/loading states. Native HTML exposes the identity, content, and actions without the bundle. |
| 12. Reduced motion | Intro is skipped for reduced motion and cancels if that preference changes during playback. The focused view has no sustained movement. Playful marquees, sparkles, flower, and pointer flourish have a persistent pause control. Reduced motion also disables the sticky story stack. Both views retain native scrolling, with no mandatory loader or auto-playing project previews. |
| 13. Structure/navigation | Selected work and recent experience precede the long story in both views. Semantic H1/H2/H3 hierarchy, skip-to-main, native section links, keyboard-operable focused story disclosure, and native playful story cards. Skip Story still links to `#portfolio-projects`. |
| 14. Accessible actions | Visible Resume/Contact labels and semantic mail links. Removed the copy-only email action and ambiguous project actions. Copyright is a paragraph. Native focus and scrolling remain available. |
| 15. Tone | Replaced profane/filler/magic slogans with specific frontend copy while preserving the black/lime identity and portrait. |
| 16. Terminology/copy | Standardized technology casing and edited narrative copy. The old incorrect SaaS category is no longer published. Preserved all four testimonial quotations and attributions verbatim. |
| 17. Metadata | Role-specific title/description, canonical URL, absolute social image URL, Twitter card metadata, valid generator value, verified Person fields, robots.txt, and sitemap. Generated and visually verified the social preview. |
| 18. Hero logos | Removed the dim moving logo column. Employer names are legible in the work/timeline sections; the portrait is kept out of the narrow-screen hero. |

## Verification

- Node 22.23.2, Astro 7.3.2, Chromium 153. The root dependency audit reports **zero vulnerabilities**. The unused, separately managed `sanity/` studio is outside the root build and this audit.
- `npm run build` passes. `npm run check` reports zero errors, warnings, and hints.
- Three calendar/date unit tests and thirty-five browser tests pass after adding the playful view and supplied CV.
- Browser tests cover 320, 390, 768, and 1440 px widths; no horizontal overflow; visible initial actions; no page errors or third-party requests; actual PDF downloads and removal of both obsolete URLs; semantic metadata; future experience/year changes without rebuilding; keyboard navigation; native story disclosure; touch scrolling; and 200% desktop reflow equivalent (720 CSS px for a 1440 px desktop).
- The no-JavaScript, blocked-bundle, and reduced-motion checks cover both routes on desktop and mobile. Additional tests cover switching views and browser history without JavaScript, persistent motion preferences, horizontal card controls, touch gestures, and 200% desktop reflow in the playful view. They were first run against the old build and failed because the hero was covered. They pass against the revised build.
- Axe checks on both routes at all four viewport widths report zero WCAG A/AA violations in the tested rules. Manual review covered focus, heading hierarchy, contrast, and settled layouts. This is not a blanket WCAG certification.
- Resume: both supplied pages rendered and visually reviewed with MuPDF. SHA-256 and actual downloads verify an exact copy of the selected source. One public PDF remains; builds cannot regenerate it. Its Current status differs from the website and is documented in the two-view notes.
- Social preview: 1200 × 630 PNG, locally served with HTTP 200 and an image/png content type. Public URL response and third-party social-card caches require verification after deployment.
- Initial focused-view local mobile lab run, before adding the floating switch: 390 × 844, 4× CPU slowdown, 1.6 Mbps download / 750 kbps upload, 150 ms latency, browser cache disabled. LCP **484 ms**, CLS **0**, **93,887 bytes** transferred, **12 requests**, **zero third-party requests**. These are local lab results, not production field Core Web Vitals. Full measurements: [performance.json](verification/performance.json).
- Browser external-link checks: GitHub and Stack Overflow returned HTTP 200 with the expected profile titles. LinkedIn redirected to the expected canonical profile path but returned anti-automation HTTP 999; it still needs a signed-in/manual check. See [external-links.json](verification/external-links.json).

Screenshots: [desktop hero](verification/desktop-1440.png), [selected work](verification/selected-work.png), [desktop full page](verification/desktop-full.png), [mobile hero](verification/mobile-hero.png), [mobile without JavaScript](verification/no-JavaScript-390.png), [desktop without JavaScript](verification/no-JavaScript-1440.png), [mobile full page](verification/desktop-390.png), [320 px](verification/desktop-320.png), [tablet](verification/desktop-768.png). PDF: [supplied resume](../public/Muhammad_Samiullah_Resume_2026.pdf). Social preview: [PNG](../public/og-image.png).

## Runtime loader: evidence and account follow-up

The original audit preserved an obfuscated script wrapped in the same runtime as Zaraz, with unrelated Polygon RPC requests and the configuration host recorded in the original inert text. I did not execute that script or visit its configuration host.

No equivalent code or indicators were found in the site's source or built JavaScript. The initial code-level integrations were Google Analytics (`G-ZQC1XS2QWG`) through Partytown, externally hosted Google Fonts, and build-time Sanity content. Those integrations are removed from the active site. Old animation dependencies and unused components are removed as well.

Fresh HTTP responses using desktop and mobile user agents returned HTTP 200 with no Zaraz/loader indicators. The responses still contained Cloudflare's email decoder. Their script inventories, dates, and SHA-256 hashes are retained in [live-response-inventory.json](verification/live-response-inventory.json). They are static HTTP observations, not proof that every live browser session is clean. Cloudflare can vary injection by request characteristics. The exact original tool, its owner, and whether it was disabled between the audit and this inspection remain unknown.

The repository's CSP restricts scripts and network requests to the same origin; the HTTP version is configured for Vercel, which the current public response identifies as the origin host. This limits the reported inline/external mechanism after deployment. It does not establish or remediate the source of an account-level injection.

An account holder needs to complete these steps for `samidev.me`:

1. Preserve/export the active Zaraz configuration and version history. In **Zaraz > Settings > Injection**, set **Auto-inject script** to **Off** and save. If the account uses Preview & Publish, publish the reviewed change so it takes effect. This disables automatic injection; the revised site has no manual Zaraz loader. [Cloudflare settings documentation](https://developers.cloudflare.com/zaraz/reference/settings/).
2. In **Zaraz > Tag setup**, inspect Custom HTML tools/actions and any managed components. Identify and disable the specific unrecognized action matching the original evidence. Record its tool/action ID and configuration/version history. If it is absent there, inspect zone Workers/routes, response-modification rules, and the Vercel deployment/integration settings before attributing the injection to Zaraz. [Cloudflare tool-management documentation](https://developers.cloudflare.com/zaraz/custom-actions/edit-tools-and-actions/).
3. If unauthorized changes are established, review the responsible account/API access and revoke or rotate that access. This implementation does not claim the account was compromised.
4. Review Cloudflare Web Analytics/Zaraz tracking settings. The revised site needs no analytics or tracking integration. The original audit observed the Cloudflare beacon, but its present account configuration cannot be verified here.
5. Keep the new `email_off` comment exemptions and `no-transform` response headers, or turn off **Email Address Obfuscation** under the zone's security settings. Verify the deployed HTML still has working `mailto:` links with JavaScript disabled. [Cloudflare email-obfuscation documentation](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/).
6. After an authorized deployment, invalidate cached `/`, `/playful/`, the current PDF, both retired PDF URLs, `/og-image.png`, and `/og-image.webp` as needed. Verify that the retired PDFs return 404 and cannot be downloaded from old caches. Verify Vercel/Cloudflare revalidation and the absolute preview URL; refresh social-card caches through the relevant provider's tools.
7. In fresh desktop and mobile browser contexts, verify there is no unrecognized loader, its globals/storage flag, unrelated RPC traffic, or configuration-host request. This is the final production acceptance check for item 01.

No account credentials or deployment authorization were provided for these actions, and no hosting changes have been made.

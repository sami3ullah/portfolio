import { test, expect } from '@playwright/test';

for (const route of ['/focused/']) {
  for (const width of [390, 1440]) {
    for (const mode of ['no JavaScript', 'bundle failure', 'reduced motion']) {
      test(`content and actions remain available with ${mode} at ${width}px on ${route}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          viewport: { width, height: width === 390 ? 844 : 1000 },
          javaScriptEnabled: mode !== 'no JavaScript',
          reducedMotion: mode === 'reduced motion' ? 'reduce' : 'no-preference',
        });
        const page = await context.newPage();
        await page.route('**/*', (route) => {
          const request = route.request();
          if (
            !request.url().startsWith('http://127.0.0.1:4321') ||
            (mode === 'bundle failure' && request.resourceType() === 'script')
          )
            return route.abort();
          return route.continue();
        });
        await page.goto(`http://127.0.0.1:4321${route}`, {
          waitUntil: 'domcontentloaded',
        });
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
        const unobstructed = await heading.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          const top = document.elementFromPoint(
            rect.x + rect.width / 2,
            rect.y + rect.height / 2
          );
          return element.contains(top);
        });
        expect(
          unobstructed,
          'The first heading must not be covered by an intro overlay'
        ).toBe(true);
        await expect(heading).toContainText('Senior Frontend Engineer');
        await expect(page.locator('.hero a[data-resume]')).toBeInViewport();
        await expect(
          page.getByRole('link', { name: 'Contact', exact: true }).first()
        ).toBeInViewport();
        if (mode === 'reduced motion')
          expect(
            await page.evaluate(
              () =>
                document
                  .getAnimations()
                  .filter((animation) => animation.playState === 'running')
                  .length
            )
          ).toBe(0);
        await page.screenshot({
          path: `docs/verification/focused-${mode.replaceAll(' ', '-')}-${width}.png`,
        });
        await context.close();
      });
    }
  }
}

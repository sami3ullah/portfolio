import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

for (const width of [320, 390, 768, 1440]) {
  test(`readable and accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    const errors = [];
    const requests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => requests.push(request.url()));
    await page.goto('/focused/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Senior Frontend Engineer');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await expect(page.locator('.hero a[data-resume]')).toBeInViewport();
    await expect(
      page.getByRole('link', { name: 'Contact', exact: true }).first()
    ).toBeInViewport();
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(
      page
        .locator('#contact')
        .getByRole('link', { name: 'msami398@gmail.com', exact: true })
    ).toHaveAttribute('href', 'mailto:msami398@gmail.com');
    expect(errors).toEqual([]);
    expect(
      requests.filter((url) => !url.startsWith('http://127.0.0.1:4321/'))
    ).toEqual([]);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: `docs/verification/desktop-${width}.png`,
      fullPage: width === 390,
    });
  });
}

test('keyboard navigation, native story disclosure, and contact links work', async ({
  page,
}) => {
  await page.goto('/focused/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to main content' })
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Work', exact: true })
    .click();
  await expect(page).toHaveURL(/#portfolio-projects$/);
  const disclosure = page.locator('summary');
  await disclosure.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details')).toHaveAttribute('open', '');
  await page.getByRole('link', { name: 'Skip Story', exact: false }).click();
  await expect(page).toHaveURL(/#portfolio-projects$/);
});

test('experience updates across future anniversaries without a rebuild', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2030-05-31T12:00:00Z') });
  await page.goto('/focused/');
  await expect(page.locator('[data-career-start]').first()).toContainText(
    '10+ years'
  );
  await page.clock.setSystemTime(new Date('2030-06-01T12:00:00Z'));
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pageshow'))
  );
  await expect(page.locator('[data-career-start]').first()).toContainText(
    '11+ years'
  );
  await expect(page.locator('[data-current-year]')).toHaveText('2030');
});

test('resume actions download the supplied document and obsolete URLs are removed', async ({
  page,
  request,
}) => {
  await page.goto('/focused/');
  const expected = await readFile('public/Muhammad_Samiullah_Resume_2026.pdf');
  for (const link of await page.locator('a[data-resume]').all()) {
    if (
      await link.evaluate((element) =>
        element.classList.contains('header-resume')
      )
    ) {
      await page.locator('#contact').scrollIntoViewIfNeeded();
    }
    const downloadPromise = page.waitForEvent('download');
    await link.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(
      'Muhammad_Samiullah_Resume_2026.pdf'
    );
    expect(await readFile(await download.path())).toEqual(expected);
  }
  for (const obsolete of [
    '/Muhammad_Samiullah_Software_Engineer.pdf',
    '/Muhammad_Samiullah_Senior_Frontend_Engineer.pdf',
  ]) {
    expect((await request.get(obsolete)).status()).toBe(404);
  }
});

test('metadata is accurate and preview asset exists', async ({
  page,
  request,
}) => {
  await page.goto('/focused/');
  await expect(page).toHaveTitle(
    'Muhammad Samiullah | Senior Frontend Engineer'
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.samidev.me/focused/'
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://www.samidev.me/og-image.png'
  );
  const image = await request.get('/og-image.png');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/png');
  const person = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent()
  );
  expect(person.homeLocation.name).toBe('Munich, Germany');
  expect(person.jobTitle).toBe('Senior Frontend Engineer');
  expect(await page.locator('body').textContent()).not.toMatch(
    /successful startups|15 engineers|Epic Shit|Lorem ipsum|Sass \/ Dashboard/
  );
});

test('200% zoom equivalent reflows and preserves actions', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 500 });
  await page.goto('/focused/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('a[data-resume]').last()).toBeVisible();
});

test('touch scrolling and work navigation remain native', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/focused/');
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Work', exact: true })
    .tap();
  await expect(page).toHaveURL(/#portfolio-projects$/);
  const before = await page.evaluate(() => scrollY);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.synthesizeScrollGesture', {
    x: 195,
    y: 650,
    yDistance: -400,
    gestureSourceType: 'touch',
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await context.close();
});

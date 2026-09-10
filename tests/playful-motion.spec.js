import { test, expect } from '@playwright/test';

test('the opening animation blocks wheel and keyboard scrolling until it ends', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.preloader-overlay')).toBeVisible();
  await expect(page.locator('.portfolio-controls')).toBeHidden();
  expect(
    await page.evaluate(
      () =>
        !!document
          .elementFromPoint(innerWidth / 2, innerHeight / 4)
          ?.closest('.preloder-container')
    )
  ).toBe(true);
  await page.mouse.wheel(0, 1600);
  await page.keyboard.press('PageDown');
  for (let index = 0; index < 12; index++) await page.keyboard.press('Tab');
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator('.preloader-overlay')).toBeHidden({
    timeout: 10000,
  });
  await expect(page.locator('.portfolio-controls')).toBeVisible();
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test('the opening animation blocks touch scrolling and releases it afterwards', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.preloader-overlay')).toBeVisible();
  const cdp = await context.newCDPSession(page);
  const swipe = () =>
    cdp.send('Input.synthesizeScrollGesture', {
      x: 195,
      y: 600,
      yDistance: -400,
      gestureSourceType: 'touch',
    });
  await swipe();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator('.preloader-overlay')).toBeHidden({
    timeout: 10000,
  });
  await swipe();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await context.close();
});

test('desktop work cards follow scrolling immediately through the pin boundary', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/focused/');
  await page.getByRole('link', { name: 'Playful side', exact: true }).click();
  await expect(page.locator('.view-curtain')).not.toHaveAttribute(
    'data-active',
    ''
  );
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('#why-work-with-me');
  const start = await track.evaluate(
    (element) => element.getBoundingClientRect().top + scrollY
  );
  for (const offset of [-120, -20, 20, 120, 240, 120, -20]) {
    const geometry = await track.evaluate(async (element, y) => {
      scrollTo(0, y);
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
      const box = element.getBoundingClientRect();
      const first = element
        .querySelector('.brands-section')
        .getBoundingClientRect();
      return { y: scrollY, top: box.top, left: box.left, cardLeft: first.left };
    }, start + offset);
    expect(geometry.top).toBeCloseTo(Math.max(0, start - geometry.y), 0);
    expect(
      Math.abs(
        geometry.cardLeft - (geometry.left - Math.max(0, geometry.y - start))
      )
    ).toBeLessThan(2);
  }
});

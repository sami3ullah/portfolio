import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`only the intro is visible before scripts load at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    let releaseScripts;
    const scriptsReady = new Promise((resolve) => {
      releaseScripts = resolve;
    });
    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'script') await scriptsReady;
      await route.continue();
    });

    try {
      await page.goto('/', { waitUntil: 'commit' });
      await expect(page.locator('.preloader-overlay')).toBeVisible();
      await expect(page.locator('.preloder-container p').first()).toBeVisible();
      const firstLetters = page
        .locator('.preloder-container p')
        .first()
        .locator('.char');
      await expect(firstLetters).toHaveCount(7);
      await expect
        .poll(
          () =>
            firstLetters.evaluateAll((letters) =>
              letters.some((letter) => {
                const opacity = Number(getComputedStyle(letter).opacity);
                return opacity > 0.05 && opacity < 0.95;
              })
            ),
          { intervals: [16], timeout: 1000 }
        )
        .toBe(true);
      await expect
        .poll(
          () =>
            page
              .locator('.preloder-container p')
              .nth(1)
              .evaluate(
                (word) =>
                  getComputedStyle(word).visibility === 'visible' &&
                  [...word.querySelectorAll('.char')].every(
                    (letter) => Number(getComputedStyle(letter).opacity) >= 0.99
                  )
              ),
          { intervals: [16], timeout: 2500 }
        )
        .toBe(true);
      await expect(page.locator('.portfolio-controls')).toBeHidden();
      await expect(page.locator('.hero-section')).toBeHidden();
      await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');
      await page.mouse.wheel(0, 1600);
      await page.keyboard.press('PageDown');
      for (let index = 0; index < 12; index++) await page.keyboard.press('Tab');
      expect(await page.evaluate(() => scrollY)).toBe(0);
      expect(
        await page.evaluate(() =>
          [
            [1, 1],
            [innerWidth / 2, innerHeight / 2],
            [innerWidth - 1, innerHeight - 1],
          ].every(
            ([x, y]) =>
              !!document.elementFromPoint(x, y)?.closest('.preloder-container')
          )
        )
      ).toBe(true);
    } finally {
      releaseScripts();
    }

    await expect(page.locator('html')).toHaveAttribute(
      'data-intro-active',
      'running'
    );
    await expect(page.locator('.preloader-overlay')).toBeHidden({
      timeout: 7500,
    });
    await expect(page.locator('.portfolio-controls')).toBeVisible();
    await expect(page.locator('h1.main-title')).toHaveCSS('opacity', '1');
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  });
}

test('three words finish once and reveal every hero animation together', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.introEvents = [];
    for (const name of [
      'astro:page-load',
      'portfolio:intro-reveal',
      'portfolio:intro-complete',
    ]) {
      document.addEventListener(name, () => {
        window.introEvents.push({ name, time: performance.now() });
      });
    }
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement
            .getAnimations()
            .find(
              (animation) =>
                animation.animationName === 'portfolio-intro-reveal'
            )?.startTime ?? -1
      )
    )
    .toBeGreaterThanOrEqual(0);
  const introStart = await page.evaluate(
    () =>
      document.documentElement
        .getAnimations()
        .find(
          (animation) => animation.animationName === 'portfolio-intro-reveal'
        ).startTime
  );
  await expect(page.locator('.preloder-container p')).toHaveText([
    'Curious',
    'Passionate',
    'Engineer',
  ]);
  for (const index of [1, 2]) {
    await expect
      .poll(
        () =>
          page
            .locator('.preloder-container p')
            .nth(index)
            .evaluate(
              (word) =>
                getComputedStyle(word).visibility === 'visible' &&
                [...word.querySelectorAll('.char')].every(
                  (char) => Number(getComputedStyle(char).opacity) >= 0.99
                )
            ),
        { intervals: [16], timeout: 2500 }
      )
      .toBe(true);
  }
  await expect
    .poll(
      () =>
        page
          .locator('.bar')
          .first()
          .evaluate(
            (bar) => bar.getBoundingClientRect().height / bar.offsetHeight
          ),
      { intervals: [16], timeout: 250 }
    )
    .toBeLessThan(0.98);
  const switchPod = page.locator('.switch-pod');
  await expect
    .poll(
      () =>
        switchPod.evaluate((pod) => {
          const style = getComputedStyle(pod);
          const opacity = Number(style.opacity);
          return (
            style.visibility === 'visible' &&
            opacity > 0.05 &&
            opacity < 0.95 &&
            new DOMMatrixReadOnly(style.transform).m42 > 0
          );
        }),
      { intervals: [16], timeout: 2500 }
    )
    .toBe(true);
  await expect(page.locator('.preloader-overlay')).toBeVisible();
  await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');
  await expect(page.locator('.preloader-overlay')).toBeHidden({
    timeout: 5000,
  });
  await expect(switchPod).toHaveCSS('opacity', '1');
  await expect(switchPod).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  for (const selector of [
    'h1.main-title',
    'h1.main-title .tagline',
    '.header-social-icons',
    '.header-logo',
    '.wrapper--vertical',
  ]) {
    await expect(page.locator(selector)).toHaveCSS('opacity', '1', {
      timeout: 1500,
    });
  }
  const events = await page.evaluate(() => window.introEvents);
  expect(events.map(({ name }) => name)).toEqual([
    'astro:page-load',
    'portfolio:intro-reveal',
    'portfolio:intro-complete',
  ]);
  expect(events[1].time - introStart).toBeGreaterThan(2950);
  expect(events[1].time - introStart).toBeLessThan(3350);
  expect(events[2].time - events[1].time).toBeGreaterThan(1450);
  expect(events[2].time - events[1].time).toBeLessThan(1800);
  expect(events[2].time - introStart).toBeLessThan(5000);
  await expect(page.locator('html')).not.toHaveAttribute('data-intro-active');
});

for (const mode of ['failed', 'late']) {
  test(`the page recovers with ${mode} scripts`, async ({ page }) => {
    let releaseScripts;
    const scriptsReady = new Promise((resolve) => {
      releaseScripts = resolve;
    });
    await page.addInitScript(() => {
      window.introReplays = 0;
      document.addEventListener(
        'portfolio:intro-reveal',
        () => window.introReplays++
      );
    });
    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'script') {
        if (mode === 'failed') return route.abort();
        await scriptsReady;
      }
      await route.continue();
    });
    try {
      await page.goto('/', { waitUntil: 'commit' });
      await expect(page.locator('.preloader-overlay')).toBeVisible();
      await expect(page.locator('.preloader-overlay')).toBeHidden({
        timeout: 10000,
      });
      await expect(page.locator('h1.main-title')).toBeVisible();
      await expect(page.locator('.portfolio-controls')).toBeVisible();
      await expect(page.locator('.switch-pod')).toHaveCSS('opacity', '1');
      await page.mouse.wheel(0, 600);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    } finally {
      releaseScripts();
    }
    if (mode === 'late') {
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-intro-active'
      );
      await expect(page.locator('h1.main-title')).toHaveCSS('opacity', '1');
      await expect(page.locator('.preloader-overlay')).toBeHidden();
      expect(await page.evaluate(() => window.introReplays)).toBe(0);
    }
  });
}

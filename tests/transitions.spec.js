import { test, expect } from '@playwright/test';

test('switch catches up when its script loads after the first navigation', async ({
  page,
}) => {
  let releaseScript;
  const scriptReady = new Promise((resolve) => {
    releaseScript = resolve;
  });
  await page.route('**/PortfolioSwitch.*.js', async (route) => {
    await scriptReady;
    await route.continue();
  });

  try {
    await page.goto('/', { waitUntil: 'commit' });
    const dock = page.locator('.portfolio-controls');
    const focused = dock.getByRole('link', {
      name: 'To the point',
      exact: true,
    });
    const playful = dock.getByRole('link', {
      name: 'Playful side',
      exact: true,
    });
    await focused.click();
    await expect(page).toHaveURL(/\/focused\/$/);
    await expect(page.locator('html')).toHaveAttribute(
      'data-portfolio-mode',
      'focused'
    );

    releaseScript();
    await page.waitForLoadState('load');
    await expect(dock).toHaveAttribute('data-view', 'focused');
    await expect(focused).toHaveAttribute('aria-current', 'page');
    await expect(playful).not.toHaveAttribute('aria-current', 'page');

    await playful.click();
    await expect(page).toHaveURL(/:\d+\/$/);
    await expect(playful).toHaveAttribute('aria-current', 'page');
    await expect(dock).toHaveAttribute('data-view', 'playful');
    await expect(page.locator('.view-curtain')).not.toHaveAttribute(
      'data-active',
      ''
    );
  } finally {
    releaseScript();
  }
});

for (const width of [390, 1440]) {
  test(`curtain switching preserves the session and dock at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors = [];
    const documents = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.isNavigationRequest()) documents.push(request.url());
    });
    await page.goto('/focused/');
    const dock = page.locator('.portfolio-controls');
    await expect(dock.locator('a')).toHaveText([
      'Playful side',
      'To the point',
    ]);
    const initial = await dock.boundingBox();
    await page.evaluate(() => {
      window.originalDock = document.querySelector('.portfolio-controls');
    });
    for (const name of [
      'Playful side',
      'To the point',
      'Playful side',
      'To the point',
    ]) {
      await dock.getByRole('link', { name, exact: true }).click();
      await expect(page.locator('.view-curtain')).toHaveAttribute(
        'data-active',
        ''
      );
      await expect(
        dock.getByRole('link', { name, exact: true })
      ).toHaveAttribute('aria-current', 'page');
      await expect(page.locator('.view-curtain')).not.toHaveAttribute(
        'data-active',
        ''
      );
      expect(
        await page.evaluate(
          () =>
            window.originalDock ===
            document.querySelector('.portfolio-controls')
        )
      ).toBe(true);
      const next = await dock.boundingBox();
      expect(next.x).toBeCloseTo(initial.x, 0);
      expect(next.y).toBeCloseTo(initial.y, 0);
      if (name === 'Playful side') {
        await expect(page.locator('.preloder-container')).toBeHidden();
        await expect(page.locator('h1.main-title')).toHaveCSS('opacity', '1');
        await page.locator('.project-section summary').first().focus();
        await page.keyboard.press('Enter');
        await expect(
          page.locator('.project-section details').first()
        ).toHaveAttribute('open', '');
      } else {
        await expect(page.locator('.hero-experience')).toContainText(
          /\d+\+ years of experience/
        );
        await expect(page.locator('.pin-spacer, #mouse-trailer')).toHaveCount(
          0
        );
      }
    }
    await page.goBack();
    await expect(page.locator('html')).toHaveAttribute(
      'data-portfolio-mode',
      'playful'
    );
    await expect(page.locator('.view-curtain')).not.toHaveAttribute(
      'data-active',
      ''
    );
    await page.goForward();
    await expect(page.locator('html')).toHaveAttribute(
      'data-portfolio-mode',
      'focused'
    );
    await expect(page.locator('.view-curtain')).not.toHaveAttribute(
      'data-active',
      ''
    );
    expect(documents).toHaveLength(1);
    expect(errors).toEqual([]);
  });
}

test('focused hero stays compact on mobile and anchors scroll smoothly', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/focused/');
    const bottom = await page
      .locator('.hero')
      .evaluate((hero) => hero.getBoundingClientRect().bottom);
    if (viewport.width <= 700) {
      expect(bottom).toBeLessThan(viewport.height);
      await expect(page.locator('.hero-portrait')).toBeHidden();
    } else {
      expect(bottom).toBeCloseTo(viewport.height, 0);
    }
    await expect(
      page.locator(
        '.hero .intro, .portrait-experience, .portrait-arrow, .header-email svg, .brand .lime'
      )
    ).toHaveCount(0);
    await expect(page.locator('.actions a')).toHaveCount(2);
    await expect(page.locator('.hero-experience')).not.toContainText('Since');
    await page
      .locator('.actions')
      .getByRole('link', { name: 'Contact', exact: true })
      .click();
    await expect(page).toHaveURL(/#contact$/);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    const during = await page.evaluate(() => ({
      y: scrollY,
      target:
        document.querySelector('#contact').getBoundingClientRect().top +
        scrollY,
    }));
    expect(during.y).toBeLessThan(during.target - 100);
    await expect(page.locator('#contact h2')).toBeInViewport();
  }
});

test('logo settles, winks on return, and repeats after 2 to 4 seconds', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.logoAnimations = [];
    window.winkTimes = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (options?.id === 'logo-wink') window.winkTimes.push(performance.now());
      if (this.matches('[data-logo], [data-logo-eye]'))
        window.logoAnimations.push(options.id);
      return animate.call(this, frames, options);
    };
  });
  await page.goto('/focused/');
  await expect
    .poll(() => page.evaluate(() => window.logoAnimations))
    .toEqual(['logo-wink']);
  await page.locator('[data-logo-eye]').evaluate(async (eye) => {
    await Promise.all(
      eye.getAnimations().map((animation) => animation.finished)
    );
  });
  await expect(page.locator('[data-logo]')).toHaveCSS('transform', 'none');
  await expect(page.locator('[data-logo-eye]')).toHaveCSS('transform', 'none');
  await page.evaluate(() => scrollTo({ top: 600, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(600);
  await page.getByRole('link', { name: 'Muhammad Samiullah, home' }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator('[data-logo]')).toBeInViewport();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.logoAnimations.filter((name) => name === 'logo-wink').length
      )
    )
    .toBe(2);
  await page.evaluate(() => {
    for (let i = 0; i < 5; i++) dispatchEvent(new Event('scroll'));
  });
  expect(
    await page.evaluate(
      () => window.logoAnimations.filter((name) => name === 'logo-wink').length
    )
  ).toBe(2);
  await expect
    .poll(() => page.evaluate(() => window.winkTimes.length), {
      timeout: 5000,
    })
    .toBe(3);
  const interval = await page.evaluate(
    () => window.winkTimes[2] - window.winkTimes[1]
  );
  expect(interval).toBeGreaterThanOrEqual(1990);
  expect(interval).toBeLessThan(4500);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-logo-eye]')).toHaveCSS('transform', 'none');
});

for (const mode of ['reduced motion', 'no native transitions']) {
  test(`client navigation works with ${mode}`, async ({ page }) => {
    if (mode === 'reduced motion')
      await page.emulateMedia({ reducedMotion: 'reduce' });
    else
      await page.addInitScript(() => {
        document.startViewTransition = undefined;
      });
    await page.goto('/focused/');
    await page.evaluate(() => {
      window.sessionMarker = true;
    });
    await page.getByRole('link', { name: 'Playful side', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute(
      'data-portfolio-mode',
      'playful'
    );
    await expect(page.locator('.preloder-container')).toBeHidden();
    await expect(page.locator('.view-curtain')).not.toHaveAttribute(
      'data-active',
      ''
    );
    await page.getByRole('link', { name: 'To the point', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute(
      'data-portfolio-mode',
      'focused'
    );
    await expect(page.locator('.view-curtain')).not.toHaveAttribute(
      'data-active',
      ''
    );
    expect(await page.evaluate(() => window.sessionMarker)).toBe(true);
    if (mode === 'reduced motion') {
      expect(
        await page.evaluate(
          () =>
            document
              .getAnimations()
              .filter((animation) => animation.playState === 'running').length
        )
      ).toBe(0);
    }
  });
}

for (const width of [390, 1440]) {
  test(`sticky navigation and simplified footer work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/focused/');
    const header = page.locator('.site-header');
    await expect(header.locator('.brand')).toHaveText('');
    await expect(header.locator('.header-resume')).toHaveAttribute(
      'download',
      ''
    );
    await expect(header.locator('.header-resume')).toBeHidden();
    await expect(page.locator('.actions svg')).toHaveCount(2);
    await expect(page.locator('.switch-caption')).toHaveCount(0);
    await expect(page.locator('#contact [data-resume]')).toHaveCount(0);
    await expect(page.locator('.footer-bottom')).not.toContainText(/[↗↑↓]/);
    const bar = header.locator('.header-inner');
    const expandedHeight = (await bar.boundingBox()).height;
    const heroTop = await page
      .locator('.hero')
      .evaluate((element) => element.getBoundingClientRect().top + scrollY);
    await page.evaluate(() => scrollTo({ top: 180, behavior: 'instant' }));
    await expect
      .poll(async () => (await bar.boundingBox()).height)
      .toBeLessThan(expandedHeight - 20);
    expect(
      await page
        .locator('.hero')
        .evaluate((element) => element.getBoundingClientRect().top + scrollY)
    ).toBeCloseTo(heroTop, 0);
    await header.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page.locator('#contact h2')).toBeInViewport();
    expect((await header.boundingBox()).y).toBe(0);
    const downloadPromise = page.waitForEvent('download');
    await header.getByRole('link', { name: 'Resume', exact: true }).click();
    expect((await downloadPromise).suggestedFilename()).toBe(
      'Muhammad_Samiullah_Resume_2026.pdf'
    );
    if (width > 700) {
      const heading = await page.locator('.contact-heading h2').boundingBox();
      const arrow = await page.locator('.contact-arrow').boundingBox();
      expect(arrow.y + arrow.height).toBeCloseTo(heading.y + heading.height, 0);
      expect(arrow.x - (heading.x + heading.width)).toBeLessThanOrEqual(40);
    }
    await expect(page.locator('.back-to-top svg')).toBeVisible();
    await page.getByRole('link', { name: 'Back to top', exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect
      .poll(async () => (await bar.boundingBox()).height)
      .toBeCloseTo(expandedHeight, 0);
    await expect(header.locator('.header-resume')).toBeHidden();
  });
}

test('playful logo retains its entrance and repeats its blink', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.winkTimes = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (options?.id === 'logo-wink') window.winkTimes.push(performance.now());
      return animate.call(this, frames, options);
    };
  });
  await page.goto('/');
  await expect(page.locator('.preloader-overlay')).toBeHidden({
    timeout: 10000,
  });
  await expect.poll(() => page.evaluate(() => window.winkTimes.length)).toBe(1);
  await expect(page.locator('.header-logo')).toHaveCSS('opacity', '1');
  await expect
    .poll(() => page.evaluate(() => window.winkTimes.length), {
      timeout: 5000,
    })
    .toBe(2);
  const interval = await page.evaluate(
    () => window.winkTimes[1] - window.winkTimes[0]
  );
  expect(interval).toBeGreaterThanOrEqual(1990);
  expect(interval).toBeLessThan(4500);
});

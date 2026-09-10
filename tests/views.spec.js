import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';

for (const width of [390, 1440]) {
  test(`original playful version is the default at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute(
      'data-portfolio-mode',
      'playful'
    );
    await expect(page.locator('.preloder-container p')).toHaveText([
      'Curious',
      'Passionate',
      'Engineer',
    ]);
    await expect(page.locator('.preloader-overlay')).toBeHidden({
      timeout: 10000,
    });
    await expect(page.locator('h1.main-title')).toHaveCSS('opacity', '1', {
      timeout: 5000,
    });
    await expect(page.locator('h1.main-title')).toHaveText(
      'MakingEpic ShitSince2019'
    );
    await expect(page.locator('.project-section')).toHaveCount(10);
    await expect(page.locator('.story_view')).toHaveCount(5);
    await expect(page.locator('.brands-section')).toHaveCount(6);
    await expect(page.locator('.testimonials__text')).toHaveCount(4);
    await expect(page.locator('.about-me-section')).toContainText(
      'Innoscripta'
    );
    await expect(page.locator('.career-timeline li').first()).toContainText(
      'Innoscripta'
    );
    await expect(page.locator('.summary')).toContainText('Munich, Germany');
    expect(
      await page.evaluate(() => {
        const story = document.querySelector('#main__story');
        const work = document.querySelector('#portfolio-projects');
        return !!(
          story.compareDocumentPosition(work) & Node.DOCUMENT_POSITION_FOLLOWING
        );
      })
    ).toBe(true);
    await expect(page.locator('[data-motion-toggle]')).toHaveCount(0);
    const resume = page.locator('a[data-resume]').first();
    await expect(resume).toBeInViewport();
    expect(
      await resume.evaluate((link) => {
        const box = link.getBoundingClientRect();
        return link.contains(
          document.elementFromPoint(
            box.x + box.width / 2,
            box.y + box.height / 2
          )
        );
      })
    ).toBe(true);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `docs/verification/original-restored-${width}.png`,
    });
  });
}

test('switch icons, default state and destinations match their labels', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.preloader-overlay')).toBeHidden({
    timeout: 10000,
  });
  const switcher = page.getByRole('navigation', { name: 'Portfolio style' });
  const playful = switcher.getByRole('link', {
    name: 'Playful side',
    exact: true,
  });
  const focused = switcher.getByRole('link', {
    name: 'To the point',
    exact: true,
  });
  await expect(playful).toHaveAttribute('aria-current', 'page');
  await expect(playful.locator('svg')).toHaveAttribute('data-icon', 'playful');
  await expect(focused.locator('svg')).toHaveAttribute('data-icon', 'focused');
  await focused.click();
  await expect(page).toHaveURL(/\/focused\/$/);
  await expect(focused).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('h1')).toContainText('Senior Frontend Engineer');
  await expect(
    page.locator('.preloder-container, .project-section, #mouse-trailer')
  ).toHaveCount(0);
  await expect(page.locator('[data-motion-toggle]')).toHaveCount(0);
  await playful.click();
  await expect(page).toHaveURL(/:\d+\/$/);
});

test('switch links work without JavaScript and preserve browser history', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321');
  await page
    .getByRole('navigation', { name: 'Portfolio style' })
    .getByRole('link', { name: 'To the point', exact: true })
    .click();
  await expect(page).toHaveURL(/\/focused\/$/);
  await page.goBack();
  await expect(page.locator('html')).toHaveAttribute(
    'data-portfolio-mode',
    'playful'
  );
  await page.goForward();
  await expect(page.locator('html')).toHaveAttribute(
    'data-portfolio-mode',
    'focused'
  );
  await context.close();
});

test('original experience text advances on the anniversary without rebuilding', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2030-05-31T12:00:00Z') });
  await page.goto('/');
  await expect(page.locator('[data-experience-years]')).toHaveText([
    '10',
    '10',
    '10',
    '10',
  ]);
  await page.clock.setSystemTime(new Date('2030-06-01T12:00:00Z'));
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pageshow'))
  );
  await expect(page.locator('[data-experience-years]')).toHaveText([
    '11',
    '11',
    '11',
    '11',
  ]);
});

test('only the exact supplied PDF is public', async () => {
  const source = JSON.parse(await readFile('tests/resume-source.json', 'utf8'));
  const pdf = await readFile(`public/${source.filename}`);
  expect(createHash('sha256').update(pdf).digest('hex')).toBe(source.sha256);
  expect(
    (await readdir('public')).filter((name) => name.endsWith('.pdf'))
  ).toEqual([source.filename]);
});

test('both views download the supplied CV from their available actions', async ({
  page,
}) => {
  const source = JSON.parse(await readFile('tests/resume-source.json', 'utf8'));
  for (const route of ['/', '/focused/']) {
    await page.goto(route);
    if (route === '/') {
      await expect(page.locator('.preloader-overlay')).toBeHidden({
        timeout: 10000,
      });
      await expect(page.locator('.header-social-icons')).toHaveCSS(
        'opacity',
        '1',
        { timeout: 5000 }
      );
    }
    const links = await page.locator('a[data-resume]').all();
    for (const [index, link] of links.entries()) {
      if (route === '/focused/' && index === 0) {
        await page.locator('#contact').scrollIntoViewIfNeeded();
      }
      if (route === '/' && index === 1) {
        await page.evaluate(() =>
          scrollTo(0, document.documentElement.scrollHeight)
        );
        await expect(page.locator('.fixed_footer')).toHaveCSS('z-index', '2');
      }
      const downloadPromise = page.waitForEvent('download');
      await link.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe(source.filename);
      expect(
        createHash('sha256')
          .update(await readFile(await download.path()))
          .digest('hex')
      ).toBe(source.sha256);
    }
  }
});

test('original Skip Story reaches the restored gallery', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.preloader-overlay')).toBeHidden({
    timeout: 10000,
  });
  await page.locator('#main__story').evaluate((story) => {
    scrollTo(0, story.getBoundingClientRect().top + scrollY - 100);
  });
  await page
    .getByRole('link', { name: 'Skip Story', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/#portfolio-projects$/);
  await expect(page.locator('.project-section').first()).toBeInViewport();
});

test('the former playful URL leads to the new default and metadata uses current routes', async ({
  page,
  request,
}) => {
  await page.goto('/playful/');
  await expect(page).toHaveURL(/:\d+\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.samidev.me/'
  );
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('https://www.samidev.me/focused/');
  expect(sitemap).not.toContain('/playful/');
});

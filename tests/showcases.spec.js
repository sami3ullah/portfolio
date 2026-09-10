import { test, expect } from '@playwright/test';
import { caseStudies } from '../src/data/case-studies';

const playfulCases = caseStudies.slice(0, 1);

for (const width of [320, 390, 768, 1440]) {
  test(`confirmed showcases read and expand at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    const errors = [];
    const requests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => requests.push(request.url()));
    await page.goto('/');
    await expect(page.locator('.preloader-overlay')).toBeHidden({
      timeout: 10000,
    });
    await expect(page.locator('.header-social-icons')).toHaveCSS(
      'opacity',
      '1'
    );
    const gallery = page.locator('#portfolio-projects');
    const initialPageWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    await expect(gallery.locator('.project-section')).toHaveCount(10);
    await expect(gallery.locator('.showcase-copy h3')).toHaveText(
      playfulCases.map((project) => project.employer.toUpperCase()),
      { useInnerText: true }
    );
    await expect(gallery.locator('video')).toHaveCount(9);
    for (const [index, project] of playfulCases.entries()) {
      const showcase = gallery.locator('.project-section').nth(index);
      await expect(showcase.locator('.showcase-copy p')).toHaveText(
        project.contribution,
        { useInnerText: true }
      );
      const details = showcase.locator('details');
      const summary = details.locator('summary');
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(details).toHaveAttribute('open', '');
      await expect(showcase.locator('h4')).toHaveText(project.title);
      await expect(showcase.locator('dd')).toHaveText([
        project.problem,
        project.decisions,
        project.outcome,
      ]);
      await expect(showcase.locator('li')).toHaveText([...project.stack]);
      // Preserve the original shell while checking that each expanded
      // showcase fits the viewport and adds no horizontal overflow.
      expect(
        await showcase.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return (
            bounds.left >= 0 &&
            bounds.right <= innerWidth &&
            element.scrollWidth <= element.clientWidth
          );
        })
      ).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth)
      ).toBeLessThanOrEqual(initialPageWidth);
      await page.keyboard.press('Enter');
      await expect(details).not.toHaveAttribute('open', '');
    }
    await page.evaluate(() =>
      scrollTo(0, document.documentElement.scrollHeight)
    );
    await expect(page.locator('.fixed_footer')).toHaveCSS('z-index', '2');
    expect(errors).toEqual([]);
    expect(
      requests.filter(
        (url) =>
          !url.startsWith('http://127.0.0.1:4321/') &&
          !url.startsWith('https://cdn.sanity.io/')
      )
    ).toEqual([]);
  });
}

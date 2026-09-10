import { test, expect } from '@playwright/test';
import { getSanityProjects } from '../src/data/sanity-projects';

// REI leads the published videos; the remaining projects keep their CMS order.
// Match each video's media to its published record after reordering.
test('all Sanity videos follow Innoscripta and play after client navigation', async ({
  page,
  request,
}) => {
  const published = await getSanityProjects();
  const rei = published.find((project) => project.name === 'REI Blackbook');
  expect(rei).toBeDefined();
  const projects = [rei, ...published.filter((project) => project !== rei)];
  expect(projects).toHaveLength(9);
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/focused/');
  await page.getByRole('link', { name: 'Playful side', exact: true }).click();
  await expect(page.locator('.view-curtain')).not.toHaveAttribute(
    'data-active',
    ''
  );
  const gallery = page.locator('#portfolio-projects');
  await expect(gallery.locator('.showcase-copy h3')).toHaveText(
    'INNOSCRIPTA AG',
    { useInnerText: true }
  );
  await expect(gallery.locator('[data-case-details]')).toHaveCount(1);
  const videos = gallery.locator('video');
  await expect(videos).toHaveCount(projects.length);
  await expect(gallery.locator('.video-project h3').nth(0)).toHaveText(
    'REI BLACKBOOK',
    { useInnerText: true }
  );
  await expect(gallery.locator('.video-project h3').nth(1)).toHaveText('LAAM', {
    useInnerText: true,
  });
  await expect(gallery.locator('.video-project h3')).toHaveText(
    projects.map((project) => project.name.toUpperCase()),
    { useInnerText: true }
  );
  expect(
    await gallery.locator('.project-section').first().locator('video').count()
  ).toBe(0);
  for (const [index, project] of projects.entries()) {
    const video = videos.nth(index);
    await expect(video).toHaveAttribute('data-src', project.videoUrl);
    await expect(video).toHaveAttribute('poster', project.posterImage);
    await expect(video).not.toHaveAttribute('src');
    const media = await request.get(project.videoUrl, {
      headers: { Range: 'bytes=0-31' },
    });
    expect(media.status()).toBe(206);
    expect(media.headers()['content-type']).toContain('video/mp4');
  }
  const first = videos.first();
  await first.scrollIntoViewIfNeeded();
  await expect
    .poll(() => first.evaluate((video) => video.readyState), { timeout: 15000 })
    .toBeGreaterThanOrEqual(2);
  await expect.poll(() => first.evaluate((video) => video.paused)).toBe(false);
  await page.locator('#recommendations').scrollIntoViewIfNeeded();
  await expect.poll(() => first.evaluate((video) => video.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await first.scrollIntoViewIfNeeded();
  await expect.poll(() => first.evaluate((video) => video.paused)).toBe(true);
  await page.getByRole('link', { name: 'To the point', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-portfolio-mode',
    'focused'
  );
  await expect(page.locator('video')).toHaveCount(0);
  expect(errors).toEqual([]);
});

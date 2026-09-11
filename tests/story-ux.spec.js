import { test, expect } from '@playwright/test';

async function openPlayful(page) {
  await page.goto('/focused/');
  await page.getByRole('link', { name: 'Playful side', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-portfolio-mode',
    'playful'
  );
  await expect(page.locator('.view-curtain')).not.toHaveAttribute(
    'data-active',
    ''
  );
  await page.evaluate(() => document.fonts.ready);
}

test('story cards stop with the scroll position in both directions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayful(page);
  const story = page.locator('#main__story');
  const start = await story.evaluate(
    (element) => element.getBoundingClientRect().top + scrollY
  );
  for (const offset of [900, 1600, 2300, 1600, 900]) {
    const drift = await story.evaluate(async (element, y) => {
      scrollTo(0, y);
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
      const read = () =>
        [...element.querySelectorAll('.story_view')].map((card) => {
          const { top, left, width, height } = card.getBoundingClientRect();
          return { top, left, width, height };
        });
      const before = read();
      const initialScroll = scrollY;
      await new Promise((resolve) => setTimeout(resolve, 350));
      const after = read();
      return {
        scroll: Math.abs(scrollY - initialScroll),
        cards: Math.max(
          ...after.flatMap((box, index) =>
            Object.keys(box).map((key) =>
              Math.abs(box[key] - before[index][key])
            )
          )
        ),
      };
    }, start + offset);
    expect(drift.scroll).toBeLessThan(2);
    expect(
      drift.cards,
      `Card drift after stopping at offset ${offset}`
    ).toBeLessThan(2);
  }
});

test('every story paragraph stays readable across resizing and motion preferences', async ({
  page,
}) => {
  await openPlayful(page);
  for (const { width, height, reducedMotion } of [
    { width: 1440, height: 900, reducedMotion: 'no-preference' },
    { width: 768, height: 700, reducedMotion: 'no-preference' },
    { width: 390, height: 844, reducedMotion: 'no-preference' },
    { width: 1024, height: 600, reducedMotion: 'no-preference' },
    { width: 1440, height: 900, reducedMotion: 'reduce' },
    { width: 1440, height: 900, reducedMotion: 'no-preference' },
  ]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion });
    await page.evaluate(() => scrollTo(0, 0));
    const positions = await page
      .locator('.story_view')
      .evaluateAll((cards) =>
        cards.map((card) => card.getBoundingClientRect().top + scrollY)
      );
    for (const [index, top] of positions.entries()) {
      await page.evaluate((y) => scrollTo(0, y), top - 100);
      const card = page.locator('.story_view').nth(index);
      const readable = await card.evaluate((element) => {
        const text = element.querySelector('h2').getBoundingClientRect();
        const controls = document
          .querySelector('.portfolio-controls')
          .getBoundingClientRect();
        return (
          text.top >= 0 &&
          text.bottom < controls.top &&
          text.left >= 0 &&
          text.right <= innerWidth &&
          [text.top + 1, text.bottom - 1].every(
            (y) =>
              document
                .elementFromPoint(text.left + text.width / 2, y)
                ?.closest('.story_view') === element
          )
        );
      });
      expect(
        readable,
        `Paragraph ${index + 1} at ${width}x${height}, ${reducedMotion}`
      ).toBe(true);
      if (
        index === 2 &&
        width >= 768 &&
        height >= 700 &&
        reducedMotion === 'no-preference'
      ) {
        // Earlier cards stay stacked above the current one.
        await expect(page.locator('.story_view').first()).toBeInViewport();
      }
    }
  }
});

for (const { width, height } of [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 1024, height: 600 },
  { width: 1440, height: 900 },
]) {
  test(`playful back to top stays at the lower right and returns focus at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await openPlayful(page);
    await page.evaluate(() =>
      scrollTo(0, document.documentElement.scrollHeight)
    );
    await expect(page.locator('.fixed_footer')).toHaveCSS('z-index', '2');
    const backToTop = page.getByRole('link', {
      name: 'Back to top',
      exact: true,
    });
    const box = await backToTop.boundingBox();
    const controls = await page.locator('.portfolio-controls').boundingBox();
    expect(box.x + box.width).toBeCloseTo(width - (width >= 768 ? 70 : 20), 0);
    expect(box.y).toBeGreaterThan(height * 0.65);
    expect(box.y + box.height + 24).toBeLessThan(controls.y);
    if (width < 768) {
      const copyright = await page.locator('.button--surtur').boundingBox();
      expect(copyright.y + copyright.height + 16).toBeLessThanOrEqual(box.y);
    }
    await backToTop.click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page.locator('#top')).toBeFocused();
  });
}

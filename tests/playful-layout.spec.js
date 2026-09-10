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
}

for (const width of [390, 1440]) {
  test(`recommendation portraits stay beside their quotes at ${width}px after switching views`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openPlayful(page);
    const section = page.locator('.testimonials').locator('..');
    const positions = await section.evaluate((e) => {
      const top = e.getBoundingClientRect().top + scrollY;
      return [top - 1500, top - 800, top, top + 500];
    });
    for (const y of positions) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await expect
        .poll(() =>
          section.evaluate((e) => {
            const section = e.getBoundingClientRect();
            return [...e.querySelectorAll('.testimonials__image')].every(
              (image) => {
                const box = image.getBoundingClientRect();
                return (
                  box.top >= section.top - 1 &&
                  box.bottom <= section.bottom + 1 &&
                  box.left >= 0 &&
                  box.right <= innerWidth
                );
              }
            );
          })
        )
        .toBe(true);
    }
    await page.locator('.testimonials__text').first().scrollIntoViewIfNeeded();
    expect(
      await page.locator('.testimonials').evaluate((e) => {
        const quote = e
          .querySelector('.testimonials__text')
          .getBoundingClientRect();
        const image = e
          .querySelector('.testimonials__image')
          .getBoundingClientRect();
        return image.left >= quote.right && e.scrollWidth <= e.clientWidth;
      })
    ).toBe(true);
  });
}

for (const width of [390, 1024]) {
  test(`work cards respond to horizontal touch swipes at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await openPlayful(page);
    const cards = page.locator('#why-work-with-me');
    await cards.scrollIntoViewIfNeeded();
    const before = await cards.locator('.brands-section').nth(1).boundingBox();
    const bounds = await cards.boundingBox();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.synthesizeScrollGesture', {
      x: Math.round(width * 0.8),
      y: Math.round(Math.max(180, Math.min(600, bounds.y + bounds.height / 2))),
      xDistance: -Math.round(width * 0.6),
      yDistance: 0,
      gestureSourceType: 'touch',
    });
    await expect
      .poll(
        async () =>
          (await cards.locator('.brands-section').nth(1).boundingBox()).x
      )
      .toBeLessThan(before.x - 50);
    // Snap positions must leave a complete card readable, even though the
    // rest of the page applies a large global scroll margin.
    await expect
      .poll(() =>
        cards.evaluate((track) => {
          const bounds = track.getBoundingClientRect();
          return [...track.querySelectorAll('.brands-section')]
            .slice(1)
            .some((card) => {
              const box = card.getBoundingClientRect();
              return (
                box.left >= bounds.left - 1 && box.right <= bounds.right + 1
              );
            });
        })
      )
      .toBe(true);
    const verticalBefore = await page.evaluate(() => scrollY);
    await cdp.send('Input.synthesizeScrollGesture', {
      x: Math.round(width / 2),
      y: 500,
      yDistance: -300,
      gestureSourceType: 'touch',
    });
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(verticalBefore);
    const aiCard = cards.locator('.brands-section').nth(3);
    await aiCard.evaluate((card) =>
      card.scrollIntoView({ block: 'center', inline: 'start' })
    );
    await expect
      .poll(() =>
        aiCard.evaluate((card) => {
          const box = card.getBoundingClientRect();
          return box.left >= 0 && box.right <= innerWidth;
        })
      )
      .toBe(true);
    await expect(aiCard.locator('h2')).toHaveText('AI READY', {
      useInnerText: true,
    });
    await context.close();
  });
}

test('desktop scroll reaches the last card and keeps portraits in recommendations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayful(page);
  const track = page.locator('#why-work-with-me');
  const target = await track.evaluate((element) => {
    const last = element.querySelector('.brands-section:last-child');
    const start = element.getBoundingClientRect().top + scrollY;
    return start + last.offsetLeft + last.offsetWidth - element.clientWidth;
  });
  await page.evaluate((y) => scrollTo(0, y), target);
  await expect
    .poll(() =>
      track.evaluate((element) => {
        const last = element
          .querySelector('.brands-section:last-child')
          .getBoundingClientRect();
        return Math.abs(last.right - element.getBoundingClientRect().right);
      })
    )
    .toBeLessThan(2);
  expect(
    await page
      .locator('.testimonials__image')
      .first()
      .evaluate((image) => {
        const cards = document
          .querySelector('#why-work-with-me')
          .getBoundingClientRect();
        return image.getBoundingClientRect().top >= cards.bottom;
      })
  ).toBe(true);
  await page.locator('#recommendations').scrollIntoViewIfNeeded();
  await expect(page.locator('.testimonials__image').first()).toBeInViewport();
});

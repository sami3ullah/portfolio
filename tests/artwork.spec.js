import { test, expect } from '@playwright/test';

test('the component illustration animates in view, rests offscreen, and respects reduced motion', async ({
  page,
}) => {
  await page.goto('/focused/');
  await page.getByRole('link', { name: 'Playful side', exact: true }).click();
  await expect(page.locator('.view-curtain')).not.toHaveAttribute(
    'data-active',
    ''
  );
  const artwork = page.locator('[data-component-artwork]');
  const isResting = () =>
    artwork.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .every((animation) => animation.playState !== 'running')
    );
  await expect.poll(isResting).toBe(true);
  await artwork.scrollIntoViewIfNeeded();
  const card = artwork.locator('.foundation-card');
  const initial = await card.evaluate(
    (element) => getComputedStyle(element).transform
  );
  await expect
    .poll(() => card.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initial);

  await page.locator('#recommendations').scrollIntoViewIfNeeded();
  await expect.poll(isResting).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await artwork.scrollIntoViewIfNeeded();
  await expect.poll(isResting).toBe(true);
  await expect(card).toBeVisible();

  await page.getByRole('link', { name: 'To the point', exact: true }).click();
  await expect(page).toHaveURL(/\/focused\/$/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('link', { name: 'Playful side', exact: true }).click();
  await expect(page.locator('.view-curtain')).not.toHaveAttribute(
    'data-active',
    ''
  );
  await artwork.scrollIntoViewIfNeeded();
  await expect.poll(isResting).toBe(false);
});

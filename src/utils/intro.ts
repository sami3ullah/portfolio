// Hero effects can register before or after the preloader on each route.
// Start them at the reveal itself so their timing cannot drift from the words.
export function afterIntroReveal(start: () => void, signal: AbortSignal) {
  const root = document.documentElement;
  if (
    isIntroActive() &&
    getComputedStyle(root)
      .getPropertyValue('--intro-content-visibility')
      .trim() !== 'visible'
  ) {
    document.addEventListener('portfolio:intro-reveal', start, {
      once: true,
      signal,
    });
  } else start();
}

export function isIntroActive() {
  const root = document.documentElement;
  return (
    root.hasAttribute('data-intro-active') &&
    getComputedStyle(root).getPropertyValue('--intro-display').trim() !== 'none'
  );
}

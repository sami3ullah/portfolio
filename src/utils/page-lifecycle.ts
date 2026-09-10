type Mode = 'focused' | 'playful';
type Setup = (page: {
  initial: boolean;
  signal: AbortSignal;
}) => void | (() => void);

const effects: { mode: Mode; setup: Setup }[] = [];
let cleanups: (() => void)[] = [];
let initial = true;

// Astro evaluates bundled scripts once. Register effects once, then create
// and dispose their page-specific state on every client navigation.
export function onPageReady(mode: Mode, setup: Setup) {
  effects.push({ mode, setup });
}

document.addEventListener('astro:before-swap', () => {
  cleanups.reverse().forEach((cleanup) => cleanup());
  cleanups = [];
});

document.addEventListener('astro:page-load', () => {
  for (const effect of effects) {
    if (effect.mode !== document.documentElement.dataset.portfolioMode)
      continue;
    const controller = new AbortController();
    const cleanup = effect.setup({ initial, signal: controller.signal });
    cleanups.push(() => {
      controller.abort();
      cleanup?.();
    });
  }
  initial = false;
});

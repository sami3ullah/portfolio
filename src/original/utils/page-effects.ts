import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPageReady } from '../../utils/page-lifecycle';

gsap.registerPlugin(ScrollTrigger);
onPageReady('playful', ({ signal }) => {
  ScrollTrigger.enable();
  let refreshFrame: number;
  const refreshAfterLayout = () => {
    if (signal.aborted) return;
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      // Component scripts can register out of document order. Measure upstream
      // pins first, once every effect and the page's fonts are ready.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
  };
  refreshAfterLayout();
  void document.fonts.ready.then(refreshAfterLayout);
  return () => {
    cancelAnimationFrame(refreshFrame);
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    ScrollTrigger.disable();
    gsap.globalTimeline.clear();
  };
});

export function playfulEffect(setup: Parameters<typeof onPageReady>[1]) {
  onPageReady('playful', (page) => {
    let cleanup: void | (() => void);
    const context = gsap.context(() => {
      cleanup = setup(page);
    });
    return () => {
      context.revert();
      cleanup?.();
    };
  });
}

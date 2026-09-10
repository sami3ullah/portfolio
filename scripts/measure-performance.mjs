import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';
const route = process.argv[2] || '/focused/';
if (!['/', '/focused/'].includes(route)) {
  throw new Error('Measure either / or /focused/.');
}
const name = route === '/' ? 'performance-original' : 'performance-focused';
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: 1_600_000 / 8,
  uploadThroughput: 750_000 / 8,
});
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.addInitScript(() => {
  window.measurements = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      window.measurements.lcp = entry.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      if (!entry.hadRecentInput) window.measurements.cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
});
const requests = [];
page.on('request', (request) => requests.push(request.url()));
await page.goto(`http://127.0.0.1:4321${route}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
if (route === '/') {
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector('.preloader-overlay')).display ===
        'none' &&
      getComputedStyle(document.querySelector('h1.main-title')).opacity === '1'
  );
}
await page.waitForFunction(() =>
  document
    .getAnimations()
    .every(
      (animation) =>
        animation.playState !== 'running' ||
        animation.effect?.getTiming().iterations === Infinity
    )
);
const result = await page.evaluate(() => ({
  ...window.measurements,
  navigation: performance.getEntriesByType('navigation')[0].toJSON(),
  resources: performance.getEntriesByType('resource').map((resource) => ({
    name: resource.name,
    bytes: resource.transferSize,
    duration: resource.duration,
  })),
}));
result.profile = {
  route,
  viewport: '390x844',
  deviceScaleFactor: 1,
  network: '1.6 Mbps down, 750 kbps up, 150 ms latency',
  cpuSlowdown: 4,
  cache: 'disabled',
  source: 'local production preview; one lab run, not field Core Web Vitals',
};
result.requests = requests;
await mkdir('docs/verification', { recursive: true });
await writeFile(
  `docs/verification/${name}.json`,
  JSON.stringify(result, null, 2) + '\n'
);
await page.screenshot({ path: `docs/verification/${name}-mobile.png` });
console.log(
  JSON.stringify({
    lcpMs: result.lcp,
    cls: result.cls,
    requests: requests.length,
    transferredBytes: result.resources.reduce(
      (sum, resource) => sum + resource.bytes,
      result.navigation.transferSize
    ),
    thirdPartyRequests: requests.filter(
      (url) => !url.startsWith('http://127.0.0.1:4321/')
    ),
  })
);
await browser.close();

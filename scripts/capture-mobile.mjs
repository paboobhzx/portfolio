import { chromium, devices } from '@playwright/test';

const base = 'http://127.0.0.1:4173';
const targets = [
  { name: 'home-top', path: '/' },
  { name: 'home-portfolio', path: '/#portfolio' },
  { name: 'cosmo-top', path: '/project-map-cosmo/' },
  { name: 'cosmo-tech', path: '/project-map-cosmo/', y: 900 },
  { name: 'superzap-top', path: '/project-map-superzap/' },
  { name: 'superzap-tech', path: '/project-map-superzap/', y: 900 },
  { name: 'superdoc-top', path: '/project-map-superdoc/' },
  { name: 'superdoc-tech', path: '/project-map-superdoc/', y: 900 },
];

const setups = [
  { key: 'iphone13', device: devices['iPhone 13'] },
  { key: 'pixel7', device: devices['Pixel 7'] },
];

const browser = await chromium.launch();
for (const setup of setups) {
  const context = await browser.newContext({ ...setup.device });
  const page = await context.newPage();
  for (const target of targets) {
    await page.goto(base + target.path, { waitUntil: 'networkidle' });
    if (target.y) await page.evaluate((y) => window.scrollTo(0, y), target.y);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `screenshots/mobile-2026-05-20/${setup.key}-${target.name}.png` });
  }
  await context.close();
}
await browser.close();

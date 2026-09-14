const { chromium } = require('playwright');

const OUT = process.argv[2];
const BASE = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch();
  const results = [];

  for (const [label, width, height] of [['mobile', 390, 844], ['tablet', 768, 1024]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();

    for (const [name, path] of [['home', '/'], ['rooms', '/rooms'], ['login', '/login']]) {
      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${OUT}\\${label}-${name}.png` });

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      results.push(`${label} ${path}: horizontal overflow ${overflow}px`);
    }
    await context.close();
  }

  console.log(results.join('\n'));
  await browser.close();
})();

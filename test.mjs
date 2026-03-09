import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  const html = await page.content();
  console.log('HTML CONTENT LENGTH:', html.length);
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML);
  console.log('ROOT HTML:', rootHtml);

  await browser.close();
})();

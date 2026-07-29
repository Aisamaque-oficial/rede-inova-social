const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating...');
  await page.goto('http://localhost:3000/painel/dashboard', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();

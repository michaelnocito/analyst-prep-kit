const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = 'C:\\Users\\Mike\\Desktop\\python-kit-shots';
const URL = 'http://localhost:4201/python/';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge' });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  const shot = async (name) => {
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, name) });
    console.log('saved', name);
  };
  const run = async (js) => { await page.evaluate(js); };

  // 1. Home (light)
  await run("show('home'); window.scrollTo(0,0);");
  await shot('01-home-light.png');

  // 2. Lesson detail (light)
  await run("openLesson(101); window.scrollTo(0,0);");
  await shot('02-lesson-detail-light.png');

  // 3. Lessons list (light)
  await run("show('lessons'); window.scrollTo(0,0);");
  await shot('03-lessons-list-light.png');

  // 4. Practice (light)
  await run("show('practice'); window.scrollTo(0,0);");
  await shot('04-practice-light.png');

  // 5. Terminal (light)
  await run("show('terminal'); window.scrollTo(0,0);");
  await shot('05-terminal-light.png');

  // 6. Cards (light)
  await run("show('cards'); window.scrollTo(0,0);");
  await shot('06-cards-light.png');

  // 7. Glossary (light)
  await run("show('glossary'); window.scrollTo(0,0);");
  await shot('07-glossary-light.png');

  // 8. Home (dark)
  await run("toggleTheme(); show('home'); window.scrollTo(0,0);");
  await shot('08-home-dark.png');

  // 9. Terminal (dark)
  await run("show('terminal'); window.scrollTo(0,0);");
  await shot('09-terminal-dark.png');

  // 10. Home (mobile) — back to light
  await run("toggleTheme();");
  await page.setViewportSize({ width: 414, height: 896 });
  await run("show('home'); window.scrollTo(0,0);");
  await shot('10-home-mobile.png');

  await browser.close();
  console.log('DONE ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });

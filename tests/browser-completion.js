import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { SAVE_KEY } from '../src/progress.js';

// Exercise completion integration with real browser keyboard events. No save
// seeding, simulation imports, state setters, or diagnostic writes are used.
const executable = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
const browser = await chromium.launch({
  headless: true,
  ...(existsSync(executable) ? { executablePath: executable } : {}),
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const snapshot = () => page.evaluate(() => window.catGame);
const until = (predicate, argument) => page.waitForFunction(predicate, argument, { timeout: 10000, polling: 'raf' });

async function move(x) {
  const state = await snapshot();
  const index = state.active;
  const right = state.cats[index].x < x;
  const key = right ? 'ArrowRight' : 'ArrowLeft';
  await page.keyboard.down(key);
  await until(({ x, index, right }) => window.catGame.won || (right
    ? window.catGame.cats[index].x >= x
    : window.catGame.cats[index].x <= x), { x, index, right });
  await page.keyboard.up(key);
}

async function leap(x, y) {
  await page.keyboard.down('Space');
  await move(x);
  await page.keyboard.up('Space');
  await until(y => window.catGame.cats[0].y === y, y);
}

try {
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  await until(() => window.catGame?.cats[0].y === 480);
  await move(180);
  await leap(270, 402);
  await page.keyboard.down('e');
  await leap(390, 324);
  await until(() => document.querySelector('#objective-boop').parentElement.classList.contains('done'));
  await page.keyboard.up('e');

  await page.keyboard.press('q');
  await until(() => window.catGame.active === 1);
  await page.keyboard.down('e');
  await page.keyboard.down('ArrowRight');
  await until(() => document.querySelector('#objective-plate').textContent.includes('stand on'));
  await page.keyboard.up('ArrowRight');
  await page.keyboard.up('e');
  await page.keyboard.down('Space');
  await move(773);
  await page.keyboard.up('Space');
  await until(() => window.catGame.cats[1].y === 480);

  await page.keyboard.press('q');
  await until(() => window.catGame.active === 0);
  await move(650);
  await page.keyboard.down('Space');
  await move(760);
  await page.keyboard.up('Space');
  await move(897);
  await page.keyboard.down('e');
  await until(() => document.querySelector('#objective-exit').textContent.includes('Door wedged'));
  await page.keyboard.up('e');
  await page.keyboard.press('q');
  await until(() => window.catGame.active === 1);
  await move(885);

  await page.locator('#completion-menu').waitFor({ state: 'visible' });
  assert.equal((await snapshot()).won, true);
  assert.deepEqual((await snapshot()).completed, [1]);
  assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).completed, SAVE_KEY), [1]);
  await page.locator('#next-level').click();
  await until(() => window.catGame.level === 2 && !window.catGame.paused);
  await page.reload({ waitUntil: 'networkidle' });
  await until(() => window.catGame?.level === 2);
  assert.deepEqual((await snapshot()).completed, [1]);
  await page.locator('#open-levels').click();
  assert.equal(await page.locator('#level-grid button:not(:disabled)').count(), 2);
  assert.deepEqual(errors, [], 'real completion must not cause browser errors');
  console.log('PASS real keyboard room completion, completion dialog, saved unlock, next room, and reload restoration');
} catch (error) {
  console.error('Browser completion snapshot:', await snapshot());
  throw error;
} finally {
  await browser.close();
}

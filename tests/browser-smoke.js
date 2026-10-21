import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { SAVE_KEY } from '../src/progress.js';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const executable = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
const browser = await chromium.launch({ headless: true, ...(existsSync(executable) ? { executablePath: executable } : {}), args: ['--no-sandbox'] });
const errors = [];
const checkPage = page => {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
};
const snapshot = page => page.evaluate(() => window.catGame);
async function ready(page) {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.catGame && document.querySelector('#game canvas'));
  await page.waitForFunction(() => window.catGame.tick > 1 && window.catGame.cats.every(cat => cat.y === 480));
}
async function advance(page, ticks = 8) {
  const before = (await snapshot(page)).tick;
  await page.waitForFunction(({ before, ticks }) => window.catGame.tick >= before + ticks, { before, ticks }, { timeout: 10000 });
}
async function holdUntil(page, key, predicate, argument) {
  await page.keyboard.down(key);
  try { await page.waitForFunction(predicate, argument, { timeout: 10000, polling: 'raf' }); }
  finally { await page.keyboard.up(key); }
}
async function hold(page, key, milliseconds) {
  await page.keyboard.down(key);
  await page.waitForTimeout(milliseconds);
  await page.keyboard.up(key);
}
async function checkPaused(page, opener, modal, closer) {
  await page.locator(opener).click();
  assert.equal(await page.locator(modal).isVisible(), true);
  const before = await snapshot(page);
  assert.equal(before.paused, true);
  await hold(page, 'ArrowRight', 180);
  await page.keyboard.press('q');
  assert.deepEqual((await snapshot(page)).cats, before.cats, `${modal} must freeze both cats`);
  assert.equal((await snapshot(page)).active, before.active, `${modal} must block switching`);
  await page.locator(closer).click();
  await advance(page, 2);
  assert.equal((await snapshot(page)).paused, false);
  const resumed = await snapshot(page);
  assert.deepEqual(resumed.cats.map(cat => cat.x), before.cats.map(cat => cat.x), 'input typed in a dialog must not leak into play');
  if (before.cats.some(cat => cat.y < 480)) assert.notDeepEqual(resumed.cats, before.cats, 'airborne physics resumes after closing the dialog');
}
try {
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const desktop = await desktopContext.newPage(); checkPage(desktop);
  await ready(desktop);
  const levelCount = Number((await desktop.locator('#level-number').textContent()).split('/')[1]);
  assert.ok(Number.isInteger(levelCount) && levelCount >= 1 && levelCount <= 10, 'the game reports its available room count');
  const canvas = desktop.locator('#game canvas');
  assert.equal(await canvas.count(), 1);
  const box = await canvas.boundingBox();
  assert.ok(box.width > 600 && box.height > 300, 'the real Phaser canvas must render at a usable desktop size');
  assert.equal((await snapshot(desktop)).level, 1);
  assert.equal((await snapshot(desktop)).active, 0);
  const initial = await snapshot(desktop);
  await holdUntil(desktop, 'ArrowRight', x => window.catGame.cats[0].x > x + 15, initial.cats[0].x);
  assert.ok((await snapshot(desktop)).cats[0].x > initial.cats[0].x + 15, 'keyboard moves Nässla');
  const stopped = (await snapshot(desktop)).cats[0].x;
  await advance(desktop);
  assert.equal((await snapshot(desktop)).cats[0].x, stopped, 'keyup stops horizontal movement');
  await holdUntil(desktop, 'Space', () => window.catGame.cats[0].y < 450);
  assert.ok((await snapshot(desktop)).cats[0].y < 450, 'Space starts a real jump');
  await desktop.waitForFunction(() => window.catGame.cats[0].y === 480);
  await desktop.keyboard.press('q');
  await desktop.waitForFunction(() => window.catGame.active === 1);
  await desktop.waitForFunction(() => document.querySelector('#cat-name').textContent === 'Maliketh');
  await holdUntil(desktop, 'ArrowLeft', x => window.catGame.cats[1].x < x - 5, initial.cats[1].x);
  assert.ok((await snapshot(desktop)).cats[1].x < initial.cats[1].x - 5, 'keyboard controls the selected second cat');
  await desktop.keyboard.press('r');
  await desktop.waitForFunction(() => window.catGame.active === 0 && window.catGame.cats[0].x === 90 && window.catGame.cats[1].x === 132);
  await holdUntil(desktop, 'Space', () => window.catGame.cats[0].y < 470);
  assert.ok((await snapshot(desktop)).cats[0].y < 470);
  await checkPaused(desktop, '#help-toggle', '#help-menu', '#close-help');
  await desktop.waitForFunction(() => window.catGame.cats[0].y === 480);
  await checkPaused(desktop, '#open-levels', '#level-menu', '#close-levels');
  await desktop.locator('#open-levels').click();
  assert.equal(await desktop.locator('#level-grid button').count(), levelCount);
  assert.equal(await desktop.locator('#level-grid button:disabled').count(), levelCount - 1, 'unplayed rooms start locked');
  await desktop.keyboard.press('Escape');
  assert.equal(await desktop.locator('#level-menu').isVisible(), false);
  await desktop.locator('#toggle-sound').click();
  assert.equal(await desktop.locator('#toggle-sound').getAttribute('aria-pressed'), 'true');
  await desktop.reload({ waitUntil: 'networkidle' });
  assert.equal(await desktop.locator('#toggle-sound').getAttribute('aria-pressed'), 'true', 'sound preference persists');
  // A seeded save tests restoration only; completion itself is exercised by physics replay tests.
  await desktop.evaluate(({ key, current }) => localStorage.setItem(key, JSON.stringify({ completed: [1], current, sound: false })), { key: SAVE_KEY, current: levelCount > 1 ? 1 : 0 });
  await desktop.reload({ waitUntil: 'networkidle' });
  await desktop.waitForFunction(id => window.catGame?.level === id, Math.min(2, levelCount));
  assert.deepEqual((await snapshot(desktop)).completed, [1]);
  await desktop.locator('#restart-level').click();
  assert.deepEqual((await snapshot(desktop)).completed, [1], 'restart preserves saved progress');
  await desktop.locator('#open-levels').click();
  assert.equal(await desktop.locator('#level-grid button:not(:disabled)').count(), Math.min(2, levelCount));
  await desktop.locator('#level-grid button').first().click();
  await desktop.waitForFunction(() => window.catGame.level === 1 && !window.catGame.paused);
  await desktop.screenshot({ path: '/tmp/cat-game-desktop.png', fullPage: true });
  await desktop.evaluate(key => localStorage.setItem(key, '{broken'), SAVE_KEY);
  await desktop.reload({ waitUntil: 'networkidle' });
  await desktop.waitForFunction(() => window.catGame?.level === 1);
  assert.deepEqual((await snapshot(desktop)).completed, [], 'corrupt browser storage recovers safely');
  console.log('PASS desktop: Phaser canvas, keyboard move/jump/switch, restart, modal pause, locks, persisted preferences/progress, corrupt storage');

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36' });
  const mobile = await mobileContext.newPage(); checkPage(mobile); await ready(mobile);
  assert.equal(await mobile.locator('#touch-controls').isVisible(), true);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile page must not overflow horizontally');
  const touchRight = mobile.locator('[data-control="right"]');
  const touchJump = mobile.locator('[data-control="jump"]');
  await touchRight.scrollIntoViewIfNeeded();
  const rightBox = await touchRight.boundingBox(), jumpBox = await touchJump.boundingBox();
  assert.ok(rightBox.width >= 44 && rightBox.height >= 44, 'touch target meets a usable size');
  const point = (rect, id) => ({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, id, radiusX: 5, radiusY: 5, force: 1 });
  const cdp = await mobileContext.newCDPSession(mobile);
  const beforeTouch = await snapshot(mobile);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(rightBox, 1), point(jumpBox, 2)] });
  await mobile.waitForFunction(before => window.catGame.cats[0].x > before.x + 15 && window.catGame.cats[0].y < before.y - 20,
    beforeTouch.cats[0], { timeout: 10000, polling: 'raf' });
  const duringTouch = await snapshot(mobile);
  assert.ok(duringTouch.cats[0].x > beforeTouch.cats[0].x + 15, 'real touch moves right');
  assert.ok(duringTouch.cats[0].y < beforeTouch.cats[0].y - 20, 'simultaneous second touch jumps while moving');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await advance(mobile, 2);
  const afterCancel = (await snapshot(mobile)).cats[0].x;
  await advance(mobile);
  assert.equal((await snapshot(mobile)).cats[0].x, afterCancel, 'touch cancellation clears held movement');
  assert.equal(await mobile.locator('[data-control].pressed').count(), 0, 'cancel clears pressed controls');
  await mobile.waitForFunction(() => window.catGame.cats[0].y === 480);
  await mobile.locator('#touch-switch').tap();
  await mobile.waitForFunction(() => window.catGame.active === 1);
  const leftBox = await mobile.locator('[data-control="left"]').boundingBox();
  const beforeLeft = (await snapshot(mobile)).cats[1].x;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(leftBox, 3)] });
  await mobile.waitForFunction(x => window.catGame.cats[1].x < x - 10, beforeLeft, { timeout: 10000, polling: 'raf' });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  assert.ok((await snapshot(mobile)).cats[1].x < beforeLeft - 10, 'touch switch selects Maliketh for movement');
  const afterRelease = (await snapshot(mobile)).cats[1].x;
  await advance(mobile);
  assert.equal((await snapshot(mobile)).cats[1].x, afterRelease, 'touch release clears held movement');
  await mobile.locator('#restart-level').tap();
  await mobile.waitForFunction(() => window.catGame.active === 0 && window.catGame.cats[0].x === 90);
  await mobile.screenshot({ path: '/tmp/cat-game-mobile.png', fullPage: true });
  console.log('PASS Android-emulated Chromium: responsive canvas, physical multi-touch movement/jump, switch, pointer cancellation and release');
  for (const viewport of [{ width: 640, height: 360 }, { width: 844, height: 390 }]) {
    await mobile.setViewportSize(viewport);
    await mobile.evaluate(() => window.scrollTo(0, 0));
    await mobile.waitForFunction(() => {
      const canvas = document.querySelector('#game canvas').getBoundingClientRect();
      const game = document.querySelector('#game').getBoundingClientRect();
      // Phaser FIT may letterbox the canvas after rotation; it must remain
      // inside its container, but need not occupy every pixel of the container.
      return canvas.width <= game.width + 1 && canvas.height <= game.height + 1;
    });
    const layout = await mobile.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      canvas: document.querySelector('#game canvas').getBoundingClientRect().toJSON(),
      controls: document.querySelector('#touch-controls').getBoundingClientRect().toJSON(),
      buttons: [...document.querySelectorAll('#touch-controls button')].map(button => ({
        name: button.getAttribute('aria-label'), ...button.getBoundingClientRect().toJSON(),
      })),
    }));
    const label = `${viewport.width}×${viewport.height} landscape`;
    assert.equal(layout.overflow, false, `${label}: no horizontal overflow`);
    for (const [name, box] of [['full room', layout.canvas], ['touch control row', layout.controls]]) {
      assert.ok(box.left >= 0 && box.right <= viewport.width + 1 && box.top >= 0 && box.bottom <= viewport.height + 1,
        `${label}: ${name} must fit in the viewport; bounds=${JSON.stringify(box)}`);
    }
    for (const button of layout.buttons) {
      assert.ok(button.width >= 44 && button.height >= 44, `${label}: ${button.name} needs a 44px touch target`);
    }
  }
  console.log('PASS landscape 640×360 and 844×390: full room and controls visible together, 44px touch targets');
  assert.deepEqual(errors, [], 'no JavaScript exceptions or browser console errors');
  console.log('PASS no browser runtime errors. Screenshots: /tmp/cat-game-desktop.png and /tmp/cat-game-mobile.png');
  await desktopContext.close(); await mobileContext.close();
} finally {
  await browser.close();
}

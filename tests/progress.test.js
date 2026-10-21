import test from 'node:test';
import assert from 'node:assert/strict';
import { SAVE_KEY, loadProgress, saveProgress, unlockedCount } from '../src/progress.js';

function memoryStorage(initial) {
  const values = new Map(initial === undefined ? [] : [[SAVE_KEY, initial]]);
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('new players start in room one with no completed rooms', () => {
  assert.deepEqual(loadProgress(memoryStorage(), 10), { completed: [], current: 0, sound: false });
  assert.equal(unlockedCount([], 10), 1);
});

test('completion, selected room, and sound survive a save/load round trip', () => {
  const storage = memoryStorage();
  const progress = { completed: [1, 2, 3], current: 3, sound: true };
  assert.equal(saveProgress(storage, progress), true);
  assert.deepEqual(loadProgress(storage, 10), progress);
  assert.equal(unlockedCount(progress.completed, 10), 4);
});

test('rooms unlock in order; a later completion cannot skip an unfinished room', () => {
  assert.equal(unlockedCount([3, 4, 5], 10), 1);
  assert.equal(unlockedCount([1, 3, 4], 10), 2);
  assert.equal(unlockedCount([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10), 10);
  assert.equal(unlockedCount([1], 1), 1);
  assert.deepEqual(loadProgress(memoryStorage(JSON.stringify({ completed: [1, 3], current: 9 })), 10), { completed: [1, 3], current: 1, sound: false });
});

test('corrupt or unexpectedly shaped storage safely starts a fresh visit', () => {
  for (const raw of ['{broken', 'null', '[]', 'false', '42', '"text"', '{"completed":false}']) {
    assert.deepEqual(loadProgress(memoryStorage(raw), 10), { completed: [], current: 0, sound: false }, raw);
  }
});

test('saved data is sanitized and cannot select a locked or nonexistent room', () => {
  const storage = memoryStorage(JSON.stringify({ completed: [1, 1, 2, 0, -1, 11, 1.5, '3', null], current: 999, sound: 'true' }));
  assert.deepEqual(loadProgress(storage, 10), { completed: [1, 2], current: 2, sound: false });
  for (const current of [-9, 2.5, '2', null]) {
    assert.equal(loadProgress(memoryStorage(JSON.stringify({ completed: [1], current })), 10).current, 0);
  }
});

test('privacy restrictions and full storage do not throw or destroy in-memory progress', () => {
  const blocked = { getItem() { throw new DOMException('Blocked', 'SecurityError'); }, setItem() { throw new DOMException('Full', 'QuotaExceededError'); } };
  assert.deepEqual(loadProgress(blocked, 10), { completed: [], current: 0, sound: false });
  const progress = { completed: [1], current: 1, sound: true };
  assert.equal(saveProgress(blocked, progress), false);
  assert.deepEqual(progress, { completed: [1], current: 1, sound: true });
});

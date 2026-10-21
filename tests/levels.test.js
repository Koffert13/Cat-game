import test from 'node:test';
import assert from 'node:assert/strict';
import { levels } from '../src/levels.js';
import { createState, step, bellReady, FLOOR } from '../src/simulation.js';
import { solveLevel } from './solver.js';

for (const level of levels) {
  test(`level ${level.id}: ${level.name} is completable using player input`, () => {
    const { state, inputs } = solveLevel(level, { record: true });
    assert.equal(state.won, true);
    assert.equal(state.stats.boops, level.pots.length);
    assert.ok(state.stats.pushes > 0);
    assert.ok(state.stats.plateTicks >= 180);
    assert.equal(state.stats.meows, 1);
    assert.ok(state.cats.every(c => c.x > level.gateX + 35 && c.y === FLOOR));
    if (level.requiresGroom) assert.ok(state.stats.grooms > 0);
    if (level.heavy) assert.ok(state.stats.snacks > 0);
    for (const input of inputs) for (const key of Object.keys(input)) {
      assert.ok(['left', 'right', 'jump', 'action', 'switch'].includes(key));
      assert.equal(typeof input[key], 'boolean');
    }
    // An independent replay must reproduce success from the initial state.
    const replay = createState(level);
    for (const input of inputs) step(replay, input);
    assert.equal(replay.won, true);
    assert.deepEqual(replay.stats, state.stats);
  });
}

test('idle input cannot solve a room or activate its puzzle', () => {
  const state = createState(levels[0]);
  for (let i = 0; i < 240; i++) step(state);
  assert.equal(state.won, false);
  assert.equal(state.gateOpen, false);
  assert.equal(bellReady(state), false);
  assert.equal(state.crate.settled, false);
  assert.equal(state.stats.boops, 0);
});

test('Nässla cannot push the crate, and Maliketh must hold action to push', () => {
  for (const active of [0, 1]) {
    const state = createState(levels[0]);
    if (active) step(state, { switch: true });
    for (let i = 0; i < 240; i++) step(state, { right: true, action: !active });
    assert.equal(state.crate.x, levels[0].crateX);
    assert.equal(state.stats.pushes, 0);
    assert.equal(state.won, false);
  }
});

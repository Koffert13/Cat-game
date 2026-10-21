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

const abilityRoom = (overrides = {}) => ({
  ...levels[0], platforms: [], climbWalls: [], pots: [], vacuums: [], bagels: [], ...overrides,
});

test('Maliketh grooms Nässla and increases her reachable jump height', () => {
  const jumpHeight = (groomed) => {
    const state = createState(abilityRoom());
    if (groomed) {
      step(state, { switch: true, action: true });
      step(state);
      step(state, { switch: true });
    }
    let highestFeet = FLOOR;
    for (let i = 0; i < 65; i++) {
      step(state, { jump: true });
      highestFeet = Math.min(highestFeet, state.cats[0].y);
    }
    assert.equal(state.stats.grooms, groomed ? 1 : 0);
    return FLOOR - highestFeet;
  };
  const normal = jumpHeight(false);
  const groomed = jumpHeight(true);
  assert.ok(normal < 164, 'ordinary jump cannot reach the bedroom shelf');
  assert.ok(groomed > 164, 'groomed jump can reach the bedroom shelf');
  assert.ok(groomed > normal + 40);
});

test('only Nässla can boop a nearby bell jar', () => {
  for (const active of [0, 1]) {
    const state = createState(abilityRoom({ pots: [{ x: 110, y: FLOOR }] }));
    step(state, { switch: !!active, action: true });
    assert.equal(state.stats.boops, active === 0 ? 1 : 0);
    assert.equal(state.pots[0].booped, active === 0);
  }
});

test('an iron crate cannot move without a bagel, but a snack makes it pushable', () => {
  for (const hasBagel of [false, true]) {
    const state = createState(abilityRoom({ heavy: true, bagels: hasBagel ? [{ x: 425, y: FLOOR }] : [] }));
    step(state, { switch: true });
    for (let i = 0; i < 350; i++) step(state, { right: true, action: true });
    assert.equal(state.crate.settled, hasBagel);
    assert.equal(state.stats.pushes > 0, hasBagel);
    assert.equal(state.stats.snacks > 0, hasBagel);
    if (!hasBagel) assert.equal(state.crate.x, state.level.crateX);
  }
});

test('only Nässla can climb a scratching post', () => {
  const room = abilityRoom({
    platforms: [{ x: 295, y: 250, w: 200, h: 14 }],
    climbWalls: [{ x: 300, y: 250, w: 20, h: 230 }],
  });
  for (const active of [0, 1]) {
    const state = createState(room);
    if (active) step(state, { switch: true });
    while (state.cats[active].x < 309) step(state, { right: true });
    for (let i = 0; i < 100; i++) step(state, { jump: true });
    assert.equal(state.stats.climbs > 0, active === 0);
    if (active) assert.equal(state.cats[active].y, FLOOR);
    else assert.equal(state.cats[active].y, 250);
  }
});

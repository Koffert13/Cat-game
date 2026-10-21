import { createState, step, FLOOR } from '../src/simulation.js';

// This replay uses only the same five buttons available to a player. Route data
// tells it where to land; all movement, interactions and progress use step().
export function solveLevel(level, { record = false } = {}) {
  const state = createState(level);
  const inputs = [];
  const tick = (input = {}) => {
    if (record) inputs.push({ ...input });
    step(state, input);
  };
  const fail = (phase) => {
    throw new Error(`Level ${level.id}: ${phase} at tick ${state.tick}; cats=${JSON.stringify(state.cats.map(c => ({x:c.x,y:c.y,grounded:c.grounded})))}; crate=${JSON.stringify(state.crate)}; stats=${JSON.stringify(state.stats)}`);
  };
  const until = (predicate, control, budget, phase) => {
    for (let i = 0; i < budget && !predicate(); i++) tick(control(i));
    if (!predicate()) fail(phase);
  };
  const select = (index) => {
    if (state.active !== index) { tick({ switch: true }); tick(); }
  };
  const walk = (x, budget = 600) => {
    let lastX = null;
    until(() => state.won || Math.abs(state.cats[state.active].x - x) <= 4, () => {
      const c = state.cats[state.active];
      const blocked = lastX !== null && Math.abs(c.x - lastX) < 0.1;
      lastX = c.x;
      return { left: c.x > x, right: c.x < x, action: true,
        jump: c.grounded && blocked && !c.prevJump };
    }, budget, `walk to ${x}`);
  };
  if (level.requiresGroom) {
    select(1);
    tick({ action: true });
    select(0);
  }
  for (const point of level.route) {
    const c = state.cats[0];
    const ledge = level.platforms.find(p => Math.abs(p.y - point.y) < 2 && point.x >= p.x && point.x <= p.x + p.w);
    if (c.y > point.y + 5 && Math.abs(c.x - point.x) > 95) {
      let takeoff = point.x - Math.sign(point.x - c.x) * 90;
      const support = level.platforms.find(p => Math.abs(p.y - c.y) < 2 && c.x > p.x - c.w / 2 && c.x < p.x + p.w + c.w / 2);
      // A gap needs a leap from the current shelf, before walking off its edge.
      if (support) takeoff = Math.max(support.x + 2, Math.min(support.x + support.w - 2, takeoff));
      walk(takeoff);
    }
    tick(); // Release jump before each new leap.
    until(() => Math.abs(c.x - point.x) < 7 && (point.climb ? c.y <= point.y + 1 : Math.abs(c.y - point.y) < 3 && c.grounded),
      () => {
        // Stay beside a shelf until our feet clear its top. Charging beneath a
        // high shelf would hit its underside before the boosted jump peaks.
        const speed = c.groom ? 3.6 : 3;
        const rightUnder = !point.climb && ledge && c.y > point.y && c.x < ledge.x && c.x + c.w / 2 + speed > ledge.x;
        const leftUnder = !point.climb && ledge && c.y > point.y && c.x > ledge.x + ledge.w && c.x - c.w / 2 - speed < ledge.x + ledge.w;
        return { left: c.x > point.x + 2 && !leftUnder, right: c.x < point.x - 2 && !rightUnder,
          jump: !!point.climb || (c.grounded && c.y > point.y + 4 && !c.prevJump), action: true };
      },
      700, `route waypoint ${JSON.stringify(point)}`);
    tick({ action: true });
  }
  until(() => state.pots.every(p => p.activated), () => ({ action: true }), 800, 'boop and drop every bell');
  select(1);
  if (level.heavy) {
    const bagel = level.bagels[0];
    if (!bagel) fail('heavy crate has no reachable bagel');
    walk(bagel.x);
    until(() => state.cats[1].buff > 0, () => ({ action: true }), 30, 'collect bagel');
  }
  until(() => state.crate.settled, () => ({ right: true, action: true }), 1000, 'push crate into socket');
  walk(level.plateX);
  until(() => state.cats[1].grounded && Math.abs(state.cats[1].y - FLOOR) < 2,
    () => ({ action: true }), 200, 'land on pressure plate');
  select(0);
  walk(level.gateX + 54);
  until(() => state.cats[0].grounded && state.cats[0].y === FLOOR,
    () => ({ action: true }), 200, 'Nässla lands beyond door');
  until(() => state.doorPropped, () => ({ action: true }), 181, 'call human to prop door');
  select(1);
  walk(level.gateX + 54);
  until(() => state.won, () => ({ action: true }), 200, 'both cats finish');
  return { state, inputs };
}

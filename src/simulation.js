// The browser and the completion tests run this exact fixed-step simulation.
export const WIDTH = 960;
export const HEIGHT = 540;
export const FLOOR = 480;
export const STEP = 1 / 60;

const overlaps = (a, b) => a.x - a.w / 2 < b.x + b.w && a.x + a.w / 2 > b.x && a.y > b.y && a.y - a.h < b.y + b.h;
const near = (a, b, dx = 52, dy = 44) => Math.abs(a.x - b.x) < dx && Math.abs(a.y - b.y) < dy;

export function createState(level) {
  return {
    level, tick: 0, active: 0, won: false, doorPropped: false, gateOpen: false, meow: 0,
    cats: [
      { x: 90, y: FLOOR, w: 24, h: 28, vx: 0, vy: 0, grounded: true, coyote: 5, prevJump: false, facing: 1, groom: 0, invulnerable: 0 },
      { x: 132, y: FLOOR, w: 34, h: 27, vx: 0, vy: 0, grounded: true, coyote: 5, prevJump: false, facing: 1, buff: 0, invulnerable: 0 },
    ],
    pots: level.pots.map(p => ({ ...p, vx: 0, vy: 0, booped: false, activated: false })),
    crate: { x: level.crateX, y: FLOOR, w: 40, h: 40, settled: false },
    vacuums: (level.vacuums || []).map(v => ({ ...v, x: v.min, direction: 1, stun: 0 })),
    bagels: (level.bagels || []).map(b => ({ ...b, available: true })),
    stats: { boops: 0, pushes: 0, climbs: 0, grooms: 0, snacks: 0, plateTicks: 0, meows: 0, bumps: 0 },
    message: level.hint, messageAt: 0, prevSwitch: false, groomCooldown: 0,
  };
}

function say(s, message) { s.message = message; s.messageAt = s.tick; }
export function bellReady(s) { return s.pots.every(p => p.activated); }
export function plateHeld(s) {
  const m = s.cats[1];
  return Math.abs(m.x - s.level.plateX) < 27 && Math.abs(m.y - FLOOR) < 2;
}

function solids(s) {
  const blocks = [...s.level.platforms, { x: 0, y: FLOOR, w: WIDTH, h: 60 },
    { x: s.crate.x - 20, y: FLOOR - 40, w: 40, h: 40 }];
  if (!s.gateOpen) blocks.push({ x: s.level.gateX, y: 170, w: 18, h: FLOOR - 170 });
  return blocks;
}

function moveCat(s, c, i, input) {
  const active = s.active === i;
  const dir = active ? Number(!!input.right) - Number(!!input.left) : 0;
  const jump = active && !!input.jump;
  const action = active && !!input.action;
  c.invulnerable = Math.max(0, c.invulnerable - 1);
  c.groom = Math.max(0, (c.groom || 0) - 1);
  c.buff = Math.max(0, (c.buff || 0) - 1);
  c.coyote = c.grounded ? 5 : Math.max(0, c.coyote - 1);
  c.vx = dir * (i === 0 ? (c.groom ? 3.6 : 3) : (c.buff ? 3 : 2.5));
  if (dir) c.facing = dir;
  if (jump && !c.prevJump && c.coyote) {
    c.vy = i === 0 ? (c.groom ? -13.5 : -11.6) : -8.2;
    c.grounded = false;
    c.coyote = 0;
  }
  const wall = i === 0 && jump && (s.level.climbWalls || []).find(w => Math.abs(c.x - (w.x + w.w / 2)) < 28 && c.y > w.y + 2 && c.y <= w.y + w.h + 6);
  if (wall) {
    c.vy = -3.2;
    c.grounded = false;
    s.stats.climbs++;
  } else c.vy = Math.min(c.vy + 0.48, 13);

  // Only Maliketh can move the floor crate. A bagel is needed for iron crates.
  const crate = s.crate;
  const next = { ...c, x: c.x + c.vx };
  const crateRect = { x: crate.x - 20, y: FLOOR - 40, w: 40, h: 40 };
  if (dir && overlaps(next, crateRect) && c.y > FLOOR - 35) {
    if (i === 1 && action && !crate.settled && (!s.level.heavy || c.buff)) {
      const push = dir * (c.buff ? 2.4 : 1.65);
      crate.x = Math.max(450, Math.min(795, crate.x + push));
      s.stats.pushes++;
      if (Math.abs(crate.x - s.level.socketX) <= 3) {
        crate.x = s.level.socketX;
        crate.settled = true;
        say(s, 'Crate delivered! Maliketh can now hold the brass plate.');
      }
    } else if (action && i === 1 && s.level.heavy && !c.buff && !crate.settled) {
      say(s, 'An iron crate. Time for a bagel power-up.');
    }
  }

  c.x += c.vx;
  c.x = Math.max(c.w / 2 + 12, Math.min(WIDTH - 18, c.x));
  for (const b of solids(s)) {
    if (overlaps(c, b)) {
      if (c.vx > 0) c.x = b.x - c.w / 2;
      else if (c.vx < 0) c.x = b.x + b.w + c.w / 2;
    }
  }
  const oldY = c.y;
  c.y += c.vy;
  c.grounded = false;
  for (const b of solids(s)) {
    if (!overlaps(c, b)) continue;
    if (c.vy >= 0 && oldY <= b.y + 1) { c.y = b.y; c.vy = 0; c.grounded = true; }
    else if (c.vy < 0 && oldY - c.h >= b.y + b.h - 1) { c.y = b.y + b.h + c.h; c.vy = 0; }
  }
  c.prevJump = jump;

  if (i === 0 && action) {
    for (const p of s.pots) {
      if (!p.booped && near(c, p, 55, 42)) {
        p.booped = true; p.vx = 4.5; p.vy = -3;
        s.stats.boops++;
        say(s, 'Boop! One perfectly innocent little accident.');
      }
    }
  }
  if (i === 1 && action && near(c, s.cats[0], 56, 36) && !s.groomCooldown) {
    s.cats[0].groom = 2400;
    s.groomCooldown = 120;
    s.stats.grooms++;
    say(s, 'A quick groom. Nässla has extra speed and jump for 40 seconds!');
  }
}

export function step(s, input = {}) {
  if (s.won) return s;
  s.tick++;
  if (input.switch && !s.prevSwitch) s.active = 1 - s.active;
  s.prevSwitch = !!input.switch;
  s.groomCooldown = Math.max(0, s.groomCooldown - 1);
  s.gateOpen = s.doorPropped || (bellReady(s) && s.crate.settled && plateHeld(s));
  for (let i = 0; i < 2; i++) moveCat(s, s.cats[i], i, input);

  for (const p of s.pots) {
    if (!p.booped || p.activated) continue;
    const previous = p.y;
    p.x += p.vx;
    p.vy += 0.45;
    p.y += p.vy;
    for (const b of s.level.platforms) {
      if (p.x > b.x - 5 && p.x < b.x + b.w + 5 && previous <= b.y && p.y >= b.y && p.vy > 0) { p.y = b.y; p.vy = 0; }
    }
    if (p.y >= FLOOR) {
      p.y = FLOOR; p.activated = true;
      say(s, bellReady(s) ? 'The bell circuit is on. Now the crate and the pressure plate!' : 'One bell down. Find the next little object.');
    }
  }

  const m = s.cats[1];
  for (const b of s.bagels) {
    if (!b.available && !m.buff) b.available = true;
    if (b.available && near(m, b, 28, 30)) {
      b.available = false; m.buff = 1200; s.stats.snacks++;
      say(s, 'BAGEL POWER! Push iron crates and boop the vacuum with E.');
    }
  }
  for (const v of s.vacuums) {
    if (v.stun > 0) { v.stun--; continue; }
    v.x += v.direction * v.speed;
    if (v.x <= v.min || v.x >= v.max) { v.x = Math.max(v.min, Math.min(v.max, v.x)); v.direction *= -1; }
    if (Math.abs(v.x - s.crate.x) < 43) { v.direction = v.x < s.crate.x ? -1 : 1; v.x = s.crate.x + v.direction * 43; }
    for (let i = 0; i < 2; i++) {
      const c = s.cats[i];
      if (c.invulnerable || c.y < FLOOR - 18 || Math.abs(c.x - v.x) > 31) continue;
      if (i === 1 && c.buff && s.active === 1 && input.action) {
        v.stun = 240; say(s, 'Bagel-powered bravery. Vacuum paused!');
      } else {
        c.x = i === 0 ? 90 : 132; c.y = FLOOR; c.vx = 0; c.vy = 0; c.invulnerable = 100;
        s.stats.bumps++; say(s, 'Brrrp! Back to the welcome rug. Your puzzle progress is safe.');
      }
    }
  }
  if (plateHeld(s)) s.stats.plateTicks++;
  s.gateOpen = s.doorPropped || (bellReady(s) && s.crate.settled && plateHeld(s));
  const n = s.cats[0];
  if (!s.doorPropped && s.active === 0 && s.gateOpen && n.x > s.level.gateX + 30 && input.action) {
    s.meow++;
    if (s.meow >= 180) { s.doorPropped = true; s.stats.meows++; say(s, 'Meeeow. The human wedged the door open. Bring Maliketh!'); }
  } else if (!s.doorPropped) s.meow = 0;
  if (s.doorPropped && s.cats.every(c => c.x > s.level.gateX + 35 && c.y === FLOOR)) {
    s.won = true;
    say(s, 'Room conquered. Together, naturally.');
  }
  return s;
}

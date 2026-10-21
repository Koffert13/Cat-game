import Phaser from 'phaser';
import './style.css';
import { levels } from './levels.js';
import { createTextures, drawRoom } from './art.js';
import { WIDTH, HEIGHT, FLOOR, createState, step, bellReady, plateHeld } from './simulation.js';
import { loadProgress, saveProgress, unlockedCount } from './progress.js';

const $ = id => document.getElementById(id);
let storage;
try { storage = window.localStorage; } catch { storage = { getItem: () => null, setItem: () => { throw Error('Storage unavailable'); } }; }
const progress = loadProgress(storage, levels.length);
let roomIndex = progress.current;
let state = createState(levels[roomIndex]);
let scene;
let audioContext;
let previousMessage = '';
let switched = false;
const keys = new Set();
const pointers = new Map();
const modals = ['level-menu', 'help-menu', 'completion-menu'];
const paused = () => modals.some(id => !$(id).hidden);
const clearInput = () => { keys.clear(); pointers.clear(); document.querySelectorAll('.pressed').forEach(el => el.classList.remove('pressed')); };

function persist() {
  if (!saveProgress(storage, progress)) document.querySelector('.site-footer > span:last-child').textContent = 'Storage unavailable — progress lasts this visit';
}
function sound(frequency = 440, length = 0.1, end = frequency * 0.65) {
  if (!progress.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    void audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(end, audioContext.currentTime + length);
    gain.gain.setValueAtTime(0.07, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + length);
    oscillator.connect(gain); gain.connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + length);
  } catch { /* Audio is optional; gameplay never depends on device audio support. */ }
}
function closeModals() {
  modals.forEach(id => { $(id).hidden = true; });
  clearInput();
  $('game').focus({ preventScroll: true });
}
function openModal(id) {
  closeModals(); clearInput();
  $(id).hidden = false;
  $(id).querySelector('button:not(:disabled)')?.focus({ preventScroll: true });
}
function switchCat() {
  if (paused() || state.won) return;
  switched = true; clearInput(); sound(480, 0.13, 680);
  $('game').focus({ preventScroll: true });
}
function startRoom(index) {
  roomIndex = index;
  progress.current = index;
  persist(); closeModals(); previousMessage = '';
  state = createState(levels[index]);
  switched = false;
  scene?.scene.restart();
  updateJournal();
}
function showLevels() {
  const grid = $('level-grid');
  grid.replaceChildren();
  const unlocked = unlockedCount(progress.completed, levels.length);
  levels.forEach((level, index) => {
    const button = document.createElement('button');
    button.className = `level-card${index === roomIndex ? ' current' : ''}`;
    button.disabled = index >= unlocked;
    button.type = 'button';
    button.setAttribute('aria-current', String(index === roomIndex));
    const number = document.createElement('span'); number.className = 'level-index'; number.textContent = String(level.id).padStart(2, '0');
    const body = document.createElement('span');
    const title = document.createElement('span'); title.className = 'level-name'; title.textContent = level.room;
    const detail = document.createElement('small'); detail.textContent = button.disabled ? 'LOCKED · COMPLETE THE PREVIOUS ROOM' : progress.completed.includes(level.id) ? 'COMPLETE · PLAY AGAIN' : level.lesson.toUpperCase();
    body.append(title, detail); button.append(number, body);
    button.addEventListener('click', () => startRoom(index)); grid.append(button);
  });
  openModal('level-menu');
}
function updateJournal() {
  const l = state.level;
  $('room-name').textContent = l.room;
  $('room-copy').textContent = l.subtitle;
  $('level-number').textContent = `${String(l.id).padStart(2, '0')} / ${String(levels.length).padStart(2, '0')}`;
  const isNassla = state.active === 0;
  $('cat-name').textContent = isNassla ? 'Nässla' : 'Maliketh';
  document.querySelector('.cat-card').dataset.cat = isNassla ? 'nassla' : 'maliketh';
  $('cat-description').textContent = isNassla ? 'Little paws. Big jumps. An excellent eye for things that belong on the floor.' : 'A round boy with a strong push. Patient, food-motivated, and surprisingly resourceful.';
  const c = state.cats[state.active];
  $('buff-status').textContent = isNassla ? (c.groom ? `Freshly groomed · ${Math.ceil(c.groom / 60)}s of extra bounce` : 'High jump · climb · boop') : (c.buff ? `Bagel power · ${Math.ceil(c.buff / 60)}s remaining` : 'Push · hold plates · groom Nässla');
  const objectives = [
    ['objective-boop', `Nässla: boop ${state.pots.length > 1 ? `all ${state.pots.length} bell jars` : 'the bell jar'} off the shelves.`, bellReady(state)],
    ['objective-plate', state.crate.settled ? 'Maliketh: stand on the brass plate.' : `Maliketh: ${l.heavy ? 'eat a bagel, then ' : ''}push the crate onto its outline.`, state.crate.settled && (plateHeld(state) || state.doorPropped)],
    ['objective-exit', state.doorPropped ? 'Door wedged! Bring both cats through.' : 'Nässla: cross the gate, hold E / ACT to meow for 3s.', state.won],
  ];
  objectives.forEach(([id, text, done]) => { $(id).textContent = text; $(id).parentElement.classList.toggle('done', done); });
  if (previousMessage !== state.message) {
    $('status-message').textContent = state.message;
    if (previousMessage) sound(state.message.startsWith('Boop') ? 1100 : 620, .15);
    previousMessage = state.message;
  }
}

class Apartment extends Phaser.Scene {
  constructor() { super('apartment'); }
  create() {
    scene = this;
    this.accumulator = 0;
    this.lastJournalTick = -6;
    createTextures(this);
    drawRoom(this, state.level);
    const g = this.add.graphics();
    for (const p of state.level.platforms) {
      g.fillStyle(0x514b38).fillRect(p.x, p.y, p.w, p.h);
      g.fillStyle(0xbe9767).fillRect(p.x, p.y, p.w, 5);
      g.fillStyle(0xe2c390).fillRect(p.x + 3, p.y, p.w - 6, 2);
      g.fillStyle(0x776c50).fillRect(p.x + 12, p.y + p.h, 5, 13).fillRect(p.x + p.w - 17, p.y + p.h, 5, 13);
    }
    for (const w of state.level.climbWalls) {
      g.fillStyle(0x9f7953).fillRect(w.x, w.y, w.w, w.h);
      for (let y = w.y + 3; y < w.y + w.h; y += 8) g.fillStyle(0xe5c28e).fillRect(w.x, y, w.w, 3);
      this.label(w.x + w.w / 2, w.y - 18, 'CLIMB ↑', '#786d50', 10);
    }
    const gate = state.level.gateX;
    // Exit arch and its little brass latch.
    g.fillStyle(0x626a50).fillRect(gate + 18, 325, 85, 155);
    g.fillStyle(0xa6b391).fillRect(gate + 26, 333, 68, 147);
    g.fillStyle(0xc4ccaa).fillRect(gate + 31, 338, 57, 136);
    g.fillStyle(0x879775).fillRect(gate + 36, 350, 47, 73).fillRect(gate + 36, 436, 47, 28);
    g.fillStyle(0xe2c073).fillRect(gate + 76, 425, 7, 6);
    this.label(gate + 60, 308, 'TOGETHER →', '#5a6a4e', 10);
    this.label(35, 30, `ROOM ${String(state.level.id).padStart(2, '0')}`, '#6e725e', 11, 0);
    this.label(35, 49, state.level.name, '#49583f', 18, 0);
    this.label(state.level.socketX, FLOOR + 31, 'CRATE', '#8b7859', 9);
    this.label(state.level.plateX, FLOOR + 31, 'HOLD', '#8b7859', 9);
    this.label(112, FLOOR + 37, 'HOME IS A TEAM SPORT', '#9a8665', 8);
    this.effects = this.add.graphics().setDepth(6);
    this.catSprites = state.cats.map((c, i) => this.add.image(c.x, c.y, i === 0 ? 'nassla' : 'maliketh').setOrigin(.5, 1).setDepth(10));
    this.catNames = ['NÄSSLA', 'MALIKETH'].map(name => this.label(0, 0, name, '#58624c', 9).setDepth(11));
    this.potSprites = state.pots.map(p => this.add.image(p.x, p.y, 'pot').setOrigin(.5, 1).setDepth(5));
    this.crateSprite = this.add.image(state.crate.x, FLOOR, state.level.heavy ? 'heavyCrate' : 'crate').setOrigin(.5, 1).setDepth(5);
    this.bagelSprites = state.bagels.map(b => this.add.image(b.x, b.y, 'bagel').setOrigin(.5, 1).setDepth(5));
    this.vacuumSprites = state.vacuums.map(v => this.add.image(v.x, FLOOR, 'vacuum').setOrigin(.5, 1).setDepth(7));
    this.prompt = this.label(480, 100, '', '#354934', 11).setDepth(20).setPadding(6, 4).setBackgroundColor('#f9f3df');
    this.renderState();
    updateJournal();
    $('game').focus({ preventScroll: true });
  }
  label(x, y, text, color, size, origin = .5) {
    return this.add.text(x, y, text, { fontFamily: 'monospace', fontSize: `${size}px`, color, resolution: 2 }).setOrigin(origin, .5);
  }
  update(_time, delta) {
    if (paused()) { this.accumulator = 0; return; }
    this.accumulator += Math.min(delta, 100);
    while (this.accumulator >= 1000 / 60) {
      const held = new Set([...keys, ...pointers.values()]);
      step(state, { left: held.has('left'), right: held.has('right'), jump: held.has('jump'), action: held.has('action'), switch: switched });
      switched = false;
      this.accumulator -= 1000 / 60;
    }
    this.renderState();
    if (state.tick - this.lastJournalTick >= 6) {
      updateJournal();
      this.lastJournalTick = state.tick;
    }
    if (state.won) {
      if (!progress.completed.includes(state.level.id)) progress.completed.push(state.level.id);
      persist(); updateJournal(); sound(660, .35, 1320);
      const finalRoom = roomIndex === levels.length - 1;
      $('completion-title').textContent = finalRoom ? 'Home, sweet home.' : 'A fine piece of teamwork.';
      $('completion-copy').textContent = finalRoom ? 'Ten rooms, two very good cats. The apartment is yours. Replay any room to make a little more mischief.' : `${state.level.room} is conquered. ${state.stats.bumps ? 'Even the vacuum couldn’t stop this pair.' : 'Not a whisker out of place.'} Your progress is saved.`;
      $('next-level').textContent = finalRoom ? 'Explore your apartment →' : 'On to the next room →';
      openModal('completion-menu');
    }
  }
  renderState() {
    const g = this.effects; g.clear();
    const socket = state.level.socketX;
    g.lineStyle(2, state.crate.settled ? 0x698753 : 0xc6a976, .9).strokeRect(socket - 22, FLOOR - 42, 44, 42);
    for (let x = socket - 16; x < socket + 20; x += 10) g.fillStyle(0xc6a976, .45).fillRect(x, FLOOR - 4, 5, 4);
    const held = plateHeld(state);
    g.fillStyle(0x6c654a).fillRect(state.level.plateX - 27, FLOOR - 3, 54, 6);
    g.fillStyle(held || state.doorPropped ? 0x90ae69 : 0xe0b66e).fillRect(state.level.plateX - 24, FLOOR - (held ? 2 : 5), 48, 4);
    const gate = state.level.gateX;
    if (!state.gateOpen) {
      g.fillStyle(0x545c47).fillRect(gate, 170, 18, FLOOR - 170);
      g.fillStyle(0x9ca380).fillRect(gate + 4, 174, 4, FLOOR - 174);
      g.fillStyle(0xd4b275).fillRect(gate - 4, 398, 26, 8);
    } else g.fillStyle(0x92ad78).fillRect(gate, 170, 18, 13);
    // Three tiny lamps show the bell, crate, and pressure-plate circuit.
    [bellReady(state), state.crate.settled, held || state.doorPropped].forEach((on, i) => {
      g.fillStyle(0x59614b).fillRect(gate - 9 + i * 13, 151, 10, 10);
      g.fillStyle(on ? 0xa1bd6b : 0xb6a78a).fillRect(gate - 7 + i * 13, 153, 6, 6);
    });
    this.crateSprite.setX(state.crate.x);
    state.pots.forEach((p, i) => {
      this.potSprites[i].setPosition(p.x, p.y).setAngle(p.booped && !p.activated ? (state.tick * 6) % 360 : 0).setScale(p.activated ? .5 : 1).setAlpha(p.activated ? .45 : 1);
      if (!p.booped) { g.fillStyle(0xe9c96f).fillRect(p.x - 2, p.y - 41 + Math.floor(Math.sin(state.tick / 18) * 2), 4, 6); }
    });
    state.bagels.forEach((b, i) => this.bagelSprites[i].setVisible(b.available).setY(b.y - 4 + Math.sin(state.tick / 18) * 2));
    state.vacuums.forEach((v, i) => { this.vacuumSprites[i].setX(v.x).setAlpha(v.stun ? .5 : 1); if (v.stun) this.labelOnceStun(g, v); });
    state.cats.forEach((c, i) => {
      const active = i === state.active;
      const idle = !active && Math.abs(c.vx) < .1 && c.grounded;
      const texture = i === 0 ? (state.tick % 180 > 169 ? 'nasslaBlink' : 'nassla') : (idle ? 'malikethSleep' : 'maliketh');
      const sprite = this.catSprites[i];
      sprite.setTexture(texture).setPosition(c.x, c.y).setFlipX(c.facing < 0).setAlpha(c.invulnerable && state.tick % 8 < 4 ? .4 : 1);
      sprite.setScale(1, c.grounded && c.vx ? 1 + Math.sin(state.tick * .6) * .035 : 1);
      g.fillStyle(0x5e5848, .15).fillRect(c.x - c.w / 2, c.y, c.w, 3);
      this.catNames[i].setPosition(c.x, c.y - 45).setAlpha(active ? 1 : .45);
      if (active) {
        g.fillStyle(0x43583c).fillTriangle(c.x - 4, c.y - 59, c.x + 4, c.y - 59, c.x, c.y - 54);
        g.fillStyle(0xf7edbf, .4).fillRect(c.x - 17, c.y + 1, 34, 2);
      }
      if (c.groom || c.buff) {
        const offset = Math.floor(Math.sin(state.tick / 12) * 3);
        g.fillStyle(c.buff ? 0xd99b4d : 0xc3918c).fillRect(c.x - 22, c.y - 17 + offset, 3, 3).fillRect(c.x + 19, c.y - 31 - offset, 3, 3);
      }
      if (idle && i === 1 && state.tick % 360 < 30) g.fillStyle(0xc5945d).fillRect(c.x - 24, c.y - 8 - (state.tick % 12 > 6 ? 3 : 0), 10, 4);
    });
    const c = state.cats[state.active];
    let prompt = '';
    if (state.active === 0 && state.pots.some(p => !p.booped && Math.abs(c.x - p.x) < 55 && Math.abs(c.y - p.y) < 42)) prompt = 'E / ACT · BOOP';
    else if (state.active === 1 && !state.crate.settled && Math.abs(c.x - state.crate.x) < 66 && c.y > FLOOR - 40) prompt = state.level.heavy && !c.buff ? 'FIND A BAGEL FIRST' : 'E / ACT + → · PUSH';
    else if (state.active === 1 && Math.abs(c.x - state.cats[0].x) < 56 && Math.abs(c.y - state.cats[0].y) < 36) prompt = 'E / ACT · GROOM NÄSSLA';
    else if (state.active === 0 && c.x > gate + 30 && !state.doorPropped) prompt = `HOLD E / ACT · MEOW ${Math.ceil((180 - state.meow) / 60)}s`;
    else if (state.active === 1 && held && !state.doorPropped) prompt = 'STAY HERE · SWITCH TO NÄSSLA';
    this.prompt.setText(prompt).setVisible(!!prompt).setPosition(Math.max(130, Math.min(WIDTH - 140, c.x)), c.y - 85);
    if (state.meow && !state.doorPropped) { g.fillStyle(0xf8eed3).fillRect(gate + 27, 290, 64, 5); g.fillStyle(0x8b9e65).fillRect(gate + 27, 290, 64 * state.meow / 180, 5); }
  }
  labelOnceStun(g, v) { g.fillStyle(0xc69d60).fillRect(v.x - 8, FLOOR - 34, 4, 4).fillRect(v.x + 8, FLOOR - 39, 4, 4); }
}

const mappings = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'jump', w: 'jump', W: 'jump', ' ': 'jump', e: 'action', E: 'action' };
window.addEventListener('keydown', event => {
  if (paused()) {
    if (event.key === 'Escape' && $('completion-menu').hidden) closeModals();
    if (event.key === 'Tab') {
      const modal = modals.map($).find(el => !el.hidden);
      const buttons = [...modal.querySelectorAll('button:not(:disabled)')];
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    return;
  }
  if (event.key === ' ' && document.activeElement?.tagName === 'BUTTON') return;
  if (mappings[event.key]) { event.preventDefault(); keys.add(mappings[event.key]); }
  if (['q', 'Q'].includes(event.key) || (event.key === 'Tab' && document.activeElement === $('game'))) {
    event.preventDefault(); if (!event.repeat) switchCat();
  }
  if (['r', 'R'].includes(event.key) && !event.repeat) startRoom(roomIndex);
});
window.addEventListener('keyup', event => { if (mappings[event.key]) keys.delete(mappings[event.key]); });
window.addEventListener('blur', clearInput);
document.addEventListener('visibilitychange', () => { if (document.hidden) clearInput(); });
for (const button of document.querySelectorAll('[data-control]')) {
  button.addEventListener('pointerdown', e => {
    e.preventDefault(); if (paused()) return;
    button.setPointerCapture(e.pointerId); pointers.set(e.pointerId, button.dataset.control); button.classList.add('pressed');
  });
  const release = e => { pointers.delete(e.pointerId); button.classList.remove('pressed'); };
  button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
}
$('touch-switch').addEventListener('click', switchCat);
$('switch-cat').addEventListener('click', switchCat);
$('open-levels').addEventListener('click', showLevels);
$('close-levels').addEventListener('click', closeModals);
$('help-toggle').addEventListener('click', () => openModal('help-menu'));
$('close-help').addEventListener('click', closeModals);
$('restart-level').addEventListener('click', () => startRoom(roomIndex));
$('completion-levels').addEventListener('click', showLevels);
$('next-level').addEventListener('click', () => roomIndex < levels.length - 1 ? startRoom(roomIndex + 1) : showLevels());
function updateSoundButton() { $('toggle-sound').textContent = progress.sound ? 'Sound on' : 'Sound off'; $('toggle-sound').setAttribute('aria-pressed', String(progress.sound)); }
$('toggle-sound').addEventListener('click', () => { progress.sound = !progress.sound; persist(); updateSoundButton(); sound(); });
updateSoundButton();

new Phaser.Game({
  type: Phaser.AUTO, parent: 'game', width: WIDTH, height: HEIGHT, backgroundColor: '#e0d9bd',
  pixelArt: true, roundPixels: true, antialias: false,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: Apartment, input: { keyboard: false, touch: false, mouse: false },
  render: { transparent: false },
});

// Read-only diagnostic snapshot, useful for accessibility tooling and browser smoke tests.
Object.defineProperty(window, 'catGame', { get: () => ({ tick: state.tick, level: state.level.id, active: state.active, cats: state.cats.map(c => ({ x: c.x, y: c.y })), won: state.won, paused: paused(), completed: [...progress.completed] }) });

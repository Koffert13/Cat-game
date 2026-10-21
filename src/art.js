/** All visual assets are drawn here, one chunky pixel at a time. No image downloads. */
const INK = 0x343d3c;

function box(g, x, y, w, h, color, alpha = 1) {
  g.fillStyle(color, alpha).fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function stepped(g, x, y, w, h, color, step = 3, alpha = 1) {
  box(g, x + step, y, w - step * 2, h, color, alpha);
  box(g, x, y + step, w, h - step * 2, color, alpha);
}

function texture(scene, name, width, height, draw) {
  if (scene.textures.exists(name)) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  draw(g);
  g.generateTexture(name, width, height);
  g.destroy();
}

function greyCat(g, blink = false) {
  // Long body, big ears, slender feet, and a question-mark tail.
  box(g, 2, 16, 3, 11, INK);
  box(g, 3, 12, 4, 6, INK);
  box(g, 5, 11, 4, 4, INK);
  box(g, 3, 17, 2, 8, 0x929d9d);
  box(g, 5, 13, 3, 3, 0xa7b1b0);
  stepped(g, 7, 16, 18, 13, INK, 3);
  stepped(g, 8, 15, 16, 12, 0x899594, 3);
  box(g, 10, 17, 11, 8, 0xa0aaa7);
  box(g, 16, 19, 7, 8, 0xc5cbc2);
  box(g, 9, 26, 5, 5, INK);
  box(g, 19, 25, 5, 6, INK);
  box(g, 10, 26, 3, 4, 0x9ba5a2);
  box(g, 20, 25, 3, 5, 0xc5cbc2);
  box(g, 10, 2, 3, 7, INK);
  box(g, 12, 4, 3, 5, INK);
  box(g, 24, 1, 3, 8, INK);
  box(g, 22, 4, 3, 5, INK);
  box(g, 11, 4, 2, 4, 0xc6a19a);
  box(g, 24, 3, 2, 4, 0xc6a19a);
  stepped(g, 9, 7, 20, 14, INK, 3);
  stepped(g, 10, 7, 18, 13, 0xaab3ad, 3);
  box(g, 11, 8, 5, 5, 0x899594);
  box(g, 23, 8, 4, 5, 0x899594);
  box(g, 16, 8, 5, 3, 0xc5cbc2);
  if (blink) {
    box(g, 13, 13, 4, 1, INK);
    box(g, 23, 13, 4, 1, INK);
  } else {
    box(g, 12, 11, 6, 5, 0xe8e5bb);
    box(g, 22, 11, 6, 5, 0xe8e5bb);
    box(g, 15, 11, 2, 5, INK);
    box(g, 25, 11, 2, 5, INK);
    box(g, 14, 11, 1, 1, 0xffffff);
    box(g, 24, 11, 1, 1, 0xffffff);
  }
  box(g, 18, 16, 4, 3, 0xe1dfce);
  box(g, 19, 16, 2, 1, 0xbc827d);
  box(g, 20, 18, 1, 1, INK);
  box(g, 8, 16, 5, 1, 0xd9ddd0);
  box(g, 26, 16, 5, 1, 0xd9ddd0);
  box(g, 8, 18, 4, 1, 0xd9ddd0);
  box(g, 27, 18, 4, 1, 0xd9ddd0);
  box(g, 14, 21, 10, 2, 0x7e9690);
  box(g, 20, 23, 2, 2, 0xdab66b);
}

function gingerCat(g, sleeping = false) {
  if (sleeping) {
    stepped(g, 5, 12, 32, 17, INK, 5);
    stepped(g, 6, 12, 30, 16, 0xbc8654, 5);
    box(g, 9, 14, 21, 11, 0xd7a367);
    box(g, 8, 19, 6, 8, 0x996a45);
    box(g, 12, 23, 17, 5, 0xae754d);
    box(g, 26, 10, 3, 6, INK);
    box(g, 33, 11, 3, 6, INK);
    stepped(g, 22, 15, 16, 11, 0xe2b77a, 3);
    box(g, 25, 19, 3, 1, INK);
    box(g, 33, 19, 3, 1, INK);
    box(g, 30, 22, 2, 1, 0xa66a61);
    box(g, 13, 12, 3, 5, 0x976544);
    box(g, 19, 12, 3, 5, 0x976544);
    return;
  }
  box(g, 1, 18, 3, 8, INK);
  box(g, 3, 23, 9, 5, INK);
  box(g, 2, 18, 2, 7, 0xc18b57);
  box(g, 4, 24, 7, 3, 0xc18b57);
  box(g, 2, 20, 2, 2, 0x8d6246);
  stepped(g, 7, 13, 25, 17, INK, 4);
  stepped(g, 8, 13, 23, 16, 0xc8945e, 4);
  box(g, 11, 15, 17, 10, 0xdba76a);
  box(g, 23, 21, 7, 7, 0xe9c18a);
  box(g, 11, 28, 6, 3, INK);
  box(g, 25, 28, 6, 3, INK);
  box(g, 12, 28, 4, 2, 0xe5b77d);
  box(g, 26, 28, 4, 2, 0xe5b77d);
  box(g, 11, 15, 3, 7, 0x9a6b47);
  box(g, 17, 14, 3, 8, 0x9a6b47);
  box(g, 13, 5, 4, 7, INK);
  box(g, 29, 4, 4, 8, INK);
  box(g, 14, 7, 2, 4, 0xc99480);
  box(g, 30, 6, 2, 4, 0xc99480);
  stepped(g, 11, 9, 26, 17, INK, 4);
  stepped(g, 12, 9, 24, 16, 0xe2b378, 4);
  box(g, 18, 10, 3, 5, 0x9a6b47);
  box(g, 24, 9, 3, 6, 0x9a6b47);
  box(g, 29, 10, 3, 4, 0x9a6b47);
  box(g, 14, 16, 6, 4, 0xe8dfa9);
  box(g, 27, 16, 6, 4, 0xe8dfa9);
  box(g, 17, 16, 2, 4, INK);
  box(g, 30, 16, 2, 4, INK);
  box(g, 14, 15, 6, 1, 0xa87650);
  box(g, 27, 15, 6, 1, 0xa87650);
  box(g, 19, 20, 11, 5, 0xf0d2a1);
  box(g, 23, 20, 3, 2, 0xa76f61);
  box(g, 24, 23, 1, 1, INK);
  box(g, 10, 20, 5, 1, 0xf0d2a1);
  box(g, 33, 20, 6, 1, 0xf0d2a1);
  box(g, 11, 23, 5, 1, 0xf0d2a1);
  box(g, 34, 23, 5, 1, 0xf0d2a1);
}

export function createTextures(scene) {
  texture(scene, 'nassla', 32, 32, g => greyCat(g));
  texture(scene, 'nasslaBlink', 32, 32, g => greyCat(g, true));
  texture(scene, 'maliketh', 40, 32, g => gingerCat(g));
  texture(scene, 'malikethSleep', 40, 32, g => gingerCat(g, true));
  for (const [name, heavy] of [['crate', false], ['heavyCrate', true]]) {
    texture(scene, name, 40, 40, g => {
      box(g, 1, 2, 38, 37, INK);
      box(g, 3, 3, 34, 34, heavy ? 0x778e83 : 0xbe8e59);
      box(g, 5, 5, 30, 4, heavy ? 0xa3b5a1 : 0xe4bc7c);
      box(g, 5, 11, 30, 22, heavy ? 0x698074 : 0xac7b4e);
      box(g, 5, 11, 3, 22, heavy ? 0x849b8a : 0xd5a56a);
      box(g, 31, 11, 4, 22, heavy ? 0x556f68 : 0x976a47);
      box(g, 5, 34, 30, 3, heavy ? 0x526d64 : 0x936646);
      if (heavy) {
        box(g, 6, 5, 4, 32, 0x424e4a);
        box(g, 30, 5, 4, 32, 0x424e4a);
        for (const x of [7, 31]) for (const y of [7, 32]) box(g, x, y, 2, 2, 0xc2b883);
        box(g, 14, 18, 12, 10, 0xc1bd8c);
        box(g, 17, 15, 6, 3, 0xc1bd8c);
        box(g, 18, 18, 4, 7, 0x526d64);
      } else {
        for (let i = 0; i < 6; i++) box(g, 8 + i * 4, 12 + i * 3, 5, 5, 0xd5a56a);
        box(g, 8, 14, 2, 2, 0x715745);
        box(g, 30, 29, 2, 2, 0x715745);
      }
    });
  }
  texture(scene, 'bagel', 24, 24, g => {
    stepped(g, 2, 3, 20, 18, 0x6a4f3b, 5);
    stepped(g, 3, 3, 18, 16, 0xc68b48, 4);
    stepped(g, 5, 4, 14, 12, 0xe6b968, 3);
    box(g, 8, 8, 8, 7, 0xa96c39);
    box(g, 10, 9, 5, 5, 0x5a4937);
    box(g, 7, 5, 3, 1, 0xffe2a0);
    box(g, 15, 6, 2, 1, 0xffe2a0);
    box(g, 5, 11, 1, 3, 0xffe2a0);
    box(g, 17, 13, 2, 1, 0xffe2a0);
    box(g, 10, 16, 3, 1, 0xffe2a0);
  });
  texture(scene, 'pot', 24, 28, g => {
    // A little brass bell under glass: a very tempting object to boop.
    box(g, 10, 1, 4, 3, 0x7e9785);
    box(g, 7, 4, 10, 2, 0x7e9785);
    box(g, 5, 6, 14, 3, 0x9db5a4);
    box(g, 3, 9, 18, 15, 0x7e9785);
    box(g, 5, 9, 14, 14, 0xc8d4b5);
    box(g, 6, 9, 2, 11, 0xf1f0d8);
    box(g, 11, 11, 3, 3, 0x987443);
    box(g, 9, 14, 7, 6, 0xc99850);
    box(g, 8, 19, 9, 2, 0xe8c477);
    box(g, 11, 21, 3, 2, 0x987443);
    box(g, 2, 24, 20, 3, 0x826645);
    box(g, 3, 24, 18, 1, 0xd9b77b);
  });
  texture(scene, 'vacuum', 46, 24, g => {
    stepped(g, 1, 5, 44, 16, INK, 5);
    stepped(g, 2, 4, 42, 14, 0x72817b, 5);
    box(g, 7, 5, 32, 9, 0xa8afa1);
    box(g, 11, 5, 24, 3, 0xcbd0ba);
    box(g, 7, 15, 32, 3, 0x3c4946);
    box(g, 8, 19, 6, 3, 0x272f30);
    box(g, 32, 19, 6, 3, 0x272f30);
    box(g, 18, 4, 11, 7, 0x4b6058);
    box(g, 20, 5, 7, 4, 0x9baa8c);
    box(g, 36, 11, 5, 3, 0xe4a17b);
    box(g, 0, 15, 5, 1, 0x67746e);
    box(g, 41, 15, 5, 1, 0x67746e);
  });
  texture(scene, 'plant', 40, 64, g => {
    box(g, 19, 13, 3, 35, 0x5a7259);
    box(g, 10, 27, 11, 3, 0x5a7259);
    box(g, 21, 20, 10, 3, 0x5a7259);
    stepped(g, 5, 18, 14, 12, 0x637e5d, 3);
    stepped(g, 23, 10, 13, 13, 0x789264, 3);
    stepped(g, 12, 2, 12, 15, 0x91a574, 3);
    stepped(g, 24, 29, 13, 10, 0x526f57, 3);
    box(g, 9, 21, 3, 6, 0x9baa78);
    box(g, 27, 12, 3, 7, 0xb1ba87);
    box(g, 10, 43, 22, 5, 0x8b6352);
    box(g, 12, 48, 18, 11, 0xbf8b6d);
    box(g, 15, 59, 12, 4, 0x8b6352);
    box(g, 14, 49, 3, 9, 0xd8a582);
  });
  texture(scene, 'paw', 16, 16, g => {
    stepped(g, 4, 8, 9, 7, 0xf1dfb5, 2);
    box(g, 1, 4, 3, 4, 0xf1dfb5);
    box(g, 5, 1, 3, 5, 0xf1dfb5);
    box(g, 10, 1, 3, 5, 0xf1dfb5);
    box(g, 14, 5, 2, 4, 0xf1dfb5);
  });
}

const THEMES = {
  hallway: { wall: 0xe6ddc5, lower: 0xb8c2a1, trim: 0x899578, floor: 0xb48e66, accent: 0x6c8067 },
  kitchen: { wall: 0xe9e1c8, lower: 0xb6bfa5, trim: 0x869b83, floor: 0xc1a27d, accent: 0x79917c },
  living: { wall: 0xe6dac3, lower: 0xc8bda2, trim: 0xa39478, floor: 0xb7936b, accent: 0x7f8d70 },
  bedroom: { wall: 0xe5d8cd, lower: 0xbab5bc, trim: 0x9595a1, floor: 0xb9967e, accent: 0x9c8e9c },
  bathroom: { wall: 0xe4e7d9, lower: 0xb7ccc1, trim: 0x8ba99b, floor: 0x9db6a9, accent: 0x7d9f9a },
  study: { wall: 0xe1d7be, lower: 0xb7bb9c, trim: 0x8c9877, floor: 0xad8968, accent: 0x9a9975 },
  laundry: { wall: 0xe5e4cf, lower: 0xc3c7b2, trim: 0x9aa58c, floor: 0xbaa88b, accent: 0x8d9e86 },
  catwall: { wall: 0xe7d4bc, lower: 0xc0b79c, trim: 0xa39579, floor: 0xb58a62, accent: 0xae886b },
  balcony: { wall: 0xdbe3d0, lower: 0xb0c1a3, trim: 0x829b7d, floor: 0xa79676, accent: 0x7b9b7c },
  attic: { wall: 0xdcd4bf, lower: 0xb8baa0, trim: 0x929b7d, floor: 0xb18d67, accent: 0x8e9973 },
};

function window(g, x, y, w, h, palette, evening = false) {
  box(g, x - 8, y - 8, w + 16, h + 18, palette.trim, 0.6);
  box(g, x - 4, y - 4, w + 8, h + 10, 0xf5ecd6);
  box(g, x, y, w, h, evening ? 0xaeb9b8 : 0xbacfc7);
  box(g, x + 2, y + 2, w - 4, h * 0.4, evening ? 0xbec2c1 : 0xcaddd1);
  // Distant Stockholm rooflines and birches.
  box(g, x, y + h - 29, 22, 29, 0x9dad9d);
  box(g, x + 5, y + h - 34, 12, 5, 0x9dad9d);
  box(g, x + w - 34, y + h - 37, 34, 37, 0xa5b5a2);
  box(g, x + w - 28, y + h - 43, 20, 6, 0xa5b5a2);
  for (let yy = y + h - 24; yy < y + h - 6; yy += 10) {
    for (const xx of [x + 7, x + w - 24, x + w - 12]) box(g, xx, yy, 4, 5, 0xe9dec2);
  }
  box(g, x + w / 2 - 3, y, 6, h, 0xf5ecd6);
  box(g, x, y + h * 0.52, w, 5, 0xf5ecd6);
  box(g, x - 9, y + h + 5, w + 18, 5, 0xc8b799);
  // Cream linen curtains, intentionally restrained behind the game.
  box(g, x - 14, y - 12, w + 28, 3, palette.trim);
  box(g, x - 12, y - 7, 20, h + 11, 0xe6d6b4, 0.9);
  box(g, x + w - 8, y - 7, 20, h + 11, 0xe6d6b4, 0.9);
  for (const xx of [x - 10, x - 2, x + w - 6, x + w + 2]) box(g, xx, y - 4, 3, h + 6, 0xcfbf9f, 0.45);
  box(g, x - 13, y + h * 0.65, 19, 4, palette.accent, 0.5);
  box(g, x + w - 6, y + h * 0.65, 19, 4, palette.accent, 0.5);
}

function picture(g, x, y, w, h, palette, variant = 0) {
  box(g, x + 2, y + 3, w, h, 0x766a57, 0.14);
  box(g, x, y, w, h, 0xa39374, 0.75);
  box(g, x + 3, y + 3, w - 6, h - 6, 0xf3e8cd);
  box(g, x + 7, y + 7, w - 14, h - 14, variant ? 0xc6c8a8 : 0xd6bea1);
  if (variant % 2 === 0) {
    // A tiny, rectangular abstract landscape print.
    box(g, x + 7, y + h * 0.59, w - 14, h * 0.25, 0x8f9e7e);
    box(g, x + 10, y + h * 0.45, w * 0.35, h * 0.28, 0xaeb396);
    stepped(g, x + w * 0.57, y + 12, 11, 11, 0xf2d6a0, 3);
  } else {
    box(g, x + w * 0.48, y + h * 0.36, 3, h * 0.42, 0x798c68);
    stepped(g, x + w * 0.25, y + h * 0.31, w * 0.28, 10, 0x8d9b78, 3);
    stepped(g, x + w * 0.51, y + h * 0.45, w * 0.27, 10, 0x8d9b78, 3);
    stepped(g, x + w * 0.39, y + h * 0.16, w * 0.23, 13, 0xa2ae88, 3);
  }
}

function lamp(g, x, palette) {
  box(g, x, 27, 2, 45, palette.trim, 0.7);
  box(g, x - 8, 70, 18, 5, palette.accent, 0.65);
  box(g, x - 15, 75, 32, 8, palette.accent, 0.65);
  box(g, x - 21, 83, 44, 6, palette.accent, 0.65);
  box(g, x - 15, 89, 32, 3, 0xf4dfac, 0.95);
  box(g, x - 5, 92, 12, 3, 0xf9ecc8, 0.8);
}

function sofa(g, x, palette) {
  const y = 395;
  box(g, x + 13, y, 138, 61, palette.accent, 0.32);
  box(g, x + 18, y + 5, 128, 31, 0xd0d0ac, 0.68);
  box(g, x + 77, y + 6, 3, 29, palette.accent, 0.2);
  box(g, x + 9, y + 33, 147, 24, palette.accent, 0.35);
  box(g, x + 1, y + 24, 16, 39, 0xacae8e, 0.65);
  box(g, x + 148, y + 24, 16, 39, 0xacae8e, 0.65);
  box(g, x + 13, y + 63, 7, 16, 0x977f61, 0.65);
  box(g, x + 144, y + 63, 7, 16, 0x977f61, 0.65);
  stepped(g, x + 30, y + 17, 27, 25, 0xd8b39b, 3, 0.7);
  box(g, x + 113, y + 19, 23, 42, 0xd9cfb3, 0.65);
  for (let i = 0; i < 5; i++) box(g, x + 116 + i * 4, y + 24, 2, 33, 0xb5b497, 0.35);
}

function kitchen(g, palette) {
  for (let x = 344; x < 760; x += 52) {
    box(g, x, 356, 50, 116, palette.accent, 0.2);
    box(g, x + 4, 363, 42, 104, 0xe4dfc7, 0.5);
    box(g, x + 34, 373, 4, 13, palette.trim, 0.5);
  }
  box(g, 338, 350, 424, 7, 0xc0ad8e, 0.6);
  // Small tiled splashback.
  for (let y = 282; y < 347; y += 18) for (let x = 342; x < 759; x += 26) {
    box(g, x + 1, y + 1, 24, 16, 0xf5eed8, 0.35);
  }
  box(g, 474, 359, 63, 103, 0xa0a99a, 0.45);
  box(g, 479, 380, 53, 59, 0x7a8c82, 0.27);
  box(g, 485, 386, 41, 45, 0xaeb5a5, 0.5);
  for (let x = 483; x < 530; x += 13) box(g, x, 365, 5, 5, 0xa49a81, 0.7);
  box(g, 633, 339, 64, 8, 0x97a69c, 0.45);
  box(g, 659, 320, 4, 22, 0xa0ab9e, 0.65);
  box(g, 659, 317, 16, 4, 0xa0ab9e, 0.65);
  box(g, 672, 321, 3, 7, 0xa0ab9e, 0.65);
}

function bed(g, palette) {
  box(g, 460, 365, 220, 105, palette.trim, 0.25);
  box(g, 466, 371, 208, 97, 0xcabfa8, 0.5);
  box(g, 450, 412, 246, 57, 0xebe0cc, 0.7);
  box(g, 460, 418, 90, 28, 0xf2e8d6, 0.8);
  box(g, 558, 418, 90, 28, 0xf2e8d6, 0.8);
  box(g, 451, 447, 246, 24, 0xaa9da8, 0.5);
  for (let x = 458; x < 696; x += 16) box(g, x, 449, 3, 21, 0xdbccd0, 0.35);
  box(g, 455, 471, 8, 8, palette.trim, 0.7);
  box(g, 684, 471, 8, 8, palette.trim, 0.7);
}

function bathroom(g, palette) {
  for (let y = 250; y < 470; y += 28) for (let x = 0; x < 960; x += 40) {
    box(g, x + 1, y + 1, 38, 26, 0xecede0, 0.17);
    if (((x / 40) + (y - 250) / 28) % 7 === 0) box(g, x + 17, y + 11, 6, 6, palette.accent, 0.15);
  }
  box(g, 515, 389, 155, 69, 0xf3eee0, 0.65);
  box(g, 508, 385, 169, 10, 0xf6f1e3, 0.85);
  box(g, 522, 459, 10, 19, 0x9baba1, 0.5);
  box(g, 652, 459, 10, 19, 0x9baba1, 0.5);
  box(g, 534, 368, 4, 20, 0x9baba1, 0.6);
  box(g, 534, 365, 13, 4, 0x9baba1, 0.6);
  box(g, 723, 335, 4, 86, palette.trim, 0.45);
  box(g, 717, 334, 55, 5, palette.trim, 0.45);
  box(g, 733, 339, 35, 70, 0xd7c4ae, 0.6);
  for (let x = 736; x < 767; x += 7) box(g, x, 343, 2, 63, 0xefe0c8, 0.35);
}

function books(g, palette) {
  box(g, 602, 326, 141, 150, 0xa99b7f, 0.28);
  box(g, 609, 332, 127, 138, 0xd2c7ab, 0.5);
  for (let row = 0; row < 3; row++) {
    const y = 339 + row * 44;
    for (let i = 0; i < 10; i++) {
      const h = 22 + ((i * 7 + row * 3) % 13);
      const colors = [0x9ca88b, 0xbf9b85, 0xa2aeaa, 0xb8b18f, 0xa39791];
      box(g, 615 + i * 11, y + 35 - h, 8, h, colors[(i + row) % colors.length], 0.6);
      box(g, 616 + i * 11, y + 38 - h, 6, 2, 0xe7dbc0, 0.45);
    }
    box(g, 608, y + 36, 129, 5, 0x9e947b, 0.4);
  }
}

function laundry(g, palette) {
  for (const x of [485, 585]) {
    box(g, x, 374, 88, 103, 0xd8d9c9, 0.7);
    box(g, x + 5, 379, 78, 17, 0xeff0dc, 0.7);
    box(g, x + 9, 383, 26, 7, palette.trim, 0.4);
    stepped(g, x + 17, 409, 54, 54, 0x9cafa4, 12, 0.65);
    stepped(g, x + 24, 416, 40, 40, 0xbdc8b7, 10, 0.8);
    box(g, x + 28, 438, 33, 13, 0xd5c3b1, 0.6);
    box(g, x + 66, 383, 8, 8, 0xa6b1a2, 0.7);
  }
  box(g, 492, 363, 62, 9, 0xb0b899, 0.7);
  box(g, 498, 355, 62, 8, 0xe8d9c3, 0.8);
  box(g, 494, 348, 61, 7, 0xc3a797, 0.6);
}

/** Draws background only; playable ledges, doors, and climb walls belong to the scene. */
export function drawRoom(scene, level = {}) {
  const theme = level.theme || 'hallway';
  const p = THEMES[theme] || THEMES.hallway;
  const g = scene.add.graphics().setDepth(-30);
  box(g, 0, 0, 960, 540, p.wall);
  box(g, 0, 0, 960, 28, 0xf2e8d2);
  box(g, 0, 28, 960, 3, p.trim, 0.35);
  box(g, 0, 31, 960, 7, p.trim, 0.07);
  // Quiet woven-paper texture; never random, so redraws stay identical.
  for (let y = 46; y < 320; y += 18) {
    for (let x = 8; x < 960; x += 22) {
      const n = (x * 17 + y * 31) % 11;
      if (n < 3) box(g, x, y, 2, 2, p.trim, 0.075);
    }
  }
  box(g, 0, 320, 960, 160, p.lower);
  box(g, 0, 316, 960, 5, 0xece1c7);
  box(g, 0, 321, 960, 3, p.trim, 0.35);
  for (let x = 24; x < 960; x += 64) {
    box(g, x, 338, 46, 124, p.trim, 0.13);
    box(g, x + 2, 340, 42, 120, p.wall, 0.17);
    box(g, x + 4, 342, 2, 116, 0xf7edd5, 0.14);
  }

  if (theme === 'balcony') {
    for (const x of [140, 380, 620]) window(g, x, 94, 156, 168, p);
    box(g, 18, 30, 8, 450, p.trim, 0.45);
    box(g, 936, 30, 8, 450, p.trim, 0.45);
  } else {
    window(g, 368, 96, 116, 139, p, theme === 'bedroom' || theme === 'attic');
    picture(g, 112, 137, 65, 82, p, 1);
    picture(g, 200, 153, 45, 53, p, 0);
    picture(g, 636, 128, 65, 77, p, 0);
    picture(g, 724, 147, 43, 55, p, 1);
  }
  lamp(g, 565, p);

  if (theme === 'kitchen') kitchen(g, p);
  else if (theme === 'bedroom') bed(g, p);
  else if (theme === 'bathroom') bathroom(g, p);
  else if (theme === 'study') books(g, p);
  else if (theme === 'laundry') laundry(g, p);
  else if (theme === 'living' || theme === 'attic') sofa(g, 512, p);
  else if (theme === 'hallway') {
    // Wall-mounted coat hooks and little slippers beneath them.
    box(g, 545, 344, 131, 7, p.trim, 0.35);
    for (const x of [558, 605, 651]) {
      box(g, x, 348, 4, 12, 0x8e8f73, 0.6);
      box(g, x - 4, 359, 13, 51, x === 605 ? 0xc6a892 : 0xa4b294, 0.6);
      box(g, x - 8, 366, 21, 23, x === 605 ? 0xc6a892 : 0xa4b294, 0.6);
    }
    stepped(g, 564, 464, 29, 11, 0x9f8c79, 3, 0.45);
    stepped(g, 601, 464, 29, 11, 0x9f8c79, 3, 0.45);
  } else if (theme === 'catwall') {
    // A portrait of the apartment's very important occupants.
    picture(g, 550, 350, 86, 92, p, 1);
    box(g, 568, 379, 20, 30, 0x9ea797, 0.6);
    box(g, 592, 387, 24, 22, 0xbea07e, 0.6);
    box(g, 570, 375, 5, 8, 0x9ea797, 0.6);
    box(g, 582, 375, 5, 8, 0x9ea797, 0.6);
    box(g, 595, 383, 5, 8, 0xbea07e, 0.6);
    box(g, 608, 383, 5, 8, 0xbea07e, 0.6);
  }

  // Every room shares a clear, solid floor line. Everything above is background.
  box(g, 0, 469, 960, 11, 0x8f8066);
  box(g, 0, 470, 960, 3, 0xd3c2a0);
  box(g, 0, 480, 960, 60, p.floor);
  box(g, 0, 480, 960, 4, 0x78634e);
  const bathroomFloor = theme === 'bathroom';
  if (bathroomFloor) {
    for (let y = 485; y < 540; y += 24) for (let x = 0; x < 960; x += 32) {
      box(g, x + 1, y, 30, 22, ((x / 32) + ((y - 485) / 24)) % 2 ? 0xc4d0ba : 0xa9bda8);
      box(g, x + 3, y + 2, 26, 2, 0xe4e4cd, 0.25);
    }
  } else {
    for (let row = 0; row < 3; row++) {
      const y = 486 + row * 18;
      box(g, 0, y + 15, 960, 2, 0x775e48, 0.3);
      for (let x = -64 + (row % 2) * 72; x < 960; x += 144) {
        box(g, x, y, 2, 15, 0x775e48, 0.3);
        box(g, x + 8, y + 2, 124, 2, 0xebc795, 0.15);
        box(g, x + 23, y + 10, 57, 1, 0x735b46, 0.17);
        box(g, x + 93, y + 6, 32, 1, 0x735b46, 0.12);
      }
    }
  }
  // Flat rugs live on the floor, never masquerading as jumpable furniture.
  stepped(g, 54, 499, 185, 26, p.accent, 5, 0.55);
  box(g, 65, 504, 163, 2, 0xe8d9b4, 0.5);
  box(g, 65, 518, 163, 2, 0xe8d9b4, 0.5);
  for (let x = 47; x < 53; x += 3) for (let y = 504; y < 524; y += 4) box(g, x, y, 6, 1, 0xddd1b1, 0.6);
  for (let x = 240; x < 247; x += 3) for (let y = 504; y < 524; y += 4) box(g, x, y, 6, 1, 0xddd1b1, 0.6);

  // Tiny lived-in details, all beneath the collision plane.
  box(g, 800, 499, 24, 4, 0x9eaf9a);
  box(g, 802, 503, 20, 6, 0x778f7a);
  box(g, 804, 499, 16, 2, 0xd8c9a5);
  box(g, 831, 501, 22, 4, 0xc49a80);
  box(g, 833, 505, 18, 5, 0xa37b66);
  box(g, 835, 501, 14, 2, 0xbdd1c5);
  return g;
}

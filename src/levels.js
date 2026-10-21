// Platforms use top-left coordinates. Cat/object positions use their feet.
// Routes are designer-authored hints for the independent physics replay tests.
export const levels = [
  {
    id: 1, name: 'A small entrance', room: 'The hallway', theme: 'hallway',
    subtitle: 'Every great adventure starts at the front door.',
    hint: 'Nässla: jump onto the shelves and press E beside the little bell jar.',
    lesson: 'Jump & boop', difficulty: 'A gentle beginning',
    platforms: [{ x: 210, y: 402, w: 160, h: 14 }, { x: 320, y: 324, w: 160, h: 14 }],
    climbWalls: [], pots: [{ x: 432, y: 324 }],
    crateX: 540, socketX: 690, plateX: 773, gateX: 843,
    vacuums: [], bagels: [],
    route: [{ x: 270, y: 402 }, { x: 388, y: 324 }],
  },
{
  "id": 2,
  "name": "Counter intelligence",
  "room": "The kitchen",
  "theme": "kitchen",
  "subtitle": "A suspiciously breakable object. A perfectly good countertop.",
  "hint": "Hop from shelf to shelf. Hold E / ACT and a direction to push with Maliketh.",
  "lesson": "Careful shelf hops",
  "difficulty": "Finding your feet",
  "platforms": [
    {
      "x": 180,
      "y": 408,
      "w": 125,
      "h": 14
    },
    {
      "x": 310,
      "y": 326,
      "w": 115,
      "h": 14
    },
    {
      "x": 430,
      "y": 244,
      "w": 125,
      "h": 14
    }
  ],
  "climbWalls": [],
  "pots": [
    {
      "x": 510,
      "y": 244
    }
  ],
  "crateX": 545,
  "socketX": 690,
  "plateX": 773,
  "gateX": 843,
  "vacuums": [],
  "bagels": [],
  "route": [
    {
      "x": 248,
      "y": 408
    },
    {
      "x": 368,
      "y": 326
    },
    {
      "x": 466,
      "y": 244
    }
  ]
},
{
  "id": 3,
  "name": "The vertical option",
  "room": "The living room",
  "theme": "living",
  "subtitle": "The sofa is lovely. The view from the scratching post is better.",
  "hint": "Nässla can climb the striped scratching post: move beside it and hold jump.",
  "lesson": "Climb the scratching post",
  "difficulty": "A new perspective",
  "platforms": [
    {
      "x": 180,
      "y": 394,
      "w": 110,
      "h": 14
    },
    {
      "x": 295,
      "y": 250,
      "w": 200,
      "h": 14
    }
  ],
  "climbWalls": [
    {
      "x": 300,
      "y": 250,
      "w": 20,
      "h": 230
    }
  ],
  "pots": [
    {
      "x": 452,
      "y": 250
    }
  ],
  "crateX": 550,
  "socketX": 690,
  "plateX": 773,
  "gateX": 843,
  "vacuums": [],
  "bagels": [],
  "route": [
    {
      "x": 240,
      "y": 394
    },
    {
      "x": 310,
      "y": 250,
      "climb": true
    },
    {
      "x": 408,
      "y": 250
    }
  ]
},
{
  "id": 4,
  "name": "A little encouragement",
  "room": "The bedroom",
  "theme": "bedroom",
  "subtitle": "Some mornings, even a high jumper needs a little love.",
  "hint": "Switch to Maliketh and press E / ACT beside Nässla to groom her. The first shelf needs that boost!",
  "lesson": "Groom for extra bounce",
  "difficulty": "A helping paw",
  "requiresGroom": true,
  "platforms": [
    {
      "x": 230,
      "y": 316,
      "w": 150,
      "h": 14
    },
    {
      "x": 365,
      "y": 218,
      "w": 155,
      "h": 14
    }
  ],
  "climbWalls": [],
  "pots": [
    {
      "x": 478,
      "y": 218
    }
  ],
  "crateX": 540,
  "socketX": 690,
  "plateX": 773,
  "gateX": 843,
  "vacuums": [],
  "bagels": [],
  "route": [
    {
      "x": 280,
      "y": 316
    },
    {
      "x": 434,
      "y": 218
    }
  ]
},
];

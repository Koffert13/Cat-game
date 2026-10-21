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
];

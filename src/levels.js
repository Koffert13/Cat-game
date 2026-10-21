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
{
  "id": 5,
  "name": "Carbs are a superpower",
  "room": "The pantry",
  "theme": "kitchen",
  "subtitle": "One iron-bound crate. One extremely motivating bagel.",
  "hint": "Iron crates need bagel power. Maliketh automatically snacks on bagels he walks over.",
  "lesson": "Bagel-powered strength",
  "difficulty": "A heavier assignment",
  "heavy": true,
  "platforms": [
    {
      "x": 165,
      "y": 404,
      "w": 130,
      "h": 14
    },
    {
      "x": 280,
      "y": 316,
      "w": 130,
      "h": 14
    },
    {
      "x": 390,
      "y": 226,
      "w": 165,
      "h": 14
    }
  ],
  "climbWalls": [],
  "pots": [
    {
      "x": 510,
      "y": 226
    }
  ],
  "crateX": 550,
  "socketX": 690,
  "plateX": 773,
  "gateX": 843,
  "vacuums": [],
  "bagels": [
    {
      "x": 425,
      "y": 480
    }
  ],
  "route": [
    {
      "x": 230,
      "y": 404
    },
    {
      "x": 344,
      "y": 316
    },
    {
      "x": 467,
      "y": 226
    }
  ]
},
{
  "id": 6,
  "name": "The floor is suspicious",
  "room": "The bathroom",
  "theme": "bathroom",
  "subtitle": "Clean tiles. Warm towels. One very unwelcome housemate.",
  "hint": "Watch the vacuum! Jump over it, or hold E / ACT with bagel-powered Maliketh to stun it.",
  "lesson": "Meet the robot vacuum",
  "difficulty": "A moving complication",
  "heavy": true,
  "platforms": [
    {
      "x": 170,
      "y": 400,
      "w": 145,
      "h": 14
    },
    {
      "x": 290,
      "y": 308,
      "w": 130,
      "h": 14
    },
    {
      "x": 400,
      "y": 220,
      "w": 155,
      "h": 14
    }
  ],
  "climbWalls": [],
  "pots": [
    {
      "x": 510,
      "y": 220
    }
  ],
  "crateX": 550,
  "socketX": 690,
  "plateX": 773,
  "gateX": 843,
  "vacuums": [
    {
      "min": 235,
      "max": 430,
      "speed": 1.2
    }
  ],
  "bagels": [
    {
      "x": 170,
      "y": 480
    }
  ],
  "route": [
    {
      "x": 235,
      "y": 400
    },
    {
      "x": 355,
      "y": 308
    },
    {
      "x": 466,
      "y": 220
    }
  ]
},
{
  "id": 7,
  "name": "Two tiny accidents",
  "room": "The study",
  "theme": "study",
  "subtitle": "The human calls it a collection. Nässla calls it an opportunity.",
  "hint": "Both bell jars power the door. Boop the lower jar, then jump across. Maliketh can snack before meeting the vacuum.",
  "lesson": "Link two bell circuits",
  "difficulty": "An extra little puzzle",
  "heavy": true,
  "platforms": [
    {
      "x": 190,
      "y": 370,
      "w": 150,
      "h": 14
    },
    {
      "x": 380,
      "y": 244,
      "w": 160,
      "h": 14
    }
  ],
  "climbWalls": [],
  "pots": [
    {
      "x": 292,
      "y": 370
    },
    {
      "x": 496,
      "y": 244
    }
  ],
  "crateX": 540,
  "socketX": 690,
  "plateX": 773,
  "gateX": 843,
  "vacuums": [
    {
      "min": 235,
      "max": 390,
      "speed": 1.4
    }
  ],
  "bagels": [
    {
      "x": 170,
      "y": 480
    }
  ],
  "route": [
    {
      "x": 248,
      "y": 370
    },
    {
      "x": 329,
      "y": 370
    },
    {
      "x": 451,
      "y": 244
    }
  ]
},
{
  "id": 8,
  "name": "Spin cycle specialists",
  "room": "The laundry",
  "theme": "laundry",
  "subtitle": "A laundry mountain is just a climbing route in disguise.",
  "hint": "Two jars, a scratching post and a vacuum. Keep Nässla up high while Maliketh handles the floor.",
  "lesson": "Climb, snack & coordinate",
  "difficulty": "Putting it together",
  "heavy": true,
  "platforms": [
    {
      "x": 180,
      "y": 390,
      "w": 150,
      "h": 14
    },
    {
      "x": 300,
      "y": 278,
      "w": 170,
      "h": 14
    },
    {
      "x": 430,
      "y": 180,
      "w": 150,
      "h": 14
    }
  ],
  "climbWalls": [
    {
      "x": 305,
      "y": 278,
      "w": 20,
      "h": 202
    }
  ],
  "pots": [
    {
      "x": 289,
      "y": 390
    },
    {
      "x": 535,
      "y": 180
    }
  ],
  "crateX": 555,
  "socketX": 700,
  "plateX": 780,
  "gateX": 843,
  "vacuums": [
    {
      "min": 230,
      "max": 440,
      "speed": 1.5
    }
  ],
  "bagels": [
    {
      "x": 168,
      "y": 480
    }
  ],
  "route": [
    {
      "x": 246,
      "y": 390
    },
    {
      "x": 315,
      "y": 278,
      "climb": true
    },
    {
      "x": 491,
      "y": 180
    }
  ]
},
{
  "id": 9,
  "name": "The wall belongs to us",
  "room": "The cat wall",
  "theme": "catwall",
  "subtitle": "The humans installed shelves. We accepted the challenge.",
  "hint": "Groom first, then climb. Two vacuums patrol below; bagel power keeps Maliketh safe while he pushes.",
  "lesson": "A high route, a busy floor",
  "difficulty": "For practiced paws",
  "requiresGroom": true,
  "heavy": true,
  "platforms": [
    {
      "x": 215,
      "y": 304,
      "w": 155,
      "h": 14
    },
    {
      "x": 360,
      "y": 226,
      "w": 110,
      "h": 14
    },
    {
      "x": 435,
      "y": 142,
      "w": 165,
      "h": 14
    }
  ],
  "climbWalls": [
    {
      "x": 390,
      "y": 142,
      "w": 18,
      "h": 338
    }
  ],
  "pots": [
    {
      "x": 337,
      "y": 304
    },
    {
      "x": 555,
      "y": 142
    }
  ],
  "crateX": 555,
  "socketX": 700,
  "plateX": 780,
  "gateX": 843,
  "vacuums": [
    {
      "min": 235,
      "max": 415,
      "speed": 1.7
    },
    {
      "min": 475,
      "max": 650,
      "speed": 1.3
    }
  ],
  "bagels": [
    {
      "x": 170,
      "y": 480
    }
  ],
  "route": [
    {
      "x": 293,
      "y": 304
    },
    {
      "x": 399,
      "y": 226
    },
    {
      "x": 399,
      "y": 142,
      "climb": true
    },
    {
      "x": 512,
      "y": 142
    }
  ]
},
];

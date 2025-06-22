// js/data/Items.js - All item data (Direct objects for simplicity)

const ITEMS = {
  // Achievement items - Items linked to character achievements
  [ITEM_SEED]: {
    displayName: "Seed Packet",
    description:
      "A seed packet that was delivered today. The gardener pig needs to know that these are '{keyword}'.",
    X: 1850,
    Y: 670,
    scale: 0.8,
    appearsIn: [LOC_GARDEN],
  },

  [ITEM_DRAGON_SCALE]: {
    displayName: "Dragon Scale",
    description:
      "An ancient dragon scale that pulses with '{keyword}' - irresistibly tempting to adventurers.",
    X: 1440,
    Y: 605,
    scale: 1.2,
    appearsIn: [LOC_FOREST],
  },

  [ITEM_RED_POTION]: {
    displayName: "Red Potion",
    description:
      "A royal red potion with faded text reading '{keyword}' - meant for true rulers.",
    X: 1523,
    Y: 420,
    scale: 0.9,
    appearsIn: [LOC_INSIDE_LABYRINTH],
  },

  [ITEM_GREEN_POTION]: {
    displayName: "Green Potion",
    description:
      "A mysterious green potion labeled '{keyword}' - looks safe to drink for warriors.",
    X: 400,
    Y: 850,
    scale: 0.8,
    appearsIn: [LOC_OUTSIDE_LABYRINTH],
  },

  // World building items - Just for flavor and immersion
  [ITEM_ANXIETY_BOOK]: {
    displayName: "Duck Reminder",
    description:
      "Remember - if you find yourself anxious, just go talk to your duck.",
    X: 1491,
    Y: 536,
    scale: 0.9,
    appearsIn: [LOC_BEDROOM],
  },

  [ITEM_MAMALETTER]: {
    displayName: "Letter from Mother",
    description:
      "A letter from your mother: 'Your gardener mentioned they need help with something today when I was chatting with them on the phone. Why you insist on my writing letters instead, well I just don't understand. Don't forget - your duck is always there when you need comfort! Love you! ❤️'",
    X: 650,
    Y: 900,
    scale: 1,
    appearsIn: [LOC_BEDROOM],
  },

  [ITEM_DUMMIES_BOOK]: {
    displayName: "Strategy Book",
    description:
      "A book detailing how to defend from adventurers by getting intel and then recruiting the perfect defenders monsters based on the adventurers personality. Seems to be talking about levels and characters that aren't included in this demo!",
    X: 1317,
    Y: 650,
    scale: 1,
    appearsIn: [LOC_LIVINGROOM],
  },

  [ITEM_MAGGLASS]: {
    displayName: "Magnifying Glass",
    description:
      "You often stare at the stars and contimplate why adventures are always trying to invade your home. Pig sometimes uses this to see things that are to blurry.",
    X: 173,
    Y: 348,
    scale: 1,
    appearsIn: [LOC_LIVINGROOM],
  },

  [ITEM_STARSBOOK]: {
    displayName: "Star Guide",
    description:
      "A book about reading the stars and understanding natural cycles. It mentions how different plants grow better at different times.",
    X: 89,
    Y: 694,
    scale: 1,
    appearsIn: [LOC_GARDEN],
  },

  [PIG_DIG]: {
    displayName: "Pig Digging",
    description:
      "You can see the pig in the distance, digging holes in the garden, preparing for planting. They look like they're waiting to know what seeds to plant.",
    X: 1050,
    Y: 800,
    scale: 0.65,
    appearsIn: [LOC_GARDEN],
  },

  // Character portraits - Show player emotional state
  [YOU_IDLE]: {
    displayName: "You (Idle)",
    description:
      "You're feeling a bit anxious about the day ahead, Pig is in your living room and wants something.",
    X: 281,
    Y: 658,
    scale: 1,
    appearsIn: [LOC_BEDROOM],
  },

  // [YOU_DUCK]: {
  //   displayName: "You with Duck",
  //   description:
  //     "Being near your duck companion always makes you feel calmer and more confident. You could talk to them anytime you need support.",
  //   X: 453,
  //   Y: 680,
  //   scale: 1,
  //   appearsIn: [LOC_INSIDE_LABYRINTH],
  // },

  [YOU_SCARED]: {
    displayName: "You (Nervous)",
    description:
      "You're feeling a bit nervous about talking to the pig, but you know they need help and you want to be a good neighbor. They always help out with your gardening after all.",
    X: 472,
    Y: 615,
    scale: 1,
    appearsIn: [LOC_LIVINGROOM],
  },

  [YOU_UNSURE]: {
    displayName: "You (Exploring)",
    description:
      "You're in the garden now, looking around for clues about what the pig might need. The fresh air helps you think more clearly.",
    X: 510,
    Y: 515,
    scale: 0.6,
    appearsIn: [LOC_GARDEN],
  },

  //expansion 1
  [ITEM_GOLDEN_GEAR]: {
    displayName: "Golden Gear",
    description:
      "A shining gear, likely from some intricate machine. There's a faded sticker that reads '{keyword}'.",
    X: 208,
    Y: 711,
    scale: 0.8,
    appearsIn: [LOC_TRADING_HALL_INSIDE],
  },

  [ITEM_TIED_MAGICAL_SCROLL]: {
    displayName: "Tied Magical Scroll",
    description:
      "A scroll bound by a magically sealed string and marked with a glowing rune. Scribbled faintly near the bottom: '{keyword}'.",
    X: 1802,
    Y: 975,
    scale: 1.0,
    appearsIn: [LOC_CRYSTAL_CAVE],
  },

  [ITEM_ROUND_STONE]: {
    displayName: "Round Stone",
    description:
      "A round stone with a visible vein of white mineral running through it. Someone has scratched a tasting note into it: '{keyword}'.",
    X: 870,
    Y: 870,
    scale: 0.85,
    appearsIn: [LOC_OUTSIDE_LABYRINTH],
  },

  [ITEM_PHOTOS_OF_POTIONS]: {
    displayName: "Photos of Potions",
    description:
      "A collection of pictures showing various potions and their ingredients. One has a note written on the back: '{keyword}'.",
    X: 772,
    Y: 847,
    scale: 0.9,
    appearsIn: [LOC_POTION_SHOP],
  },

  [ITEM_OLD_LEATHER_JACKET]: {
    displayName: "Old Leather Jacket",
    description:
      "A worn jacket with patches and a giant 'dragon' symbol on the front. Something is in the pocket: '{keyword}'.",
    X: 1721,
    Y: 478,
    scale: 1,
    appearsIn: [LOC_GOLD_ROOM],
  },

  [ITEM_VALOR_MEDAL]: {
    displayName: "Valor Medal",
    description:
      "A medal from a long-forgotten war. A word is faintly etched on the back: '{keyword}'.",
    X: 1700,
    Y: 882,
    scale: 0.8,
    appearsIn: [LOC_TRADING_HALL],
  },

  [ITEM_ACCOUNTING_BOOK]: {
    displayName: "Accounting Book",
    description: "Holds all the accounting for the potion shop.",
    X: 1592,
    Y: 909,
    scale: 0.9,
    appearsIn: [LOC_POTINO_INSIDE],
  },

  [ITEM_HAMMER]: {
    displayName: "Hammer",
    description: "A sturdy hammer, clearly used but still strong.",
    X: 231,
    Y: 1002,
    scale: 0.9,
    appearsIn: [LOC_GARDEN],
  },

  [ITEM_SPOOL_OF_SPIDER_SILK]: {
    displayName: "Spool of Spider Silk",
    description: "Shiny and bright silk wound neatly on a wooden spool.",
    X: 900,
    Y: 640,
    scale: 0.7,
    appearsIn: [LOC_TRADING_HALL_INSIDE],
  },

  [ITEM_UNFINISHED_MAZE_ART]: {
    displayName: "Unfinished Maze Art",
    description:
      "Treadwork art of a labyrinth - though it clearly doesn't match this one.",
    X: 329,
    Y: 666,
    scale: 0.75,
    appearsIn: [LOC_GOLD_ROOM],
  },

  [ITEM_USED_LIBRARY_CARD]: {
    displayName: "Used Library Card",
    description:
      "A well-worn card filled out completely over the past 20 years.",
    X: 475,
    Y: 868,
    scale: 0.8,
    appearsIn: [LOC_POTINO_INSIDE],
  },
};

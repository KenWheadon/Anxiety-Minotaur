// js/data/Items.js - All item data (Direct objects for simplicity)

const ITEMS = {
  // Achievement items - Items linked to character achievements
  [ITEM_SEED]: {
    displayName: "Seed Packet",
    description:
      "A seed packet that was delivered today. The gardener pig needs to know that these are '{keyword}'.",
    x: 1850,
    y: 670,
    scale: 0.8,
    appearsIn: [LOC_GARDEN],
  },

  [ITEM_DRAGON_SCALE]: {
    displayName: "Dragon Scale",
    description:
      "An ancient dragon scale that pulses with '{keyword}' - irresistibly tempting to adventurers.",
    x: 960,
    y: 400,
    scale: 1.2,
    appearsIn: [LOC_FOREST],
  },

  [ITEM_RED_POTION]: {
    displayName: "Red Potion",
    description:
      "A royal red potion with faded text reading '{keyword}' - meant for true rulers.",
    x: 1600,
    y: 400,
    scale: 0.9,
    appearsIn: [LOC_INSIDE_LABYRINTH],
  },

  [ITEM_GREEN_POTION]: {
    displayName: "Green Potion",
    description:
      "A mysterious green potion labeled '{keyword}' - looks safe to drink for warriors.",
    x: 400,
    y: 850,
    scale: 0.8,
    appearsIn: [LOC_OUTSIDE_LABYRINTH],
  },

  // World building items - Just for flavor and immersion
  [ITEM_ANXIETY_BOOK]: {
    displayName: "Duck Reminder",
    description:
      "Remember - if you find yourself anxious, just go talk to your duck.",
    x: 1491,
    y: 536,
    scale: 0.9,
    appearsIn: [LOC_BEDROOM],
  },

  [ITEM_MAMALETTER]: {
    displayName: "Letter from Mother",
    description:
      "A letter from your mother: 'Your gardener mentioned they need help with something today when I was chatting with them on the phone. Why you insist on my writing letters instead, well I just don't understand. Don't forget - your duck is always there when you need comfort! Love you! ❤️'",
    x: 650,
    y: 900,
    scale: 1,
    appearsIn: [LOC_BEDROOM],
  },

  [ITEM_DUMMIES_BOOK]: {
    displayName: "Strategy Book",
    description:
      "A book detailing how to defend from adventurers by getting intel and then recruiting the perfect defenders monsters based on the adventurers personality. Seems to be talking about levels and characters that aren't included in this demo!",
    x: 1317,
    y: 650,
    scale: 1,
    appearsIn: [LOC_LIVINGROOM],
  },

  [ITEM_MAGGLASS]: {
    displayName: "Magnifying Glass",
    description:
      "You often stare at the stars and contimplate why adventures are always trying to invade your home. Pig sometimes uses this to see things that are to blurry.",
    x: 173,
    y: 348,
    scale: 1,
    appearsIn: [LOC_LIVINGROOM],
  },

  [ITEM_STARSBOOK]: {
    displayName: "Star Guide",
    description:
      "A book about reading the stars and understanding natural cycles. It mentions how different plants grow better at different times.",
    x: 185,
    y: 835,
    scale: 1,
    appearsIn: [LOC_GARDEN],
  },

  [PIG_DIG]: {
    displayName: "Pig Digging",
    description:
      "You can see the pig in the distance, digging holes in the garden, preparing for planting. They look like they're waiting to know what seeds to plant.",
    x: 1050,
    y: 800,
    scale: 0.65,
    appearsIn: [LOC_GARDEN],
  },

  // Character portraits - Show player emotional state
  [YOU_IDLE]: {
    displayName: "You (Idle)",
    description:
      "You're feeling a bit anxious about the day ahead, Pig is in your living room and wants something.",
    x: 800,
    y: 800,
    scale: 1,
    appearsIn: [LOC_BEDROOM],
  },

  // [YOU_DUCK]: {
  //   displayName: "You with Duck",
  //   description:
  //     "Being near your duck companion always makes you feel calmer and more confident. You could talk to them anytime you need support.",
  //   x: 453,
  //   y: 680,
  //   scale: 1,
  //   appearsIn: [LOC_INSIDE_LABYRINTH],
  // },

  [YOU_SCARED]: {
    displayName: "You (Nervous)",
    description:
      "You're feeling a bit nervous about talking to the pig, but you know they need help and you want to be a good neighbor. They always help out with your gardening after all.",
    x: 472,
    y: 615,
    scale: 1,
    appearsIn: [LOC_LIVINGROOM],
  },

  [YOU_UNSURE]: {
    displayName: "You (Exploring)",
    description:
      "You're in the garden now, looking around for clues about what the pig might need. The fresh air helps you think more clearly.",
    x: 510,
    y: 515,
    scale: 0.6,
    appearsIn: [LOC_GARDEN],
  },
};

const items = {
  // ORIGINAL TUTORIAL ITEMS

  // Level 1 Items - World Building
  [ITEM_DUCK]: {
    description:
      "Remember - if you find yourself anxious, just go talk to your duck.",
    X: 1491,
    Y: 536,
    scale: 0.9,
    img: ITEM_DUCK,
  },

  [ITEM_MAMALETTER]: {
    description:
      "A letter from your mother: 'Your gardener mentioned they need help with something today when I was chatting with them on the phone. Why you insist on my writing letters instead, well I just don't understand. Don't forget - your duck is always there when you need comfort! Love you! ❤️'",
    X: 650,
    Y: 900,
    scale: 1,
    img: ITEM_MAMALETTER,
  },

  [ITEM_HELP]: {
    description:
      "A book detailing how to defend from adventurers by getting intel and then recruiting the perfect defenders monsters based on the adventurers personality. Seems to be talking about levels and characters that aren't included in this demo!",
    X: 1317,
    Y: 650,
    scale: 1,
    img: ITEM_HELP,
  },

  [ITEM_MAGGLASS]: {
    description:
      "You often stare at the stars and contimplate why adventures are always trying to invade your home. Pig sometimes uses this to see things that are to blurry.",
    X: 173,
    Y: 348,
    scale: 1,
    img: ITEM_MAGGLASS,
  },

  // Garden Items
  [PIG_DIG]: {
    description:
      "You can see the pig in the distance, digging holes in the garden, preparing for planting. They look like they're waiting to know what seeds to plant.",
    X: 1050,
    Y: 800,
    scale: 0.65,
    img: PIG_DIG,
  },

  [TUTORIAL_SEED]: {
    description:
      "A seed packet that was delivered today. The gardener pig needs help identifying what type of seeds these are.",
    X: 1850,
    Y: 670,
    scale: 0.8,
    img: TUTORIAL_SEED,
  },

  [ITEM_STARSBOOK]: {
    description:
      "A book about reading the stars and understanding natural cycles. It mentions how different plants grow better at different times.",
    X: 185,
    Y: 835,
    scale: 1,
    img: ITEM_STARSBOOK,
  },

  //Images of your character
  [YOU_IDLE]: {
    description:
      "You're feeling a bit anxious about the day ahead, Pig is in your living room and wants something.",
    X: 280,
    Y: 594,
    scale: 1,
    img: YOU_IDLE,
  },

  [YOU_DUCK]: {
    description:
      "Being near your duck companion always makes you feel calmer and more confident. You could talk to them anytime you need support.",
    X: 453,
    Y: 680,
    scale: 1,
    img: YOU_DUCK,
  },

  [YOU_SCARED]: {
    description:
      "You're feeling a bit nervous about talking to the pig, but you know they need help and you want to be a good neighbor. They always help out with your gardening after all.",
    X: 472,
    Y: 615,
    scale: 1,
    img: YOU_SCARED,
  },

  [YOU_UNSURE]: {
    description:
      "You're in the garden now, looking around for clues about what the pig might need. The fresh air helps you think more clearly.",
    X: 510,
    Y: 515,
    scale: 0.6,
    img: YOU_UNSURE,
  },

  // NEW MAGICAL ITEMS

  // Green Potion - Template for Sumo's safety question
  [GREEN_POTION]: {
    description:
      "A mysterious green potion labeled '{SUMO_KEYWORD}' - looks safe to drink for warriors.", // TEMPLATE
    X: 400,
    Y: 850,
    scale: 0.8,
    img: GREEN_POTION,
  },

  // Red Potion - Template for KingKing's inscription question
  [RED_POTION]: {
    description:
      "A royal red potion with faded text reading '{KINGKING_KEYWORD}' - meant for true rulers.", // TEMPLATE
    X: 1600,
    Y: 400,
    scale: 0.9,
    img: RED_POTION,
  },

  // Dragon Scale - Template for Demon's magic sensing question
  [DRAGON_SCALE]: {
    description:
      "An ancient dragon scale that pulses with '{DEMON_KEYWORD}' - irresistibly tempting to adventurers.", // TEMPLATE
    X: 960,
    Y: 400,
    scale: 1.2,
    img: DRAGON_SCALE,
  },
};

const locations = {
  // Level 1 locations - Minotaur's Home
  [LEVEL1_HOUSE]: {
    description:
      "Your cozy bedroom with personal mementos. Today's the big day - your first adventurer challenge!",
    characters: [NPC_DUCK],
    items: [YOU_IDLE, ITEM_DUCK, ITEM_MAMALETTER],
    locations: [LEVEL1_LIVINGROOM],
    background: LEVEL1_HOUSE,
  },

  [LEVEL1_LIVINGROOM]: {
    description:
      "A homey kitchen where you and duck share meals. The smell of fresh bread helps calm your nerves.",
    characters: [],
    items: [YOU_DUCK, ITEM_HELP, ITEM_MAGGLASS],
    locations: [LEVEL1_HOUSE],
    background: LEVEL1_LIVINGROOM,
  },

  // Level 2 locations - The Labyrinth (10 areas)
  [LEVEL2_OUTSIDELAB]: {
    description:
      "The grand entrance to your labyrinth. Time to find the right allies for today's challenge.",
    characters: [MON_SKELETON],
    items: [ITEM_SKELETON],
    locations: [LEVEL2_FOREST, LEVEL2_POTIONSHOP, LEVEL2_HALL],
    background: LEVEL2_OUTSIDELAB,
  },

  [LEVEL2_FOREST]: {
    description:
      "A lovely pathway leading to the crystal caves. Why do adventures even bother coming near his home when these crystals are just here for the taking.",
    characters: [INFO_LIB, MON_SPHINX],
    items: [ITEM_IRIS, ITEM_TROLL],
    locations: [LEVEL2_OUTSIDELAB, LEVEL2_CAVE],
    background: LEVEL2_FOREST,
  },

  [LEVEL2_CAVE]: {
    description:
      "The cave's enterence is guarded by two beautifully crafted gargoyles, I can see the Siren's craft mark.",
    characters: [MON_SIREN, TRAP_PIP],
    items: [ITEM_SPIDER],
    locations: [LEVEL2_FOREST, LEVEL2_CRYSTALCAVE],
    background: LEVEL2_CAVE,
  },

  [LEVEL2_CRYSTALCAVE]: {
    description:
      "A mystical cave where crystals hum with magic. Illusions dance in the prismatic light.",
    characters: [TRAP_IRIS, NPC_DUCK2],
    items: [ITEM_JACKET],
    locations: [LEVEL2_CAVE],
    background: LEVEL2_CRYSTALCAVE,
  },

  [LEVEL2_POTIONSHOP]: {
    description:
      "A quaint potion shop, the Sphinx family has been running it for hundreds of years, and each year the potion on top is said to get a bit bigger.",
    characters: [MON_TROLL, MON_SPIDER],
    items: [ITEM_STARSBOOK],
    locations: [LEVEL2_OUTSIDELAB, LEVEL2_HALL, LEVEL2_POTIONINSIDE],
    background: LEVEL2_POTIONSHOP,
  },

  [LEVEL2_POTIONINSIDE]: {
    description:
      "A workshop filled with ingenious contraptions. Trap makers demonstrate their deadly crafts.",
    characters: [NPC_SPHINX, TRAP_KATE],
    items: [ITEM_POTIONRED, ITEM_POTIONGREEN, ITEM_KATE],
    locations: [LEVEL2_POTIONSHOP],
    background: LEVEL2_POTIONINSIDE,
  },

  [LEVEL2_HALL]: {
    description:
      "A bustling marketplace where deals are made and information is traded freely.",
    characters: [NPC_SUMO],
    items: [ITEM_PIP],
    locations: [LEVEL2_OUTSIDELAB, LEVEL2_POTIONSHOP, LEVEL2_HALLINSIDE],
    background: LEVEL2_HALL,
  },

  [LEVEL2_HALLINSIDE]: {
    description:
      "A glittering chamber filled with gold and jewels. Perfect for testing an adventurer's greed.",
    characters: [INFO_KING],
    items: [ITEM_DRAGON],
    locations: [LEVEL2_HALL, LEVEL2_GOLDROOM, LEVEL2_LIBRARY],
    background: LEVEL2_HALLINSIDE,
  },

  [LEVEL2_LIBRARY]: {
    description:
      "A library filled with riddles and brain teasers. Intellectual challenges await within.",
    characters: [],
    items: [YOU_UNSURE, ITEM_KING],
    locations: [LEVEL2_HALL],
    background: LEVEL2_LIBRARY,
  },

  [LEVEL2_GOLDROOM]: {
    description:
      "A room filled with golds and riches, gems and magical items. You could spend hours just looking at all the different wonderful items.",
    characters: [NPC_KINGKING],
    items: [ITEM_LIB],
    locations: [LEVEL2_HALL],
    background: LEVEL2_GOLDROOM,
  },

  // Level 3 location - Results
  [LEVEL3_BG]: {
    description:
      "The final chamber where your preparations meet the incoming adventurer. The moment of truth!",
    characters: [],
    items: [],
    locations: [],
    background: LEVEL3_BG,
  },
};

const locations = {
  // Level 1 locations - Minotaur's Home
  [MINOTAUR_BEDROOM]: {
    description:
      "Your cozy bedroom with personal mementos. Today's the big day - your first adventurer challenge!",
    characters: [DUCK_COMPANION],
    items: [ANXIETY_WORKBOOK, LETTER_FROM_MOM],
    locations: [MINOTAUR_KITCHEN, MINOTAUR_GARDEN],
    background: MINOTAUR_BEDROOM,
  },

  [MINOTAUR_KITCHEN]: {
    description:
      "A homey kitchen where you and duck share meals. The smell of fresh bread helps calm your nerves.",
    characters: [],
    items: [DUCK_TREAT_RECIPE, LABYRINTH_BLUEPRINT],
    locations: [MINOTAUR_BEDROOM, MINOTAUR_GARDEN],
    background: MINOTAUR_KITCHEN,
  },

  [MINOTAUR_GARDEN]: {
    description:
      "A peaceful garden where duck likes to waddle around. The morning sun feels encouraging.",
    characters: [DUCK_COMPANION],
    items: [BABY_DUCK_PHOTOS],
    locations: [MINOTAUR_BEDROOM, MINOTAUR_KITCHEN],
    background: MINOTAUR_GARDEN,
  },

  // Level 2 locations - The Labyrinth (10 areas)
  [LABYRINTH_ENTRANCE]: {
    description:
      "The grand entrance to your labyrinth. Time to find the right allies for today's challenge.",
    characters: [DUCK_COMPANION, SKELETON_WARRIOR],
    items: [WAR_MEDAL, LIBRARY_CARD],
    locations: [ANCIENT_LIBRARY, MONSTER_BARRACKS, MARKET_SQUARE],
    background: LABYRINTH_ENTRANCE,
  },

  [ANCIENT_LIBRARY]: {
    description:
      "A vast library filled with ancient knowledge. The Librarian whispers among the towering shelves.",
    characters: [THE_LIBRARIAN, SPHINX],
    items: [ANCIENT_SCROLL, THINKING_STONE],
    locations: [LABYRINTH_ENTRANCE, CRYSTAL_CAVE, MEDITATION_GROVE],
    background: ANCIENT_LIBRARY,
  },

  [TREASURE_CHAMBER]: {
    description:
      "A glittering chamber filled with gold and jewels. Perfect for testing an adventurer's greed.",
    characters: [DRAGON_HATCHLING, THE_MERCHANT_KING],
    items: [POLISHED_SCALE, MERCHANT_LEDGER],
    locations: [MARKET_SQUARE, CRYSTAL_CAVE],
    background: TREASURE_CHAMBER,
  },

  [MONSTER_BARRACKS]: {
    description:
      "Where potential monster allies gather. The air buzzes with nervous energy and introductions.",
    characters: [TROLL, GIANT_SPIDER],
    items: [TRADE_CONTRACT, SILK_THREAD],
    locations: [LABYRINTH_ENTRANCE, TRAP_WORKSHOP, SHADOW_ALCOVE],
    background: MONSTER_BARRACKS,
  },

  [TRAP_WORKSHOP]: {
    description:
      "A workshop filled with ingenious contraptions. Trap makers demonstrate their deadly crafts.",
    characters: [COGWHEEL_KATE, PIT_BOSS_PETE],
    items: [CLOCKWORK_GEAR, HAMMER_HEAD],
    locations: [MONSTER_BARRACKS, PUZZLE_CHAMBER],
    background: TRAP_WORKSHOP,
  },

  [CRYSTAL_CAVE]: {
    description:
      "A mystical cave where crystals hum with magic. Illusions dance in the prismatic light.",
    characters: [ILLUSION_IRIS, DUCK_COMPANION],
    items: [KALEIDOSCOPE],
    locations: [ANCIENT_LIBRARY, TREASURE_CHAMBER, MEDITATION_GROVE],
    background: CRYSTAL_CAVE,
  },

  [MEDITATION_GROVE]: {
    description:
      "A serene grove where deep thinkers ponder existence. Perfect for philosophical conversations.",
    characters: [THE_PHILOSOPHER, SIREN],
    items: [GOLDEN_HARP_STRING],
    locations: [ANCIENT_LIBRARY, CRYSTAL_CAVE, SHADOW_ALCOVE],
    background: MEDITATION_GROVE,
  },

  [MARKET_SQUARE]: {
    description:
      "A bustling marketplace where deals are made and information is traded freely.",
    characters: [THE_MERCHANT_KING, DUCK_COMPANION],
    items: [MERCHANT_LEDGER],
    locations: [LABYRINTH_ENTRANCE, TREASURE_CHAMBER, PUZZLE_CHAMBER],
    background: MARKET_SQUARE,
  },

  [PUZZLE_CHAMBER]: {
    description:
      "A chamber filled with riddles and brain teasers. Intellectual challenges await within.",
    characters: [PUZZLE_MASTER_PIP],
    items: [CHESS_PIECE],
    locations: [TRAP_WORKSHOP, MARKET_SQUARE, SHADOW_ALCOVE],
    background: PUZZLE_CHAMBER,
  },

  [SHADOW_ALCOVE]: {
    description:
      "A mysterious alcove shrouded in shadows. Whispered secrets echo in the darkness.",
    characters: [DUCK_COMPANION],
    items: [],
    locations: [MONSTER_BARRACKS, MEDITATION_GROVE, PUZZLE_CHAMBER],
    background: SHADOW_ALCOVE,
  },

  // Level 3 location - Results
  [RESULT_CHAMBER]: {
    description:
      "The final chamber where your preparations meet the incoming adventurer. The moment of truth!",
    characters: [],
    items: [],
    locations: [],
    background: RESULT_CHAMBER,
  },
};

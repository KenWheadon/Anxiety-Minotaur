const locations = {
  // Level 1 locations - Minotaur's Home
  [BEDROOM]: {
    description:
      "Your cozy bedroom with personal mementos. Today's the big day - your first adventurer challenge!",
    characters: [NPC_DUCK],
    items: [YOU_IDLE, ITEM_DUCK, ITEM_MAMALETTER],
    locations: [LIVINGROOM],
    background: BEDROOM,
  },

  [LIVINGROOM]: {
    description:
      "A homey kitchen where you and duck share meals. The smell of fresh bread helps calm your nerves.",
    characters: [TUTORIAL_PIG],
    items: [YOU_DUCK, ITEM_HELP, ITEM_MAGGLASS],
    locations: [BEDROOM, GARDEN],
    background: LIVINGROOM,
  },

  [GARDEN]: {
    description:
      "The outside of your cottage, deeply tucked away in a stone labyrinth.",
    characters: [NPC_DUCK2],
    items: [YOU_UNSURE, TUTORIAL_SEED, PIG_DIG],
    locations: [LIVINGROOM],
    background: GARDEN,
  },
};

// js/data/Locations.js - Tutorial locations for Anxiety Minotaur

const locations = {
  // Tutorial Bedroom - Starting location with duck and worldbuilding
  [BEDROOM]: {
    description:
      "Your cozy bedroom where you feel safe and comfortable. Your duck companion is here, and there are some personal items around. You can hear your gardener neighbor in the living room - they seem to need help with something.",
    characters: [NPC_DUCK],
    items: [YOU_IDLE, ITEM_DUCK, ITEM_MAMALETTER],
    locations: [LIVINGROOM],
    background: BEDROOM,
  },

  // Tutorial Living Room - Main challenge location with pig NPC
  [LIVINGROOM]: {
    description:
      "Your living room where you sometimes chat with neighbors. The gardener pig is here and seems to need help with something garden-related. There are some useful books and tools around.",
    characters: [TUTORIAL_PIG],
    items: [YOU_SCARED, ITEM_HELP, ITEM_MAGGLASS, ITEM_STARSBOOK, ITEM_PAINT],
    locations: [BEDROOM, GARDEN],
    background: LIVINGROOM,
  },

  // Tutorial Garden - Discovery location with seed item and duck
  [GARDEN]: {
    description:
      "Your peaceful garden area. You can see the pig in the distance preparing to plant something, and there are some items here including what looks like a seed packet. Your duck companion is also here if you need comfort.",
    characters: [NPC_DUCK2],
    items: [YOU_UNSURE, TUTORIAL_SEED, PIG_DIG],
    locations: [LIVINGROOM],
    background: GARDEN,
  },
};

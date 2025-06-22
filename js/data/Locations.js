// js/data/Locations.js - Tutorial locations for Anxiety Minotaur
// UPDATED: Added new labyrinth and forest areas

const locations = {
  // ORIGINAL TUTORIAL LOCATIONS

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
    characters: [PIG],
    items: [YOU_SCARED, ITEM_HELP, ITEM_MAGGLASS, ITEM_STARSBOOK],
    locations: [BEDROOM, GARDEN],
    background: LIVINGROOM,
  },

  // Tutorial Garden - Discovery location with seed item and duck (now connects to expanded world)
  [GARDEN]: {
    description:
      "Your peaceful garden area. You can see the pig in the distance preparing to plant something, and there are some items here including what looks like a seed packet. Your duck companion is also here if you need comfort. A winding path leads deeper into the surrounding wilderness.",
    characters: [NPC_DUCK2],
    items: [YOU_UNSURE, TUTORIAL_SEED, PIG_DIG],
    locations: [LIVINGROOM, MIDDLE_OF_LABYRINTH], // NEW: Connection to expanded world
    background: GARDEN,
  },

  // NEW LOCATIONS

  // Outside Labyrinth - Entrance to the mysterious labyrinth
  [OUTSIDE_LABYRINTH]: {
    description:
      "The entrance to an ancient stone labyrinth stands before you. Weathered walls stretch upward, covered in mysterious symbols and fading inscriptions. You can hear strange sounds echoing from within, and the air feels charged with an otherworldly energy. A forest path winds away to the east.",
    characters: [KINGKING], // Royal figure guards the entrance
    items: [RED_POTION], // Power potion near the entrance
    locations: [MIDDLE_OF_LABYRINTH, FOREST],
    background: OUTSIDE_LABYRINTH,
  },

  // Middle of Labyrinth - Central hub with the demon
  [MIDDLE_OF_LABYRINTH]: {
    description:
      "You've reached the heart of the labyrinth. Ancient stones form a circular chamber lit by an eerie, sourceless glow. The walls are covered in symbols that seem to shift when you're not looking directly at them. The air thrums with mystical energy, and shadows dance in the corners of your vision.",
    characters: [DEMON], // Mysterious supernatural entity
    items: [DRAGON_SCALE], // Rare material in the center
    locations: [OUTSIDE_LABYRINTH, GARDEN],
    background: MIDDLE_OF_LABYRINTH,
  },

  // Forest - Natural area with the sumo warrior
  [FOREST]: {
    description:
      "A dense, primordial forest surrounds you. Towering trees create a natural cathedral, their canopy filtering sunlight into dappled patterns on the forest floor. You can hear the distant sound of practice strikes and heavy breathing - someone is training here. The air is fresh and filled with the scent of earth and growing things.",
    characters: [SUMO], // Strong warrior training in nature
    items: [GREEN_POTION], // Healing potion among the herbs
    locations: [OUTSIDE_LABYRINTH],
    background: FOREST,
  },
};

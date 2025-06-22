// js/data/Locations.js - Simplified location definitions

const LOCATIONS = {
  [LOC_BEDROOM]: {
    displayName: "Bedroom",
    description:
      "Your cozy bedroom where you feel safe and comfortable. Your duck companion is here, and there are some personal items around. You can hear your gardener neighbor in the living room - they seem to need help with something.",
    background: LOC_BEDROOM,
    connectsTo: [LOC_LIVINGROOM],
  },

  [LOC_LIVINGROOM]: {
    displayName: "Living Room",
    description:
      "Your living room where you sometimes chat with neighbors. The gardener pig is here and seems to need help with something garden-related. There are some useful books and tools around.",
    background: LOC_LIVINGROOM,
    connectsTo: [LOC_BEDROOM, LOC_GARDEN],
  },

  [LOC_GARDEN]: {
    displayName: "Garden",
    description:
      "Your peaceful garden area. You can see the pig in the distance preparing to plant something, and there are some items here including what looks like a seed packet. Your duck companion is also here if you need comfort. A winding path leads deeper into the surrounding wilderness.",
    background: LOC_GARDEN,
    connectsTo: [LOC_LIVINGROOM, LOC_INSIDE_LABYRINTH],
  },

  [LOC_OUTSIDE_LABYRINTH]: {
    displayName: "Outside Labyrinth",
    description:
      "The entrance to an ancient stone labyrinth stands before you. Weathered walls stretch upward, covered in mysterious symbols and fading inscriptions. You can hear strange sounds echoing from within, and the air feels charged with an otherworldly energy. A forest path winds away to the east.",
    background: LOC_OUTSIDE_LABYRINTH,
    connectsTo: [LOC_INSIDE_LABYRINTH, LOC_FOREST, LOC_POTION_SHOP],
  },

  [LOC_INSIDE_LABYRINTH]: {
    displayName: "Heart of Labyrinth",
    description:
      "You've reached the heart of the labyrinth. Ancient stones form a circular chamber lit by an eerie, sourceless glow. The walls are covered in symbols that seem to shift when you're not looking directly at them. The air thrums with mystical energy, and shadows dance in the corners of your vision.",
    background: LOC_INSIDE_LABYRINTH,
    connectsTo: [LOC_OUTSIDE_LABYRINTH, LOC_GARDEN],
  },

  [LOC_FOREST]: {
    displayName: "Ancient Forest",
    description:
      "A dense, primordial forest surrounds you. Towering trees create a natural cathedral, their canopy filtering sunlight into dappled patterns on the forest floor. You can hear the distant sound of practice strikes and heavy breathing - someone is training here. The air is fresh and filled with the scent of earth and growing things.",
    background: LOC_FOREST,
    connectsTo: [LOC_OUTSIDE_LABYRINTH, LOC_CRYSTAL_CAVE],
  },

  //expansion 1
  [LOC_CRYSTAL_CAVE]: {
    displayName: "Crystal Cave",
    description:
      "A glimmering hollow filled with luminous crystals. Magical energy seems to hum from every surface.",
    background: LOC_CRYSTAL_CAVE,
    connectsTo: [LOC_FOREST, LOC_GOLD_ROOM],
  },

  [LOC_GOLD_ROOM]: {
    displayName: "Gold Room",
    description:
      "A treasure-laden chamber deep within the cave. Piles of old coins and trinkets glint under a pale light.",
    background: LOC_GOLD_ROOM,
    connectsTo: [LOC_CRYSTAL_CAVE],
  },

  [LOC_POTINO_INSIDE]: {
    displayName: "Inside Potino",
    description:
      "A quiet interior tucked behind the potion shop’s curtain. Glass vials and herbs line the shelves.",
    background: LOC_POTINO_INSIDE,
    connectsTo: [LOC_POTION_SHOP],
  },

  [LOC_POTION_SHOP]: {
    displayName: "Potion Shop",
    description:
      "A whimsical shop full of mysterious scents and colorful bottles. The shopkeeper might be nearby.",
    background: LOC_POTION_SHOP,
    connectsTo: [LOC_OUTSIDE_LABYRINTH, LOC_POTINO_INSIDE, LOC_TRADING_HALL],
  },

  [LOC_TRADING_HALL]: {
    displayName: "Trading Hall",
    description:
      "A grand open space where merchants gather to exchange rare items. The air is filled with the sound of bartering.",
    background: LOC_TRADING_HALL,
    connectsTo: [LOC_POTION_SHOP, LOC_TRADING_HALL_INSIDE],
  },

  [LOC_TRADING_HALL_INSIDE]: {
    displayName: "Trading Hall Interior",
    description:
      "The backroom of the hall, where exclusive and secretive deals happen.",
    background: LOC_TRADING_HALL_INSIDE,
    connectsTo: [LOC_TRADING_HALL],
  },
};

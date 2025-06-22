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
    connectsTo: [LOC_INSIDE_LABYRINTH, LOC_FOREST],
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
    connectsTo: [LOC_OUTSIDE_LABYRINTH],
  },
};

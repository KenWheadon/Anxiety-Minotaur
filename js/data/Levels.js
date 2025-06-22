// js/data/Levels.js - Tutorial level for Anxiety Minotaur
// UPDATED: Added all new content to Level 1

const LEVELS = {
  1: {
    name: "Tutorial: Helping Your Neighbor & Exploring the Realm",
    description:
      "Your gardener neighbor needs help identifying some seeds. Explore your expanded home and the mysterious labyrinth beyond, meet fascinating characters, and discover magical items while helping solve the mystery!",
    startLocation: BEDROOM,
    completionAchievement: TUTORIAL_COMPLETE,
    completionMessage:
      "Wonderful! You've successfully helped your neighbor and explored the mystical realm beyond!",

    // EXPANDED: All locations including new areas
    locations: [
      // Original home areas
      BEDROOM,
      LIVINGROOM,
      GARDEN,
      // NEW: Expanded world areas
      OUTSIDE_LABYRINTH,
      MIDDLE_OF_LABYRINTH,
      FOREST,
    ],

    // EXPANDED: All characters including new NPCs
    characters: [
      // Original tutorial characters
      NPC_DUCK,
      NPC_DUCK2,
      PIG,
      // NEW: Expanded cast
      DEMON,
      KINGKING,
      SUMO,
    ],

    // EXPANDED: All items including new magical items
    items: [
      // Original worldbuilding items
      ITEM_DUCK,
      ITEM_MAMALETTER,
      ITEM_HELP,
      ITEM_MAGGLASS,
      ITEM_STARSBOOK,
      TUTORIAL_SEED,
      PIG_DIG,
      YOU_IDLE,
      YOU_DUCK,
      YOU_SCARED,
      YOU_UNSURE,
      // NEW: Magical items
      GREEN_POTION,
      RED_POTION,
      DRAGON_SCALE,
    ],

    // EXPANDED: All achievements including new character and exploration achievements
    achievements: [
      // Original tutorial achievements
      TALKED_TO_DUCK,
      TUTORIAL_COMPLETE,
      // NEW: Character interaction achievements
      MET_THE_DEMON,
      ROYAL_AUDIENCE,
      WARRIOR_RESPECT,
      // NEW: Collection and exploration achievements
      POTION_COLLECTOR,
      LABYRINTH_EXPLORER,
    ],
  },
};

// js/data/Levels.js - Tutorial level for Anxiety Minotaur
// UPDATED: Added all new content to Level 1

const LEVELS = {
  1: {
    name: "Tutorial: Helping Your Neighbor & Exploring the Realm",
    description:
      "Your gardener neighbor needs help identifying some seeds. Explore your expanded home and the mysterious labyrinth beyond, meet fascinating characters, and discover magical items while helping solve the mystery!",
    startLocation: LOC_BEDROOM,
    completionAchievement: MENT_TUTORIAL_COMPLETE,
    completionMessage:
      "Wonderful! You've successfully helped your neighbor and explored the mystical realm beyond!",

    // EXPANDED: All locations including new areas
    locations: [
      // Original home areas
      LOC_BEDROOM,
      LOC_LIVINGROOM,
      LOC_GARDEN,
      // NEW: Expanded world areas
      LOC_OUTSIDE_LABYRINTH,
      LOC_INSIDE_LABYRINTH,
      LOC_FOREST,
    ],

    // EXPANDED: All characters including new NPCs
    characters: [
      // Original tutorial characters
      NPC_DUCK,
      NPC_DUCK2,
      NPC_PIG,
      // NEW: Expanded cast
      NPC_DEMON,
      NPC_KINGKING,
      NPC_SUMO,
    ],

    // EXPANDED: All items including new magical items
    items: [
      // Original worldbuilding items
      ITEM_ANXIETY_BOOK,
      ITEM_MAMALETTER,
      ITEM_DUMMIES_BOOK,
      ITEM_MAGGLASS,
      ITEM_STARSBOOK,
      ITEM_SEED,
      PIG_DIG,
      YOU_IDLE,
      YOU_DUCK,
      YOU_SCARED,
      YOU_UNSURE,
      // NEW: Magical items
      ITEM_GREEN_POTION,
      ITEM_RED_POTION,
      ITEM_DRAGON_SCALE,
    ],

    // EXPANDED: All achievements including new character and exploration achievements
    achievements: [
      // Original tutorial achievements
      MENT_TALKED_TO_DUCK,
      MENT_TUTORIAL_COMPLETE,
      // NEW: Character interaction achievements
      MENT_MET_THE_DEMON,
      MENT_ROYAL_AUDIENCE,
      MENT_WARRIOR_RESPECT,
    ],
  },
};

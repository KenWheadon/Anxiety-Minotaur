// js/data/Levels.js - Minotaur's Labyrinth level definitions

const LEVELS = {
  1: {
    name: "Home Sweet Home",
    description:
      "Prepare yourself mentally for the challenge ahead. When you're ready, tell duck it's time to start the day.",
    startLocation: LEVEL1_HOUSE,
    completionAchievement: READY_FOR_THE_DAY,
    completionMessage:
      "Time to head to the labyrinth and find the right allies!",
    locations: [LEVEL1_HOUSE, LEVEL1_LIVINGROOM],
    characters: [NPC_DUCK],
    items: [
      ITEM_DUCK,
      ITEM_MAMALETTER,
      ITEM_MAGGLASS,
      ITEM_HELP,
      YOU_IDLE,
      YOU_DUCK,
    ],
    achievements: [READY_FOR_THE_DAY, TALKED_TO_DUCK, READ_MOMS_LETTER],
  },

  2: {
    name: "Labyrinth Preparation",
    description:
      "Explore the around the labyrinth, recruit 2 monsters and 1 trap maker, and gather intelligence on the incoming adventurer. Manage your social energy wisely!",
    startLocation: LEVEL2_POTIONINSIDE,
    completionAchievement: RECRUITMENT_COMPLETE,
    completionMessage:
      "All preparations complete! Time to face the adventurer!",
    locations: [
      LEVEL2_OUTSIDELAB,
      LEVEL2_FOREST,
      LEVEL2_CAVE,
      LEVEL2_CRYSTALCAVE,
      LEVEL2_POTIONSHOP,
      LEVEL2_POTIONINSIDE,
      LEVEL2_HALL,
      LEVEL2_HALLINSIDE,
      LEVEL2_GOLDROOM,
      LEVEL2_LIBRARY,
    ],
    characters: [
      NPC_DUCK, // Energy restoration
      //NPCS
      NPC_DEMON,
      NPC_KINGKING,
      NPC_SPHINX,
      NPC_SUMO,

      //You Frames
      YOU_IDLE,
      YOU_SCARED,
      YOU_UNSURE,

      // Monsters (recruit 2 of 6)
      MON_SKELETON,
      MON_DRAGON,
      MON_SPHINX,
      MON_SPIDER,
      MON_SIREN,
      MON_TROLL,

      // Trap Makers (recruit 1 of 3)
      TRAP_KATE,
      TRAP_PIP,
      TRAP_IRIS,

      // Information Dealers (visit all 3)
      INFO_LIB,
      INFO_KING,
      INFO_PHIL,
    ],
    items: [
      // Monster clues
      ITEM_SKELETON,
      ITEM_DRAGON,
      ITEM_SPHINX,
      ITEM_SPIDER,
      ITEM_SIREN,
      ITEM_TROLL,

      // Trap maker clues
      ITEM_KATE,
      ITEM_PIP,
      ITEM_IRIS,

      // Information dealer clues
      ITEM_LIB,
      ITEM_KING,
      ITEM_PHIL,
    ],
    achievements: [
      RECRUITED_FIRST_MONSTER,
      RECRUITED_SECOND_MONSTER,
      HIRED_TRAP_MAKER,
      LEARNED_FEAR_LEVEL,
      LEARNED_GREED_LEVEL,
      LEARNED_PRIDE_LEVEL,
      RECRUITMENT_COMPLETE,
    ],
  },

  3: {
    name: "The Confrontation",
    description:
      "Watch as your carefully chosen allies face the incoming adventurer. Will your strategy succeed?",
    startLocation: LEVEL3_BG,
    completionAchievement: null, // No interactive completion - just cutscenes
    completionMessage: "The challenge is complete!",
    locations: [LEVEL3_BG],
    characters: [], // No interactive characters in results level
    items: [], // No items to examine
    achievements: [DEFEATED_ADVENTURER, KILLED_AT_HOME], // One of these will trigger
  },
};

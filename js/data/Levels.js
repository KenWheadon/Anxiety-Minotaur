// js/data/Levels.js - Minotaur's Labyrinth level definitions

const LEVELS = {
  1: {
    name: "Home Sweet Home",
    description:
      "Prepare yourself mentally for the challenge ahead. When you're ready, tell duck it's time to start the day.",
    startLocation: MINOTAUR_BEDROOM,
    completionAchievement: READY_FOR_THE_DAY,
    completionMessage:
      "Time to head to the labyrinth and find the right allies!",
    locations: [MINOTAUR_BEDROOM, MINOTAUR_KITCHEN, MINOTAUR_GARDEN],
    characters: [DUCK_COMPANION],
    items: [
      ANXIETY_WORKBOOK,
      LETTER_FROM_MOM,
      BABY_DUCK_PHOTOS,
      DUCK_TREAT_RECIPE,
      LABYRINTH_BLUEPRINT,
    ],
    achievements: [READY_FOR_THE_DAY, TALKED_TO_DUCK, READ_MOMS_LETTER],
  },

  2: {
    name: "Labyrinth Preparation",
    description:
      "Explore the labyrinth, recruit 2 monsters and 1 trap maker, and gather intelligence on the incoming adventurer. Manage your social energy wisely!",
    startLocation: LABYRINTH_ENTRANCE,
    completionAchievement: RECRUITMENT_COMPLETE,
    completionMessage:
      "All preparations complete! Time to face the adventurer!",
    locations: [
      LABYRINTH_ENTRANCE,
      ANCIENT_LIBRARY,
      TREASURE_CHAMBER,
      MONSTER_BARRACKS,
      TRAP_WORKSHOP,
      CRYSTAL_CAVE,
      MEDITATION_GROVE,
      MARKET_SQUARE,
      PUZZLE_CHAMBER,
      SHADOW_ALCOVE,
    ],
    characters: [
      DUCK_COMPANION, // Energy restoration
      // Monsters (recruit 2 of 6)
      SKELETON_WARRIOR,
      DRAGON_HATCHLING,
      SPHINX,
      GIANT_SPIDER,
      SIREN,
      TROLL,
      // Trap Makers (recruit 1 of 4)
      COGWHEEL_KATE,
      PUZZLE_MASTER_PIP,
      ILLUSION_IRIS,
      PIT_BOSS_PETE,
      // Information Dealers (visit all 3)
      THE_LIBRARIAN,
      THE_MERCHANT_KING,
      THE_PHILOSOPHER,
    ],
    items: [
      // Monster clues
      WAR_MEDAL,
      POLISHED_SCALE,
      ANCIENT_SCROLL,
      SILK_THREAD,
      GOLDEN_HARP_STRING,
      TRADE_CONTRACT,
      // Trap maker clues
      CLOCKWORK_GEAR,
      CHESS_PIECE,
      KALEIDOSCOPE,
      HAMMER_HEAD,
      // Information dealer clues
      LIBRARY_CARD,
      MERCHANT_LEDGER,
      THINKING_STONE,
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
    startLocation: RESULT_CHAMBER,
    completionAchievement: null, // No interactive completion - just cutscenes
    completionMessage: "The challenge is complete!",
    locations: [RESULT_CHAMBER],
    characters: [], // No interactive characters in results level
    items: [], // No items to examine
    achievements: [DEFEATED_ADVENTURER, ADVENTURER_ESCAPED], // One of these will trigger
  },
};

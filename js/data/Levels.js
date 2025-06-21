// js/data/Levels.js - Anxiety Minotaur level definitions

const LEVELS = {
  1: {
    name: "Home Sweet Home",
    description:
      "Prepare yourself mentally for the challenge ahead. When you're ready, tell duck it's time to start the day.",
    startLocation: BEDROOM,
    completionAchievement: READY_FOR_THE_DAY,
    completionMessage:
      "Time to head to the labyrinth and find the right allies!",
    locations: [BEDROOM, LIVINGROOM, GARDEN],
    characters: [NPC_DUCK],
    items: [
      ITEM_DUCK,
      ITEM_MAMALETTER,
      ITEM_MAGGLASS,
      ITEM_HELP,
      YOU_IDLE,
      YOU_DUCK,
      PIG_DIG,
      TUTORIAL_PIG,
    ],
    achievements: [READY_FOR_THE_DAY, TALKED_TO_DUCK, READ_MOMS_LETTER],
  },
};

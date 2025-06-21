// js/data/Levels.js - Tutorial level for Anxiety Minotaur

const LEVELS = {
  1: {
    name: "Tutorial: Helping Your Neighbor",
    description:
      "Your gardener neighbor needs help identifying some seeds. Explore your home, talk to your duck for comfort, and help solve the mystery!",
    startLocation: BEDROOM,
    completionAchievement: TUTORIAL_COMPLETE,
    completionMessage:
      "Wonderful! You've successfully helped your neighbor and completed the tutorial!",
    locations: [BEDROOM, LIVINGROOM, GARDEN],
    characters: [NPC_DUCK, NPC_DUCK2, TUTORIAL_PIG],
    items: [
      ITEM_DUCK,
      ITEM_MAMALETTER,
      ITEM_HELP,
      ITEM_MAGGLASS,
      ITEM_STARSBOOK,
      ITEM_PAINT,
      TUTORIAL_SEED,
      PIG_DIG,
      YOU_IDLE,
      YOU_DUCK,
      YOU_SCARED,
      YOU_UNSURE,
    ],
    achievements: [TALKED_TO_DUCK, READ_MOMS_LETTER, TUTORIAL_COMPLETE],
  },
};

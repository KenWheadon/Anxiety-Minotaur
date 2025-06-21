// js/data/Achievements.js - All achievements for Minotaur's Labyrinth

const achievements = {
  // Level 1 achievements - Tutorial/Home
  [READY_FOR_THE_DAY]: {
    title: "Ready for the Day",
    description: "Told duck you're ready to start your labyrinth challenge!",
    hint: "Talk to duck about being ready when you've explored your home.",
    characterId: NPC_DUCK,
    isUnlocked: false,
  },

  [TALKED_TO_DUCK]: {
    title: "Best Friend",
    description: "Had your first conversation with your loyal duck companion.",
    hint: "Your duck is always there to listen and help you recharge.",
    characterId: NPC_DUCK,
    triggerKeywords: ["quack"], // Triggers on any duck response
    isUnlocked: false,
  },

  [READ_MOMS_LETTER]: {
    title: "Family Support",
    description: "Read the encouraging letter from mom. You can do this!",
    hint: "Check out the personal items in your home.",
    characterId: null, // Item interaction
    triggerKeywords: [],
    isUnlocked: false,
  },

  // NEW: Tutorial achievement
  [TUTORIAL_COMPLETE]: {
    title: "Green Thumb",
    description:
      "Successfully helped the gardener pig with their favorite plant!",
    hint: "Find what the pig needs and mention it in conversation.",
    characterId: TUTORIAL_PIG,
    triggerKeywords: [
      "roses",
      "tulips",
      "daisies",
      "sunflowers",
      "lilies",
      "peonies",
      "orchids",
    ],
    isUnlocked: false,
  },
};

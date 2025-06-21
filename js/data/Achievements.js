// js/data/Achievements.js - All achievements for Minotaur's Labyrinth

const achievements = {
  // Level 1 achievements - Tutorial/Home
  [TALKED_TO_DUCK]: {
    title: "Best Friend",
    description: "Had your first conversation with your loyal duck companion.",
    hint: "Your duck is always there to listen and help you recharge.",
    characterId: NPC_DUCK,
    triggerKeywords: ["quack"], // Triggers on any duck response
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

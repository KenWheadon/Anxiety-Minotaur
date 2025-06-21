// js/data/Achievements.js - Tutorial achievements for Anxiety Minotaur

const achievements = {
  // First conversation with duck companion
  [TALKED_TO_DUCK]: {
    title: "Best Friend",
    description: "Had your first conversation with your loyal duck companion.",
    hint: "Your duck is always there to listen and help you recharge.",
    characterId: NPC_DUCK,
    triggerKeywords: ["quack"], // Triggers on any duck response
    isUnlocked: false,
  },

  // Main tutorial completion - helping the pig with correct keyword
  [TUTORIAL_COMPLETE]: {
    title: "Green Thumb Helper",
    description:
      "Successfully helped your gardener neighbor identify their seeds!",
    hint: "Find what the pig needs by exploring the garden and mention it in conversation.",
    characterId: TUTORIAL_PIG,
    triggerKeywords: [], // Will be populated by KeywordGenerationManager
    isUnlocked: false,
  },
};

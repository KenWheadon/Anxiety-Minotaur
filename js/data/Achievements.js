// js/data/Achievements.js - Tutorial achievements for Anxiety Minotaur
// UPDATED: Added new achievements for expanded content

const achievements = {
  // ORIGINAL TUTORIAL ACHIEVEMENTS

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
    characterId: PIG,
    triggerKeywords: [], // Will be populated by KeywordGenerationManager
    isUnlocked: false,
  },

  // NEW ACHIEVEMENTS FOR EXPANDED CONTENT

  // Demon conversation achievement
  [MET_THE_DEMON]: {
    title: "Ancient Wisdom",
    description:
      "Engaged in deep philosophical conversation with the labyrinth's ancient guardian.",
    hint: "The demon in the labyrinth's heart enjoys discussing mystical and philosophical matters.",
    characterId: DEMON,
    triggerKeywords: []], // Will be populated by KeywordGenerationManager
    isUnlocked: false,
  },

  // KingKing conversation achievement
  [ROYAL_AUDIENCE]: {
    title: "Royal Recognition",
    description:
      "Earned the respect and acknowledgment of the noble guardian KingKing.",
    hint: "The royal guardian appreciates discussions of honor, justice, and nobility.",
    characterId: KINGKING,
    triggerKeywords: [], 
    isUnlocked: false,
  },

  // Sumo conversation achievement
  [WARRIOR_RESPECT]: {
    title: "Strength and Harmony",
    description:
      "Found balance between power and peace through conversation with the forest warrior.",
    hint: "The sumo warrior values strength, discipline, and respect for nature.",
    characterId: SUMO,
    triggerKeywords: [],
    isUnlocked: false,
  },

  // Item collection achievement
  [POTION_COLLECTOR]: {
    title: "Alchemist's Apprentice",
    description:
      "Discovered both the mystical green and red potions hidden throughout the realm.",
    hint: "Explore the forest and labyrinth entrance to find magical potions.",
    characterId: null, // Not tied to a specific character - exploration based
    triggerKeywords: [],
    isUnlocked: false,
  },

  // Exploration achievement
  [LABYRINTH_EXPLORER]: {
    title: "Brave Explorer",
    description:
      "Ventured into the mysterious labyrinth and discovered its ancient secrets.",
    hint: "Explore all the new areas beyond your home to unlock this achievement.",
    characterId: null, // Not tied to a specific character - exploration based
    triggerKeywords: [],
    isUnlocked: false,
  },
};

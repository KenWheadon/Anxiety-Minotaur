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
    itemId: TUTORIAL_SEED,
    keywordId: PIG_KEYWORDS,
    triggerKeywords: [], // Will be populated by KeywordGenerationManager
    isUnlocked: false,
  },

  // NEW ACHIEVEMENTS FOR EXPANDED CONTENT

  // Demon conversation achievement
  [MET_THE_DEMON]: {
    title: "Ancient Wisdom",
    description: "Helped the ancient demon with their mystical research.",
    hint: "The demon wants to know what magic adventurers will sense in their dragon scale!",
    characterId: DEMON,
    itemId: DRAGON_SCALE,
    keywordId: DEMON_KEYWORDS,
    triggerKeywords: [], // Will be randomly populated
    isUnlocked: false,
  },

  [ROYAL_AUDIENCE]: {
    title: "Royal Recognition",
    description: "Earned the respect of the noble guardian KingKing.",
    hint: "KingKing is too scared to touch the red potion - help them read what it says!",
    characterId: KINGKING,
    itemId: RED_POTION,
    keywordId: KINGKING_KEYWORDS,
    triggerKeywords: [], // Will be randomly populated
    isUnlocked: false,
  },

  [WARRIOR_RESPECT]: {
    title: "Warrior's Trust",
    description: "Gained the trust of the mighty forest warrior.",
    hint: "Sumo found a potion but doesn't know if it's safe - check what type it is!",
    characterId: SUMO,
    itemId: GREEN_POTION,
    keywordId: SUMO_KEYWORDS,
    triggerKeywords: [], // Will be randomly populated
    isUnlocked: false,
  },
};

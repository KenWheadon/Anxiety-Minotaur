const achievements = {
  // Level 1 achievements - Tutorial/Home
  [READY_FOR_THE_DAY]: {
    title: "Ready for the Day",
    description: "Told duck you're ready to start your labyrinth challenge!",
    hint: "Talk to duck about being ready when you've explored your home.",
    characterId: NPC_DUCK,
    triggerKeywords: ["ready", "start", "begin", "go", "day", "adventure"],
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

  // Level 2 achievements - Recruitment Progress
  [RECRUITED_FIRST_MONSTER]: {
    title: "First Ally",
    description: "Successfully recruited your first monster ally!",
    hint: "Find the right item clue and convince a monster to join you.",
    characterId: null, // Any monster
    triggerKeywords: ["join", "ally", "recruit", "help"],
    isUnlocked: false,
  },

  [RECRUITED_SECOND_MONSTER]: {
    title: "Monster Squad",
    description: "Recruited your second monster - your team is taking shape!",
    hint: "Two monsters should cover different adventurer types.",
    characterId: null, // Any monster
    triggerKeywords: ["join", "ally", "recruit", "help"],
    isUnlocked: false,
  },

  [HIRED_TRAP_MAKER]: {
    title: "Trap Expert",
    description:
      "Hired a skilled trap maker to enhance your labyrinth's defenses.",
    hint: "Find a trap maker whose skills match your strategy.",
    characterId: null, // Any trap maker
    triggerKeywords: ["hire", "contract", "build", "trap"],
    isUnlocked: false,
  },

  [LEARNED_FEAR_LEVEL]: {
    title: "Know Your Enemy's Fear",
    description:
      "Learned whether the incoming adventurer is brave or cowardly.",
    hint: "The Librarian knows about courage and fear.",
    characterId: INFO_LIB,
    triggerKeywords: ["fear", "brave", "courage", "coward"],
    isUnlocked: false,
  },

  [LEARNED_GREED_LEVEL]: {
    title: "Know Your Enemy's Greed",
    description:
      "Discovered how greedy or generous the incoming adventurer is.",
    hint: "The Merchant King understands the value of everything.",
    characterId: INFO_KING,
    triggerKeywords: ["greed", "generous", "treasure", "gold"],
    isUnlocked: false,
  },

  [LEARNED_PRIDE_LEVEL]: {
    title: "Know Your Enemy's Pride",
    description: "Learned about the adventurer's level of pride and humility.",
    hint: "The Philosopher sees all perspectives on pride.",
    characterId: INFO_PHIL,
    triggerKeywords: ["pride", "humble", "arrogant", "ego"],
    isUnlocked: false,
  },

  [RECRUITMENT_COMPLETE]: {
    title: "Preparation Complete",
    description:
      "Gathered all allies and intelligence needed for the challenge!",
    hint: "Recruit 2 monsters, hire 1 trap maker, and learn all 3 adventurer stats.",
    characterId: null,
    triggerKeywords: [],
    isUnlocked: false,
  },

  // Level 3 achievements - Results
  [DEFEATED_ADVENTURER]: {
    title: "Labyrinth Master",
    description: "Your strategy worked perfectly! The adventurer was defeated.",
    hint: "Match your monsters and traps to counter the adventurer's stats.",
    characterId: null,
    triggerKeywords: [],
    isUnlocked: false,
  },

  [KILLED_AT_HOME]: {
    title: "Learning Experience",
    description: "The adventurer escaped, but you learned valuable lessons.",
    hint: "Try different monster and trap combinations next time.",
    characterId: null,
    triggerKeywords: [],
    isUnlocked: false,
  },
};

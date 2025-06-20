const achievements = {
  // Level 1 achievements
  [NOT_STACKING_UP]: {
    title: "Not stacking up",
    description: "Hops is worried he's not stacking up to expectations!",
    hint: "We have to find a way to impress his Wife.",
    characterId: FROG_HOPS,
    triggerKeywords: ["not living up"],
    isUnlocked: false,
  },
  [HOP_TO_IT]: {
    title: "Hop to it",
    description: "You have your assignment - bust that Kingpin!",
    hint: "That trophy is gonna look good as a center piece.",
    characterId: FROG_PAPA_POLICE,
    triggerKeywords: ["Hop to it"],
    isUnlocked: false,
  },
  [LOST_THESE_IN_NAM]: {
    title: "Lost these in NAM",
    description: "Nothing like giving an arm and an arm for your city.",
    hint: "The frog gang ate his arms!",
    characterId: FROG_FLAD,
    triggerKeywords: ["ate my arms"],
    isUnlocked: false,
  },

  // Level 2 achievements
  [VIP_ACCESS]: {
    title: "VIP access",
    description: "What are you - a cop or something?",
    hint: "Ask Albino Tomato about his criminal past...",
    characterId: FROG_BOUNCER,
    triggerKeywords: ["VIP"],
    isUnlocked: false,
  },
  [SOUP_TO_GO]: {
    title: "The soup to go",
    description: "Who doesn't love leek in their soup.",
    hint: "Soup heads never gonna stop soup'in.",
    characterId: FROG_SOUPMAN,
    triggerKeywords: ["leek"],
    isUnlocked: false,
  },

  // Level 3 achievements - FIXED TO USE CONSTANTS AS KEYS
  [SPILLED_HIS_GUTS]: {
    title: "Spilled his guts",
    description:
      "Nothing quite like getting the Kingpin to spill his guts, on the other guts.",
    hint: "Nothing say, payday, like a liver!",
    characterId: FROG_KINGPIN,
    triggerKeywords: ["PICKLED organs"],
    isUnlocked: false,
  },
  [FOUND_THE_RAT]: {
    title: "Found the rat",
    description: "You've been found out.",
    hint: "Someone's been feeding info to the cops!",
    characterId: FROG_KINGPIN,
    triggerKeywords: ["rat trap"],
    isUnlocked: false,
  },
  [ONE_MORE_DRINK]: {
    title: "One more drink",
    description: "Albert's got some stories to tell when he's had enough.",
    hint: "Loose lips sink ships, especially with alcohol!",
    characterId: FROG_DRUNK,
    triggerKeywords: ["crunk time"],
    isUnlocked: false,
  },
  [NAME_GAME]: {
    title: "The name game",
    description: "Proved your memory skills to the mysterious gang member.",
    hint: "Remember everyone's names to impress the ghost!",
    characterId: FROG_GHOST,
    triggerKeywords: ["good show"],
    isUnlocked: false,
  },
  [ATOMIC_CLOCK]: {
    title: "Atomic clock",
    description: "Perfect timing makes all the difference.",
    hint: "Some deliveries need to be exactly on time!",
    characterId: FROG_PUNK,
    triggerKeywords: ["atomic"],
    isUnlocked: false,
  },
};

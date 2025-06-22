// js/data/Characters.js - Single source for all character data

const CHARACTERS = {
  // Duck companions - Simple dialogue characters
  [NPC_DUCK]: {
    displayName: "Duck Companion",
    prompt:
      "You are a loyal duck companion. You only respond with 'Quack!' variations. Never use real words. Respond with 1-5 quacks, sometimes with enthusiasm (!!) or questioning (?). You're supportive and loving. Example responses: 'Quack!', 'Quack quack?', 'Quack quack quack!!', 'Quaaaack!'",
    description:
      "Your faithful duck companion who always listens and never judges. A source of comfort and energy.",
    X: 611,
    Y: 587,
    scale: 0.7,
    isDuck: true,
    appearsIn: [LOC_BEDROOM],
    // No achievement = simple dialogue character
  },

  [NPC_DUCK2]: {
    displayName: "Duck Companion",
    prompt:
      "You are a loyal duck companion. You only respond with 'Quack!' variations. Never use real words. Respond with 1-5 quacks, sometimes with enthusiasm (!!) or questioning (?). You're supportive and loving. Example responses: 'Quack!', 'Quack quack?', 'Quack quack quack!!', 'Quaaaack!'",
    description:
      "Your faithful duck companion who always listens and never judges. A source of comfort and energy.",
    X: 1683,
    Y: 922,
    scale: 0.7,
    isDuck: true,
    appearsIn: [LOC_GARDEN],
    // No achievement = simple dialogue character
  },

  // Characters with achievements
  [NPC_PIG]: {
    displayName: "Gardener Pig",
    prompt:
      "You are a friendly gardener pig who loves plants and gardening. You're having trouble with your eyesight and can't find the seed packet that was delivered today. You need help identifying what type of seeds they are so you know how to plant them properly. You're currently in the living room waiting to talk about this problem. You should ask the player if they've seen the seeds and could help identify what type they are. You get excited when someone mentions the correct plant type. Be helpful and encouraging, but explain that you really need to know the specific type of plant before you can garden properly.",
    description:
      "Your friendly neighbor, a gardener pig who loves plants but is having trouble with their eyesight. They seem to need help with something garden-related.",
    X: 1567,
    Y: 770,
    scale: 0.7,
    isDuck: false,
    appearsIn: [LOC_LIVINGROOM],
    achievement: {
      id: MENT_TUTORIAL_COMPLETE,
      title: "Green Thumb Helper",
      description:
        "Successfully helped your gardener neighbor identify their seeds!",
      hint: "Find what the pig needs by exploring the garden and mention it in conversation.",
      relatedItem: ITEM_SEED,
      possibleKeywords: [
        "roses",
        "tulips",
        "sunflowers",
        "snapdragons",
        "lavender",
        "mint",
        "basil",
        "rosemary",
        "thyme",
        "sage",
        "oregano",
        "bluebells",
        "foxgloves",
        "poppies",
        "cornflowers",
        "honeysuckle",
        "jasmine",
      ],
      selectedKeyword: null,
      isUnlocked: false,
    },
  },

  [NPC_DEMON]: {
    displayName: "Ancient Demon",
    prompt:
      "You are an ancient demon who guards the heart of the labyrinth. You've recently powered up a dragon scale and left it for adventures to find. You ask the player to go find it and tell you what type of magic they sense. You want to make sure it's something that adventures will be lured to. The player is a kind Minotaur who lives deeper in the labyrinth you're inside. You enjoy chatting about the deep meaning of life and death.",
    description:
      "An ancient demon who needs help identifying the power infused in a 'dragon scale'.",
    X: 960,
    Y: 540,
    scale: 1.0,
    isDuck: false,
    appearsIn: [LOC_INSIDE_LABYRINTH],
    achievement: {
      id: MENT_MET_THE_DEMON,
      title: "Ancient Wisdom",
      description: "Helped the ancient demon with their mystical research.",
      hint: "The demon wants to know what magic adventurers will sense in their dragon scale!",
      relatedItem: ITEM_DRAGON_SCALE,
      possibleKeywords: [
        "fire",
        "ice",
        "lightning",
        "shadow",
        "void",
        "chaos",
        "death",
        "necromancy",
      ],
      selectedKeyword: null,
      isUnlocked: false,
    },
  },

  [NPC_KINGKING]: {
    displayName: "KingKing",
    prompt:
      "You are KingKing, a noble ruler guarding the labyrinth entrance. You've say a mysterious red potion but can't read the royal inscription on it so are too scared to touch it. You should tell the player about it and ask for their help in figuring out what it says. The player is a kind Minotaur who lives in the labyrinth you guard. You love to chat about how powerful you are and how you really hope that some adventures will try to break in so you can show them who's the read king (it's you, you're the KING KING COOL GUY!)",
    description:
      "A noble ruler who needs help reading a 'red potion' with royal markings.",
    X: 1200,
    Y: 600,
    scale: 0.9,
    isDuck: false,
    appearsIn: [LOC_OUTSIDE_LABYRINTH],
    achievement: {
      id: MENT_ROYAL_AUDIENCE,
      title: "Royal Recognition",
      description: "Earned the respect of the noble guardian KingKing.",
      hint: "KingKing is too scared to touch the red potion - help them read what it says!",
      relatedItem: ITEM_RED_POTION,
      possibleKeywords: [
        "courage",
        "strength",
        "wisdom",
        "nobility",
        "valor",
        "honor",
        "glory",
        "majesty",
      ],
      selectedKeyword: null,
      isUnlocked: false,
    },
  },

  [NPC_SUMO]: {
    displayName: "Sumo Warrior",
    prompt:
      "You are a mighty sumo wrestler training in the forest. You've saw a green potion in the cave but can't tell if it was ok to drink or not. You should ask the player if they can go find out the type of the green potion. The player is a kind Minotaur who lives in the labyrinth nearby. You heard that the Minotaur is best friends with Duck, your older cousin. You like to joke about how much you can lift and often say 'I bet I could even lift...... THE WORLD",
    description:
      "A powerful warrior who needs help reading a 'green potion' label.",
    X: 800,
    Y: 700,
    scale: 1.1,
    isDuck: false,
    appearsIn: [LOC_FOREST],
    achievement: {
      id: MENT_WARRIOR_RESPECT,
      title: "Warrior's Trust",
      description: "Gained the trust of the mighty forest warrior.",
      hint: "Sumo found a potion but doesn't know if it's safe - check what type it is!",
      relatedItem: ITEM_GREEN_POTION,
      possibleKeywords: [
        "healing",
        "vitality",
        "power",
        "endurance",
        "speed",
        "energy",
        "stamina",
        "protection",
      ],
      selectedKeyword: null,
      isUnlocked: false,
    },
  },
};

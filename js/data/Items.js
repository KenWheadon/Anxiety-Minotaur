const items = {
  // Level 1 Items - World Building
  [ITEM_DUCK]: {
    description:
      "Remember - if you find yourself anxious, just go pet your duck.",
    X: 200,
    Y: 300,
    scale: 0.5,
    img: ITEM_DUCK,
  },

  [ITEM_MAMALETTER]: {
    description:
      "Remember sweetie, read your books and make friends with your neighbours. PS - don't forget to pet the duck! Love you! ❤️",
    X: 400,
    Y: 200,
    scale: 0.4,
    img: ITEM_MAMALETTER,
  },

  [ITEM_HELP]: {
    description:
      "A book detailing how to defend from adventurers by getting intel and recruiting the right monsters and trap maker.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: ITEM_HELP,
  },

  [ITEM_MAGGLASS]: {
    description:
      "You often stare at the stars and contimplate why adventures are always trying to invade your home.",
    X: 500,
    Y: 350,
    scale: 0.4,
    img: ITEM_MAGGLASS,
  },

  // Level 2 Items - Monster Clues
  [ITEM_SKELETON]: {
    description:
      "A tarnished bronze medal with a faded ribbon, it has an eagle emblem and 'For Valor' inscription. There's a marking on the back.", //the shape of the marking is the skeletons KEY
    X: 350,
    Y: 600,
    scale: 0.4,
    img: ITEM_SKELETON,
    clueFor: MON_SKELETON,
  },

  [ITEM_SIREN]: {
    description:
      "A worn hammer, it has a faint smell that reminds you of the ocean. It also has a small engraved word on the handle.", //The word is the sirens KEY
    X: 380,
    Y: 380,
    scale: 0.2,
    img: ITEM_SIREN,
    clueFor: MON_SIREN,
  },

  [ITEM_DRAGON]: {
    description:
      "An iridescent dragon scale that shifts colors in the light - deep emerald to brilliant gold. It's small but perfectly formed, practically glowing with an emotion.", //the emotion is the dragons KEY
    X: 450,
    Y: 700,
    scale: 0.3,
    img: ITEM_DRAGON,
    clueFor: MON_DRAGON,
  },

  [ITEM_SPIDER]: {
    description:
      "Strong, shimmering thread wound carefully on a wooden spool. The craftsmanship is exquisite - each strand perfectly aligned with patience and artistic precision. It smells faintly.", //the smell is the spiders KEY
    X: 520,
    Y: 650,
    scale: 0.3,
    img: ITEM_SPIDER,
    clueFor: MON_SPIDER,
  },

  [ITEM_SPHINX]: {
    description:
      "A set of pictures, featuring potions, ingredients, and the Sphinx family. One photo stands out.", //The photo that stands out is the sphinxs KEY
    X: 280,
    Y: 320,
    scale: 0.5,
    img: ITEM_SPHINX,
    clueFor: MON_SPHINX,
  },

  [ITEM_TROLL]: {
    description:
      "A smooth stone that is quite astounding to look at. For some reason you lick it, and it has an obvious taste.", //The taste of the rock is the trolls KEY
    X: 420,
    Y: 750,
    scale: 0.4,
    img: ITEM_TROLL,
    clueFor: MON_TROLL,
  },

  // Level 2 Items - Trap Maker Clues
  [ITEM_KATE]: {
    description:
      "A precisely machined brass gear with perfect teeth and smooth rotation. The mechanical precision is mesmerizing - oddly reminds you of something.", //The thing you are reminded of is Kate's KEY
    X: 300,
    Y: 550,
    scale: 0.3,
    img: ITEM_KATE,
    clueFor: TRAP_KATE,
  },

  [ITEM_PIP]: {
    description:
      "A lovely letter from someone who clearly has feelings for Pip. Just line after line gushing about their love and admeration. They mention an idea for a date.", //The date idea is Pips KEY
    X: 480,
    Y: 420,
    scale: 0.3,
    img: ITEM_PIP,
    clueFor: TRAP_PIP,
  },

  [ITEM_IRIS]: {
    description:
      "A beautiful scroll, tightly bound from prying eyes and likely filled with magic beyond reason. The paper as a specific texture.", //The texture of the paper is Iris's KEY
    X: 400,
    Y: 480,
    scale: 0.4,
    img: ITEM_IRIS,
    clueFor: TRAP_IRIS,
  },

  // Level 2 Items - Information Dealer Clues
  [ITEM_LIB]: {
    description:
      "A worn library card with countless date stamps from the last 12 years. The signautre on the back in written in colored ink.", //The color of the ink is Libs KEY
    X: 250,
    Y: 280,
    scale: 0.3,
    img: ITEM_LIB,
    clueFor: INFO_LIB,
  },

  [ITEM_KING]: {
    description:
      "A contract for the best prices on all goods and services, granted to the Merchant King himself. The contract mentions a specific bylaw that is being exploited.", //The bylaw is Kings KEY
    X: 500,
    Y: 320,
    scale: 0.4,
    img: ITEM_KING,
    clueFor: INFO_KING,
  },

  [ITEM_PHIL]: {
    description:
      "A book containing the all of the party halls revenue numbers. It seems like they had a best selling drink - what an odd flavor.", //The odd flavor of drink is Phil's KEY
    X: 360,
    Y: 200,
    scale: 0.3,
    img: ITEM_PHIL,
    clueFor: INFO_PHIL,
  },

  //extras
  [ITEM_JACKET]: {
    description:
      "The inside pocket contains a crumpled photo of a young siren with defiant eyes and a cocky grin. One sleeve has battle damage - claw marks that perfectly match Giant Spider's leg span.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: ITEM_JACKET,
  },

  [ITEM_ART]: {
    description:
      "A book detailing how to defend from adventurers by getting intel and recruiting the right monsters and trap maker.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: ITEM_ART,
  },

  [ITEM_STARSBOOK]: {
    description:
      "A book detailing how to defend from adventurers by getting intel and recruiting the right monsters and trap maker.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: ITEM_STARSBOOK,
  },

  [ITEM_POTIONGREEN]: {
    description:
      "A round, bulbous bottle made of thick green glass, containing a luminescent liquid that bubbles continuously with an unsettling glow.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: ITEM_POTIONGREEN,
  },

  [ITEM_POTIONRED]: {
    description:
      "A tall, slender bottle made of clear crystal. The cork is sealed with black wax and marked with an alchemical symbol.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: ITEM_POTIONRED,
  },

  [ITEM_PAINT]: {
    description:
      "A wooden box filled with brushes that paint with light instead of pigment and bottles of liquid rainbow.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: ITEM_PAINT,
  },

  //Images of your character
  [YOU_IDLE]: {
    description:
      "You're worried about the day, but also excited to make your family proud.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: YOU_IDLE,
  },

  [YOU_DUCK]: {
    description:
      "No matter how anxious, your pet duck always makes you feel better.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: YOU_DUCK,
  },

  [YOU_DEAD]: {
    description:
      "Guess you didn't do your family proud - couldn't even survive one adventurer.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: YOU_DEAD,
  },

  [YOU_SCARED]: {
    description:
      "You can't stop thinking about how you still need to talk to more people.... this is the worst.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: YOU_SCARED,
  },

  [YOU_UNSURE]: {
    description:
      "You're worried about the day, but also excited to make your family proud.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: YOU_UNSURE,
  },
};

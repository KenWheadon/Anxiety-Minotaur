const items = {
  // Level 1 Items - World Building
  [ANXIETY_WORKBOOK]: {
    description:
      "Your well-worn copy of 'Social Anxiety for Minotaurs'. Chapter 3: 'Making Friends with Monsters' has lots of highlights and nervous doodles in the margins.",
    X: 200,
    Y: 300,
    scale: 0.5,
    img: ANXIETY_WORKBOOK,
  },

  [LETTER_FROM_MOM]: {
    description:
      "A letter from Mom: 'Remember sweetie, just be yourself! The labyrinth will be wonderful. The other minotaurs will be so proud. PS - don't forget to feed duck! Love you! ❤️'",
    X: 400,
    Y: 200,
    scale: 0.4,
    img: LETTER_FROM_MOM,
  },

  [BABY_DUCK_PHOTOS]: {
    description:
      "Adorable polaroids of duck as a tiny duckling. There's one of you both napping together, another of duck's first swim. The memories make you smile despite your nerves.",
    X: 300,
    Y: 400,
    scale: 0.3,
    img: BABY_DUCK_PHOTOS,
  },

  [DUCK_TREAT_RECIPE]: {
    description:
      "A hand-written recipe card: 'Duck's Favorite Breadcrumbs - Makes duck super happy!' with little drawings of smiling bread pieces. Your handwriting is surprisingly neat.",
    X: 500,
    Y: 350,
    scale: 0.4,
    img: DUCK_TREAT_RECIPE,
  },

  [LABYRINTH_BLUEPRINT]: {
    description:
      "Plans for your labyrinth covered in corrections, revisions, and nervous eraser marks. 'Version 47 - This time it'll work!' is written in the corner with determined handwriting.",
    X: 250,
    Y: 450,
    scale: 0.6,
    img: LABYRINTH_BLUEPRINT,
  },

  // Level 2 Items - Monster Clues
  [WAR_MEDAL]: {
    description:
      "A tarnished bronze medal with an eagle emblem and 'For Valor' inscription. The ribbon is faded but the weight of honor still feels heavy in your hands.",
    X: 350,
    Y: 600,
    scale: 0.4,
    img: WAR_MEDAL,
    clueFor: SKELETON_WARRIOR,
  },

  [POLISHED_SCALE]: {
    description:
      "An iridescent dragon scale that shifts colors in the light - deep emerald to brilliant gold. It's small but perfectly formed, practically glowing with draconic pride.",
    X: 450,
    Y: 700,
    scale: 0.3,
    img: POLISHED_SCALE,
    clueFor: DRAGON_HATCHLING,
  },

  [ANCIENT_SCROLL]: {
    description:
      "A preserved parchment containing complex geometric diagrams and philosophical equations. The knowledge seems to pulse with ancient wisdom and intellectual challenge.",
    X: 280,
    Y: 320,
    scale: 0.5,
    img: ANCIENT_SCROLL,
    clueFor: SPHINX,
  },

  [SILK_THREAD]: {
    description:
      "Strong, shimmering thread wound carefully on a wooden spool. The craftsmanship is exquisite - each strand perfectly aligned with patience and artistic precision.",
    X: 520,
    Y: 650,
    scale: 0.3,
    img: SILK_THREAD,
    clueFor: GIANT_SPIDER,
  },

  [GOLDEN_HARP_STRING]: {
    description:
      "A delicate golden string that hums melodiously in the breeze. Even the slightest touch produces beautiful notes that seem to demand an audience.",
    X: 380,
    Y: 380,
    scale: 0.2,
    img: GOLDEN_HARP_STRING,
    clueFor: SIREN,
  },

  [TRADE_CONTRACT]: {
    description:
      "A formal business document with official seals and careful legal language. 'Fair Payment Guaranteed' is stamped in bold letters - the mark of honest dealing.",
    X: 420,
    Y: 750,
    scale: 0.4,
    img: TRADE_CONTRACT,
    clueFor: TROLL,
  },

  // Level 2 Items - Trap Maker Clues
  [CLOCKWORK_GEAR]: {
    description:
      "A precisely machined brass gear with perfect teeth and smooth rotation. The mechanical precision is mesmerizing - clearly made by someone who loves how things work.",
    X: 300,
    Y: 550,
    scale: 0.3,
    img: CLOCKWORK_GEAR,
    clueFor: COGWHEEL_KATE,
  },

  [CHESS_PIECE]: {
    description:
      "An ornate king piece carved from dark wood with intricate details. It seems to radiate strategic thinking and intellectual superiority - a mastermind's tool.",
    X: 480,
    Y: 420,
    scale: 0.3,
    img: CHESS_PIECE,
    clueFor: PUZZLE_MASTER_PIP,
  },

  [KALEIDOSCOPE]: {
    description:
      "A beautiful tube that creates mesmerizing, ever-changing patterns when you look through it. Reality shifts and dances - nothing is quite what it seems.",
    X: 400,
    Y: 480,
    scale: 0.4,
    img: KALEIDOSCOPE,
    clueFor: ILLUSION_IRIS,
  },

  [HAMMER_HEAD]: {
    description:
      "A well-worn but perfectly balanced hammer head. Honest work has polished the metal smooth - the tool of someone who builds things to last.",
    X: 320,
    Y: 680,
    scale: 0.4,
    img: HAMMER_HEAD,
    clueFor: PIT_BOSS_PETE,
  },

  // Level 2 Items - Information Dealer Clues
  [LIBRARY_CARD]: {
    description:
      "A worn library card with countless date stamps and careful notations. 'Handle books with care' is printed in gentle letters - the mark of someone who treasures knowledge.",
    X: 250,
    Y: 280,
    scale: 0.3,
    img: LIBRARY_CARD,
    clueFor: THE_LIBRARIAN,
  },

  [MERCHANT_LEDGER]: {
    description:
      "A leather-bound book filled with careful calculations, profit margins, and trade records. Every transaction is meticulously recorded - the work of a master merchant.",
    X: 500,
    Y: 320,
    scale: 0.4,
    img: MERCHANT_LEDGER,
    clueFor: THE_MERCHANT_KING,
  },

  [THINKING_STONE]: {
    description:
      "A smooth, perfectly round stone that fits comfortably in your palm. Holding it seems to encourage deep contemplation and consideration of multiple perspectives.",
    X: 360,
    Y: 200,
    scale: 0.3,
    img: THINKING_STONE,
    clueFor: THE_PHILOSOPHER,
  },
};

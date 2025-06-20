const items = {
  // Level 1 item
  [ITEM_HOPS_PICTURE]: {
    description:
      "A picture showing Hops and his wife in a heart-themed frame. She looks so proud of him in his uniform... I wonder if he feels he's living up to her expectations?",
    X: 806,
    Y: 594,
    scale: 0.5,
    img: ITEM_HOPS_PICTURE,
  },
  [ITEM_FLAD_PICTURE]: {
    description:
      "A photo of Flad with his son, with 'Love you Dad' scrawled in crayon. Flad's robotic arms are clearly visible - there's a story behind those prosthetics.",
    X: 1363,
    Y: 367,
    scale: 0.5,
    img: ITEM_FLAD_PICTURE,
  },
  [ITEM_NOTE]: {
    description:
      "A note from the arrested criminal with an address scribbled on it - somewhere in the gang territory near uptown. This could be your ticket to infiltrating the frog gang.",
    X: 451,
    Y: 226,
    scale: 0.8,
    img: ITEM_NOTE,
  },

  // level 2 items
  [ITEM_BALLOONDOG]: {
    description:
      "A masterfully crafted balloon dog - clearly made by someone with serious artistic talent. You wonder if anyone around her has a secret passion for balloon animals. Maybe they'd love to hear someone appreciate this kind of artistry?",
    X: 1254,
    Y: 818,
    scale: 0.15,
    img: ITEM_BALLOONDOG,
  },
  [ITEM_BARREL]: {
    description:
      "A weathered barrel, you peak inside and see a bunch of balloon animals. Someone around here is embarrassed about their balloon hobby.",
    X: 963,
    Y: 729,
    scale: 0.3,
    img: ITEM_BARREL,
  },
  [ITEM_CAN]: {
    description:
      "A crumpled can, smells like it used to contain red frog - supossed to give you fly wings or something.",
    X: 1478,
    Y: 912,
    scale: 0.25,
    img: ITEM_CAN,
  },
  [ITEM_DUMPSTER]: {
    description:
      "A dumpster tagged with a neon frog skull. Inside, you find an empty can of 'Five Star Carrot Soup' - premium vegetable soup. Someone around here must have expensive tastes in soup. There's also deflated balloons mixed in with the trash.",
    X: 251,
    Y: 912,
    scale: 1,
    img: ITEM_DUMPSTER,
  },
  [ITEM_GARBAGECAN]: {
    description:
      "A dented garbage can overflowing with synthetic frog slime and... balloon animal instruction booklets? 'Balloon Animals for Beginners' and 'Advanced Twisting Techniques' are visible among the gang trash. Each signed -B.",
    X: 1443,
    Y: 825,
    scale: 1,
    img: ITEM_GARBAGECAN,
  },
  [ITEM_MATTRESS]: {
    description:
      "A disgusting mattress with suspicious green stains. The frogs crash here after all-night binges.",
    X: 1194,
    Y: 696,
    scale: 0.5,
    img: ITEM_MATTRESS,
  },
  [ITEM_RIM_TIRE]: {
    description:
      "A shiny rim and tire combo. The frogs are known for their underground drag races.",
    X: 445,
    Y: 847,
    scale: 0.5,
    img: ITEM_RIM_TIRE,
  },
  [ITEM_TIRE]: {
    description:
      "A lone tire. Rolled in from the gang’s latest getaway—or robery.",
    X: 714,
    Y: 793,
    scale: 0.5,
    img: ITEM_TIRE,
  },
  [ITEM_TRASH]: {
    description:
      "A pile of trash buzzing with robo flies. The frogs rigged it to spy on their own hideout enterence.",
    X: 655,
    Y: 760,
    scale: 0.75,
    img: ITEM_TRASH,
  },

  // Level 3 item
  [ITEM_TV]: {
    description:
      "A broken CRT TV with gang tags covering the screen. You can still make out audio saying something about... preservation techniques.",
    X: 1499,
    Y: 502,
    scale: 0.55,
    img: ITEM_TV,
  },
  [ITEM_CHAIR]: {
    description:
      "A worn leather chair by the fireplace where gang members relax and share war stories. The cushions are stained with... you'd rather not know what.",
    X: 1692,
    Y: 868,
    scale: 1,
    img: ITEM_CHAIR,
  },
  [ITEM_CASHBOX]: {
    description:
      "A box overflowing with dirty money from the gang's various 'businesses' - You've heard they run protection rackets and loan sharking operations.",
    X: 1349,
    Y: 1030,
    scale: 0.75,
    img: ITEM_CASHBOX,
  },
  [ITEM_DARTBOARD]: {
    description:
      "A dartboard riddled with holes and what looks like... organic stains. The gang uses this for 'practice' - though what they're practicing for is disturbing.",
    X: 1750,
    Y: 825,
    scale: 1,
    img: ITEM_DARTBOARD,
  },
  [ITEM_MAGAZINE]: {
    description:
      "A zine featuring Cucumber Gal, the frog supermodel. When she's on a cover it means there are coded gang meetup deets somewhere inside.",
    X: 1750,
    Y: 825,
    scale: 1,
    img: ITEM_MAGAZINE,
  },
  [ITEM_BOTTLES]: {
    description:
      "A collection of bottles, all brimming with liquids of different shades.",
    X: 982,
    Y: 727,
    scale: 0.5,
    img: ITEM_BOTTLES,
  },
  [ITEM_TRANSACTION_LOG]: {
    description:
      "You shouldn't be looking at this financial ledger while the Kingpin is right here but you do notice records of 'special deliveries' and 'biological asset management.",
    X: 1078,
    Y: 782,
    scale: 1,
    img: ITEM_TRANSACTION_LOG,
  },
  [ITEM_PLANT]: {
    description:
      "A plastic plant that's obviously fake - just like the gang's 'legitimate business' front. Nothing here is what it seems to be.",
    X: 1385,
    Y: 566,
    scale: 1,
    img: ITEM_PLANT,
  },
  [ITEM_PAPERSTACK]: {
    description:
      "Maybe you shouldn't rifle through these documents so openly. They appear to be medical reports and 'specimen quality assessments' - deeply disturbing stuff.",
    X: 1423,
    Y: 717,
    scale: 1,
    img: ITEM_PAPERSTACK,
  },
  [ITEM_PAINTING_JACKO]: {
    description:
      "A painting of the punk-looking frog with 'JACKO' written in bold letters below. He's one of the gang's key members",
    X: 713,
    Y: 296,
    scale: 1,
    img: ITEM_PAINTING_JACKO,
  },
  [ITEM_PAINTING_FROG]: {
    description:
      "A painting of an ancient frog elder, probably some kind of gang mythology or tribute to their criminal heritage. Even criminals have their legends.",
    X: 194,
    Y: 187,
    scale: 1,
    img: ITEM_PAINTING_FROG,
  },
  [ITEM_PAINTING_MECHA]: {
    description:
      "A painting of the mecha looking frog. It's labeled 'MECHA'....right on the nose with that name.",
    X: 1442,
    Y: 253,
    scale: 1,
    img: ITEM_PAINTING_MECHA,
  },
  [ITEM_TOILET]: {
    description:
      "A toilet sitting openly in the main area instead of a proper bathroom. Gang members have no shame - or maybe they just like asserting dominance through public displays.",
    X: 884,
    Y: 793,
    scale: 1,
    img: ITEM_TOILET,
  },
  [ITEM_CLOCK]: {
    description:
      "It's 2:50am. Thank goodness you can still read analog clocks.",
    X: 1040,
    Y: 274,
    scale: 1,
    img: ITEM_CLOCK,
  },
  [ITEM_LAMP]: {
    description:
      "A simple desk lamp, though it's probably seen things that would make most people sick. Gang hideouts aren't known for their cheerful atmosphere.",
    X: 348,
    Y: 620,
    scale: 1,
    img: ITEM_LAMP,
  },
  [FROG_PASSEDOUT]: {
    description:
      "This frog is completely unconscious and barely breathing. You can see recent surgical scars all over his chest.",
    X: 1376,
    Y: 1090,
    scale: 0.5,
    img: FROG_PASSEDOUT,
  },
};

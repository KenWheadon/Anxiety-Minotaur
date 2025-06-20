// js/data/Levels.js - Level definitions that REFERENCE data from other files

const LEVELS = {
  1: {
    name: "Level 1: The Assignment",
    description:
      "Get Papa Police to give out the assignment that every cop in the city has been talking about.",
    startLocation: OUTSIDE_POLICE_STATION,
    completionAchievement: HOP_TO_IT,
    completionMessage:
      "You've been assigned the task of taking down the Kingpin. Now to track down his hideout.",
    // FIXED: Reference locations from global locations object
    locations: [OUTSIDE_POLICE_STATION, POLICE_STATION, OFFICE],
    // FIXED: Reference characters from global characters object
    characters: [FROG_FLAD, FROG_HOPS, FROG_PAPA_POLICE, FROG_CUFFED],
    // FIXED: Reference items from global items object
    items: [ITEM_HOPS_PICTURE, ITEM_FLAD_PICTURE, ITEM_NOTE],
    // FIXED: Reference achievements from global achievements object
    achievements: [HOP_TO_IT, NOT_STACKING_UP, LOST_THESE_IN_NAM],
  },

  2: {
    name: "Level 2: Gang Territory",
    description: "Infiltrate the frog gang's territory and gain their trust",
    startLocation: OUTSIDE_GANG_CLUB,
    completionAchievement: VIP_ACCESS,
    completionMessage: "You've gained access to the gang's inner circle!",
    // FIXED: Reference existing locations
    locations: [OUTSIDE_GANG_CLUB, ALLEY_LEFT, ALLEY_RIGHT],
    // FIXED: Reference existing characters
    characters: [FROG_SOUPMAN, FROG_BOUNCER, FROG_HAPPYLEATHER],
    // FIXED: Reference existing items
    items: [
      ITEM_BALLOONDOG,
      ITEM_BARREL,
      ITEM_CAN,
      ITEM_DUMPSTER,
      ITEM_GARBAGECAN,
      ITEM_MATTRESS,
      ITEM_RIM_TIRE,
      ITEM_TIRE,
      ITEM_TRASH,
    ],
    // FIXED: Reference existing achievements
    achievements: [VIP_ACCESS, SOUP_TO_GO],
  },

  3: {
    name: "Level 3: The Confession",
    description:
      "Find out how to get the Kingpin to confess without raising suspicions that you're a cop.",
    startLocation: HIDEOUT_BAR,
    completionAchievement: SPILLED_HIS_GUTS,
    completionMessage:
      "You got enough info to have Frog Kingpin arrested and executed without trial!",
    locations: [
      HIDEOUT_BAR,
      HIDEOUT_BATHROOM,
      HIDEOUT_KINGPIN_OFFICE,
      HIDEOUT_LOUNGE,
      HIDEOUT_WAITINGROOM,
    ],
    characters: [
      FROG_DRUNK,
      FROG_FLAD_LOVE,
      FROG_GHOST,
      FROG_PUNK,
      FROG_MECHA,
      FROG_TALL,
      FROG_KINGPIN,
    ],
    items: [
      ITEM_BOTTLES,
      ITEM_CASHBOX,
      ITEM_CHAIR,
      ITEM_CLOCK,
      ITEM_DARTBOARD,
      ITEM_PAINTING_FROG,
      ITEM_PAINTING_JACKO,
      ITEM_PAINTING_MECHA,
      ITEM_LAMP,
      ITEM_MAGAZINE,
      ITEM_PAPERSTACK,
      ITEM_PLANT,
      ITEM_TOILET,
      ITEM_TRANSACTION_LOG,
      ITEM_TV,
      FROG_PASSEDOUT,
    ],
    // FIXED: Include ALL Level 3 achievements
    achievements: [
      SPILLED_HIS_GUTS,
      FOUND_THE_RAT,
      ONE_MORE_DRINK,
      NAME_GAME,
      ATOMIC_CLOCK,
    ],
  },
};

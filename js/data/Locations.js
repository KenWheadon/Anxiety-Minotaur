const locations = {
  // Level 1 locations
  [OFFICE]: {
    description:
      "The secret frog gang hideout - dimly lit and full of suspicious activity",
    characters: [FROG_PAPA_POLICE],
    items: [ITEM_NOTE],
    locations: [POLICE_STATION],
    background: OFFICE,
  },
  [OUTSIDE_POLICE_STATION]: {
    description: "A police station - where it all begins.",
    characters: [FROG_FLAD],
    items: [],
    locations: [POLICE_STATION],
    background: OUTSIDE_POLICE_STATION,
  },
  [POLICE_STATION]: {
    description: "A police station - where it all begins.",
    characters: [FROG_HOPS, FROG_CUFFED],
    items: [ITEM_HOPS_PICTURE, ITEM_FLAD_PICTURE],
    locations: [OUTSIDE_POLICE_STATION, OFFICE],
    background: POLICE_STATION,
  },

  [OUTSIDE_GANG_CLUB]: {
    description:
      "It's totally not close to the secret hideout of a super cool frog gang.",
    characters: [FROG_SOUPMAN],
    items: [ITEM_DUMPSTER, ITEM_GARBAGECAN],
    locations: [ALLEY_LEFT, ALLEY_RIGHT],
    background: OUTSIDE_GANG_CLUB,
  },
  [ALLEY_LEFT]: {
    description: "An alley, this one is a deadend.",
    characters: [FROG_HAPPYLEATHER],
    items: [ITEM_MATTRESS, ITEM_TIRE, ITEM_BARREL, ITEM_BALLOONDOG],
    locations: [OUTSIDE_GANG_CLUB],
    background: ALLEY_LEFT,
  },
  [ALLEY_RIGHT]: {
    description: "An alley, looks like a deadend.",
    characters: [FROG_BOUNCER],
    items: [ITEM_RIM_TIRE, ITEM_CAN, ITEM_TRASH],
    locations: [OUTSIDE_GANG_CLUB],
    background: ALLEY_RIGHT,
  },

  // Level 3 location
  [HIDEOUT_BAR]: {
    description:
      "The secret frog gang hideout - dimly lit and full of suspicious activity",
    characters: [FROG_DRUNK, FROG_FLAD_LOVE],
    items: [ITEM_TV],
    locations: [HIDEOUT_BATHROOM, HIDEOUT_LOUNGE],
    background: HIDEOUT_BAR,
  },
  [HIDEOUT_BATHROOM]: {
    description:
      "The secret frog gang hideout - dimly lit and full of suspicious activity",
    characters: [FROG_MECHA],
    items: [FROG_PASSEDOUT, ITEM_TOILET],
    locations: [HIDEOUT_BAR],
    background: HIDEOUT_BATHROOM,
  },
  [HIDEOUT_LOUNGE]: {
    description:
      "The secret frog gang hideout - dimly lit and full of suspicious activity",
    characters: [FROG_PUNK, FROG_GHOST],
    items: [ITEM_CHAIR, ITEM_PAINTING_FROG, ITEM_PAINTING_JACKO, ITEM_BOTTLES],
    locations: [HIDEOUT_BAR, HIDEOUT_WAITINGROOM],
    background: HIDEOUT_LOUNGE,
  },
  [HIDEOUT_WAITINGROOM]: {
    description:
      "The secret frog gang hideout - dimly lit and full of suspicious activity",
    characters: [FROG_TALL],
    items: [ITEM_PAINTING_MECHA, ITEM_LAMP, ITEM_PLANT, ITEM_CASHBOX],
    locations: [HIDEOUT_KINGPIN_OFFICE, HIDEOUT_LOUNGE],
    background: HIDEOUT_WAITINGROOM,
  },
  [HIDEOUT_KINGPIN_OFFICE]: {
    description:
      "The secret frog gang hideout - dimly lit and full of suspicious activity",
    characters: [FROG_KINGPIN],
    items: [ITEM_CLOCK, ITEM_PAPERSTACK, ITEM_TRANSACTION_LOG],
    locations: [HIDEOUT_WAITINGROOM],
    background: HIDEOUT_KINGPIN_OFFICE,
  },
};

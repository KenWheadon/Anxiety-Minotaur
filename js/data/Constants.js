// js/data/Constants.js - Anxiety Minotaur constants with centralized asset paths
// UPDATED: Added new characters, items, and locations

const LEVELE0_BG = "level0_bg";

// Location constants (Level 1 - Expanded Home and Labyrinth)
const BEDROOM = "BEDROOM";
const LIVINGROOM = "LIVINGROOM";
const GARDEN = "GARDEN";
// NEW LOCATIONS
const MIDDLE_OF_LABYRINTH = "MIDDLE_OF_LABYRINTH";
const OUTSIDE_LABYRINTH = "OUTSIDE_LABYRINTH";
const FOREST = "FOREST";

//Level 1 Characters (Original)
const NPC_DUCK = "npc_duck";
const NPC_DUCK2 = "npc_duck2";
const PIG = "PIG";
// NEW CHARACTERS
const DEMON = "demon";
const KINGKING = "kingking";
const SUMO = "sumo";

//You Frames
const YOU_IDLE = "you_idle";
const YOU_DUCK = "you_duck";
const YOU_SCARED = "you_scared";
const YOU_UNSURE = "you_unsure";

// Item constants (Level 1 - Expanded World Building)
const ITEM_DUCK = "item_duck";
const ITEM_HELP = "item_help";
const ITEM_MAGGLASS = "item_magglass";
const ITEM_STARSBOOK = "item_starbook"; // Fixed typo from "item_starsbook"
const ITEM_MAMALETTER = "item_mamaletter";
const TUTORIAL_SEED = "tutorial_seed";
const PIG_DIG = "pig_dig";
// NEW ITEMS
const GREEN_POTION = "green_potion";
const RED_POTION = "red_potion";
const DRAGON_SCALE = "dragon_scale";

// Achievement constants (Level 1 - Expanded)
const TALKED_TO_DUCK = "TALKED_TO_DUCK";
const TUTORIAL_COMPLETE = "tutorial_complete";
// NEW ACHIEVEMENTS
const MET_THE_DEMON = "met_the_demon";
const ROYAL_AUDIENCE = "royal_audience";
const WARRIOR_RESPECT = "warrior_respect";
const POTION_COLLECTOR = "potion_collector";
const LABYRINTH_EXPLORER = "labyrinth_explorer";

// ========================================
// ASSET PATH CONFIGURATION
// ========================================
// Single source of truth for all game assets

const ASSET_PATHS = {
  // Background images
  backgrounds: {
    [BEDROOM]: "images/backgrounds/bedroom.png",
    [LIVINGROOM]: "images/backgrounds/livingroom.png",
    [GARDEN]: "images/backgrounds/garden.png",
    [LEVELE0_BG]: "images/backgrounds/level0_bg.png",
    // NEW BACKGROUNDS
    [MIDDLE_OF_LABYRINTH]: "images/backgrounds/inside_labyrinth.png",
    [OUTSIDE_LABYRINTH]: "images/backgrounds/outside_labyrinth.png",
    [FOREST]: "images/backgrounds/forest.png",
  },

  // Character images (interactive NPCs)
  characters: {
    [NPC_DUCK]: "images/characters/duck.png",
    [NPC_DUCK2]: "images/characters/duck.png", // Same image, different instance
    [PIG]: "images/characters/pig.png",
    // NEW CHARACTER IMAGES
    [DEMON]: "images/characters/demon.png",
    [KINGKING]: "images/characters/royal.png",
    [SUMO]: "images/characters/sumo.png",
  },

  // Item images (including "you_" images for descriptions)
  items: {
    [ITEM_DUCK]: "images/items/self_help_book.png",
    [ITEM_HELP]: "images/items/defending_for_dummies_book.png",
    [ITEM_MAGGLASS]: "images/items/magglass.png",
    [ITEM_STARSBOOK]: "images/items/starbook.png", // Fixed typo
    [ITEM_MAMALETTER]: "images/items/mamaletter.png",
    [TUTORIAL_SEED]: "images/items/seed.png",
    [PIG_DIG]: "images/items/pig_dig.png",
    [YOU_IDLE]: "images/items/idle.png", // Correctly in items (descriptions)
    [YOU_DUCK]: "images/items/holding_duck.png", // Correctly in items (descriptions)
    [YOU_SCARED]: "images/items/scared.png", // Correctly in items (descriptions)
    [YOU_UNSURE]: "images/items/unsure.png", // Correctly in items (descriptions)
    // NEW ITEM IMAGES
    [GREEN_POTION]: "images/items/green_potion.png",
    [RED_POTION]: "images/items/red_potion.png",
    [DRAGON_SCALE]: "images/items/dragon_scale.png",
  },

  // Audio files (optional - only if you have them)
  audio: {
    backgroundMusic: {
      level1: "music/level1_background.mp3",
    },
    soundEffects: {
      click: "effects/ui_click.mp3",
      achievement: "effects/achievement.mp3",
      discovery: "effects/discovery.mp3",
      chatOpen: "effects/chat_open.mp3",
      characterInteract: "effects/character_interact.mp3",
      itemExamine: "effects/item_examine.mp3",
      locationChange: "effects/location_change.mp3",
      uiHover: "effects/ui_hover.mp3",
    },
  },
};

// ========================================
// HELPER FUNCTIONS FOR ASSET ACCESS
// ========================================

// Get all asset paths as a flat map for AssetManager
function getAllAssetPaths() {
  const allPaths = {};

  // Add backgrounds
  Object.entries(ASSET_PATHS.backgrounds).forEach(([key, path]) => {
    allPaths[key.toLowerCase()] = path;
  });

  // Add characters
  Object.entries(ASSET_PATHS.characters).forEach(([key, path]) => {
    allPaths[key.toLowerCase()] = path;
  });

  // Add items
  Object.entries(ASSET_PATHS.items).forEach(([key, path]) => {
    allPaths[key.toLowerCase()] = path;
  });

  return allPaths;
}

// Get asset path by key (with fallback)
function getAssetPath(assetKey, category = null) {
  const key = assetKey.toUpperCase();

  if (category) {
    return ASSET_PATHS[category]?.[key] || null;
  }

  // Search all categories
  for (const categoryPaths of Object.values(ASSET_PATHS)) {
    if (categoryPaths[key]) {
      return categoryPaths[key];
    }
  }

  return null;
}

// Get category from asset key
function getAssetCategory(assetKey) {
  const key = assetKey.toUpperCase();

  if (ASSET_PATHS.backgrounds[key]) return "background";
  if (ASSET_PATHS.characters[key]) return "character";
  if (ASSET_PATHS.items[key]) return "item";

  return "unknown";
}

// EXPANDED: Keywords for more diverse interactions
const PIG_KEYWORDS = [
  // Original starter keywords
  "roses",
  "tulips",
  "sunflowers",

  // Popular Garden Flowers (8)
  "snapdragons",

  // Herbs & Aromatic Plants (7)
  "lavender",
  "mint",
  "basil",
  "rosemary",
  "thyme",
  "sage",
  "oregano",

  // Wildflowers & Native Plants (7)
  "bluebells",
  "foxgloves",
  "poppies",
  "cornflowers",
  "honeysuckle",
  "jasmine",
];

// NEW: Character-specific keywords for new achievements
const DEMON_KEYWORDS = [
  "darkness",
  "shadow",
  "fire",
  "soul",
  "power",
  "magic",
  "ancient",
  "ritual",
  "spell",
  "curse",
];

const KINGKING_KEYWORDS = [
  "kingdom",
  "crown",
  "royal",
  "honor",
  "justice",
  "rule",
  "noble",
  "majesty",
  "decree",
  "court",
];

const SUMO_KEYWORDS = [
  "strength",
  "honor",
  "fight",
  "warrior",
  "training",
  "discipline",
  "respect",
  "tournament",
  "champion",
  "balance",
];

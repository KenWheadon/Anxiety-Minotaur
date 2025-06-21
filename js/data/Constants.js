// js/data/Constants.js - Anxiety Minotaur constants with centralized asset paths

const LEVELE0_BG = "level0_bg";

// Location constants (Level 1 - Home)
const BEDROOM = "BEDROOM";
const LIVINGROOM = "LIVINGROOM";
const GARDEN = "GARDEN";

//Level 1 Character
const NPC_DUCK = "npc_duck";
const NPC_DUCK2 = "npc_duck2";
const TUTORIAL_PIG = "tutorial_pig";

//You Frames
const YOU_IDLE = "you_idle";
const YOU_DUCK = "you_duck";
const YOU_SCARED = "you_scared";
const YOU_UNSURE = "you_unsure";

// Item constants (Level 1 - World Building)
const ITEM_DUCK = "item_duck";
const ITEM_HELP = "item_help";
const ITEM_MAGGLASS = "item_magglass";
const ITEM_STARSBOOK = "item_starbook"; // Fixed typo from "item_starsbook"
const ITEM_MAMALETTER = "item_mamaletter";
const TUTORIAL_SEED = "tutorial_seed";
const PIG_DIG = "pig_dig";

// Achievement constants (Level 1)
const TALKED_TO_DUCK = "TALKED_TO_DUCK";
const TUTORIAL_COMPLETE = "tutorial_complete";

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
  },

  // Character images (interactive NPCs)
  characters: {
    [NPC_DUCK]: "images/characters/npc_duck.png",
    [NPC_DUCK2]: "images/characters/npc_duck.png", // Same image, different instance
    [TUTORIAL_PIG]: "images/characters/tutorial_pig.png",
  },

  // Item images (including "you_" images for descriptions)
  items: {
    [ITEM_DUCK]: "images/items/item_duck.png",
    [ITEM_HELP]: "images/items/item_help.png",
    [ITEM_MAGGLASS]: "images/items/item_magglass.png",
    [ITEM_STARSBOOK]: "images/items/item_starbook.png", // Fixed typo
    [ITEM_MAMALETTER]: "images/items/item_mamaletter.png",
    [TUTORIAL_SEED]: "images/items/tutorial_seed.png",
    [PIG_DIG]: "images/items/pig_dig.png",
    [YOU_IDLE]: "images/items/you_idle.png", // Correctly in items (descriptions)
    [YOU_DUCK]: "images/items/you_duck.png", // Correctly in items (descriptions)
    [YOU_SCARED]: "images/items/you_scared.png", // Correctly in items (descriptions)
    [YOU_UNSURE]: "images/items/you_unsure.png", // Correctly in items (descriptions)
  },

  // Audio files (optional - only if you have them)
  audio: {
    backgroundMusic: {
      level1: "music/level1_background.mp3",
      level2: "music/level2_background.mp3",
      level3: "music/level3_background.mp3",
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

const TUTORIAL_PIG_KEYWORDS = [
  // Original 7 starter keywords
  "roses",
  "tulips",
  "daisies",
  "sunflowers",
  "lilies",
  "peonies",
  "orchids",

  // 30 Additional keywords - categorized for variety

  // Popular Garden Flowers (8)
  "marigolds",
  "petunias",
  "carnations",
  "violets",
  "zinnias",
  "cosmos",
  "pansies",
  "snapdragons",

  // Herbs & Aromatic Plants (7)
  "lavender",
  "mint",
  "basil",
  "rosemary",
  "thyme",
  "sage",
  "oregano",

  // Vegetables (8)
  "tomatoes",
  "carrots",
  "lettuce",
  "peppers",
  "radishes",
  "beans",
  "peas",
  "spinach",

  // Wildflowers & Native Plants (7)
  "bluebells",
  "foxgloves",
  "poppies",
  "cornflowers",
  "honeysuckle",
  "jasmine",
  "forget-me-nots",
];

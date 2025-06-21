// js/systems/KeywordGenerationManager.js
// Dynamic Keyword Generation & Item Description System for Minotaur's Labyrinth

class KeywordGenerationManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.characterKeywords = new Map();
    this.unlockedCharacters = new Set();
    this.originalItemDescriptions = new Map(); // Store originals for reference

    this.generateAllKeywords();
    this.updateAllItemDescriptions();
    this.setupEventListeners();

    console.log("🔑 Keyword Generation Manager initialized");
  }

  // Generate all keywords at game start
  generateAllKeywords() {
    console.log("🎲 Generating keywords for all characters...");

    // Keyword pools for different character types
    const keywordPools = {
      // Monster keywords - things that fit their personalities
      monsters: {
        [MON_SKELETON]: [
          "triangle",
          "diamond",
          "star",
          "circle",
          "cross",
          "sword",
          "shield",
        ],
        [MON_SIREN]: [
          "melody",
          "harmony",
          "song",
          "rhythm",
          "tune",
          "echo",
          "chorus",
        ],
        [MON_DRAGON]: [
          "pride",
          "envy",
          "joy",
          "rage",
          "hope",
          "greed",
          "power",
        ],
        [MON_SPIDER]: [
          "lavender",
          "roses",
          "mint",
          "pine",
          "ocean",
          "vanilla",
          "cedar",
        ],
        [MON_SPHINX]: [
          "glowing",
          "faded",
          "torn",
          "pristine",
          "ancient",
          "mysterious",
          "wise",
        ],
        [MON_TROLL]: [
          "sweet",
          "salty",
          "bitter",
          "sour",
          "spicy",
          "tangy",
          "bland",
        ],
      },

      // Trap maker keywords - things related to their crafts
      trapMakers: {
        [TRAP_KATE]: [
          "clockwork",
          "steam",
          "gears",
          "pistons",
          "springs",
          "machinery",
          "precision",
        ],
        [TRAP_PIP]: [
          "picnic",
          "stargazing",
          "dancing",
          "hiking",
          "sailing",
          "gardening",
          "cooking",
        ],
        [TRAP_IRIS]: [
          "silk",
          "velvet",
          "cotton",
          "linen",
          "satin",
          "wool",
          "leather",
        ],
      },

      // Information dealer keywords - specific details they'd know
      infoDealers: {
        [INFO_LIB]: [
          "blue",
          "red",
          "green",
          "purple",
          "gold",
          "silver",
          "black",
        ],
        [INFO_KING]: [
          "section",
          "clause",
          "paragraph",
          "amendment",
          "article",
          "subsection",
          "provision",
        ],
        [INFO_PHIL]: [
          "cherry",
          "lemon",
          "apple",
          "grape",
          "orange",
          "strawberry",
          "peach",
        ],
      },

      // Tutorial keywords for Level 1
      tutorial: {
        tutorial_pig: [
          "roses",
          "tulips",
          "daisies",
          "sunflowers",
          "lilies",
          "peonies",
          "orchids",
        ],
      },
    };

    // Generate random keyword for each character
    Object.entries(keywordPools).forEach(([category, characters]) => {
      Object.entries(characters).forEach(([characterId, keywords]) => {
        const selectedKeyword =
          keywords[Math.floor(Math.random() * keywords.length)];
        this.characterKeywords.set(characterId, selectedKeyword);
        console.log(`🔑 ${characterId}: "${selectedKeyword}"`);
      });
    });

    console.log(
      "🎲 All keywords generated:",
      Object.fromEntries(this.characterKeywords)
    );
  }

  // Update all item descriptions to include the keywords directly
  updateAllItemDescriptions() {
    console.log("📝 Updating item descriptions with keywords...");

    // Store original descriptions first
    Object.entries(items).forEach(([itemKey, itemData]) => {
      if (itemData.description) {
        this.originalItemDescriptions.set(itemKey, itemData.description);
      }
    });

    // Update each item with its character's keyword
    const itemUpdates = {
      // Monster clue items
      [ITEM_SKELETON]: {
        character: MON_SKELETON,
        template: (keyword) =>
          `A tarnished bronze medal with a faded ribbon, it has an eagle emblem and 'For Valor' inscription. On the back is a clear marking shaped like a ${keyword}.`,
      },

      [ITEM_SIREN]: {
        character: MON_SIREN,
        template: (keyword) =>
          `A worn hammer with a faint ocean smell. Engraved on the handle in small letters is the word "${keyword}".`,
      },

      [ITEM_DRAGON]: {
        character: MON_DRAGON,
        template: (keyword) =>
          `An iridescent dragon scale that shifts colors in the light - deep emerald to brilliant gold. It's perfectly formed and practically glowing with ${keyword}.`,
      },

      [ITEM_SPIDER]: {
        character: MON_SPIDER,
        template: (keyword) =>
          `Strong, shimmering thread wound carefully on a wooden spool. The craftsmanship is exquisite - each strand perfectly aligned with patience and artistic precision. It smells distinctly of ${keyword}.`,
      },

      [ITEM_SPHINX]: {
        character: MON_SPHINX,
        template: (keyword) =>
          `A set of pictures featuring potions, ingredients, and the Sphinx family. One photo stands out - it appears to be ${keyword} compared to the others.`,
      },

      [ITEM_TROLL]: {
        character: MON_TROLL,
        template: (keyword) =>
          `A smooth stone that's quite astounding to look at. For some reason you lick it, and it has a distinctly ${keyword} taste.`,
      },

      // Trap maker clue items
      [ITEM_KATE]: {
        character: TRAP_KATE,
        template: (keyword) =>
          `A precisely machined brass gear with perfect teeth and smooth rotation. The mechanical precision is mesmerizing - it strongly reminds you of ${keyword}.`,
      },

      [ITEM_PIP]: {
        character: TRAP_PIP,
        template: (keyword) =>
          `A lovely letter from someone who clearly has feelings for Pip. Line after line gushing about their love and admiration. They suggest a romantic ${keyword} date.`,
      },

      [ITEM_IRIS]: {
        character: TRAP_IRIS,
        template: (keyword) =>
          `A beautiful scroll, tightly bound from prying eyes and likely filled with magic beyond reason. The paper has a distinctive ${keyword} texture.`,
      },

      // Information dealer clue items
      [ITEM_LIB]: {
        character: INFO_LIB,
        template: (keyword) =>
          `A worn library card with countless date stamps from the last 12 years. The signature on the back is written in ${keyword} ink.`,
      },

      [ITEM_KING]: {
        character: INFO_KING,
        template: (keyword) =>
          `A contract for the best prices on all goods and services, granted to the Merchant King himself. The contract specifically mentions exploiting ${keyword} 12.`,
      },

      [ITEM_PHIL]: {
        character: INFO_PHIL,
        template: (keyword) =>
          `A book containing all of the party hall's revenue numbers. It seems like they had a best selling drink - ${keyword} flavored.`,
      },
    };

    // Apply updates to actual item descriptions
    Object.entries(itemUpdates).forEach(([itemKey, updateData]) => {
      const keyword = this.characterKeywords.get(updateData.character);
      if (keyword && items[itemKey]) {
        const newDescription = updateData.template(keyword);
        items[itemKey].description = newDescription;
        console.log(`📝 Updated ${itemKey}: "${newDescription}"`);
      }
    });

    console.log("📝 All item descriptions updated with keywords");
  }

  // Add tutorial content for Level 1
  addTutorialContent() {
    if (this.gameEngine.currentLevel !== 1) return;

    const tutorialKeyword = this.characterKeywords.get("tutorial_pig");
    if (!tutorialKeyword) return;

    // Add tutorial pig character (using existing NPC_SUMO as placeholder)
    characters["tutorial_pig"] = {
      prompt: `You are a friendly gardener pig who loves plants and gardening. You get especially excited when someone mentions ${tutorialKeyword} - they're your absolute favorite! You're currently digging holes and working in your garden.`,
      description:
        "A cheerful pig tending to a garden outside your house. They seem to be working on something specific...",
      X: 400,
      Y: 600,
      scale: 1,
      img: NPC_SUMO, // Using sumo as placeholder for pig
      isTutorial: true,
    };

    // Add tutorial item with clear keyword (using existing seed item as placeholder)
    items["tutorial_seed"] = {
      description: `A packet of ${tutorialKeyword} seeds. Perfect for any gardener who loves ${tutorialKeyword}!`,
      X: 350,
      Y: 650,
      scale: 1,
      img: ITEM_MAMALETTER, // Using letter as placeholder for seed packet
      clueFor: "tutorial_pig",
    };

    // Add to Level 1 house location
    if (locations[LEVEL1_HOUSE]) {
      if (!locations[LEVEL1_HOUSE].characters.includes("tutorial_pig")) {
        locations[LEVEL1_HOUSE].characters.push("tutorial_pig");
      }
      if (!locations[LEVEL1_HOUSE].items.includes("tutorial_seed")) {
        locations[LEVEL1_HOUSE].items.push("tutorial_seed");
      }
    }

    console.log(`🐷 Tutorial content added: pig likes ${tutorialKeyword}`);
  }

  // Check if player message contains the correct keyword
  checkForKeyword(characterId, playerMessage) {
    const keyword = this.characterKeywords.get(characterId);
    if (!keyword) return false;

    // Check for exact word match (case insensitive)
    const messageWords = playerMessage.toLowerCase().split(/\W+/);
    const found = messageWords.includes(keyword.toLowerCase());

    console.log(
      `🔑 Checking ${characterId} for "${keyword}": ${
        found ? "FOUND" : "not found"
      }`
    );
    console.log(`🔑 Player words: [${messageWords.join(", ")}]`);

    return found;
  }

  // Unlock character when correct keyword is mentioned
  unlockCharacter(characterId) {
    if (this.unlockedCharacters.has(characterId)) {
      console.log(`🔑 ${characterId} already unlocked`);
      return false;
    }

    this.unlockedCharacters.add(characterId);
    this.showUnlockEffect(characterId);
    this.modifyCharacterPrompt(characterId);

    // Emit event for recruitment system
    GameEvents.emit("CHARACTER_UNLOCKED", {
      characterId,
      keyword: this.characterKeywords.get(characterId),
    });

    console.log(`✅ Character unlocked: ${characterId}`);
    return true;
  }

  // Show visual unlock effect with checkmark
  showUnlockEffect(characterId) {
    const characterElement = document.querySelector(
      `[data-key="${characterId}"]`
    );
    if (!characterElement) return;

    // Remove any existing checkmark
    const existingCheckmark =
      characterElement.querySelector(".unlock-checkmark");
    if (existingCheckmark) {
      existingCheckmark.remove();
    }

    // Create new checkmark
    const checkmark = document.createElement("div");
    checkmark.className = "unlock-checkmark";
    checkmark.innerHTML = "✅";
    checkmark.style.cssText = `
      position: absolute;
      top: -15px;
      right: -15px;
      font-size: 28px;
      z-index: 1000;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      pointer-events: none;
    `;

    // Ensure parent has relative positioning
    characterElement.style.position = "relative";
    characterElement.appendChild(checkmark);

    // Animate checkmark appearance with GSAP
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        checkmark,
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(2)",
        }
      );

      // Add glow effect to character
      gsap.to(characterElement, {
        boxShadow: "0 0 20px rgba(0, 255, 0, 0.6)",
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });
    } else {
      // Fallback CSS animation
      checkmark.style.animation = "bounceIn 0.6s ease-out";
    }
  }

  // Modify character prompt to be helpful after unlock
  modifyCharacterPrompt(characterId) {
    const character = characters[characterId];
    if (!character) return;

    // Store original prompt if not already stored
    if (!character.originalPrompt) {
      character.originalPrompt = character.prompt;
    }

    // Add helpful behavior to prompt
    const helpfulAddition =
      "\n\nIMPORTANT: You are now excited and willing to help! You offer to join their cause and assist with defending the labyrinth. You're enthusiastic about working together.";

    character.prompt = character.originalPrompt + helpfulAddition;

    console.log(`🔑 Modified ${characterId} prompt to be helpful`);
  }

  // Setup event listeners for conversation integration
  setupEventListeners() {
    // Listen for conversation messages to check for keywords
    GameEvents.on("CONVERSATION_MESSAGE_SENT", (data) => {
      const { characterId, message } = data;

      // Skip if already unlocked
      if (this.unlockedCharacters.has(characterId)) return;

      // Check for keyword match
      if (this.checkForKeyword(characterId, message)) {
        this.unlockCharacter(characterId);
      }
    });

    // Listen for level changes to add tutorial content
    GameEvents.on("LEVEL_CHANGED", (data) => {
      if (data.level === 1) {
        this.addTutorialContent();
      }
    });
  }

  // Utility methods
  getKeywordForCharacter(characterId) {
    return this.characterKeywords.get(characterId);
  }

  isCharacterUnlocked(characterId) {
    return this.unlockedCharacters.has(characterId);
  }

  getUnlockedCharacters() {
    return Array.from(this.unlockedCharacters);
  }

  // Debug method to show all keywords (remove in production)
  debugShowAllKeywords() {
    console.log("🔍 DEBUG - All Character Keywords:");
    this.characterKeywords.forEach((keyword, characterId) => {
      console.log(`  ${characterId}: "${keyword}"`);
    });
  }
}

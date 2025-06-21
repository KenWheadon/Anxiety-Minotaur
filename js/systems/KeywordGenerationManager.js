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
      // Tutorial keywords for Level 1
      tutorial: {
        tutorial_pig: TUTORIAL_PIG_KEYWORDS,
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
      [TUTORIAL_SEED]: {
        character: TUTORIAL_PIG,
        template: (keyword) =>
          `A packet of seeds, I think pig wants to know what seeds he bought. I better tell him that these seeds are ${keyword}.`,
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
    if (locations[BEDROOM]) {
      if (!locations[BEDROOM].characters.includes("tutorial_pig")) {
        locations[BEDROOM].characters.push("tutorial_pig");
      }
      if (!locations[BEDROOM].items.includes("tutorial_seed")) {
        locations[BEDROOM].items.push("tutorial_seed");
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

// js/systems/KeywordGenerationManager.js
// UPDATED: Now properly accesses keywords from keywords.js data structure

class KeywordGenerationManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.characterKeywords = new Map(); // Character ID -> single keyword
    this.unlockedCharacters = new Set();
    this.isInitialized = false;
    this.keywordAchievements = []; // Will store achievements that have keyword systems

    // Setup event listeners but don't generate keywords yet
    this.setupEventListeners();

    console.log(
      "🔑 Simplified Keyword Generation Manager created (not initialized)"
    );
  }

  // Lazy initialization - called when game is ready
  async initialize() {
    if (this.isInitialized) {
      console.log("🔑 Keyword manager already initialized");
      return;
    }

    console.log("🔑 Initializing achievement-driven keyword generation...");

    // Find all achievements with keyword systems
    this.discoverKeywordAchievements();

    // Generate keywords for all keyword-enabled achievements
    this.generateAllKeywords();

    // Update all linked item descriptions
    this.updateAllItemDescriptions();

    this.isInitialized = true;

    console.log("🔑 Achievement-driven Keyword Generation Manager initialized");
    console.log(
      `🔑 Managing ${this.keywordAchievements.length} keyword-enabled achievements`
    );
  }

  // UPDATED: Find all achievements that have keyword systems
  discoverKeywordAchievements() {
    console.log("🔍 Discovering keyword-enabled achievements...");

    if (typeof achievements === "undefined") {
      console.warn("🔍 No achievements data available");
      return;
    }

    if (typeof keywords === "undefined") {
      console.warn("🔍 No keywords data available");
      return;
    }

    this.keywordAchievements = [];

    Object.entries(achievements).forEach(
      ([achievementKey, achievementData]) => {
        // Check if this achievement has all the required keyword fields
        if (
          achievementData.characterId &&
          achievementData.itemId &&
          achievementData.keywordId
        ) {
          // Verify the character exists
          if (
            typeof characters !== "undefined" &&
            characters[achievementData.characterId]
          ) {
            // Verify the item exists
            if (typeof items !== "undefined" && items[achievementData.itemId]) {
              // UPDATED: Check if keywords exist in the keywords data structure
              if (
                keywords[achievementData.keywordId] &&
                Array.isArray(keywords[achievementData.keywordId])
              ) {
                this.keywordAchievements.push({
                  achievementKey,
                  achievementData,
                  characterId: achievementData.characterId,
                  itemId: achievementData.itemId,
                  keywordArray: keywords[achievementData.keywordId], // UPDATED: Access from keywords object
                });

                console.log(`🔍 Found keyword achievement: ${achievementKey}`);
                console.log(`    Character: ${achievementData.characterId}`);
                console.log(`    Item: ${achievementData.itemId}`);
                console.log(
                  `    Keywords: ${achievementData.keywordId} (${
                    keywords[achievementData.keywordId].length
                  } options)`
                );
              } else {
                console.warn(
                  `🔍 Achievement ${achievementKey}: keyword array ${achievementData.keywordId} not found in keywords data`
                );
              }
            } else {
              console.warn(
                `🔍 Achievement ${achievementKey}: item ${achievementData.itemId} not found`
              );
            }
          } else {
            console.warn(
              `🔍 Achievement ${achievementKey}: character ${achievementData.characterId} not found`
            );
          }
        }
      }
    );

    console.log(
      `🔍 Discovery complete: ${this.keywordAchievements.length} keyword achievements found`
    );
  }

  // SIMPLE: Generate keywords for all keyword achievements
  generateAllKeywords() {
    console.log("🎲 Generating keywords for all keyword achievements...");

    this.keywordAchievements.forEach((config) => {
      // Pick random keyword from this achievement's keyword array
      const selectedKeyword =
        config.keywordArray[
          Math.floor(Math.random() * config.keywordArray.length)
        ];
      this.characterKeywords.set(config.characterId, selectedKeyword);

      console.log(
        `🔑 ${config.characterId} keyword: "${selectedKeyword}" (for ${config.achievementKey})`
      );
    });

    // Emit event for dependency injection (AchievementManager)
    GameEvents.emit("KEYWORDS_GENERATED", {
      characterKeywords: new Map(this.characterKeywords),
    });

    console.log("🎲 Keyword generation complete");
  }

  // SIMPLE: Update item descriptions for all keyword achievements
  updateAllItemDescriptions() {
    console.log(
      "📝 Updating item descriptions for all keyword achievements..."
    );

    this.keywordAchievements.forEach((config) => {
      const keyword = this.characterKeywords.get(config.characterId);

      if (!keyword) {
        console.warn(
          `📝 No keyword found for ${config.characterId}, skipping item update`
        );
        return;
      }

      if (!items[config.itemId]) {
        console.warn(`📝 Item ${config.itemId} not found, skipping`);
        return;
      }

      // Simply replace {keyword} placeholder in the item's existing description
      const originalDescription = items[config.itemId].description;
      const updatedDescription = originalDescription.replace(
        /\{keyword\}/gi,
        keyword
      );

      items[config.itemId].description = updatedDescription;
      console.log(
        `📝 Updated ${config.itemId} description with keyword: "${keyword}"`
      );
      console.log(`📝   Before: ${originalDescription}`);
      console.log(`📝   After: ${updatedDescription}`);
    });

    console.log("📝 All item descriptions updated");
  }

  // Check for the exact keyword match for ANY character
  checkForKeyword(characterId, playerMessage) {
    if (!this.isInitialized) {
      console.warn("🔑 Keyword manager not initialized yet");
      return false;
    }

    const keyword = this.characterKeywords.get(characterId);
    if (!keyword) {
      console.log(`🔑 No keyword found for ${characterId}`);
      return false;
    }

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

    // Emit event for achievement system
    GameEvents.emit(GAME_EVENTS.CHARACTER_UNLOCK, {
      type: "character_unlock",
      characterKey: characterId,
      keyword: this.characterKeywords.get(characterId),
      timestamp: Date.now(),
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

    // Animate checkmark appearance
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
    }
  }

  // Setup event listeners for conversation integration
  setupEventListeners() {
    // Listen for conversation messages to check for keywords
    GameEvents.on(GAME_EVENTS.CONVERSATION_MESSAGE, (eventData) => {
      if (!this.isInitialized) return;

      const { characterKey, message } = eventData;

      // Skip if already unlocked
      if (this.unlockedCharacters.has(characterKey)) return;

      // Check for keyword match
      if (this.checkForKeyword(characterKey, message)) {
        this.unlockCharacter(characterKey);
      }
    });

    console.log("🔑 Event listeners setup complete");
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

  // Get all generated keywords (for debugging)
  getAllKeywords() {
    return Object.fromEntries(this.characterKeywords);
  }

  // Get discovered achievements (for debugging)
  getKeywordAchievements() {
    return this.keywordAchievements.map((config) => ({
      achievement: config.achievementKey,
      character: config.characterId,
      item: config.itemId,
      keywordCount: config.keywordArray.length,
      selectedKeyword: this.characterKeywords.get(config.characterId),
    }));
  }

  // Debug method to show keywords and configurations
  debugShowKeywords() {
    if (!this.isInitialized) {
      console.log("🔍 Keyword manager not initialized yet");
      return;
    }

    console.log("🔍 DEBUG - Achievement-Driven Keywords:");
    this.keywordAchievements.forEach((config) => {
      const selectedKeyword = this.characterKeywords.get(config.characterId);
      console.log(`  ${config.achievementKey}:`);
      console.log(`    Character: ${config.characterId}`);
      console.log(`    Item: ${config.itemId}`);
      console.log(`    Selected: "${selectedKeyword}"`);
      console.log(`    Options: [${config.keywordArray.join(", ")}]`);
    });
  }

  // Reset for new game
  reset() {
    this.characterKeywords.clear();
    this.unlockedCharacters.clear();
    this.keywordAchievements = [];
    this.isInitialized = false;
    console.log("🔄 Achievement-driven keyword system reset");
  }

  // Check if initialized (for external checks)
  getInitializationStatus() {
    return this.isInitialized;
  }
}

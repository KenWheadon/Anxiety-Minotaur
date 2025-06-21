// js/systems/KeywordGenerationManager.js
// FIXED: Dynamic Keyword Generation for Anxiety Minotaur Tutorial with Lazy Initialization

class KeywordGenerationManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.characterKeywords = new Map(); // Character ID -> single keyword
    this.unlockedCharacters = new Set();
    this.isInitialized = false;

    // Setup event listeners but don't generate keywords yet
    this.setupEventListeners();

    console.log("🔑 Keyword Generation Manager created (not initialized)");
  }

  // FIXED: Lazy initialization - called when game is ready
  async initialize() {
    if (this.isInitialized) {
      console.log("🔑 Keyword manager already initialized");
      return;
    }

    console.log("🔑 Initializing keyword generation manager...");

    // Generate keywords and update descriptions
    this.generateAllKeywords();
    this.updateAllItemDescriptions();
    this.isInitialized = true;

    console.log("🔑 Keyword Generation Manager initialized for tutorial");
  }

  // FIXED: Generate exactly ONE keyword per character
  generateAllKeywords() {
    console.log("🎲 Generating tutorial keywords...");

    // Generate one random keyword for the tutorial pig
    const selectedKeyword =
      TUTORIAL_PIG_KEYWORDS[
        Math.floor(Math.random() * TUTORIAL_PIG_KEYWORDS.length)
      ];
    this.characterKeywords.set(TUTORIAL_PIG, selectedKeyword);

    console.log(`🔑 Tutorial pig keyword: "${selectedKeyword}"`);

    // Emit event for dependency injection instead of direct modification
    GameEvents.emit("KEYWORDS_GENERATED", {
      characterKeywords: new Map(this.characterKeywords),
    });

    console.log("🎲 Tutorial keyword generation complete");
  }

  // Update item descriptions to include the generated keyword
  updateAllItemDescriptions() {
    console.log("📝 Updating tutorial item descriptions...");

    const pigKeyword = this.characterKeywords.get(TUTORIAL_PIG);
    if (pigKeyword && items[TUTORIAL_SEED]) {
      // Update the seed description to include the specific keyword
      items[
        TUTORIAL_SEED
      ].description = `A seed packet labeled "${pigKeyword}" that was delivered today. The gardener pig needs help identifying what type of seeds these are so they know how to plant them properly.`;

      console.log(
        `📝 Updated seed packet description with keyword: ${pigKeyword}`
      );
    }

    console.log("📝 Tutorial item descriptions updated");
  }

  // FIXED: Check for the exact keyword match for a specific character
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
    } else {
      // Fallback CSS animation
      checkmark.style.animation = "bounceIn 0.6s ease-out";
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

    console.log("🔑 Tutorial keyword event listeners setup complete");
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

  // Debug method to show keywords
  debugShowKeywords() {
    if (!this.isInitialized) {
      console.log("🔍 Keyword manager not initialized yet");
      return;
    }

    console.log("🔍 DEBUG - Tutorial Keywords:");
    this.characterKeywords.forEach((keyword, characterId) => {
      console.log(`  ${characterId}: "${keyword}"`);
    });
  }

  // Reset for new game
  reset() {
    this.characterKeywords.clear();
    this.unlockedCharacters.clear();
    this.isInitialized = false;
    console.log("🔄 Keyword system reset for new tutorial");
  }

  // Check if initialized (for external checks)
  getInitializationStatus() {
    return this.isInitialized;
  }
}

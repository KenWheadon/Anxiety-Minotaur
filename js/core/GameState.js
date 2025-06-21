// js/core/GameState.js - Fixed social energy system for all levels + Victory Persistence

class GameState {
  constructor() {
    this.gameId = Date.now();
    this.version = "4.0";
    this.currentLocation = null;
    this.currentLevel = 1;
    this.unlockedAchievements = new Set();
    this.conversationHistory = new Map();
    this.itemsExamined = new Set();
    this.isFirstTimeLoad = true;
    this.maxSocialEnergy = CONFIG.MAX_SOCIAL_ENERGY;

    // ADDED: Track tutorial completion for victory screen persistence
    this.tutorialCompleted = false;

    // Initialize social energy for all levels
    this.socialEnergy = CONFIG.STARTING_SOCIAL_ENERGY;

    // Game progress tracking
    this.gameProgress = {
      startTime: Date.now(),
      conversationsHad: 0,
      energyRestored: 0,
      statsLearned: 0,
    };

    console.log("🎮 GameState initialized for Anxiety Minotaur");
  }

  // Initialize game state for a new level
  initializeForLevel(levelNumber) {
    console.log(`🎯 Initializing game state for Level ${levelNumber}`);

    this.currentLevel = levelNumber;

    // Always ensure social energy is available
    if (this.socialEnergy === undefined || this.socialEnergy === null) {
      this.socialEnergy = CONFIG.STARTING_SOCIAL_ENERGY;
    }
    console.log(
      `💝 Social energy: ${this.socialEnergy}/${this.maxSocialEnergy}`
    );
  }

  // Always allow social energy tracking
  shouldTrackSocialEnergy() {
    return true; // Available in all levels now
  }

  // ADDED: Mark tutorial as completed (called when victory first achieved)
  markTutorialCompleted() {
    if (!this.tutorialCompleted) {
      this.tutorialCompleted = true;
      console.log("🎉 Tutorial marked as completed in GameState");
      this.save(); // Save immediately
      return true;
    }
    return false;
  }

  // UPDATED: More robust tutorial completion check
  isTutorialCompleted() {
    // Check both the flag AND the achievement for backwards compatibility
    return this.tutorialCompleted || this.hasAchievement(TUTORIAL_COMPLETE);
  }

  // Restore energy (duck conversations) - works in all levels
  restoreEnergy(amount = CONFIG.DUCK_ENERGY_RESTORE) {
    const oldEnergy = this.socialEnergy;
    this.socialEnergy = Math.min(
      this.maxSocialEnergy,
      this.socialEnergy + amount
    );
    const restored = this.socialEnergy - oldEnergy;

    if (restored > 0) {
      this.gameProgress.energyRestored += restored;
      console.log(
        `💝 Energy restored: +${restored} (${oldEnergy} → ${this.socialEnergy})`
      );
      return true;
    }

    return false;
  }

  // Spend energy (conversations) - works in all levels but only deducts in Level 2+
  spendEnergy(amount = CONFIG.CONVERSATION_ENERGY_COST) {
    // Only deduct energy in Level 2 and beyond
    if (this.currentLevel < 2) {
      return true; // No energy cost in Level 1
    }

    if (this.socialEnergy >= amount) {
      this.socialEnergy -= amount;
      console.log(
        `💔 Energy spent: -${amount} (${this.socialEnergy + amount} → ${
          this.socialEnergy
        })`
      );
      return true;
    }

    return false; // Not enough energy
  }

  // Add conversation to history
  addConversation(characterKey, playerMessage, characterResponse) {
    if (!this.conversationHistory.has(characterKey)) {
      this.conversationHistory.set(characterKey, []);
    }

    const conversation = {
      timestamp: Date.now(),
      player: playerMessage,
      character: characterResponse,
    };

    this.conversationHistory.get(characterKey).push(conversation);
    this.gameProgress.conversationsHad++;

    // Keep only last 10 conversations per character to manage memory
    const history = this.conversationHistory.get(characterKey);
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    console.log(
      `💬 Added conversation with ${characterKey} (${history.length} total)`
    );
  }

  // Get conversation history for a character
  getConversationHistory(characterKey) {
    return this.conversationHistory.get(characterKey) || [];
  }

  // Add examined item
  addExaminedItem(itemKey) {
    this.itemsExamined.add(itemKey);
    console.log(`🔍 Item examined: ${itemKey}`);
  }

  // Check if item was examined
  hasExaminedItem(itemKey) {
    return this.itemsExamined.has(itemKey);
  }

  // Unlock achievement
  unlockAchievement(achievementKey) {
    if (!this.unlockedAchievements.has(achievementKey)) {
      this.unlockedAchievements.add(achievementKey);
      console.log(`🏆 Achievement unlocked: ${achievementKey}`);
      return true;
    }
    return false;
  }

  // Check if achievement is unlocked
  hasAchievement(achievementKey) {
    return this.unlockedAchievements.has(achievementKey);
  }

  // Get all unlocked achievements
  getUnlockedAchievements() {
    return Array.from(this.unlockedAchievements);
  }

  // UPDATED: Save game state - include tutorialCompleted
  save() {
    try {
      const saveData = {
        gameId: this.gameId,
        version: this.version,
        currentLocation: this.currentLocation,
        currentLevel: this.currentLevel,
        socialEnergy: this.socialEnergy,
        maxSocialEnergy: this.maxSocialEnergy,
        tutorialCompleted: this.tutorialCompleted, // ADDED: Save tutorial completion
        unlockedAchievements: Array.from(this.unlockedAchievements),
        conversationHistory: Object.fromEntries(
          Array.from(this.conversationHistory.entries()).map(([key, value]) => [
            key,
            value.slice(-5), // Save only last 5 conversations per character
          ])
        ),
        itemsExamined: Array.from(this.itemsExamined),
        gameProgress: this.gameProgress,
        saveTime: Date.now(),
      };

      localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(saveData));
      console.log(`📂 Game saved (${this.constructor.name} v${this.version})`);
      return true;
    } catch (error) {
      console.error("❌ Failed to save game:", error);
      return false;
    }
  }

  // UPDATED: Load game state - include tutorialCompleted
  load() {
    try {
      const saveData = localStorage.getItem(CONFIG.SAVE_KEY);
      if (!saveData) {
        console.log("📂 No save data found");
        return false;
      }

      const data = JSON.parse(saveData);

      // Load basic state
      this.gameId = data.gameId || Date.now();
      this.version = data.version || "4.0";
      this.currentLocation = data.currentLocation;
      this.currentLevel = data.currentLevel || 1;
      this.socialEnergy = data.socialEnergy || CONFIG.STARTING_SOCIAL_ENERGY;
      this.maxSocialEnergy = data.maxSocialEnergy || CONFIG.MAX_SOCIAL_ENERGY;

      // Load tutorial completion status
      this.tutorialCompleted = data.tutorialCompleted || false;

      // Load achievements
      this.unlockedAchievements = new Set(data.unlockedAchievements || []);

      // ADDED: Backwards compatibility - if achievement exists but flag doesn't, sync them
      if (this.hasAchievement(TUTORIAL_COMPLETE) && !this.tutorialCompleted) {
        console.log(
          "🔧 Legacy save detected - syncing tutorial completion flag"
        );
        this.tutorialCompleted = true;
        // Will be saved automatically by the game engine
      }

      // Load conversation history
      this.conversationHistory = new Map();
      if (data.conversationHistory) {
        Object.entries(data.conversationHistory).forEach(([key, value]) => {
          this.conversationHistory.set(key, value);
        });
      }

      // Load examined items
      this.itemsExamined = new Set(data.itemsExamined || []);

      // Load game progress
      this.gameProgress = {
        startTime: Date.now(),
        conversationsHad: 0,
        energyRestored: 0,
        ...data.gameProgress,
      };

      this.isFirstTimeLoad = false;
      console.log(`📂 Game loaded (${this.constructor.name} v${this.version})`);
      console.log(`🎉 Tutorial completed status: ${this.tutorialCompleted}`);
      console.log(
        `🏆 Tutorial achievement unlocked: ${this.hasAchievement(
          TUTORIAL_COMPLETE
        )}`
      );

      return true;
    } catch (error) {
      console.error("❌ Failed to load game:", error);
      return false;
    }
  }

  // UPDATED: Reset game state - clear tutorialCompleted
  reset() {
    this.gameId = Date.now();
    this.currentLocation = null;
    this.currentLevel = 1;
    this.socialEnergy = CONFIG.STARTING_SOCIAL_ENERGY;
    this.tutorialCompleted = false; // ADDED: Reset tutorial completion
    this.unlockedAchievements = new Set();
    this.conversationHistory = new Map();
    this.itemsExamined = new Set();
    this.gameProgress = {
      startTime: Date.now(),
      conversationsHad: 0,
      energyRestored: 0,
      statsLearned: 0,
    };

    console.log("🔄 Game state reset");
  }

  // Clean up
  destroy() {
    if (this.conversationHistory) {
      this.conversationHistory.clear();
    }
    console.log("🗑️ Game state destroyed");
  }
}

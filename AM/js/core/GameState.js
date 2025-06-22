// js/core/GameState.js - Version bump to invalidate old saves and ensure social energy starts at 0

class GameState {
  constructor() {
    this.gameId = Date.now();
    this.version = "8.0";
    this.currentLocation = null;
    this.currentLevel = 1;
    this.unlockedAchievements = new Set();
    this.conversationHistory = new Map();
    this.itemsExamined = new Set();
    this.isFirstTimeLoad = true;
    this.maxSocialEnergy = CONFIG.MAX_SOCIAL_ENERGY;

    // Track tutorial completion for victory screen persistence
    this.tutorialCompleted = false;

    // Social energy always starts at 0 for new games
    this.socialEnergy = 0;

    // Game progress tracking
    this.gameProgress = {
      startTime: Date.now(),
      conversationsHad: 0,
      energyRestored: 0,
      statsLearned: 0,
    };

    console.log("🎮 GameState v5.0 initialized - Social energy starts at 0");
  }

  // Initialize game state for a new level
  initializeForLevel(levelNumber) {
    console.log(`🎯 Initializing game state for Level ${levelNumber}`);

    this.currentLevel = levelNumber;

    // For new games, always start social energy at 0
    if (this.socialEnergy === undefined || this.socialEnergy === null) {
      this.socialEnergy = 0;
    }

    console.log(
      `💝 Social energy: ${this.socialEnergy}/${this.maxSocialEnergy}`
    );
  }

  // Always allow social energy tracking
  shouldTrackSocialEnergy() {
    return true;
  }

  // Mark tutorial as completed (called when victory first achieved)
  markTutorialCompleted() {
    if (!this.tutorialCompleted) {
      this.tutorialCompleted = true;
      console.log("🎉 Tutorial marked as completed in GameState");
      this.save();
      return true;
    }
    return false;
  }

  // More robust tutorial completion check
  isTutorialCompleted() {
    return (
      this.tutorialCompleted || this.hasAchievement(MENT_TUTORIAL_COMPLETE)
    );
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

  // Spend energy (conversations) - now works in all levels
  spendEnergy(amount = CONFIG.CONVERSATION_ENERGY_COST) {
    if (this.socialEnergy >= amount) {
      this.socialEnergy -= amount;
      console.log(
        `💔 Energy spent: -${amount} (${this.socialEnergy + amount} → ${
          this.socialEnergy
        })`
      );
      return true;
    }

    return false;
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

    // Keep only last 10 conversations per character
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

  // Save game state - include tutorialCompleted
  save() {
    try {
      const saveData = {
        gameId: this.gameId,
        version: this.version, // This will now be "5.0"
        currentLocation: this.currentLocation,
        currentLevel: this.currentLevel,
        socialEnergy: this.socialEnergy,
        maxSocialEnergy: this.maxSocialEnergy,
        tutorialCompleted: this.tutorialCompleted,
        unlockedAchievements: Array.from(this.unlockedAchievements),
        conversationHistory: Object.fromEntries(
          Array.from(this.conversationHistory.entries()).map(([key, value]) => [
            key,
            value.slice(-5),
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

  // ENHANCED: Load with version checking to invalidate old saves
  load() {
    try {
      const saveData = localStorage.getItem(CONFIG.SAVE_KEY);
      if (!saveData) {
        console.log("📂 No save data found - starting fresh");
        return false;
      }

      const data = JSON.parse(saveData);

      // VERSION CHECK: Invalidate old save versions
      if (!data.version || data.version !== this.version) {
        console.log(
          `📂 Save version mismatch: found ${data.version}, expected ${this.version}`
        );
        console.log("📂 Starting fresh game due to version update");

        // Clear the old save data
        localStorage.removeItem(CONFIG.SAVE_KEY);

        return false; // This will trigger a fresh start
      }

      // Load basic state (only if version matches)
      this.gameId = data.gameId || Date.now();
      this.version = data.version;
      this.currentLocation = data.currentLocation;
      this.currentLevel = data.currentLevel || 1;

      // Load social energy
      this.socialEnergy =
        data.socialEnergy !== undefined && data.socialEnergy !== null
          ? data.socialEnergy
          : 0;

      this.maxSocialEnergy = data.maxSocialEnergy || CONFIG.MAX_SOCIAL_ENERGY;

      // Load tutorial completion status
      this.tutorialCompleted = data.tutorialCompleted || false;

      // Load achievements
      this.unlockedAchievements = new Set(data.unlockedAchievements || []);

      // Backwards compatibility for tutorial completion
      if (
        this.hasAchievement(MENT_TUTORIAL_COMPLETE) &&
        !this.tutorialCompleted
      ) {
        console.log(
          "🔧 Legacy save detected - syncing tutorial completion flag"
        );
        this.tutorialCompleted = true;
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
      console.log(`📂 Game loaded successfully (v${this.version})`);
      console.log(
        `💝 Social energy: ${this.socialEnergy}/${this.maxSocialEnergy}`
      );
      console.log(`🎉 Tutorial completed: ${this.tutorialCompleted}`);

      return true;
    } catch (error) {
      console.error("❌ Failed to load game:", error);
      console.log("📂 Starting fresh due to load error");

      // Clear corrupted save data
      localStorage.removeItem(CONFIG.SAVE_KEY);

      return false;
    }
  }

  // Reset game state - always reset social energy to 0
  reset() {
    this.gameId = Date.now();
    this.currentLocation = null;
    this.currentLevel = 1;
    this.socialEnergy = 0;
    this.tutorialCompleted = false;
    this.unlockedAchievements = new Set();
    this.conversationHistory = new Map();
    this.itemsExamined = new Set();
    this.gameProgress = {
      startTime: Date.now(),
      conversationsHad: 0,
      energyRestored: 0,
      statsLearned: 0,
    };

    console.log("🔄 Game state reset - Social energy set to 0");
  }

  // Clean up
  destroy() {
    if (this.conversationHistory) {
      this.conversationHistory.clear();
    }
    console.log("🗑️ Game state destroyed");
  }
}

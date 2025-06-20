// js/core/GameState.js - Updated to use CONFIG for default level and removed clue system

class GameState {
  constructor() {
    // Use CONFIG to determine default level and location
    this.currentLocation = CONFIG.DEFAULT_LOCATION;
    this.currentLevel = CONFIG.DEFAULT_LEVEL;
    this.visitedLocations = new Set();
    this.conversationHistories = new Map();
    this.unlockedAchievements = new Set();
    // REMOVED: discoveredClues - no longer needed
    this.completedLevels = new Set();
    this.gameProgress = {
      startTime: Date.now(),
      playTime: 0,
      conversationCount: 0,
      locationsVisited: 0,
      levelsCompleted: 0,
    };

    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.save();
    }, 30000);
  }

  // Visit a location
  visitLocation(locationKey) {
    const wasNew = !this.visitedLocations.has(locationKey);
    this.visitedLocations.add(locationKey);
    this.currentLocation = locationKey;

    if (wasNew) {
      this.gameProgress.locationsVisited++;
      console.log(`📍 First visit to: ${locationKey}`);
      GameEvents.emit(GAME_EVENTS.LOCATION_CHANGED, {
        location: locationKey,
        isFirstVisit: true,
      });
    } else {
      GameEvents.emit(GAME_EVENTS.LOCATION_CHANGED, {
        location: locationKey,
        isFirstVisit: false,
      });
    }
  }

  // Complete a level
  completeLevel(levelNumber) {
    const wasNew = !this.completedLevels.has(levelNumber);
    this.completedLevels.add(levelNumber);

    if (wasNew) {
      this.gameProgress.levelsCompleted++;
      console.log(`🎯 Level ${levelNumber} completed!`);
      GameEvents.emit(GAME_EVENTS.LEVEL_COMPLETED, {
        level: levelNumber,
        totalCompleted: this.completedLevels.size,
      });
    }

    return wasNew;
  }

  // Check if level is completed
  isLevelCompleted(levelNumber) {
    return this.completedLevels.has(levelNumber);
  }

  // Set current level
  setCurrentLevel(levelNumber) {
    this.currentLevel = levelNumber;
    console.log(`🎯 Current level set to: ${levelNumber}`);
  }

  // Add conversation to history
  addConversation(characterKey, playerMessage, characterResponse) {
    if (!this.conversationHistories.has(characterKey)) {
      this.conversationHistories.set(characterKey, []);
    }

    const history = this.conversationHistories.get(characterKey);
    history.push({
      timestamp: Date.now(),
      player: playerMessage,
      character: characterResponse,
      location: this.currentLocation,
      level: this.currentLevel, // Track which level conversation happened in
    });

    this.gameProgress.conversationCount++;

    // Keep only last 20 conversations per character
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
  }

  // Get conversation history for character
  getConversationHistory(characterKey) {
    return this.conversationHistories.get(characterKey) || [];
  }

  // Unlock achievement
  unlockAchievement(achievementKey) {
    if (!this.unlockedAchievements.has(achievementKey)) {
      this.unlockedAchievements.add(achievementKey);
      console.log(`🏆 Achievement unlocked: ${achievementKey}`);
      GameEvents.emit(GAME_EVENTS.ACHIEVEMENT_UNLOCKED, achievementKey);
      return true;
    }
    return false;
  }

  // Check if achievement is unlocked
  hasAchievement(achievementKey) {
    return this.unlockedAchievements.has(achievementKey);
  }

  // REMOVED: addClue method - no longer needed

  // Get game statistics
  getStats() {
    return {
      currentLevel: this.currentLevel,
      levelsCompleted: this.completedLevels.size,
      locationsVisited: this.visitedLocations.size,
      totalLocations: Object.keys(locations).length,
      achievementsUnlocked: this.unlockedAchievements.size,
      totalAchievements: Object.keys(achievements).length,
      conversationCount: this.gameProgress.conversationCount,
      // REMOVED: cluesFound - no longer tracked
      playTime: this.getPlayTime(),
    };
  }

  // Get play time in minutes
  getPlayTime() {
    const currentSession = Date.now() - this.gameProgress.startTime;
    return Math.round((this.gameProgress.playTime + currentSession) / 60000);
  }

  // Update play time (called from game loop)
  updatePlayTime() {
    // Update play time every minute to avoid constant calculations
    const now = Date.now();
    if (!this.lastPlayTimeUpdate || now - this.lastPlayTimeUpdate > 60000) {
      this.gameProgress.playTime =
        this.gameProgress.playTime + (now - this.gameProgress.startTime);
      this.gameProgress.startTime = now;
      this.lastPlayTimeUpdate = now;
    }
  }

  // Save game state to localStorage
  save() {
    try {
      const saveData = {
        currentLocation: this.currentLocation,
        currentLevel: this.currentLevel,
        visitedLocations: Array.from(this.visitedLocations),
        conversationHistories: Object.fromEntries(this.conversationHistories),
        unlockedAchievements: Array.from(this.unlockedAchievements),
        // REMOVED: discoveredClues - no longer saved
        completedLevels: Array.from(this.completedLevels),
        gameProgress: {
          ...this.gameProgress,
          playTime:
            this.gameProgress.playTime +
            (Date.now() - this.gameProgress.startTime),
        },
        saveTime: Date.now(),
        saveVersion: "2.0", // Version for save compatibility
      };

      localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(saveData));
      console.log("💾 Game saved");
      console.log(
        "💾 Current level:",
        this.currentLevel,
        "| Completed levels:",
        Array.from(this.completedLevels)
      );
      console.log(
        "💾 Saved achievements:",
        Array.from(this.unlockedAchievements)
      );
      GameEvents.emit(GAME_EVENTS.GAME_SAVED);
    } catch (error) {
      console.error("Failed to save game:", error);
    }
  }

  // Load game state from localStorage
  load() {
    try {
      const saveData = localStorage.getItem(CONFIG.SAVE_KEY);
      if (!saveData) {
        console.log("No save data found, starting new game");
        return false;
      }

      const parsed = JSON.parse(saveData);

      // Load v2.0+ save data
      this.currentLocation = parsed.currentLocation || CONFIG.DEFAULT_LOCATION;
      this.currentLevel = parsed.currentLevel || CONFIG.DEFAULT_LEVEL;
      this.visitedLocations = new Set(parsed.visitedLocations || []);
      this.conversationHistories = new Map(
        Object.entries(parsed.conversationHistories || {})
      );
      this.unlockedAchievements = new Set(parsed.unlockedAchievements || []);
      // REMOVED: discoveredClues loading - no longer needed
      this.completedLevels = new Set(parsed.completedLevels || []);
      this.gameProgress = {
        ...this.gameProgress,
        ...parsed.gameProgress,
        startTime: Date.now(), // Reset start time for current session
      };

      console.log("📂 Game loaded (v2.0)");
      console.log(
        "📂 Current level:",
        this.currentLevel,
        "| Completed levels:",
        Array.from(this.completedLevels)
      );
      console.log(
        "📂 Loaded achievements:",
        Array.from(this.unlockedAchievements)
      );

      GameEvents.emit(GAME_EVENTS.GAME_LOADED);
      return true;
    } catch (error) {
      console.error("Failed to load game:", error);
      return false;
    }
  }

  // Reset game state
  reset() {
    // Reset core game state
    this.currentLocation = CONFIG.DEFAULT_LOCATION;
    this.currentLevel = CONFIG.DEFAULT_LEVEL;
    this.visitedLocations.clear();
    this.conversationHistories.clear();
    this.unlockedAchievements.clear();
    // REMOVED: discoveredClues clearing - no longer exists
    this.completedLevels.clear();

    // Reset game progress
    this.gameProgress = {
      startTime: Date.now(),
      playTime: 0,
      conversationCount: 0,
      locationsVisited: 0,
      levelsCompleted: 0,
    };

    console.log(`🔄 Game state reset to Level ${CONFIG.DEFAULT_LEVEL}`);
  }

  // Cleanup when game ends
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    this.save(); // Final save
  }
}

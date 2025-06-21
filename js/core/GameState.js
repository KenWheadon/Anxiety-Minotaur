// js/core/GameState.js - Enhanced for Anxiety Minotaur

class GameState {
  constructor() {
    // Use CONFIG to determine default level and location
    this.currentLocation = CONFIG.DEFAULT_LOCATION;
    this.currentLevel = CONFIG.DEFAULT_LEVEL;
    this.visitedLocations = new Set();
    this.conversationHistories = new Map();
    this.unlockedAchievements = new Set();
    this.completedLevels = new Set();

    // NEW: Social Energy System (Level 2 only)
    this.socialEnergy = 0; // Start at 0, only active in Level 2
    this.maxSocialEnergy = CONFIG.MAX_SOCIAL_ENERGY;

    // NEW: Recruitment Tracking
    this.recruitedMonsters = new Set(); // Track recruited monsters (max 2)
    this.hiredTrapMaker = null; // Track hired trap maker (max 1)

    // NEW: Adventurer Intelligence
    this.adventurerStats = {
      fear: null, // Will be revealed by The Librarian
      greed: null, // Will be revealed by The Merchant King
      pride: null, // Will be revealed by The Philosopher
    };

    // NEW: Hidden adventurer stats (set at game start, revealed through gameplay)
    this.generateAdventurerStats();

    // Game Progress Tracking
    this.gameProgress = {
      startTime: Date.now(),
      playTime: 0,
      conversationCount: 0,
      locationsVisited: 0,
      levelsCompleted: 0,
      energyRestored: 0, // NEW: Track duck interactions
      monstersRecruited: 0, // NEW: Track recruitment
      trapMakersHired: 0, // NEW: Track trap makers
    };

    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.save();
    }, 30000);

    console.log("🎮 GameState initialized for Anxiety Minotaur");
  }

  // NEW: Generate random adventurer stats for this playthrough
  generateAdventurerStats() {
    this.hiddenAdventurerStats = {
      fear: Math.random() > 0.5 ? FEAR_HIGH : FEAR_LOW,
      greed: Math.random() > 0.5 ? GREED_HIGH : GREED_LOW,
      pride: Math.random() > 0.5 ? PRIDE_HIGH : PRIDE_LOW,
    };

    console.log("🎯 Generated adventurer stats:", this.hiddenAdventurerStats);
  }

  // NEW: Check if social energy tracking is active
  shouldTrackSocialEnergy() {
    return this.currentLevel === 2;
  }

  // NEW: Initialize social energy for Level 2
  initializeSocialEnergy() {
    if (this.currentLevel === 2) {
      this.socialEnergy = CONFIG.STARTING_SOCIAL_ENERGY;
      console.log(
        `💝 Social energy initialized: ${this.socialEnergy}/${this.maxSocialEnergy}`
      );
    }
  }

  // NEW: Restore energy (duck conversations)
  restoreEnergy(amount = CONFIG.DUCK_ENERGY_RESTORE) {
    if (!this.shouldTrackSocialEnergy()) return false;

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

  // NEW: Spend energy (conversations)
  spendEnergy(amount = CONFIG.CONVERSATION_ENERGY_COST) {
    if (!this.shouldTrackSocialEnergy()) return true;

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

  // NEW: Recruit a monster
  recruitMonster(monsterId) {
    if (this.recruitedMonsters.size >= 2) {
      return { success: false, reason: "Already recruited 2 monsters" };
    }

    if (this.recruitedMonsters.has(monsterId)) {
      return { success: false, reason: "Monster already recruited" };
    }

    this.recruitedMonsters.add(monsterId);
    this.gameProgress.monstersRecruited++;

    console.log(
      `⚔️ Recruited monster: ${monsterId} (${this.recruitedMonsters.size}/2)`
    );

    // Check for achievement
    if (this.recruitedMonsters.size === 1) {
      this.unlockAchievement(RECRUITED_FIRST_MONSTER);
    } else if (this.recruitedMonsters.size === 2) {
      this.unlockAchievement(RECRUITED_SECOND_MONSTER);
    }

    this.checkRecruitmentComplete();
    return { success: true };
  }

  // NEW: Hire a trap maker
  hireTrapMaker(trapMakerId) {
    if (this.hiredTrapMaker !== null) {
      return { success: false, reason: "Already hired a trap maker" };
    }

    this.hiredTrapMaker = trapMakerId;
    this.gameProgress.trapMakersHired++;

    console.log(`🪤 Hired trap maker: ${trapMakerId}`);
    this.unlockAchievement(HIRED_TRAP_MAKER);

    this.checkRecruitmentComplete();
    return { success: true };
  }

  // NEW: Reveal adventurer stat
  revealAdventurerStat(statType) {
    if (
      this.hiddenAdventurerStats[statType] &&
      this.adventurerStats[statType] === null
    ) {
      this.adventurerStats[statType] = this.hiddenAdventurerStats[statType];

      console.log(
        `🔍 Revealed adventurer ${statType}: ${this.adventurerStats[statType]}`
      );

      // Check for achievements
      if (statType === "fear") {
        this.unlockAchievement(LEARNED_FEAR_LEVEL);
      } else if (statType === "greed") {
        this.unlockAchievement(LEARNED_GREED_LEVEL);
      } else if (statType === "pride") {
        this.unlockAchievement(LEARNED_PRIDE_LEVEL);
      }

      this.checkRecruitmentComplete();
      return true;
    }

    return false;
  }

  // NEW: Check if recruitment is complete
  checkRecruitmentComplete() {
    const hasEnoughMonsters = this.recruitedMonsters.size === 2;
    const hasTrapMaker = this.hiredTrapMaker !== null;
    const hasAllStats = Object.values(this.adventurerStats).every(
      (stat) => stat !== null
    );

    if (hasEnoughMonsters && hasTrapMaker && hasAllStats) {
      console.log("✅ Recruitment complete!");
      this.unlockAchievement(RECRUITMENT_COMPLETE);
      return true;
    }

    console.log(
      `📋 Recruitment progress: Monsters ${
        this.recruitedMonsters.size
      }/2, Trap Maker ${hasTrapMaker ? 1 : 0}/1, Stats ${
        Object.values(this.adventurerStats).filter((s) => s !== null).length
      }/3`
    );
    return false;
  }

  // NEW: Get recruitment status
  getRecruitmentStatus() {
    return {
      monsters: {
        recruited: Array.from(this.recruitedMonsters),
        count: this.recruitedMonsters.size,
        max: 2,
        complete: this.recruitedMonsters.size === 2,
      },
      trapMaker: {
        hired: this.hiredTrapMaker,
        complete: this.hiredTrapMaker !== null,
      },
      intelligence: {
        revealed: this.adventurerStats,
        hidden: this.hiddenAdventurerStats, // For debugging
        complete: Object.values(this.adventurerStats).every(
          (stat) => stat !== null
        ),
      },
      overall: {
        complete: this.checkRecruitmentComplete(),
      },
    };
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
    const oldLevel = this.currentLevel;
    this.currentLevel = levelNumber;

    // Initialize social energy when entering Level 2
    if (levelNumber === 2 && oldLevel !== 2) {
      this.initializeSocialEnergy();
    }

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
      level: this.currentLevel,
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
      playTime: this.getPlayTime(),
      // NEW: Social energy stats
      socialEnergy: this.socialEnergy,
      maxSocialEnergy: this.maxSocialEnergy,
      energyRestored: this.gameProgress.energyRestored,
      // NEW: Recruitment stats
      monstersRecruited: this.recruitedMonsters.size,
      trapMakersHired: this.gameProgress.trapMakersHired,
      recruitmentComplete: this.checkRecruitmentComplete(),
    };
  }

  // Get play time in minutes
  getPlayTime() {
    const currentSession = Date.now() - this.gameProgress.startTime;
    return Math.round((this.gameProgress.playTime + currentSession) / 60000);
  }

  // Update play time (called from game loop)
  updatePlayTime() {
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
        completedLevels: Array.from(this.completedLevels),
        // NEW: Social energy and recruitment data
        socialEnergy: this.socialEnergy,
        recruitedMonsters: Array.from(this.recruitedMonsters),
        hiredTrapMaker: this.hiredTrapMaker,
        adventurerStats: this.adventurerStats,
        hiddenAdventurerStats: this.hiddenAdventurerStats,
        gameProgress: {
          ...this.gameProgress,
          playTime:
            this.gameProgress.playTime +
            (Date.now() - this.gameProgress.startTime),
        },
        saveTime: Date.now(),
        saveVersion: "3.0", // Version for Anxiety Minotaur
      };

      localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(saveData));
      console.log("💾 Game saved (Anxiety Minotaur v3.0)");
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

      // Load basic data
      this.currentLocation = parsed.currentLocation || CONFIG.DEFAULT_LOCATION;
      this.currentLevel = parsed.currentLevel || CONFIG.DEFAULT_LEVEL;
      this.visitedLocations = new Set(parsed.visitedLocations || []);
      this.conversationHistories = new Map(
        Object.entries(parsed.conversationHistories || {})
      );
      this.unlockedAchievements = new Set(parsed.unlockedAchievements || []);
      this.completedLevels = new Set(parsed.completedLevels || []);

      // NEW: Load social energy and recruitment data
      this.socialEnergy = parsed.socialEnergy || 0;
      this.recruitedMonsters = new Set(parsed.recruitedMonsters || []);
      this.hiredTrapMaker = parsed.hiredTrapMaker || null;
      this.adventurerStats = parsed.adventurerStats || {
        fear: null,
        greed: null,
        pride: null,
      };
      this.hiddenAdventurerStats =
        parsed.hiddenAdventurerStats || this.generateAdventurerStats();

      this.gameProgress = {
        ...this.gameProgress,
        ...parsed.gameProgress,
        startTime: Date.now(), // Reset start time for current session
      };

      console.log("📂 Game loaded (Anxiety Minotaur v3.0)");
      console.log("📂 Recruitment status:", this.getRecruitmentStatus());

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
    this.completedLevels.clear();

    // NEW: Reset social energy and recruitment
    this.socialEnergy = 0;
    this.recruitedMonsters.clear();
    this.hiredTrapMaker = null;
    this.adventurerStats = { fear: null, greed: null, pride: null };
    this.generateAdventurerStats(); // Generate new random stats

    // Reset game progress
    this.gameProgress = {
      startTime: Date.now(),
      playTime: 0,
      conversationCount: 0,
      locationsVisited: 0,
      levelsCompleted: 0,
      energyRestored: 0,
      monstersRecruited: 0,
      trapMakersHired: 0,
    };

    console.log(`🔄 Game state reset to Level ${CONFIG.DEFAULT_LEVEL}`);
    console.log("🎯 New adventurer stats generated for fresh playthrough");
  }

  // Cleanup when game ends
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    this.save(); // Final save
  }
}

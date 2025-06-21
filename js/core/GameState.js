// js/core/GameState.js - Fixed social energy system for all levels

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

    // Initialize social energy for all levels
    this.socialEnergy = CONFIG.STARTING_SOCIAL_ENERGY;

    // Recruitment tracking
    this.recruitedMonsters = new Set();
    this.hiredTrapMaker = null;
    this.learnedStats = new Set();

    // Game progress tracking
    this.gameProgress = {
      startTime: Date.now(),
      conversationsHad: 0,
      energyRestored: 0,
      monstersRecruited: 0,
      trapMakersHired: 0,
      statsLearned: 0,
    };

    // Hidden adventurer stats (generated once per game)
    this.hiddenAdventurerStats = null;

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

    // Generate hidden adventurer stats (once per game)
    if (!this.hiddenAdventurerStats) {
      this.generateHiddenAdventurerStats();
    }

    console.log(
      `💝 Social energy: ${this.socialEnergy}/${this.maxSocialEnergy}`
    );
  }

  // Generate hidden adventurer stats once per game
  generateHiddenAdventurerStats() {
    this.hiddenAdventurerStats = {
      fear: Math.random() > 0.5 ? FEAR_HIGH : FEAR_LOW,
      greed: Math.random() > 0.5 ? GREED_HIGH : GREED_LOW,
      pride: Math.random() > 0.5 ? PRIDE_HIGH : PRIDE_LOW,
    };

    console.log("🎯 Generated adventurer stats:", this.hiddenAdventurerStats);
  }

  // Always allow social energy tracking
  shouldTrackSocialEnergy() {
    return true; // Available in all levels now
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

  // Recruit a monster
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

  // Hire a trap maker
  hireTrapMaker(trapMakerId) {
    if (this.hiredTrapMaker !== null) {
      return { success: false, reason: "Already hired a trap maker" };
    }

    this.hiredTrapMaker = trapMakerId;
    this.gameProgress.trapMakersHired++;

    console.log(`🔧 Hired trap maker: ${trapMakerId}`);

    this.unlockAchievement(HIRED_TRAP_MAKER);
    this.checkRecruitmentComplete();
    return { success: true };
  }

  // Learn an adventurer stat
  learnStat(statType) {
    if (this.learnedStats.has(statType)) {
      return { success: false, reason: "Stat already learned" };
    }

    this.learnedStats.add(statType);
    this.gameProgress.statsLearned++;

    console.log(`🧠 Learned stat: ${statType}`);

    // Unlock appropriate achievement
    const achievements = {
      fear: LEARNED_FEAR_LEVEL,
      greed: LEARNED_GREED_LEVEL,
      pride: LEARNED_PRIDE_LEVEL,
    };

    if (achievements[statType]) {
      this.unlockAchievement(achievements[statType]);
    }

    this.checkRecruitmentComplete();
    return { success: true, stat: this.hiddenAdventurerStats[statType] };
  }

  // Check if recruitment is complete
  checkRecruitmentComplete() {
    if (
      this.recruitedMonsters.size >= 2 &&
      this.hiredTrapMaker !== null &&
      this.learnedStats.size >= 3
    ) {
      this.unlockAchievement(RECRUITMENT_COMPLETE);
      console.log("🎯 Recruitment phase complete!");
    }
  }

  // Get recruitment progress
  getRecruitmentProgress() {
    const monstersProgress = `${this.recruitedMonsters.size}/2`;
    const trapMakerProgress = this.hiredTrapMaker ? "1/1" : "0/1";
    const statsProgress = `${this.learnedStats.size}/3`;

    console.log("📋 Recruitment progress:", {
      monsters: monstersProgress,
      trapMaker: trapMakerProgress,
      stats: statsProgress,
    });

    return {
      monsters: {
        current: this.recruitedMonsters.size,
        required: 2,
        complete: this.recruitedMonsters.size >= 2,
      },
      trapMaker: {
        current: this.hiredTrapMaker ? 1 : 0,
        required: 1,
        complete: this.hiredTrapMaker !== null,
      },
      intelligence: {
        current: this.learnedStats.size,
        required: 3,
        complete: this.learnedStats.size >= 3,
      },
      overall: {
        complete:
          this.recruitedMonsters.size >= 2 &&
          this.hiredTrapMaker !== null &&
          this.learnedStats.size >= 3,
      },
    };
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

  // Save game state
  save() {
    try {
      const saveData = {
        gameId: this.gameId,
        version: this.version,
        currentLocation: this.currentLocation,
        currentLevel: this.currentLevel,
        socialEnergy: this.socialEnergy,
        maxSocialEnergy: this.maxSocialEnergy,
        unlockedAchievements: Array.from(this.unlockedAchievements),
        conversationHistory: Object.fromEntries(
          Array.from(this.conversationHistory.entries()).map(([key, value]) => [
            key,
            value.slice(-5), // Save only last 5 conversations per character
          ])
        ),
        itemsExamined: Array.from(this.itemsExamined),
        recruitedMonsters: Array.from(this.recruitedMonsters),
        hiredTrapMaker: this.hiredTrapMaker,
        learnedStats: Array.from(this.learnedStats),
        hiddenAdventurerStats: this.hiddenAdventurerStats,
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

  // Load game state
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

      // Load achievements
      this.unlockedAchievements = new Set(data.unlockedAchievements || []);

      // Load conversation history
      this.conversationHistory = new Map();
      if (data.conversationHistory) {
        Object.entries(data.conversationHistory).forEach(([key, value]) => {
          this.conversationHistory.set(key, value);
        });
      }

      // Load examined items
      this.itemsExamined = new Set(data.itemsExamined || []);

      // Load recruitment data
      this.recruitedMonsters = new Set(data.recruitedMonsters || []);
      this.hiredTrapMaker = data.hiredTrapMaker || null;
      this.learnedStats = new Set(data.learnedStats || []);

      // Load hidden stats
      this.hiddenAdventurerStats = data.hiddenAdventurerStats;

      // Load game progress
      this.gameProgress = {
        startTime: Date.now(),
        conversationsHad: 0,
        energyRestored: 0,
        monstersRecruited: 0,
        trapMakersHired: 0,
        statsLearned: 0,
        ...data.gameProgress,
      };

      // Generate hidden stats if missing
      if (!this.hiddenAdventurerStats) {
        this.generateHiddenAdventurerStats();
      }

      this.isFirstTimeLoad = false;
      console.log(`📂 Game loaded (${this.constructor.name} v${this.version})`);

      // Log recruitment status
      this.getRecruitmentProgress();

      return true;
    } catch (error) {
      console.error("❌ Failed to load game:", error);
      return false;
    }
  }

  // Reset game state
  reset() {
    this.gameId = Date.now();
    this.currentLocation = null;
    this.currentLevel = 1;
    this.socialEnergy = CONFIG.STARTING_SOCIAL_ENERGY;
    this.unlockedAchievements = new Set();
    this.conversationHistory = new Map();
    this.itemsExamined = new Set();
    this.recruitedMonsters = new Set();
    this.hiredTrapMaker = null;
    this.learnedStats = new Set();
    this.hiddenAdventurerStats = null;
    this.gameProgress = {
      startTime: Date.now(),
      conversationsHad: 0,
      energyRestored: 0,
      monstersRecruited: 0,
      trapMakersHired: 0,
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

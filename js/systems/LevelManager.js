// js/systems/LevelManager.js - Updated to remove "Stay in Current Level" option

class LevelManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.currentLevel = 1;
    this.levels = new Map();
    this.levelCompletionScreen = null;
    this.finalVictoryScreen = null;

    this.loadLevelDefinitions();
    this.createLevelCompletionUI();

    console.log("🎯 Level Manager initialized");
  }

  loadLevelDefinitions() {
    // Load level definitions from the levels data
    Object.entries(LEVELS).forEach(([levelNum, levelData]) => {
      this.levels.set(parseInt(levelNum), levelData);
    });

    console.log(`🎯 Loaded ${this.levels.size} level definitions`);
  }

  createLevelCompletionUI() {
    this.levelCompletionScreen = document.createElement("div");
    this.levelCompletionScreen.className = "level-completion-screen";
    this.levelCompletionScreen.innerHTML = `
      <div class="level-completion-content">
        <div class="level-completion-header">
          <div class="completion-icon">⭐</div>
          <h1>Level Complete!</h1>
          <h2 class="level-completion-subtitle">Great job completing this challenge!</h2>
        </div>
        
        <div class="level-completion-achievement">
          <div class="achievement-showcase">
            <div class="showcase-achievement">
              <span class="achievement-emoji">🎯</span>
              <span class="achievement-name">Achievement Unlocked</span>
            </div>
          </div>
        </div>
        
        <div class="level-completion-message">
          <p class="completion-text">🌟 You've successfully completed the objectives for this level!</p>
          <p class="next-level-hint">Ready for the next challenge?</p>
        </div>
        
        <div class="level-completion-actions">
          <button class="level-completion-button continue-to-next">Continue to Next Level</button>
        </div>
        
        <div class="level-completion-footer">
          <p>🎊 Level Completed! 🎊</p>
        </div>
      </div>
    `;

    document.body.appendChild(this.levelCompletionScreen);
    this.hideLevelCompletion();
    this.setupLevelCompletionListeners();
  }

  setupLevelCompletionListeners() {
    // Continue to next level button - ONLY option now
    this.levelCompletionScreen
      .querySelector(".continue-to-next")
      .addEventListener("click", () => {
        this.proceedToNextLevel();
      });

    // Add keyboard shortcut for convenience
    document.addEventListener("keydown", (e) => {
      if (this.levelCompletionScreen.classList.contains("visible")) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.proceedToNextLevel();
        }
      }
    });
  }

  // Check if current level is completed based on achievement
  checkLevelCompletion(achievementId) {
    const currentLevelData = this.levels.get(this.currentLevel);
    if (!currentLevelData) return false;

    // Check if this achievement completes the current level
    if (currentLevelData.completionAchievement === achievementId) {
      console.log(
        `🎯 Level ${this.currentLevel} completed with achievement: ${achievementId}`
      );
      this.showLevelCompletion(achievementId);
      return true;
    }

    return false;
  }

  showLevelCompletion(achievementId) {
    // Get achievement data for display
    const achievement = achievements[achievementId];
    if (achievement) {
      const achievementName =
        this.levelCompletionScreen.querySelector(".achievement-name");
      if (achievementName) {
        achievementName.textContent = achievement.title;
      }
    }

    // Update level-specific messaging
    const subtitle = this.levelCompletionScreen.querySelector(
      ".level-completion-subtitle"
    );
    const currentLevelData = this.levels.get(this.currentLevel);
    if (subtitle && currentLevelData) {
      subtitle.textContent =
        currentLevelData.completionMessage ||
        "Great job completing this challenge!";
    }

    // Show the completion screen
    this.levelCompletionScreen.classList.add("visible");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Play completion animation
    this.playLevelCompletionSequence();

    console.log(`🎉 Level ${this.currentLevel} completion screen shown`);
  }

  hideLevelCompletion() {
    this.levelCompletionScreen.classList.remove("visible");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  playLevelCompletionSequence() {
    const content = this.levelCompletionScreen.querySelector(
      ".level-completion-content"
    );
    const header = this.levelCompletionScreen.querySelector(
      ".level-completion-header"
    );
    const achievement = this.levelCompletionScreen.querySelector(
      ".level-completion-achievement"
    );
    const message = this.levelCompletionScreen.querySelector(
      ".level-completion-message"
    );
    const actions = this.levelCompletionScreen.querySelector(
      ".level-completion-actions"
    );
    const footer = this.levelCompletionScreen.querySelector(
      ".level-completion-footer"
    );

    // Initial state
    gsap.set([header, achievement, message, actions, footer], {
      opacity: 0,
      y: 30,
    });

    // Animate content in
    gsap.fromTo(
      content,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
    );

    // Staggered entrance animation
    const timeline = gsap.timeline({ delay: 0.3 });

    timeline
      .to(header, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
      .to(
        achievement,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .to(
        message,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .to(
        actions,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .to(
        footer,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

    // Play success sound
    if (this.gameEngine.renderer?.assetManager) {
      this.gameEngine.renderer.assetManager.playSound(
        "effects/achievement.mp3",
        0.8
      );
    }
  }

  async proceedToNextLevel() {
    this.hideLevelCompletion();

    const nextLevel = this.currentLevel + 1;

    // Check if next level exists
    if (this.levels.has(nextLevel)) {
      console.log(`🎯 Proceeding to level ${nextLevel}`);
      await this.loadLevel(nextLevel);
    } else {
      // No more levels - show final victory
      console.log("🏆 No more levels - showing final victory");
      this.showFinalVictory();
    }
  }

  async loadLevel(levelNumber) {
    const levelData = this.levels.get(levelNumber);
    if (!levelData) {
      console.error(`❌ Level ${levelNumber} not found`);
      return false;
    }

    console.log(`🎯 Loading level ${levelNumber}: ${levelData.name}`);

    // Update current level
    this.currentLevel = levelNumber;

    // Reset game state for new level
    this.resetLevelState();

    // Load the starting location for this level
    await this.gameEngine.loadLocation(levelData.startLocation);

    // Update game state
    this.gameEngine.gameState.currentLevel = levelNumber;
    this.gameEngine.gameState.save();

    // Emit level changed event
    GameEvents.emit(GAME_EVENTS.LEVEL_CHANGED, {
      level: levelNumber,
      levelData: levelData,
    });

    return true;
  }

  resetLevelState() {
    // Reset achievements for new level
    if (this.gameEngine.achievementManager) {
      this.gameEngine.achievementManager.resetAll();
    }

    // Reset exploration progress - BUT NOT DISCOVERIES (handled in ExplorationDrawer)
    if (this.gameEngine.explorationDrawer) {
      // Only reset the current level tracking, not saved discoveries
      this.gameEngine.explorationDrawer.discoveredCharacters.clear();
      this.gameEngine.explorationDrawer.discoveredItems.clear();
    }

    // Clear conversation histories for fresh start
    this.gameEngine.gameState.conversationHistories.clear();

    console.log("🔄 Level state reset for new level");
  }

  showFinalVictory() {
    // Use the existing victory screen for final game completion
    if (this.gameEngine.victoryScreen) {
      this.gameEngine.victoryScreen.show();
    }
  }

  // Get current level data with proper references
  getCurrentLevelData() {
    const levelData = this.levels.get(this.currentLevel);
    if (!levelData) return null;

    // FIXED: Build level data by referencing global objects
    return {
      ...levelData,
      // Get actual location data for this level
      locationData: this.getLocationDataForLevel(levelData),
      // Get actual character data for this level
      characterData: this.getCharacterDataForLevel(levelData),
      // Get actual item data for this level
      itemData: this.getItemDataForLevel(levelData),
      // Get actual achievement data for this level
      achievementData: this.getAchievementDataForLevel(levelData),
    };
  }

  // FIXED: Get location data by reference
  getLocationDataForLevel(levelData) {
    const locationData = {};
    levelData.locations.forEach((locationKey) => {
      if (locations[locationKey]) {
        locationData[locationKey] = locations[locationKey];
      }
    });
    return locationData;
  }

  // FIXED: Get character data by reference
  getCharacterDataForLevel(levelData) {
    const characterData = {};
    levelData.characters.forEach((characterKey) => {
      if (characters[characterKey]) {
        characterData[characterKey] = characters[characterKey];
      }
    });
    return characterData;
  }

  // FIXED: Get item data by reference
  getItemDataForLevel(levelData) {
    const itemData = {};
    levelData.items.forEach((itemKey) => {
      if (items[itemKey]) {
        itemData[itemKey] = items[itemKey];
      }
    });
    return itemData;
  }

  // FIXED: Get achievement data by reference
  getAchievementDataForLevel(levelData) {
    const achievementData = {};
    levelData.achievements.forEach((achievementKey) => {
      if (achievements[achievementKey]) {
        achievementData[achievementKey] = achievements[achievementKey];
      }
    });
    return achievementData;
  }

  // Get available levels count
  getTotalLevels() {
    return this.levels.size;
  }

  // Check if level is unlocked (for future expansion)
  isLevelUnlocked(levelNumber) {
    // For now, linear progression - only next level is unlocked
    return levelNumber <= this.currentLevel;
  }

  // Save level progress
  saveProgress() {
    return {
      currentLevel: this.currentLevel,
      // Could expand to include level-specific progress data
    };
  }

  // Load level progress
  loadProgress(progressData) {
    if (progressData && progressData.currentLevel) {
      this.currentLevel = progressData.currentLevel;
      console.log(`🎯 Loaded level progress: Level ${this.currentLevel}`);
    }
  }

  destroy() {
    if (this.levelCompletionScreen && this.levelCompletionScreen.parentNode) {
      this.levelCompletionScreen.parentNode.removeChild(
        this.levelCompletionScreen
      );
    }

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    console.log("🗑️ Level manager destroyed");
  }
}

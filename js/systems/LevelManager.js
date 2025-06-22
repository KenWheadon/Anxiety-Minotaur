// js/systems/LevelManager.js - Simplified for tutorial

class LevelManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.currentLevel = 1;
    this.levels = new Map();
    this.levelCompletionScreen = null;

    this.loadLevelDefinitions();
    this.createLevelCompletionUI();
    this.setupAchievementListener();

    console.log("🎯 Level Manager initialized for tutorial");
  }

  loadLevelDefinitions() {
    // Load tutorial level definition
    Object.entries(LEVELS).forEach(([levelNum, levelData]) => {
      this.levels.set(parseInt(levelNum), levelData);
    });

    console.log(`🎯 Loaded ${this.levels.size} level definition(s)`);
  }

  setupAchievementListener() {
    GameEvents.on(GAME_EVENTS.ACHIEVEMENT_UNLOCK, (eventData) => {
      const achievementId = eventData.achievementKey || eventData.achievementId;

      // Check if this achievement completes the current level
      if (this.checkLevelCompletion(achievementId)) {
        console.log(
          `🎯 Level ${this.currentLevel} completed with achievement: ${achievementId}`
        );
      }
    });
  }

  createLevelCompletionUI() {
    this.levelCompletionScreen = document.createElement("div");
    this.levelCompletionScreen.className = "level-completion-screen";
    this.levelCompletionScreen.innerHTML = `
      <div class="level-completion-content">
        <div class="level-completion-header">
          <div class="completion-icon">⭐</div>
          <h1>Tutorial Complete!</h1>
          <h2 class="level-completion-subtitle">Great job helping your neighbor!</h2>
        </div>
        
        <div class="level-completion-achievement">
          <div class="achievement-showcase">
            <div class="showcase-achievement">
              <span class="achievement-emoji">🎯</span>
              <span class="achievement-name">Tutorial Achievement Unlocked</span>
            </div>
          </div>
        </div>
        
        <div class="level-completion-message">
          <p class="completion-text">🌟 You've successfully completed the tutorial objectives!</p>
          <p class="next-level-hint">Ready to continue your adventure?</p>
        </div>
        
        <div class="level-completion-actions">
          <button class="level-completion-button continue-to-next">Complete Game</button>
          <button class="level-completion-button stay-in-tutorial">Keep Exploring Tutorial</button>
        </div>
        
        <div class="level-completion-footer">
          <p>🎊 Tutorial Completed! 🎊</p>
        </div>
      </div>
    `;

    document.body.appendChild(this.levelCompletionScreen);
    this.hideLevelCompletion();
    this.setupLevelCompletionListeners();
  }

  setupLevelCompletionListeners() {
    // Continue to full game button
    this.levelCompletionScreen
      .querySelector(".continue-to-next")
      .addEventListener("click", () => {
        // For now, this shows a message about the full game
        alert(
          "Thanks for completing the tutorial! The full game is coming soon. 🎮"
        );
        this.hideLevelCompletion();
      });

    // Stay in tutorial button
    this.levelCompletionScreen
      .querySelector(".stay-in-tutorial")
      .addEventListener("click", () => {
        this.hideLevelCompletion();
      });

    // Add keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (this.levelCompletionScreen.classList.contains("visible")) {
        if (e.key === "Enter") {
          e.preventDefault();
          // Default to continue
          this.levelCompletionScreen.querySelector(".continue-to-next").click();
        } else if (e.key === "Escape") {
          e.preventDefault();
          this.hideLevelCompletion();
        }
      }
    });
  }

  // Check if tutorial is completed based on achievement
  checkLevelCompletion(achievementId) {
    const currentLevelData = this.levels.get(this.currentLevel);
    if (!currentLevelData) return false;

    // Check if this achievement completes the tutorial
    if (currentLevelData.completionAchievement === achievementId) {
      console.log(`🎯 Tutorial completed with achievement: ${achievementId}`);
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

    // Update messaging
    const subtitle = this.levelCompletionScreen.querySelector(
      ".level-completion-subtitle"
    );
    const currentLevelData = this.levels.get(this.currentLevel);
    if (subtitle && currentLevelData) {
      subtitle.textContent =
        currentLevelData.completionMessage ||
        "Great job helping your neighbor!";
    }

    // Show the completion screen
    this.levelCompletionScreen.classList.add("visible");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Play completion animation
    this.playLevelCompletionSequence();

    console.log(`🎉 Tutorial completion screen shown`);
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

  async loadLevel(levelNumber) {
    const levelData = this.levels.get(levelNumber);
    if (!levelData) {
      console.error(`❌ Level ${levelNumber} not found`);
      return false;
    }

    console.log(`🎯 Loading level ${levelNumber}: ${levelData.name}`);

    // Update current level
    this.currentLevel = levelNumber;

    // Update game state
    this.gameEngine.gameState.currentLevel = levelNumber;
    this.gameEngine.gameState.save();

    // Load the starting location for this level
    await this.gameEngine.loadLocation(levelData.startLocation);

    // Emit level changed event
    GameEvents.emit(GAME_EVENTS.LEVEL_CHANGED, {
      level: levelNumber,
      levelData: levelData,
    });

    return true;
  }

  // Get current level data with proper references
  getCurrentLevelData() {
    const levelData = this.levels.get(this.currentLevel);
    if (!levelData) return null;

    return {
      ...levelData,
      locationData: this.getLocationDataForLevel(levelData),
      characterData: this.getCharacterDataForLevel(levelData),
      itemData: this.getItemDataForLevel(levelData),
      achievementData: this.getAchievementDataForLevel(levelData),
    };
  }

  getLocationDataForLevel(levelData) {
    const locationData = {};
    levelData.locations.forEach((locationKey) => {
      if (locations[locationKey]) {
        locationData[locationKey] = locations[locationKey];
      }
    });
    return locationData;
  }

  getCharacterDataForLevel(levelData) {
    const characterData = {};
    levelData.characters.forEach((characterKey) => {
      if (characters[characterKey]) {
        characterData[characterKey] = characters[characterKey];
      }
    });
    return characterData;
  }

  getItemDataForLevel(levelData) {
    const itemData = {};
    levelData.items.forEach((itemKey) => {
      if (items[itemKey]) {
        itemData[itemKey] = items[itemKey];
      }
    });
    return itemData;
  }

  getAchievementDataForLevel(levelData) {
    const achievementData = {};
    levelData.achievements.forEach((achievementKey) => {
      if (achievements[achievementKey]) {
        achievementData[achievementKey] = achievements[achievementKey];
      }
    });
    return achievementData;
  }

  // Get total levels count
  getTotalLevels() {
    return this.levels.size;
  }

  // Reset for tutorial reset
  reset() {
    this.currentLevel = 1;
    this.hideLevelCompletion();
    console.log("🔄 Level manager reset to tutorial");
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

// js/systems/AchievementManager.js - Updated to show ALL achievements, not just current level

class AchievementManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.achievements = new Map();
    this.unlockedAchievements = new Set();
    this.achievementPanel = null;
    this.achievementButton = null;
    this.notificationQueue = [];
    this.isShowingNotification = false;
    this.hasNewAchievements = false;
    this.onAllAchievementsUnlocked = null; // Callback function - now used for final victory only
    this.onGameOverCallback = null; // NEW: Callback for game over condition

    this.loadAchievements();
    this.createAchievementUI();
    this.createAchievementButton();
    this.setupEventListeners();

    console.log(
      "🏆 Achievement manager initialized with ALL achievements visible"
    );
  }

  // Set callback for when all achievements are unlocked (final victory)
  setAllAchievementsUnlockedCallback(callback) {
    this.onAllAchievementsUnlocked = callback;
  }

  // NEW: Set callback for game over condition
  setGameOverCallback(callback) {
    this.onGameOverCallback = callback;
  }

  // FIXED: Load ALL achievements, not just current level
  loadAchievements() {
    console.log("🏆 Loading ALL achievements from global achievements object");

    // Clear existing achievements
    this.achievements.clear();

    // FIXED: Load ALL achievements from global achievements object
    if (typeof achievements !== "undefined") {
      Object.entries(achievements).forEach(([key, achievementData]) => {
        this.achievements.set(key, {
          ...achievementData,
          id: key,
          unlockedAt: null,
          progress: 0,
          // NEW: Add level info for display purposes
          level: this.getAchievementLevel(key),
        });
      });
      console.log(
        `🏆 Loaded ${this.achievements.size} total achievements from all levels`
      );
    } else {
      console.warn("🏆 No achievements data available");
    }
  }

  // NEW: Helper method to determine which level an achievement belongs to
  getAchievementLevel(achievementKey) {
    // Check each level's achievements to see where this belongs
    if (typeof LEVELS !== "undefined") {
      for (const [levelNum, levelData] of Object.entries(LEVELS)) {
        if (
          levelData.achievements &&
          levelData.achievements.includes(achievementKey)
        ) {
          return parseInt(levelNum);
        }
      }
    }

    // Fallback: try to guess from achievement constants
    const level1Achievements = LEVELS[1].achievements;
    const level2Achievements = LEVELS[2].achievements;
    const level3Achievements = LEVELS[3].achievements;

    if (level1Achievements.includes(achievementKey)) return 1;
    if (level2Achievements.includes(achievementKey)) return 2;
    if (level3Achievements.includes(achievementKey)) return 3;

    return null; // Unknown level
  }

  createAchievementButton() {
    // Create floating achievements button
    this.achievementButton = document.createElement("button");
    this.achievementButton.className = "achievements-trigger";
    this.achievementButton.innerHTML = "🏆";
    this.achievementButton.title = "View Achievements (F2)";
    this.achievementButton.setAttribute("data-progress", "0/0");

    document.body.appendChild(this.achievementButton);

    // Add click listener
    this.achievementButton.addEventListener("click", () => {
      this.showAchievementPanel();
    });

    // Update progress indicator
    this.updateButtonProgress();
  }

  updateButtonProgress() {
    if (this.achievementButton) {
      const unlocked = this.unlockedAchievements.size;
      const total = this.achievements.size;
      this.achievementButton.setAttribute(
        "data-progress",
        `${unlocked}/${total}`
      );

      // Add pulse animation for new achievements
      if (this.hasNewAchievements) {
        this.achievementButton.classList.add("has-new");
        // Remove the animation after a few seconds
        setTimeout(() => {
          this.achievementButton.classList.remove("has-new");
          this.hasNewAchievements = false;
        }, 5000);
      }
    }
  }

  createAchievementUI() {
    // Create achievement panel
    this.achievementPanel = document.createElement("div");
    this.achievementPanel.className = "achievement-panel";
    this.achievementPanel.innerHTML = `
            <div class="achievement-header">
                <h2>🏆 All Game Achievements</h2>
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="progress-text">0 / ${this.achievements.size}</span>
                </div>
                <button class="close-achievements">×</button>
            </div>
            <div class="achievement-tabs">
                <button class="achievement-tab active" data-filter="all">All</button>
                <button class="achievement-tab" data-filter="unlocked">Unlocked</button>
                <button class="achievement-tab" data-filter="locked">Locked</button>
                <button class="achievement-tab" data-filter="level1">Level 1</button>
                <button class="achievement-tab" data-filter="level2">Level 2</button>
                <button class="achievement-tab" data-filter="level3">Level 3</button>
            </div>
            <div class="achievement-list"></div>
        `;

    document.body.appendChild(this.achievementPanel);
    this.hideAchievementPanel();
  }

  setupEventListeners() {
    // Close button
    this.achievementPanel
      .querySelector(".close-achievements")
      .addEventListener("click", () => {
        this.hideAchievementPanel();
      });

    // Tab buttons
    this.achievementPanel
      .querySelectorAll(".achievement-tab")
      .forEach((tab) => {
        tab.addEventListener("click", (e) => {
          this.switchTab(e.target.dataset.filter);
        });
      });

    // Listen for achievement unlocks
    GameEvents.on(GAME_EVENTS.ACHIEVEMENT_UNLOCKED, (achievementId) => {
      this.handleAchievementUnlock(achievementId);
    });

    // REMOVED: Level change reloading - we now show all achievements always
    // GameEvents.on(GAME_EVENTS.LEVEL_CHANGED, () => { ... });

    // Keyboard shortcut to open achievements F2
    document.addEventListener("keydown", (e) => {
      const isConversationActive =
        this.gameEngine.conversationManager.isConversationActive;
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (!isConversationActive && !isInputFocused) {
        // Use F2 key for achievements (safe function key)
        if (e.key === "F2") {
          e.preventDefault();
          this.showAchievementPanel();
        }
      }
    });
  }

  checkTriggers(characterKey, message, response) {
    console.log(`🏆 AchievementManager.checkTriggers called`);
    console.log(`🏆 Character: ${characterKey}`);
    console.log(`🏆 Message: "${message}"`);
    console.log(`🏆 Response: "${response}"`);

    // FIXED: Check ALL achievements, not just current level ones
    const characterAchievements = Array.from(this.achievements.values()).filter(
      (achievement) => {
        console.log(
          `🏆 Checking achievement ${achievement.id}: characterId=${achievement.characterId}, target=${characterKey}`
        );
        return (
          achievement.characterId === characterKey && !achievement.isUnlocked
        );
      }
    );

    console.log(
      `🏆 Found ${characterAchievements.length} possible achievements for ${characterKey} across all levels`
    );

    characterAchievements.forEach((achievement) => {
      console.log(
        `🏆 Checking achievement: ${achievement.id} (Level ${
          achievement.level || "?"
        })`
      );
      console.log(
        `🏆 Trigger keywords: ${JSON.stringify(achievement.triggerKeywords)}`
      );

      // Normalize the response text: lowercase and replace underscores with spaces
      const normalizedResponse = response.toLowerCase().replace(/_/g, " ");
      console.log(`🏆 Normalized response: "${normalizedResponse}"`);

      // Check if the character's response contains the trigger keyword
      const responseHasTrigger = achievement.triggerKeywords.some((keyword) => {
        // Normalize the keyword the same way
        const normalizedKeyword = keyword.toLowerCase().replace(/_/g, " ");
        const found = normalizedResponse.includes(normalizedKeyword);
        console.log(
          `🏆 Checking normalized keyword "${normalizedKeyword}" in response: ${found}`
        );
        return found;
      });

      if (responseHasTrigger) {
        console.log(
          `🏆 TRIGGER FOUND! Unlocking achievement: ${achievement.id} (Level ${
            achievement.level || "?"
          })`
        );
        this.unlockAchievement(achievement.id);
      } else {
        console.log(`🏆 No trigger found for ${achievement.id}`);
      }
    });
  }

  unlockAchievement(achievementId) {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.isUnlocked) {
      return false;
    }

    // Mark as unlocked
    achievement.isUnlocked = true;
    achievement.unlockedAt = new Date();
    this.unlockedAchievements.add(achievementId);
    this.hasNewAchievements = true;

    // Update game state
    this.gameEngine.gameState.unlockAchievement(achievementId);

    // Show notification
    this.queueNotification(achievement);

    // Update progress
    this.updateProgress();
    this.updateButtonProgress();

    // Check for level completion (existing logic)
    let levelCompleted = false;
    if (this.gameEngine.levelManager) {
      levelCompleted =
        this.gameEngine.levelManager.checkLevelCompletion(achievementId);
      if (levelCompleted) {
        console.log(`🎯 Level completed with achievement: ${achievementId}`);

        // Check if we just completed Level 3 (final level) - trigger final victory
        if (
          this.gameEngine.levelManager.currentLevel === 3 &&
          this.onAllAchievementsUnlocked
        ) {
          console.log(
            "🎉 Level 3 completed! Calling final victory callback..."
          );
          setTimeout(() => {
            this.onAllAchievementsUnlocked();
          }, 3000); // Delay to let the level completion show first
        }

        return true;
      }
    }

    console.log(
      `🏆 Achievement unlocked: ${achievement.title} (Level ${
        achievement.level || "?"
      })`
    );
    return true;
  }

  // Check if Level 3 is completed (for final victory)
  isLevel3Complete() {
    if (!this.gameEngine.levelManager) return false;

    const currentLevel = this.gameEngine.levelManager.currentLevel;

    // Check if we're on Level 3 and have the completion achievement
    return (
      currentLevel === 3 && this.unlockedAchievements.has(SPILLED_HIS_GUTS)
    );
  }

  queueNotification(achievement) {
    this.notificationQueue.push(achievement);
    if (!this.isShowingNotification) {
      this.showNextNotification();
    }
  }

  async showNextNotification() {
    if (this.notificationQueue.length === 0) {
      this.isShowingNotification = false;
      return;
    }

    this.isShowingNotification = true;
    const achievement = this.notificationQueue.shift();

    // Create notification element with level info
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    const levelText = achievement.level ? ` (Level ${achievement.level})` : "";
    notification.innerHTML = `
            <div class="notification-icon">🏆</div>
            <div class="notification-content">
                <div class="notification-title">Achievement Unlocked!${levelText}</div>
                <div class="notification-description">${achievement.title}</div>
            </div>
        `;

    document.body.appendChild(notification);

    // Play sound (if available)
    if (this.gameEngine.renderer && this.gameEngine.renderer.assetManager) {
      this.gameEngine.renderer.assetManager.playSound(
        "effects/achievement.mp3",
        0.6
      );
    }

    // Animate in
    gsap.fromTo(
      notification,
      { opacity: 0, x: 100, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    );

    // Wait and animate out
    await Utils.wait(4000);

    gsap.to(notification, {
      opacity: 0,
      x: 100,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.showNextNotification();
      },
    });
  }

  showAchievementPanel() {
    this.achievementPanel.style.display = "flex";
    this.renderAchievements("all");
    this.updateProgress();

    // Animate in
    gsap.fromTo(
      this.achievementPanel,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
    );
  }

  hideAchievementPanel() {
    gsap.to(this.achievementPanel, {
      opacity: 0,
      scale: 0.8,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        this.achievementPanel.style.display = "none";
      },
    });
  }

  switchTab(filter) {
    // Update tab states
    this.achievementPanel
      .querySelectorAll(".achievement-tab")
      .forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.filter === filter);
      });

    // Render achievements for this filter
    this.renderAchievements(filter);
  }

  renderAchievements(filter = "all") {
    const listContainer =
      this.achievementPanel.querySelector(".achievement-list");
    listContainer.innerHTML = "";

    // Filter achievements
    let achievementsToShow = Array.from(this.achievements.values());

    switch (filter) {
      case "unlocked":
        achievementsToShow = achievementsToShow.filter((a) => a.isUnlocked);
        break;
      case "locked":
        achievementsToShow = achievementsToShow.filter((a) => !a.isUnlocked);
        break;
      case "level1":
        achievementsToShow = achievementsToShow.filter((a) => a.level === 1);
        break;
      case "level2":
        achievementsToShow = achievementsToShow.filter((a) => a.level === 2);
        break;
      case "level3":
        achievementsToShow = achievementsToShow.filter((a) => a.level === 3);
        break;
      // "all" shows everything
    }

    // Sort: unlocked first, then by level, then by title
    achievementsToShow.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) {
        return b.isUnlocked - a.isUnlocked;
      }
      if (a.level !== b.level) {
        return (a.level || 999) - (b.level || 999);
      }
      return a.title.localeCompare(b.title);
    });

    // Render each achievement
    achievementsToShow.forEach((achievement) => {
      const achievementElement = this.createAchievementElement(achievement);
      listContainer.appendChild(achievementElement);
    });

    // Animate in
    const items = listContainer.querySelectorAll(".achievement-item");
    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          delay: index * 0.05,
          ease: "power2.out",
        }
      );
    });
  }

  createAchievementElement(achievement) {
    const element = document.createElement("div");
    element.className = `achievement-item ${
      achievement.isUnlocked ? "unlocked" : "locked"
    }`;

    const unlockTimeHtml =
      achievement.isUnlocked && achievement.unlockedAt
        ? `<div class="achievement-unlock-time">Unlocked: ${achievement.unlockedAt.toLocaleDateString()}</div>`
        : "";

    // Show level info
    const levelHtml = achievement.level
      ? `<div class="achievement-level">Level ${achievement.level}</div>`
      : `<div class="achievement-level">Unknown Level</div>`;

    // Show real information for unlocked achievements, hide for locked ones
    let contentHtml;
    if (achievement.isUnlocked) {
      contentHtml = `
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-description">${achievement.description}</div>
        ${levelHtml}
        ${unlockTimeHtml}
      `;
    } else {
      // Completely hide all information for locked achievements
      contentHtml = `
        <div class="achievement-title">???</div>
        <div class="achievement-description">???</div>
        ${levelHtml}
        <div class="achievement-hint">Keep exploring to unlock this achievement!</div>
      `;
    }

    element.innerHTML = `
            <div class="achievement-icon">
                ${achievement.isUnlocked ? "🏆" : "🔒"}
            </div>
            <div class="achievement-content">
                ${contentHtml}
            </div>
        `;

    return element;
  }

  updateProgress() {
    const total = this.achievements.size;
    const unlocked = this.unlockedAchievements.size;
    const percentage = total > 0 ? (unlocked / total) * 100 : 0;

    const progressFill = this.achievementPanel.querySelector(".progress-fill");
    const progressText = this.achievementPanel.querySelector(".progress-text");

    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }

    if (progressText) {
      progressText.textContent = `${unlocked} / ${total}`;
    }
  }

  // Handle achievement unlock event
  handleAchievementUnlock(achievementId) {
    // This method can be used for additional logic when achievements are unlocked
    console.log(`🏆 Achievement unlock event received: ${achievementId}`);
  }

  // Sync achievements from game state on load
  syncFromGameState(unlockedSet) {
    console.log("🏆 Syncing achievements from game state");
    this.unlockedAchievements = new Set(unlockedSet);

    // Update achievement objects
    this.achievements.forEach((achievement, id) => {
      if (this.unlockedAchievements.has(id)) {
        achievement.isUnlocked = true;
        // Note: We don't have unlockedAt time from save, but that's ok
      }
    });

    this.updateProgress();
    this.updateButtonProgress();
    console.log("🏆 Achievement sync complete - showing all achievements");
  }

  // Get achievement statistics
  getStats() {
    return {
      total: this.achievements.size,
      unlocked: this.unlockedAchievements.size,
      locked: this.achievements.size - this.unlockedAchievements.size,
      percentage:
        this.achievements.size > 0
          ? Math.round(
              (this.unlockedAchievements.size / this.achievements.size) * 100
            )
          : 0,
      byLevel: {
        level1: {
          total: Array.from(this.achievements.values()).filter(
            (a) => a.level === 1
          ).length,
          unlocked: Array.from(this.achievements.values()).filter(
            (a) => a.level === 1 && a.isUnlocked
          ).length,
        },
        level2: {
          total: Array.from(this.achievements.values()).filter(
            (a) => a.level === 2
          ).length,
          unlocked: Array.from(this.achievements.values()).filter(
            (a) => a.level === 2 && a.isUnlocked
          ).length,
        },
        level3: {
          total: Array.from(this.achievements.values()).filter(
            (a) => a.level === 3
          ).length,
          unlocked: Array.from(this.achievements.values()).filter(
            (a) => a.level === 3 && a.isUnlocked
          ).length,
        },
      },
    };
  }

  // Get achievements by character
  getAchievementsByCharacter(characterId) {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.characterId === characterId
    );
  }

  // Check if player has unlocked all achievements FOR ALL LEVELS
  hasUnlockedAll() {
    return this.unlockedAchievements.size === this.achievements.size;
  }

  // Reset all achievements (for new game or debugging/testing)
  resetAll() {
    this.achievements.forEach((achievement) => {
      achievement.isUnlocked = false;
      achievement.unlockedAt = null;
    });
    this.unlockedAchievements.clear();
    this.updateProgress();
    this.updateButtonProgress();
    console.log("🏆 All achievements reset");
  }
}

// js/systems/AchievementManager.js - UPDATED: Uses ContentManager for achievements

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
    this.onTutorialCompleteCallback = null; // Callback for tutorial completion
    this.isInitialized = false;

    this.createAchievementUI();
    this.createAchievementButton();
    this.setupEventListeners();

    console.log("🏆 Achievement manager initialized for tutorial");
  }

  // Set callback for when tutorial is completed
  setTutorialCompleteCallback(callback) {
    this.onTutorialCompleteCallback = callback;
  }

  // UPDATED: Load achievements from ContentManager instead of global variables
  loadAchievementsWithKeywords() {
    const achievementsData = contentManager.getAllAchievements();

    Object.entries(achievementsData).forEach(([key, achievementData]) => {
      this.achievements.set(key, {
        ...achievementData,
        id: key,
        unlockedAt: null,
        progress: 0,
      });
    });

    this.isInitialized = true;
    console.log(
      `🏆 Loaded ${this.achievements.size} achievements from ContentManager`
    );
  }

  createAchievementButton() {
    this.achievementButton = document.createElement("button");
    this.achievementButton.className = "achievements-trigger";
    this.achievementButton.innerHTML = "🏆";
    this.achievementButton.title = "View Achievements (F2)";
    this.achievementButton.setAttribute("data-progress", "0/0");

    document.body.appendChild(this.achievementButton);

    this.achievementButton.addEventListener("click", () => {
      this.showAchievementPanel();
    });

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

      if (this.hasNewAchievements) {
        this.achievementButton.classList.add("has-new");
        setTimeout(() => {
          this.achievementButton.classList.remove("has-new");
          this.hasNewAchievements = false;
        }, 5000);
      }
    }
  }

  createAchievementUI() {
    this.achievementPanel = document.createElement("div");
    this.achievementPanel.className = "achievement-panel";
    this.achievementPanel.innerHTML = `
      <div class="achievement-header">
        <h2>🏆 Tutorial Achievements</h2>
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

    // Listen for standardized conversation messages
    GameEvents.on(GAME_EVENTS.CONVERSATION_MESSAGE, (eventData) => {
      if (!this.isInitialized) {
        console.warn("🏆 Achievement manager not initialized yet");
        return;
      }

      const { characterKey, message, response } = eventData;
      this.checkTriggers(characterKey, message, response);
    });

    // Listen for achievement unlocks
    GameEvents.on(GAME_EVENTS.ACHIEVEMENT_UNLOCK, (eventData) => {
      const achievementId = eventData.achievementKey || eventData.achievementId;
      this.handleAchievementUnlock(achievementId);
    });

    // Keyboard shortcut F2
    document.addEventListener("keydown", (e) => {
      const isConversationActive =
        this.gameEngine.conversationManager.isConversationActive;
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (!isConversationActive && !isInputFocused) {
        if (e.key === "F2") {
          e.preventDefault();
          this.showAchievementPanel();
        }
      }
    });
  }

  // Check achievement triggers for conversation messages
  checkTriggers(characterKey, message, response) {
    if (!this.isInitialized) {
      console.warn("🏆 Achievement system not ready");
      return;
    }

    console.log(`🏆 Checking triggers for ${characterKey}`);
    console.log(`🏆 Message: "${message}"`);

    // Find achievements for this character
    const characterAchievements = Array.from(this.achievements.values()).filter(
      (achievement) =>
        achievement.characterId === characterKey && !achievement.isUnlocked
    );

    console.log(
      `🏆 Found ${characterAchievements.length} possible achievements for ${characterKey}`
    );

    characterAchievements.forEach((achievement) => {
      console.log(`🏆 Checking achievement: ${achievement.id}`);
      console.log(
        `🏆 Trigger keywords: ${JSON.stringify(achievement.triggerKeywords)}`
      );

      const triggerFound = this.checkKeywordTriggers(
        achievement.triggerKeywords,
        characterKey,
        message
      );

      if (triggerFound) {
        console.log(
          `🏆 TRIGGER FOUND! Unlocking achievement: ${achievement.id}`
        );
        this.unlockAchievement(achievement.id);
      }
    });
  }

  // Check if message contains trigger keywords
  checkKeywordTriggers(triggerKeywords, characterKey, message) {
    if (!triggerKeywords || triggerKeywords.length === 0) {
      return false;
    }

    // Normalize message for checking
    const normalizedMessage = message.toLowerCase();

    // Use word boundary matching for precise detection
    return triggerKeywords.some((keyword) => {
      const normalizedKeyword = keyword.toLowerCase();

      // Duck checks for 'quack' in player message, others check for exact word match
      let found = false;

      if (characterKey === NPC_DUCK || characterKey === NPC_DUCK2) {
        // Duck: check if player said anything containing 'quack'
        found = normalizedMessage.includes("quack");
        console.log(
          `🏆 Duck checking for 'quack' in "${normalizedMessage}": ${found}`
        );
      } else {
        // Other characters: check for exact word match
        const wordBoundaryRegex = new RegExp(`\\b${normalizedKeyword}\\b`, "i");
        found = wordBoundaryRegex.test(normalizedMessage);
        console.log(
          `🏆 Checking "${normalizedKeyword}" in "${normalizedMessage}": ${found}`
        );
      }

      return found;
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

    // Emit standardized achievement event
    GameEvents.emit(GAME_EVENTS.ACHIEVEMENT_UNLOCK, {
      type: "achievement",
      achievementKey: achievementId,
      achievement: achievement,
      timestamp: Date.now(),
    });

    // Check for tutorial completion
    if (
      achievementId === MENT_TUTORIAL_COMPLETE &&
      this.onTutorialCompleteCallback
    ) {
      console.log("🎉 Tutorial completed! Triggering victory callback...");
      setTimeout(() => {
        this.onTutorialCompleteCallback();
      }, 2000); // Delay to let the achievement notification show
    }

    console.log(`🏆 Achievement unlocked: ${achievement.title}`);
    return true;
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

    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
      <div class="notification-icon">🏆</div>
      <div class="notification-content">
        <div class="notification-title">Achievement Unlocked!</div>
        <div class="notification-description">${achievement.title}</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Play sound
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
    await this.delay(4000);

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
    this.achievementPanel
      .querySelectorAll(".achievement-tab")
      .forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.filter === filter);
      });

    this.renderAchievements(filter);
  }

  renderAchievements(filter = "all") {
    const listContainer =
      this.achievementPanel.querySelector(".achievement-list");
    listContainer.innerHTML = "";

    let achievementsToShow = Array.from(this.achievements.values());

    switch (filter) {
      case "unlocked":
        achievementsToShow = achievementsToShow.filter((a) => a.isUnlocked);
        break;
      case "locked":
        achievementsToShow = achievementsToShow.filter((a) => !a.isUnlocked);
        break;
    }

    // Sort: unlocked first, then by title
    achievementsToShow.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) {
        return b.isUnlocked - a.isUnlocked;
      }
      return a.title.localeCompare(b.title);
    });

    achievementsToShow.forEach((achievement) => {
      const achievementElement = this.createAchievementElement(achievement);
      listContainer.appendChild(achievementElement);
    });

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

    let contentHtml;
    if (achievement.isUnlocked) {
      contentHtml = `
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-description">${achievement.description}</div>
        ${unlockTimeHtml}
      `;
    } else {
      contentHtml = `
        <div class="achievement-title">???</div>
        <div class="achievement-description">${
          achievement.hint ||
          "Complete tutorial objectives to unlock this achievement!"
        }</div>
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

  handleAchievementUnlock(achievementId) {
    console.log(`🏆 Achievement unlock event received: ${achievementId}`);
  }

  // Sync achievements from game state
  syncFromGameState(unlockedSet) {
    console.log("🏆 Syncing achievements from game state");
    this.unlockedAchievements = new Set(unlockedSet);

    this.achievements.forEach((achievement, id) => {
      if (this.unlockedAchievements.has(id)) {
        achievement.isUnlocked = true;
      }
    });

    this.updateProgress();
    this.updateButtonProgress();
    console.log("🏆 Achievement sync complete");
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
    };
  }

  // Check if tutorial is complete
  isTutorialComplete() {
    return this.unlockedAchievements.has(MENT_TUTORIAL_COMPLETE);
  }

  // Reset all achievements
  reset() {
    this.achievements.forEach((achievement) => {
      achievement.isUnlocked = false;
      achievement.unlockedAt = null;
    });
    this.unlockedAchievements.clear();
    this.isInitialized = false;
    this.updateProgress();
    this.updateButtonProgress();
    console.log("🏆 Tutorial achievements reset");
  }

  // Utility method
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  destroy() {
    if (this.achievementPanel && this.achievementPanel.parentNode) {
      this.achievementPanel.parentNode.removeChild(this.achievementPanel);
    }

    if (this.achievementButton && this.achievementButton.parentNode) {
      this.achievementButton.parentNode.removeChild(this.achievementButton);
    }

    console.log("🗑️ Achievement manager destroyed");
  }
}

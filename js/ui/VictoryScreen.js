// js/ui/VictoryScreen.js - Tutorial Victory Screen for Anxiety Minotaur with Victory Persistence

class VictoryScreen {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.victoryElement = null;
    this.isShowing = false;
    this.isUnlocked = false;
    this.victoryButton = null;

    this.createVictoryUI();
    this.createVictoryButton();
  }

  // UPDATED: More robust sync method that checks both the flag AND the achievement
  syncWithGameState() {
    const gameState = this.gameEngine.gameState;

    // Check both the tutorial completed flag AND if the tutorial achievement is unlocked
    const hasCompletedFlag = gameState.isTutorialCompleted();
    const hasTutorialAchievement = gameState.hasAchievement(TUTORIAL_COMPLETE);

    const wasCompleted = hasCompletedFlag || hasTutorialAchievement;

    if (wasCompleted && !this.isUnlocked) {
      console.log("🎉 Restoring victory button from saved game state");
      console.log(`  - Tutorial flag: ${hasCompletedFlag}`);
      console.log(`  - Achievement unlocked: ${hasTutorialAchievement}`);

      this.isUnlocked = true;
      this.victoryButton.style.display = "block";

      // If we detected completion via achievement but flag wasn't set, fix it
      if (hasTutorialAchievement && !hasCompletedFlag) {
        console.log(
          "🔧 Syncing tutorial completion flag with achievement state"
        );
        gameState.markTutorialCompleted();
      }
    }
  }

  createVictoryButton() {
    this.victoryButton = document.createElement("button");
    this.victoryButton.className = "victory-trigger";
    this.victoryButton.innerHTML = "🏆";
    this.victoryButton.title = "View Tutorial Completion (F3)";
    this.victoryButton.style.display = "none";

    document.body.appendChild(this.victoryButton);

    this.victoryButton.addEventListener("click", () => {
      this.show();
    });

    // F3 keyboard shortcut
    document.addEventListener("keydown", (e) => {
      const isConversationActive =
        this.gameEngine.conversationManager.isConversationActive;
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (
        !isConversationActive &&
        !isInputFocused &&
        this.isUnlocked &&
        !this.isShowing
      ) {
        if (e.key === "F3") {
          e.preventDefault();
          this.show();
        }
      }
    });
  }

  createVictoryUI() {
    this.victoryElement = document.createElement("div");
    this.victoryElement.className = "victory-screen";
    this.victoryElement.innerHTML = `
      <div class="victory-content">
        <div class="victory-header">
          <div class="victory-trophy-container">
            <div class="victory-trophy-image">🎉</div>
            <div class="victory-trophy-glow"></div>
          </div>
          <h1>Tutorial Complete!</h1>
          <h2>You've successfully helped your neighbor and learned the basics!</h2>
          <div class="trophy-caption">🌟 Helpful Neighbor Achievement Earned! 🌟</div>
        </div>
        
        <div class="victory-stats">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">Complete</div>
            <div class="stat-label">Tutorial Status</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value" id="characters-met">0</div>
            <div class="stat-label">Characters Met</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-value" id="items-found">0</div>
            <div class="stat-label">Items Found</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-value" id="achievements-earned">0</div>
            <div class="stat-label">Achievements</div>
          </div>
        </div>
        
        <div class="victory-achievements">
          <h3>What You've Learned</h3>
          <div class="achievement-showcase">
            <div class="showcase-achievement">
              <span class="achievement-emoji">🦆</span>
              <span class="achievement-name">Duck companions help restore social energy</span>
            </div>
            <div class="showcase-achievement">
              <span class="achievement-emoji">🔍</span>
              <span class="achievement-name">Exploring and examining items reveals clues</span>
            </div>
            <div class="showcase-achievement">
              <span class="achievement-emoji">💬</span>
              <span class="achievement-name">Conversations can solve problems and help others</span>
            </div>
          </div>
        </div>
        
        <div class="victory-flex">
          <div class="victory-message">
            <p>🌟 You've successfully helped your gardener neighbor identify their seeds!</p>
            <p>💝 You've learned how to manage social energy and use your duck companion for support!</p>
            <p>🎮 Ready for a completely fresh adventure?</p>
          </div>
          
          <div class="victory-actions">
            <button class="victory-button continue-game">🔄 Start Fresh Adventure</button>
            <button class="victory-button close-victory">Keep Exploring Tutorial</button>
          </div>
        </div>
        
        <div class="victory-footer">
          <p>🎊 Tutorial Complete - Ready for Adventure! 🎊</p>
          <div class="celebration-emojis">
            <span>🦆</span><span>🌱</span><span>💝</span><span>🏆</span>
            <span>✨</span><span>🎉</span><span>🌟</span><span>⭐</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.victoryElement);
    this.hide();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // UPDATED: Complete to fresh adventure button - now resets everything
    this.victoryElement
      .querySelector(".continue-game")
      .addEventListener("click", () => {
        this.handleCompleteGameReset();
      });

    // Close victory screen button
    this.victoryElement
      .querySelector(".close-victory")
      .addEventListener("click", () => {
        this.hide();
      });
  }

  // NEW: Handle complete game reset with user confirmation
  handleCompleteGameReset() {
    const confirmed = confirm(
      "🎮 Ready to start a fresh adventure?\n\n" +
        "This will:\n" +
        "• Reset all progress and achievements\n" +
        "• Clear all discoveries and conversations\n" +
        "• Return you to the very beginning\n" +
        "• Keep your audio settings\n\n" +
        "Start fresh adventure?"
    );

    if (!confirmed) {
      return;
    }

    console.log("🎮 Player chose to start fresh adventure");

    // Show reset animation
    this.showResetAnimation();

    // Delay the actual reset to allow animation to play
    setTimeout(() => {
      this.gameEngine.completeGameReset();
    }, 1500);
  }

  // NEW: Show reset animation with feedback
  showResetAnimation() {
    const content = this.victoryElement.querySelector(".victory-content");

    // Update content to show reset in progress
    const header = this.victoryElement.querySelector(".victory-header h1");
    const subtitle = this.victoryElement.querySelector(".victory-header h2");
    const actions = this.victoryElement.querySelector(".victory-actions");

    if (header) header.textContent = "Starting Fresh Adventure...";
    if (subtitle)
      subtitle.textContent = "Resetting progress and preparing new game";

    // Hide action buttons
    if (actions) actions.style.display = "none";

    // Add spinning icon animation
    const trophyIcon = this.victoryElement.querySelector(
      ".victory-trophy-image"
    );
    if (trophyIcon) {
      trophyIcon.textContent = "🔄";

      // Spin animation
      if (typeof gsap !== "undefined") {
        gsap.to(trophyIcon, {
          rotation: 360,
          duration: 1,
          repeat: -1,
          ease: "none",
        });
      }
    }

    // Fade out other elements
    const elementsToFade = [
      ".victory-stats",
      ".victory-achievements",
      ".victory-flex",
      ".victory-footer",
    ];

    elementsToFade.forEach((selector) => {
      const element = this.victoryElement.querySelector(selector);
      if (element && typeof gsap !== "undefined") {
        gsap.to(element, {
          opacity: 0.3,
          duration: 0.5,
        });
      }
    });
  }

  // UPDATED: show method - mark tutorial as completed in GameState
  show(withCutscene = false) {
    if (this.isShowing) return;

    console.log("🎉 Tutorial victory screen showing");

    // If this is the first time showing (tutorial just completed)
    if (!this.isUnlocked) {
      this.isUnlocked = true;
      this.victoryButton.style.display = "block";

      // ADDED: Mark tutorial as completed in GameState
      this.gameEngine.gameState.markTutorialCompleted();

      this.playVictorySequence();
    }

    this.showVictoryScreen();
  }

  async showVictoryScreen() {
    if (this.isShowing) return;

    this.isShowing = true;

    // Update stats
    this.updateStats();

    // Show the screen
    this.victoryElement.classList.add("visible");

    // Prevent body scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Play entrance animation
    const content = this.victoryElement.querySelector(".victory-content");
    gsap.fromTo(
      content,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );

    // Play victory sound
    if (this.gameEngine.renderer?.assetManager) {
      this.gameEngine.renderer.assetManager.playSound(
        "effects/achievement.mp3",
        0.8
      );
    }

    console.log("🎉 Tutorial victory screen shown!");
  }

  hide() {
    this.isShowing = false;
    this.victoryElement.classList.remove("visible");

    // Restore body scrolling
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  updateStats() {
    // Get game statistics
    const explorationStats = this.gameEngine.explorationDrawer.getStats();
    const achievementStats = this.gameEngine.achievementManager.getStats();

    // Update character count
    const charactersMet = this.victoryElement.querySelector("#characters-met");
    if (charactersMet) {
      charactersMet.textContent = explorationStats.characters.discovered;
    }

    // Update items count
    const itemsFound = this.victoryElement.querySelector("#items-found");
    if (itemsFound) {
      itemsFound.textContent = explorationStats.items.discovered;
    }

    // Update achievements count
    const achievementsEarned = this.victoryElement.querySelector(
      "#achievements-earned"
    );
    if (achievementsEarned) {
      achievementsEarned.textContent = achievementStats.unlocked;
    }
  }

  playVictorySequence() {
    const content = this.victoryElement.querySelector(".victory-content");
    const header = this.victoryElement.querySelector(".victory-header");
    const stats = this.victoryElement.querySelector(".victory-stats");
    const achievements = this.victoryElement.querySelector(
      ".victory-achievements"
    );
    const message = this.victoryElement.querySelector(".victory-message");
    const actions = this.victoryElement.querySelector(".victory-actions");
    const footer = this.victoryElement.querySelector(".victory-footer");

    // Initial state
    gsap.set([header, stats, achievements, message, actions, footer], {
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
        stats,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .to(
        achievements,
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

    // Animate stat cards individually
    const statCards = this.victoryElement.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 1.2 + index * 0.1,
          ease: "back.out(1.7)",
        }
      );
    });

    // Animate achievement showcase
    const showcaseAchievements = this.victoryElement.querySelectorAll(
      ".showcase-achievement"
    );
    showcaseAchievements.forEach((achievement, index) => {
      gsap.fromTo(
        achievement,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          delay: 2 + index * 0.1,
          ease: "power2.out",
        }
      );
    });

    // Special trophy entrance animation
    const trophyContainer = this.victoryElement.querySelector(
      ".victory-trophy-container"
    );
    if (trophyContainer) {
      gsap.fromTo(
        trophyContainer,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          delay: 0.8,
          ease: "back.out(2.7)",
        }
      );
    }

    // Confetti effect
    this.createTutorialConfetti();
  }

  createTutorialConfetti() {
    const colors = ["#FFD700", "#4CAF50", "#2196F3", "#FF9800", "#E91E63"];
    const emojis = ["🦆", "🌱", "💝", "🏆", "⭐", "🎉", "✨", "🌟"];

    const confettiContainer = document.createElement("div");
    confettiContainer.className = "victory-confetti-container";
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      overflow: hidden;
      z-index: 10001;
    `;

    this.victoryElement.appendChild(confettiContainer);

    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        const useEmoji = Math.random() > 0.5;

        if (useEmoji) {
          confetti.textContent =
            emojis[Math.floor(Math.random() * emojis.length)];
          confetti.style.fontSize = "20px";
        } else {
          confetti.style.cssText = `
            width: 10px;
            height: 10px;
            background-color: ${
              colors[Math.floor(Math.random() * colors.length)]
            };
            border-radius: 50%;
          `;
        }

        confetti.style.cssText += `
          position: absolute;
          left: ${Math.random() * 100}vw;
          top: -20px;
          pointer-events: none;
          z-index: 10002;
        `;

        confettiContainer.appendChild(confetti);

        gsap.to(confetti, {
          y: window.innerHeight + 50,
          x: `+=${Math.random() * 200 - 100}`,
          rotation: Math.random() * 720,
          duration: Math.random() * 4 + 3,
          ease: "power2.in",
          onComplete: () => {
            if (confetti.parentNode) {
              confetti.parentNode.removeChild(confetti);
            }
          },
        });
      }, i * 100);
    }

    // Clean up confetti container
    setTimeout(() => {
      if (confettiContainer && confettiContainer.parentNode) {
        confettiContainer.parentNode.removeChild(confettiContainer);
      }
    }, 10000);
  }

  // Check if tutorial victory should trigger
  static shouldTriggerVictory(achievementManager) {
    return achievementManager.isTutorialComplete();
  }

  // Check if victory has been unlocked
  isVictoryUnlocked() {
    return this.isUnlocked;
  }

  // Force unlock victory (for debugging)
  forceUnlock() {
    this.isUnlocked = true;
    this.victoryButton.style.display = "block";
  }

  destroy() {
    // Restore body overflow
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (this.victoryElement && this.victoryElement.parentNode) {
      this.victoryElement.parentNode.removeChild(this.victoryElement);
    }

    if (this.victoryButton && this.victoryButton.parentNode) {
      this.victoryButton.parentNode.removeChild(this.victoryButton);
    }

    console.log("🗑️ Tutorial victory screen destroyed");
  }
}

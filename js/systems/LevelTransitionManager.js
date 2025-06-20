// js/systems/LevelTransitionManager.js - Handle smooth transitions between levels

class LevelTransitionManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.transitionOverlay = null;
    this.isTransitioning = false;

    this.createTransitionUI();
    this.setupEventListeners();

    console.log("🌊 Level Transition Manager initialized");
  }

  createTransitionUI() {
    this.transitionOverlay = document.createElement("div");
    this.transitionOverlay.className = "level-transition-overlay";
    this.transitionOverlay.innerHTML = `
      <div class="transition-content">
        <div class="transition-icon">🏰</div>
        <div class="transition-title">Level Transition</div>
        <div class="transition-subtitle">Preparing next phase...</div>
        <div class="transition-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
    `;

    // Add CSS
    const style = document.createElement("style");
    style.textContent = `
      .level-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      .level-transition-overlay.active {
        display: flex;
        opacity: 1;
      }

      .transition-content {
        text-align: center;
        color: white;
        max-width: 400px;
        padding: 40px;
      }

      .transition-icon {
        font-size: 64px;
        margin-bottom: 20px;
        animation: float 2s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      .transition-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: #3498db;
      }

      .transition-subtitle {
        font-size: 1.1rem;
        margin-bottom: 30px;
        opacity: 0.8;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        width: 0%;
        transition: width 0.3s ease;
        border-radius: 4px;
      }

      .transition-sparkles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      }

      .sparkle {
        position: absolute;
        color: #f1c40f;
        font-size: 16px;
        animation: sparkle-fall 3s linear infinite;
        opacity: 0;
      }

      @keyframes sparkle-fall {
        0% { 
          opacity: 0;
          transform: translateY(-50px) rotate(0deg);
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% { 
          opacity: 0;
          transform: translateY(100vh) rotate(360deg);
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.transitionOverlay);
  }

  setupEventListeners() {
    // Listen for level completion to trigger transitions
    GameEvents.on(GAME_EVENTS.ACHIEVEMENT_UNLOCKED, (achievementId) => {
      if (achievementId === READY_FOR_THE_DAY) {
        // Level 1 → Level 2 transition
        setTimeout(() => {
          this.transitionToLevel2();
        }, 2000);
      } else if (achievementId === RECRUITMENT_COMPLETE) {
        // Level 2 → Level 3 transition
        setTimeout(() => {
          this.transitionToLevel3();
        }, 2000);
      }
    });
  }

  async transitionToLevel2() {
    console.log("🌊 Starting transition from Level 1 to Level 2");

    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Update transition content for Level 2
    this.updateTransitionContent({
      icon: "🏰",
      title: "Entering the Labyrinth",
      subtitle: "Time to recruit allies and gather intelligence...",
    });

    // Show transition screen
    await this.showTransition();

    // Create sparkle effect
    this.createSparkleEffect();

    // Simulate loading/preparation time
    await this.animateProgress(3000);

    // Load Level 2
    await this.gameEngine.levelManager.loadLevel(2);

    // Hide transition screen
    await this.hideTransition();

    this.isTransitioning = false;
    console.log("🌊 Transition to Level 2 complete");
  }

  async transitionToLevel3() {
    console.log("🌊 Starting transition from Level 2 to Level 3");

    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Update transition content for Level 3
    this.updateTransitionContent({
      icon: "⚔️",
      title: "The Final Confrontation",
      subtitle: "Your strategy will now be tested...",
    });

    // Show transition screen
    await this.showTransition();

    // Create dramatic effect for final level
    this.createDramaticEffect();

    // Longer preparation time for final results
    await this.animateProgress(4000);

    // Calculate results and load Level 3
    const resultsManager = new ResultsManager(this.gameEngine);
    const results = resultsManager.calculateResults();

    // Load Level 3
    await this.gameEngine.levelManager.loadLevel(3);

    // Hide transition screen
    await this.hideTransition();

    // Show results screen after a brief pause
    setTimeout(() => {
      const resultsScreen = new ResultsScreen(this.gameEngine);
      resultsScreen.show(results);
    }, 1000);

    this.isTransitioning = false;
    console.log("🌊 Transition to Level 3 complete");
  }

  updateTransitionContent(content) {
    const icon = this.transitionOverlay.querySelector(".transition-icon");
    const title = this.transitionOverlay.querySelector(".transition-title");
    const subtitle = this.transitionOverlay.querySelector(
      ".transition-subtitle"
    );

    icon.textContent = content.icon;
    title.textContent = content.title;
    subtitle.textContent = content.subtitle;
  }

  async showTransition() {
    return new Promise((resolve) => {
      this.transitionOverlay.classList.add("active");

      // Disable all game interactions
      if (this.gameEngine.interactionHandler) {
        this.gameEngine.interactionHandler.setInteractionsEnabled(false);
      }

      // Close any open UI
      if (this.gameEngine.conversationManager?.isConversationActive) {
        this.gameEngine.conversationManager.endConversation();
      }

      setTimeout(resolve, 500); // Wait for fade in
    });
  }

  async hideTransition() {
    return new Promise((resolve) => {
      gsap.to(this.transitionOverlay, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          this.transitionOverlay.classList.remove("active");
          this.transitionOverlay.style.opacity = "";

          // Re-enable game interactions
          if (this.gameEngine.interactionHandler) {
            this.gameEngine.interactionHandler.setInteractionsEnabled(true);
          }

          resolve();
        },
      });
    });
  }

  async animateProgress(duration) {
    return new Promise((resolve) => {
      const progressFill =
        this.transitionOverlay.querySelector(".progress-fill");

      gsap.to(progressFill, {
        width: "100%",
        duration: duration / 1000,
        ease: "power2.out",
        onComplete: resolve,
      });
    });
  }

  createSparkleEffect() {
    const sparkleContainer = document.createElement("div");
    sparkleContainer.className = "transition-sparkles";
    this.transitionOverlay.appendChild(sparkleContainer);

    // Create sparkles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.textContent = "✨";
        sparkle.style.left = Math.random() * 100 + "%";
        sparkle.style.animationDelay = Math.random() * 2 + "s";
        sparkle.style.animationDuration = Math.random() * 2 + 2 + "s";

        sparkleContainer.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
          }
        }, 5000);
      }, i * 100);
    }

    // Clean up sparkle container after effects
    setTimeout(() => {
      if (sparkleContainer.parentNode) {
        sparkleContainer.parentNode.removeChild(sparkleContainer);
      }
    }, 8000);
  }

  createDramaticEffect() {
    const sparkleContainer = document.createElement("div");
    sparkleContainer.className = "transition-sparkles";
    this.transitionOverlay.appendChild(sparkleContainer);

    // Create more dramatic effects for final level
    const effects = ["⚡", "🔥", "✨", "💫", "⭐"];

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const effect = document.createElement("div");
        effect.className = "sparkle";
        effect.textContent =
          effects[Math.floor(Math.random() * effects.length)];
        effect.style.left = Math.random() * 100 + "%";
        effect.style.animationDelay = Math.random() * 2 + "s";
        effect.style.animationDuration = Math.random() * 1.5 + 1.5 + "s";
        effect.style.fontSize = Math.random() * 8 + 16 + "px";

        sparkleContainer.appendChild(effect);

        // Remove effect after animation
        setTimeout(() => {
          if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
          }
        }, 4000);
      }, i * 80);
    }

    // Add screen flash effect
    const flash = document.createElement("div");
    flash.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      pointer-events: none;
    `;

    this.transitionOverlay.appendChild(flash);

    gsap.fromTo(
      flash,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.1,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
          }
        },
      }
    );

    // Clean up sparkle container
    setTimeout(() => {
      if (sparkleContainer.parentNode) {
        sparkleContainer.parentNode.removeChild(sparkleContainer);
      }
    }, 6000);
  }

  // Manual transition trigger (for debugging or forced transitions)
  async triggerTransition(fromLevel, toLevel) {
    console.log(`🌊 Manual transition: Level ${fromLevel} → Level ${toLevel}`);

    if (toLevel === 2) {
      await this.transitionToLevel2();
    } else if (toLevel === 3) {
      await this.transitionToLevel3();
    }
  }

  // Check if currently transitioning
  isCurrentlyTransitioning() {
    return this.isTransitioning;
  }

  // Force stop transition (emergency use)
  stopTransition() {
    if (this.isTransitioning) {
      console.log("🌊 Force stopping transition");

      this.isTransitioning = false;
      this.transitionOverlay.classList.remove("active");

      // Re-enable interactions
      if (this.gameEngine.interactionHandler) {
        this.gameEngine.interactionHandler.setInteractionsEnabled(true);
      }
    }
  }

  destroy() {
    if (this.transitionOverlay && this.transitionOverlay.parentNode) {
      this.transitionOverlay.parentNode.removeChild(this.transitionOverlay);
    }

    console.log("🗑️ Level Transition Manager destroyed");
  }
}

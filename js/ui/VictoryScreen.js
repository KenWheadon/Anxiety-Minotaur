class VictoryScreen {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.victoryElement = null;
    this.isShowing = false;
    this.isUnlocked = false; // Track if victory has been achieved
    this.victoryButton = null; // Button to reopen victory screen

    this.createVictoryUI();
    this.createVictoryButton(); // Create the reopen button
  }

  // Create a button to reopen the victory screen
  createVictoryButton() {
    this.victoryButton = document.createElement("button");
    this.victoryButton.className = "victory-trigger";
    this.victoryButton.innerHTML = "🏆";
    this.victoryButton.title = "View Victory Screen (F3)";
    this.victoryButton.style.display = "none"; // Hidden until victory is achieved

    document.body.appendChild(this.victoryButton);

    // Add click listener
    this.victoryButton.addEventListener("click", () => {
      this.show();
    });

    // Add keyboard shortcut F3
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
        // Use F3 key for victory screen (safe function key)
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
            <div class="victory-trophy-image"></div>
            <div class="victory-trophy-glow"></div>
          </div>
          <h1>Mission Accomplished!</h1>
          <h2>You've successfully completed Level 3 and brought down the Kingpin!</h2>
          <div class="trophy-caption">🏆 Super Shiny Mega-Cop Trophy Earned! 🏆</div>
        </div>
        
        <div class="victory-stats">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">3/3</div>
            <div class="stat-label">Levels Complete</div>
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
            <div class="stat-icon">⏱️</div>
            <div class="stat-value" id="play-time">0</div>
            <div class="stat-label">Minutes Played</div>
          </div>
        </div>
        
        <div class="victory-achievements">
          <h3>Mission Objectives Complete</h3>
          <div class="achievement-showcase">
            <div class="showcase-achievement">
              <span class="achievement-emoji">🚓</span>
              <span class="achievement-name">Assignment Received</span>
            </div>
            <div class="showcase-achievement">
              <span class="achievement-emoji">🎭</span>
              <span class="achievement-name">Gang Infiltrated</span>
            </div>
            <div class="showcase-achievement">
              <span class="achievement-emoji">⚖️</span>
              <span class="achievement-name">Kingpin Exposed</span>
            </div>
          </div>
        </div>
        
        <div class="victory-message">
          <p>🌟 You've successfully exposed the Kingpin's criminal operations!</p>
          <p>💡 The frog gang has been dismantled and justice has been served!</p>
          <p>🎮 Thank you for playing Anxiety Minotaur!</p>
        </div>
        
        <div class="victory-actions">
          <button class="victory-button restart-game">Start New Game</button>
        </div>
        
        <div class="victory-footer">
          <p>🎊 Level 3 Complete - Mission Accomplished! 🎊</p>
          <div class="celebration-emojis">
            <span>🚓</span><span>🐸</span><span>⚖️</span><span>🏆</span>
            <span>✨</span><span>🎉</span><span>🏆</span><span>⭐</span>
          </div>
        </div>
      </div>
    `;

    // CSS styles are now handled by css/victory.css
    document.body.appendChild(this.victoryElement);
    this.hide();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Restart game button
    this.victoryElement
      .querySelector(".restart-game")
      .addEventListener("click", () => {
        if (
          confirm(
            "Are you sure you want to start a new game? This will reset all progress."
          )
        ) {
          this.gameEngine.reset();
          this.hide();
          // Hide victory button and reset unlock status on game reset
          this.isUnlocked = false;
          this.victoryButton.style.display = "none";
        }
      });
  }

  // NEW: Load trophy image
  async loadTrophyImage() {
    try {
      // Use the game's asset manager to load the trophy image
      const trophyImage = await this.gameEngine.renderer.assetManager.loadImage(
        "items/item_trophy",
        "item"
      );

      const trophyImageElement = this.victoryElement.querySelector(
        ".victory-trophy-image"
      );
      if (trophyImageElement && trophyImage) {
        if (trophyImage.src.includes("data:")) {
          // Canvas-generated placeholder
          trophyImageElement.style.backgroundImage = `url(${trophyImage.src})`;
        } else {
          // Real image
          trophyImageElement.style.backgroundImage = `url(${trophyImage.src})`;
        }

        console.log("🏆 Trophy image loaded successfully");
      }
    } catch (error) {
      console.warn(
        "🏆 Failed to load trophy image, using emoji fallback:",
        error
      );

      // Fallback to emoji if image fails
      const trophyImageElement = this.victoryElement.querySelector(
        ".victory-trophy-image"
      );
      if (trophyImageElement) {
        trophyImageElement.innerHTML = "🏆";
        trophyImageElement.style.fontSize = "80px";
        trophyImageElement.style.display = "flex";
        trophyImageElement.style.alignItems = "center";
        trophyImageElement.style.justifyContent = "center";
      }
    }
  }

  // NEW: Modified to support cutscene integration
  show(withCutscene = false) {
    if (this.isShowing) return;

    console.log(
      `🎉 Victory screen show called (withCutscene: ${withCutscene})`
    );

    // If cutscene is requested and available AND this is the first time showing victory
    if (
      withCutscene &&
      !this.isUnlocked &&
      this.gameEngine.cutsceneManager &&
      this.gameEngine.cutsceneManager.hasCutscene("level3_victory")
    ) {
      console.log("🎬 Playing victory cutscene before showing screen");

      this.gameEngine.cutsceneManager.playCutscene("level3_victory", () => {
        // Show victory screen after cutscene completes
        this.showVictoryScreen();
      });
    } else {
      // Show victory screen immediately (for reopening or no cutscene)
      this.showVictoryScreen();
    }
  }

  // NEW: Separated the actual screen display logic
  async showVictoryScreen() {
    if (this.isShowing) return;

    this.isShowing = true;

    // Load trophy image before showing
    await this.loadTrophyImage();

    // Update stats
    this.updateStats();

    // Show the screen
    this.victoryElement.classList.add("visible");

    // Prevent body scrollbars by setting overflow hidden on both html and body
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Only play victory sequence on first show (when unlocked)
    if (!this.isUnlocked) {
      this.playVictorySequence();
      this.isUnlocked = true; // Mark as unlocked
      this.victoryButton.style.display = "block"; // Show reopen button

      // Play victory sound
      if (this.gameEngine.renderer?.assetManager) {
        this.gameEngine.renderer.assetManager.playSound(
          "effects/achievement.mp3",
          0.8
        );
      }
    } else {
      // Just show without animations for reopened victory screen
      const content = this.victoryElement.querySelector(".victory-content");
      gsap.fromTo(
        content,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }

    console.log("🎉 Victory screen shown!");
  }

  hide() {
    this.isShowing = false;
    this.victoryElement.classList.remove("visible");

    // Restore body scrolling on both html and body
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  updateStats() {
    // Get game statistics
    const gameStats = this.gameEngine.gameState.getStats();
    const explorationStats = this.gameEngine.explorationDrawer.getStats();

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

    // Update play time
    const playTime = this.victoryElement.querySelector("#play-time");
    if (playTime) {
      playTime.textContent = gameStats.playTime;
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

    // Enhanced confetti effect with trophy theme
    this.createTrophyConfetti();
  }

  createTrophyConfetti() {
    const colors = ["#FFD700", "#4CAF50", "#2196F3", "#FF9800", "#E91E63"];
    const emojis = ["🐸", "🚓", "⚖️", "🏆", "⭐", "🎉", "✨", "👑", "🥇"];

    // Better confetti container positioning and overflow management
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

    for (let i = 0; i < 35; i++) {
      // More confetti for victory!
      setTimeout(() => {
        const confetti = document.createElement("div");
        const useEmoji = Math.random() > 0.6;

        if (useEmoji) {
          confetti.textContent =
            emojis[Math.floor(Math.random() * emojis.length)];
          confetti.style.fontSize = "24px";
        } else {
          confetti.style.cssText = `
            width: 12px;
            height: 12px;
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

        // Better confetti animation with proper cleanup
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
      }, i * 80); // Faster confetti spawn
    }

    // Clean up confetti container after all animations with safety check
    setTimeout(() => {
      if (confettiContainer && confettiContainer.parentNode) {
        confettiContainer.parentNode.removeChild(confettiContainer);
      }
    }, 12000);
  }

  // Check if victory conditions are met - for Level 3 completion
  static shouldTriggerVictory(achievementManager) {
    // Check if we're on Level 3 and have the completion achievement
    return (
      achievementManager.gameEngine.levelManager?.currentLevel === 3 &&
      achievementManager.unlockedAchievements.has(SPILLED_HIS_GUTS)
    );
  }

  // Check if victory has been unlocked (for external use)
  isVictoryUnlocked() {
    return this.isUnlocked;
  }

  // Force unlock victory (for debugging or manual triggers)
  forceUnlock() {
    this.isUnlocked = true;
    this.victoryButton.style.display = "block";
  }

  destroy() {
    // Restore body overflow when destroying
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (this.victoryElement && this.victoryElement.parentNode) {
      this.victoryElement.parentNode.removeChild(this.victoryElement);
    }

    // Clean up victory button
    if (this.victoryButton && this.victoryButton.parentNode) {
      this.victoryButton.parentNode.removeChild(this.victoryButton);
    }

    console.log("🗑️ Victory screen destroyed");
  }
}

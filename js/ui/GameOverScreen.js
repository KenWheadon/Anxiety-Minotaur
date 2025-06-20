class GameOverScreen {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.gameOverElement = null;
    this.isShowing = false;

    this.createGameOverUI();
  }

  createGameOverUI() {
    this.gameOverElement = document.createElement("div");
    this.gameOverElement.className = "game-over-screen";
    this.gameOverElement.innerHTML = `
      <div class="game-over-content">
        <div class="game-over-header">
          <div class="game-over-icon">💀</div>
          <h1>BUSTED!</h1>
          <h2>Your cover has been blown!</h2>
        </div>
        
        <div class="game-over-message">
          <p>🚨 The Kingpin has discovered you're a cop!</p>
          <p>💥 Your undercover operation has been compromised!</p>
          <p>⚰️ This mission is over...</p>
        </div>
        
        <div class="game-over-stats">
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value" id="final-play-time">0</div>
            <div class="stat-label">Minutes Played</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-value" id="final-conversations">0</div>
            <div class="stat-label">Conversations</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-value" id="final-achievements">0</div>
            <div class="stat-label">Achievements</div>
          </div>
        </div>
        
        <div class="game-over-actions">
          <button class="game-over-button restart-game">Try Again</button>
          <button class="game-over-button quit-game">Main Menu</button>
        </div>
        
        <div class="game-over-footer">
          <p>💡 Tip: Be more careful about who you trust next time!</p>
          <div class="game-over-emojis">
            <span>🚓</span><span>💀</span><span>🐸</span><span>⚰️</span>
          </div>
        </div>
      </div>
    `;

    // NEW: Add CSS to prevent horizontal scrolling
    const style = document.createElement("style");
    style.textContent = `
      .game-over-screen {
        /* FIXED: Prevent horizontal scrolling */
        max-width: 100vw;
        overflow-x: hidden;
        box-sizing: border-box;
      }

      .game-over-content {
        /* FIXED: Constrain content width and prevent overflow */
        max-width: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
        overflow-x: hidden;
      }

      .game-over-stats {
        /* FIXED: Responsive stat cards that don't cause horizontal overflow */
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        margin: 20px 0;
        max-width: 100%;
      }

      .stat-card {
        /* FIXED: Responsive stat cards */
        flex: 1 1 150px;
        min-width: 120px;
        max-width: 200px;
        box-sizing: border-box;
      }

      .game-over-actions {
        /* FIXED: Responsive button layout */
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        margin: 20px 0;
        max-width: 100%;
      }

      .game-over-button {
        /* FIXED: Responsive buttons */
        flex: 1 1 auto;
        min-width: 120px;
        max-width: 200px;
        box-sizing: border-box;
        white-space: nowrap;
      }

      .game-over-emojis {
        /* FIXED: Prevent emoji overflow */
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        max-width: 100%;
      }

      .game-over-emojis span {
        font-size: 24px;
        flex-shrink: 0;
      }

      /* FIXED: Mobile responsive adjustments */
      @media (max-width: 600px) {
        .game-over-content {
          padding: 15px;
        }
        
        .game-over-stats {
          flex-direction: column;
          align-items: center;
        }

        .stat-card {
          max-width: 300px;
          width: 100%;
        }
        
        .game-over-actions {
          flex-direction: column;
          align-items: center;
        }

        .game-over-button {
          width: 100%;
          max-width: 300px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.gameOverElement);
    this.hide();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Restart game button
    this.gameOverElement
      .querySelector(".restart-game")
      .addEventListener("click", () => {
        if (
          confirm(
            "Are you sure you want to restart? This will reset all progress."
          )
        ) {
          this.gameEngine.reset();
          this.hide();
        }
      });

    // Quit game button (for now just restarts)
    this.gameOverElement
      .querySelector(".quit-game")
      .addEventListener("click", () => {
        if (
          confirm(
            "Are you sure you want to quit? This will reset all progress."
          )
        ) {
          this.gameEngine.reset();
          this.hide();
        }
      });
  }

  // NEW: Modified to support cutscene integration
  show(withCutscene = false) {
    if (this.isShowing) return;

    console.log(
      `💀 Game Over screen show called (withCutscene: ${withCutscene})`
    );

    // If cutscene is requested and available
    if (
      withCutscene &&
      this.gameEngine.cutsceneManager &&
      this.gameEngine.cutsceneManager.hasCutscene("level3_gameover")
    ) {
      console.log("🎬 Playing game over cutscene before showing screen");

      this.gameEngine.cutsceneManager.playCutscene("level3_gameover", () => {
        // Show game over screen after cutscene completes
        this.showGameOverScreen();
      });
    } else {
      // Show game over screen immediately
      this.showGameOverScreen();
    }
  }

  // NEW: Separated the actual screen display logic
  showGameOverScreen() {
    if (this.isShowing) return;

    this.isShowing = true;

    // Update stats
    this.updateStats();

    // Show the screen
    this.gameOverElement.classList.add("visible");

    // FIXED: Prevent body scrolling on both html and body elements
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // FIXED: Additional scrolling prevention
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.width = "100vw";
    document.body.style.maxWidth = "100vw";

    // Disable all game interactions
    if (this.gameEngine.interactionHandler) {
      this.gameEngine.interactionHandler.setInteractionsEnabled(false);
    }

    // Close any open conversations
    if (
      this.gameEngine.conversationManager &&
      this.gameEngine.conversationManager.isConversationActive
    ) {
      this.gameEngine.conversationManager.endConversation();
    }

    // Play game over sequence
    this.playGameOverSequence();

    // Play game over sound
    if (this.gameEngine.renderer?.assetManager) {
      this.gameEngine.renderer.assetManager.playSound(
        "effects/game_over.mp3",
        0.8
      );
    }

    console.log("💀 Game Over screen shown!");
  }

  hide() {
    this.isShowing = false;
    this.gameOverElement.classList.remove("visible");

    // FIXED: Restore body scrolling completely
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflowX = "";
    document.body.style.overflowX = "";
    document.body.style.width = "";
    document.body.style.maxWidth = "";

    // Re-enable game interactions
    if (this.gameEngine.interactionHandler) {
      this.gameEngine.interactionHandler.setInteractionsEnabled(true);
    }
  }

  updateStats() {
    // Get game statistics
    const gameStats = this.gameEngine.gameState.getStats();
    const achievementStats = this.gameEngine.achievementManager.getStats();

    // Update play time
    const playTime = this.gameOverElement.querySelector("#final-play-time");
    if (playTime) {
      playTime.textContent = gameStats.playTime;
    }

    // Update conversation count
    const conversations = this.gameOverElement.querySelector(
      "#final-conversations"
    );
    if (conversations) {
      conversations.textContent = gameStats.conversationCount;
    }

    // Update achievement count
    const achievements = this.gameOverElement.querySelector(
      "#final-achievements"
    );
    if (achievements) {
      achievements.textContent = achievementStats.unlocked;
    }
  }

  playGameOverSequence() {
    const content = this.gameOverElement.querySelector(".game-over-content");
    const header = this.gameOverElement.querySelector(".game-over-header");
    const message = this.gameOverElement.querySelector(".game-over-message");
    const stats = this.gameOverElement.querySelector(".game-over-stats");
    const actions = this.gameOverElement.querySelector(".game-over-actions");
    const footer = this.gameOverElement.querySelector(".game-over-footer");

    // Initial state
    gsap.set([header, message, stats, actions, footer], {
      opacity: 0,
      y: 30,
    });

    // Animate content in with dramatic effect
    gsap.fromTo(
      content,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    // Staggered entrance animation with dramatic timing
    const timeline = gsap.timeline({ delay: 0.4 });

    timeline
      .to(header, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(
        message,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .to(
        stats,
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
    const statCards = this.gameOverElement.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 1.8 + index * 0.1,
          ease: "back.out(1.7)",
        }
      );
    });

    // Add dramatic screen shake effect
    gsap.to(content, {
      x: 5,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut",
      delay: 0.2,
    });

    // Create dramatic particles effect
    this.createGameOverParticles();
  }

  createGameOverParticles() {
    const colors = ["#FF0000", "#8B0000", "#DC143C", "#B22222", "#CD5C5C"];
    const symbols = ["💀", "⚡", "💥", "🚨", "⚰️"];

    // Create particle container
    const particleContainer = document.createElement("div");
    particleContainer.className = "game-over-particles";
    particleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      overflow: hidden;
      z-index: 10001;
      max-width: 100vw; /* FIXED: Prevent overflow */
    `;

    this.gameOverElement.appendChild(particleContainer);

    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const particle = document.createElement("div");
        const useSymbol = Math.random() > 0.6;

        if (useSymbol) {
          particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];
          particle.style.fontSize = "24px";
        } else {
          particle.style.cssText = `
            width: 8px;
            height: 8px;
            background-color: ${
              colors[Math.floor(Math.random() * colors.length)]
            };
            border-radius: 50%;
          `;
        }

        particle.style.cssText += `
          position: absolute;
          left: ${Math.random() * 100}vw;
          top: -30px;
          pointer-events: none;
          z-index: 10002;
        `;

        particleContainer.appendChild(particle);

        // FIXED: Animate particle fall with constrained movement
        gsap.to(particle, {
          y: window.innerHeight + 100,
          x: `+=${Math.random() * 200 - 100}`, // FIXED: Reduced range to prevent overflow
          rotation: Math.random() * 720,
          opacity: 0,
          duration: Math.random() * 4 + 3,
          ease: "power2.in",
          onComplete: () => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          },
        });
      }, i * 150);
    }

    // Clean up particle container after all animations
    setTimeout(() => {
      if (particleContainer && particleContainer.parentNode) {
        particleContainer.parentNode.removeChild(particleContainer);
      }
    }, 10000);
  }

  // Check if player is showing (for external use)
  isGameOverShowing() {
    return this.isShowing;
  }

  destroy() {
    // FIXED: Restore body overflow when destroying
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflowX = "";
    document.body.style.overflowX = "";
    document.body.style.width = "";
    document.body.style.maxWidth = "";

    if (this.gameOverElement && this.gameOverElement.parentNode) {
      this.gameOverElement.parentNode.removeChild(this.gameOverElement);
    }

    console.log("🗑️ Game Over screen destroyed");
  }
}

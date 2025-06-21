// js/ui/StartScreen.js - Main menu/start screen for Minotaur's Labyrinth

class StartScreen {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.startScreenElement = null;
    this.playButton = null;
    this.isShowing = false;
    this.backgroundImage = null;
    this.playButtonImage = null;

    this.createStartScreenUI();
    this.setupEventListeners();

    console.log("🎮 Start Screen initialized (Minotaur's Labyrinth)");
  }

  createStartScreenUI() {
    this.startScreenElement = document.createElement("div");
    this.startScreenElement.className = "start-screen";
    this.startScreenElement.innerHTML = `
      <div class="start-screen-content">
        <div class="start-screen-background"></div>
        
        <div class="start-screen-overlay">
          <div class="game-title">
            <h1>Minotaur's Labyrinth</h1>
            <h2>A Social Puzzle Adventure</h2>
          </div>
          
          <div class="start-screen-buttons">
            <button class="start-button play-game" id="play-button">
              <span class="button-text">Start Adventure</span>
            </button>
            
            <div class="start-screen-info">
              <h3>🎯 Your Mission</h3>
              <p>You're a socially anxious minotaur preparing your labyrinth for an incoming adventurer!</p>
              
              <h3>🎮 How to Play</h3>
              <p><strong>Level 1:</strong> Explore your home, talk to duck, get ready 🏠</p>
              <p><strong>Level 2:</strong> Recruit 2 monsters + 1 trap maker, learn adventurer's stats 🧩</p>
              <p><strong>Level 3:</strong> Watch your strategy play out! 🎭</p>
              
              <h3>💝 Social Energy System</h3>
              <p>• Conversations cost energy (Level 2 only)</p>
              <p>• Talk to 🦆 duck to recharge anytime!</p>
              <p>• Plan your conversations wisely</p>
              
              <h3>🔍 Finding Clues</h3>
              <p>• Examine items to learn what NPCs want</p>
              <p>• Match items to personalities for recruitment</p>
              <p>• Visit information dealers for adventurer intel</p>
              
              <div class="controls-hint">
                <p>👆 Click characters and items to interact</p>
                <p>🎹 Press F1 for Discovery Journal, F2 for Achievements</p>
              </div>
            </div>
          </div>
          
          <div class="start-screen-footer">
            <p>Made with 🐂 and 🦆 for puzzle lovers</p>
            <div class="version-info">Minotaur's Labyrinth v1.0</div>
          </div>
        </div>
      </div>
    `;

    // Add CSS styles
    const style = document.createElement("style");
    style.textContent = `
      .start-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        display: none;
        z-index: 100000;
        overflow: hidden;
      }

      .start-screen.visible {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .start-screen-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .start-screen-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 1;
      }

      .start-screen-overlay {
        position: relative;
        z-index: 2;
        text-align: center;
        color: white;
        max-width: 700px;
        max-height: 90vh;
        padding: 40px;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(139, 69, 19, 0.4);
        overflow-y: auto;
        box-shadow: 0 0 30px rgba(139, 69, 19, 0.3);
      }

      .game-title h1 {
        font-size: 3.5rem;
        margin: 0 0 10px 0;
        color: #D2691E;
        text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
        font-weight: bold;
        letter-spacing: 2px;
      }

      .game-title h2 {
        font-size: 1.8rem;
        margin: 0 0 30px 0;
        color: #F4A460;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        font-weight: normal;
        letter-spacing: 1px;
        font-style: italic;
      }

      .start-screen-buttons {
        margin: 30px 0;
      }

      .start-button {
        background: linear-gradient(45deg, #D2691E, #F4A460);
        border: none;
        padding: 0;
        border-radius: 15px;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease;
        margin: 15px;
        overflow: hidden;
        position: relative;
        min-width: 220px;
        min-height: 80px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 20px rgba(210, 105, 30, 0.4);
      }

      .start-button:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 8px 25px rgba(210, 105, 30, 0.6);
        background: linear-gradient(45deg, #CD853F, #DEB887);
      }

      .start-button:active {
        transform: translateY(-1px) scale(1.02);
      }

      .start-button .button-text {
        z-index: 2;
        position: relative;
      }

      .start-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s;
      }

      .start-button:hover::before {
        left: 100%;
      }

      .start-screen-info {
        margin: 30px 0;
        font-size: 14px;
        line-height: 1.6;
        color: #E8F5E8;
        text-align: left;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }

      .start-screen-info h3 {
        color: #D2691E;
        margin: 20px 0 10px 0;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }

      .start-screen-info p {
        margin: 8px 0;
      }

      .controls-hint {
        margin-top: 20px;
        padding: 15px;
        background: rgba(210, 105, 30, 0.2);
        border-radius: 8px;
        border: 1px solid rgba(210, 105, 30, 0.4);
      }

      .controls-hint p {
        margin: 5px 0;
        font-size: 13px;
        color: #DEB887;
      }

      .start-screen-footer {
        margin-top: 30px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }

      .version-info {
        margin-top: 10px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .start-screen-overlay {
          max-width: 90%;
          padding: 30px 20px;
          max-height: 95vh;
        }

        .game-title h1 {
          font-size: 2.8rem;
        }

        .game-title h2 {
          font-size: 1.5rem;
        }

        .start-button {
          font-size: 20px;
          min-width: 180px;
          min-height: 70px;
        }

        .start-screen-info {
          font-size: 13px;
        }

        .start-screen-info h3 {
          font-size: 16px;
          margin: 15px 0 8px 0;
        }

        .controls-hint {
          font-size: 12px;
        }
      }

      @media (max-width: 480px) {
        .start-screen-overlay {
          padding: 20px 15px;
        }

        .game-title h1 {
          font-size: 2.2rem;
        }

        .game-title h2 {
          font-size: 1.2rem;
        }

        .start-screen-info {
          font-size: 12px;
        }

        .start-screen-info h3 {
          font-size: 15px;
        }
      }

      /* Animation for screen entrance */
      .start-screen-overlay {
        animation: slideIn 1s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Floating animation for buttons */
      .start-button {
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }

      .start-button:hover {
        animation: none;
      }

      /* Scrollbar styling for mobile */
      .start-screen-overlay::-webkit-scrollbar {
        width: 6px;
      }

      .start-screen-overlay::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }

      .start-screen-overlay::-webkit-scrollbar-thumb {
        background: rgba(210, 105, 30, 0.5);
        border-radius: 3px;
      }

      .start-screen-overlay::-webkit-scrollbar-thumb:hover {
        background: rgba(210, 105, 30, 0.7);
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.startScreenElement);

    // Get button reference
    this.playButton = this.startScreenElement.querySelector("#play-button");

    this.hide();
  }

  setupEventListeners() {
    // Play button
    this.playButton.addEventListener("click", () => {
      this.startGame();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (this.isShowing) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.startGame();
        }
      }
    });

    // Prevent clicks from propagating when start screen is showing
    this.startScreenElement.addEventListener("click", (e) => {
      if (this.isShowing) {
        e.stopPropagation();
      }
    });
  }

  async show() {
    if (this.isShowing) return;

    console.log("🎮 Showing start screen (Minotaur's Labyrinth)");
    this.isShowing = true;

    // Load background image
    await this.loadAssets();

    // Show the screen
    this.startScreenElement.classList.add("visible");

    // Prevent body scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Play entrance animations
    this.playEntranceAnimation();

    // Play background music if available
    if (this.gameEngine.audioManager) {
      console.log("🎵 Start screen audio ready");
    }
  }

  hide() {
    this.isShowing = false;
    this.startScreenElement.classList.remove("visible");

    // Restore body scrolling
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  async loadAssets() {
    try {
      // Load start screen background
      const backgroundImage = new Image();
      backgroundImage.src = "images/backgrounds/" + LEVELE0_BG + ".png";

      await new Promise((resolve, reject) => {
        backgroundImage.onload = resolve;
        backgroundImage.onerror = () => {
          console.warn("🎮 Start screen background not found, using fallback");
          resolve(); // Continue even if image fails
        };
      });

      // Set background
      const backgroundElement = this.startScreenElement.querySelector(
        ".start-screen-background"
      );
      if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
        backgroundElement.style.backgroundImage = `url(${backgroundImage.src})`;
      } else {
        // Fallback gradient background - minotaur themed
        backgroundElement.style.background =
          "linear-gradient(135deg, #8B4513 0%, #D2691E 25%, #F4A460 50%, #DEB887 75%, #8B4513 100%)";
      }

      console.log("🎮 Start screen assets loaded");
    } catch (error) {
      console.warn("🎮 Error loading start screen assets:", error);
    }
  }

  playEntranceAnimation() {
    const content = this.startScreenElement.querySelector(
      ".start-screen-overlay"
    );
    const title = this.startScreenElement.querySelector(".game-title");
    const buttons = this.startScreenElement.querySelector(
      ".start-screen-buttons"
    );
    const footer = this.startScreenElement.querySelector(
      ".start-screen-footer"
    );

    // Initial state
    gsap.set([title, buttons, footer], { opacity: 0, y: 30 });

    // Animate content in
    gsap.fromTo(
      content,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    );

    // Staggered entrance
    const timeline = gsap.timeline({ delay: 0.3 });

    timeline
      .to(title, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(
        buttons,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .to(
        footer,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

    // Add sparkle effect
    this.createSparkleEffect();
  }

  createSparkleEffect() {
    const sparkleContainer = document.createElement("div");
    sparkleContainer.className = "sparkle-container";
    sparkleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 3;
      overflow: hidden;
    `;

    this.startScreenElement
      .querySelector(".start-screen-content")
      .appendChild(sparkleContainer);

    // Create minotaur-themed sparkles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        const sparkleOptions = ["✨", "🌟", "⭐", "💫", "🔮", "🏛️", "🗿"];
        sparkle.textContent =
          sparkleOptions[Math.floor(Math.random() * sparkleOptions.length)];
        sparkle.style.cssText = `
          position: absolute;
          font-size: ${Math.random() * 20 + 15}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          user-select: none;
          color: ${
            ["#D2691E", "#F4A460", "#DEB887", "#CD853F"][
              Math.floor(Math.random() * 4)
            ]
          };
        `;

        sparkleContainer.appendChild(sparkle);

        // Animate sparkle
        gsap.fromTo(
          sparkle,
          { opacity: 0, scale: 0, rotation: 0 },
          {
            opacity: 1,
            scale: 1.5,
            rotation: 360,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(sparkle, {
                opacity: 0,
                scale: 0,
                duration: 1,
                onComplete: () => sparkle.remove(),
              });
            },
          }
        );
      }, i * 150);
    }

    // Clean up sparkle container after animations
    setTimeout(() => {
      if (sparkleContainer.parentNode) {
        sparkleContainer.parentNode.removeChild(sparkleContainer);
      }
    }, 8000);
  }

  async startGame() {
    if (!this.isShowing) return;

    console.log("🎮 Starting Minotaur's Labyrinth from start screen");

    // Play click sound
    if (this.gameEngine.audioManager) {
      this.gameEngine.audioManager.playSoundEffect("click", 0.8);
    }

    // Button click animation
    gsap.to(this.playButton, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    // Hide start screen with animation
    const content = this.startScreenElement.querySelector(
      ".start-screen-overlay"
    );
    await new Promise((resolve) => {
      gsap.to(content, {
        opacity: 0,
        scale: 0.8,
        y: -50,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          this.hide();
          resolve();
        },
      });
    });

    // Start the actual game
    await this.gameEngine.startGameplay();
  }

  // Check if start screen is showing
  isStartScreenShowing() {
    return this.isShowing;
  }

  // Get start screen status
  getStatus() {
    return {
      isShowing: this.isShowing,
      assetsLoaded: {
        background: !!this.backgroundImage,
        playButton: !!this.playButtonImage,
      },
    };
  }

  destroy() {
    // Restore body overflow
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (this.startScreenElement && this.startScreenElement.parentNode) {
      this.startScreenElement.parentNode.removeChild(this.startScreenElement);
    }

    console.log("🗑️ Start screen destroyed (Minotaur's Labyrinth)");
  }
}

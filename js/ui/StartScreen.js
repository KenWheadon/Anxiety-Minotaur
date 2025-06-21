// js/ui/StartScreen.js - Tutorial start screen for Anxiety Minotaur

class StartScreen {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.startScreenElement = null;
    this.playButton = null;
    this.isShowing = false;
    this.backgroundImage = null;

    this.createStartScreenUI();
    this.setupEventListeners();

    console.log("🎮 Start Screen initialized (Anxiety Minotaur Tutorial)");
  }

  createStartScreenUI() {
    this.startScreenElement = document.createElement("div");
    this.startScreenElement.className = "start-screen";
    this.startScreenElement.innerHTML = `
      <div class="start-screen-content">
        <div class="start-screen-background"></div>
        
        <div class="start-screen-overlay">
          <div class="game-title">
            <h1>Anxiety Minotaur</h1>
          </div>
          
          <div class="start-screen-buttons">
            <button class="start-button play-game" id="play-button">
              <span class="button-text">Start</span>
            </button>
            
            <div class="start-screen-info">
              <h3>🎯 Objective</h3>
              <p>Your gardener neighbor needs help identifying some seeds that were delivered today. Can you help them figure out what type of plants they are?</p>
              
              <h3>🎮 What You'll Learn</h3>
              <p><strong>Social Energy:</strong> Talking to others uses energy, but your duck companion always helps you recharge! 🦆</p>
              <p><strong>Exploration:</strong> Examine items and explore different rooms to find clues 🔍</p>
              <p><strong>Problem Solving:</strong> Use what you discover to help your neighbor with their gardening problem 🌱</p>
              
              
              <h3>💝 Playing Tips</h3>
              <p>• Click on characters and items to interact with them</p>
              <p>• Your duck companion never judges and always helps restore your energy</p>
              <p>• Take your time - there's no rush to complete the tutorial</p>
              <p>• Read item descriptions carefully for helpful clues</p>
              
              <div class="controls-hint">
                <h3>🎹 Controls</h3>
                <p><strong>Mouse:</strong> Click to interact with characters and items</p>
                <p><strong>1, 2, 3:</strong> Quick navigation between rooms</p>
                <p><strong>F1:</strong> Discovery Journal (track your progress)</p>
                <p><strong>F2:</strong> Achievements (see your accomplishments)</p>
                <p><strong>ESC:</strong> Audio settings</p>
              </div>
            </div>
          </div>
          
          <div class="start-screen-footer">
            <p>A demo for a compassionate social puzzle about helping others and managing anxiety 💝</p>
          </div>
        </div>
      </div>
    `;

    // Enhanced CSS styles for tutorial
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
        max-width: 800px;
        max-height: 95vh;
        padding: 30px;
        background: rgba(0, 0, 0, 0.85);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(139, 69, 19, 0.4);
        overflow-y: auto;
        box-shadow: 0 0 30px rgba(139, 69, 19, 0.3);
      }

      .game-title h1 {
        font-size: 3.2rem;
        color: #D2691E;
        text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
        font-weight: bold;
        letter-spacing: 2px;
      }

      .start-screen-buttons {
        margin: 10px 0;
      }

      .start-button {
        background: linear-gradient(45deg, #228B22, #32CD32);
        border: none;
        padding: 0;
        border-radius: 15px;
        cursor: pointer;
        font-size: 22px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease;
        margin: 15px;
        overflow: hidden;
        position: relative;
        min-width: 200px;
        min-height: 70px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 20px rgba(34, 139, 34, 0.4);
      }

      .start-button:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 8px 25px rgba(34, 139, 34, 0.6);
        background: linear-gradient(45deg, #32CD32, #90EE90);
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
  margin: 10px 0;
        font-size: 14px;
        line-height: 1.6;
        color: #E8F5E8;
        text-align: left;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
      }

      .start-screen-info h3 {
        color: #32CD32;
        margin: 5px 0 8px 0;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }

      .start-screen-info p {
        margin: 8px 0;
        text-align: center;
      }

      .tutorial-benefits {
        margin: 20px 0;
        padding: 15px;
        background: rgba(50, 205, 50, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(50, 205, 50, 0.3);
      }

      .tutorial-benefits h3 {
        color: #90EE90;
        margin-bottom: 10px;
      }

      .tutorial-benefits p {
        font-size: 13px;
        line-height: 1.5;
        font-style: italic;
      }

      .controls-hint {
        padding: 7px;
        background: rgba(210, 105, 30, 0.2);
        border-radius: 8px;
        border: 1px solid rgba(210, 105, 30, 0.4);
      }

      .controls-hint h3 {
        color: #DEB887;
        margin-bottom: 10px;
      }

      .controls-hint p {
        margin: 5px 0;
        font-size: 12px;
        color: #DEB887;
      }

      .start-screen-footer {
        margin-top: 25px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }

      .version-info {
        margin-top: 8px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        font-style: italic;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .start-screen-overlay {
          max-width: 95%;
          padding: 25px 15px;
          max-height: 98vh;
        }

        .game-title h1 {
          font-size: 2.5rem;
        }


        .start-button {
          font-size: 18px;
          min-width: 160px;
          min-height: 60px;
        }

        .start-screen-info {
          font-size: 12px;
        }

        .start-screen-info h3 {
          font-size: 14px;
          margin: 5px 0 6px 0;
        }

        .tutorial-benefits {
          padding: 12px;
        }

        .controls-hint {
          padding: 12px;
        }
      }

      @media (max-width: 480px) {
        .start-screen-overlay {
          padding: 20px 12px;
        }

        .game-title h1 {
          font-size: 2rem;
        }

        .game-title h2 {
          font-size: 1.1rem;
        }

        .start-screen-info {
          font-size: 11px;
        }

        .start-screen-info h3 {
          font-size: 13px;
        }
      }

      /* Enhanced animations */
      .start-screen-overlay {
        animation: tutorialSlideIn 1.2s ease-out;
      }

      @keyframes tutorialSlideIn {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Gentle floating animation for tutorial button */
      .start-button {
        animation: tutorialFloat 4s ease-in-out infinite;
      }

      @keyframes tutorialFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }

      .start-button:hover {
        animation: none;
      }

      /* Enhanced scrollbar for mobile */
      .start-screen-overlay::-webkit-scrollbar {
        width: 6px;
      }

      .start-screen-overlay::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }

      .start-screen-overlay::-webkit-scrollbar-thumb {
        background: rgba(50, 205, 50, 0.5);
        border-radius: 3px;
      }

      .start-screen-overlay::-webkit-scrollbar-thumb:hover {
        background: rgba(50, 205, 50, 0.7);
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

    console.log("🎮 Showing tutorial start screen");
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
      console.log("🎵 Tutorial start screen audio ready");
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
          console.warn(
            "🎮 Tutorial start screen background not found, using fallback"
          );
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
        // Fallback gradient background - tutorial themed
        backgroundElement.style.background =
          "linear-gradient(135deg, #228B22 0%, #32CD32 25%, #90EE90 50%, #98FB98 75%, #228B22 100%)";
      }

      console.log("🎮 Tutorial start screen assets loaded");
    } catch (error) {
      console.warn("🎮 Error loading tutorial start screen assets:", error);
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
      { scale: 0.9, opacity: 0 },
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

    // Add gentle sparkle effect for tutorial
    this.createTutorialSparkles();
  }

  createTutorialSparkles() {
    const sparkleContainer = document.createElement("div");
    sparkleContainer.className = "tutorial-sparkle-container";
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

    // Create gentle tutorial-themed sparkles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        const sparkleOptions = ["🌱", "🦆", "💝", "⭐", "✨", "🏠", "🌟"];
        sparkle.textContent =
          sparkleOptions[Math.floor(Math.random() * sparkleOptions.length)];
        sparkle.style.cssText = `
          position: absolute;
          font-size: ${Math.random() * 16 + 12}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          user-select: none;
          color: ${
            ["#32CD32", "#90EE90", "#98FB98", "#DEB887"][
              Math.floor(Math.random() * 4)
            ]
          };
        `;

        sparkleContainer.appendChild(sparkle);

        // Gentle animate sparkle
        gsap.fromTo(
          sparkle,
          { opacity: 0, scale: 0, rotation: 0 },
          {
            opacity: 1,
            scale: 1.2,
            rotation: 180,
            duration: 3,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(sparkle, {
                opacity: 0,
                scale: 0,
                duration: 1.5,
                onComplete: () => sparkle.remove(),
              });
            },
          }
        );
      }, i * 200);
    }

    // Clean up sparkle container after animations
    setTimeout(() => {
      if (sparkleContainer.parentNode) {
        sparkleContainer.parentNode.removeChild(sparkleContainer);
      }
    }, 10000);
  }

  async startGame() {
    if (!this.isShowing) return;

    console.log("🎮 Starting Anxiety Minotaur Tutorial from start screen");

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
        scale: 0.9,
        y: -30,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          this.hide();
          resolve();
        },
      });
    });

    // Start the tutorial
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

    console.log("🗑️ Tutorial start screen destroyed");
  }
}

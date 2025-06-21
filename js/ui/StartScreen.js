// js/ui/StartScreen.js - CLEANED VERSION with CSS removed

class StartScreen {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.startScreenElement = null;
    this.isVisible = false;
  }

  async show() {
    if (this.isVisible) return;

    // Create start screen if it doesn't exist
    if (!this.startScreenElement) {
      this.createStartScreen();
    }

    // Try to load background asset
    try {
      await this.loadStartScreenAssets();
    } catch (error) {
      console.warn("🎮 Error loading tutorial start screen assets:", error);
    }

    this.isVisible = true;
    this.startScreenElement.classList.add("visible");

    // Play entrance animation
    this.playEntranceAnimation();

    console.log("🎮 Tutorial start screen shown");
  }

  createStartScreen() {
    this.startScreenElement = document.createElement("div");
    this.startScreenElement.className = "start-screen";

    // ✅ REMOVED: All inline CSS - now uses start-screen.css classes only
    this.startScreenElement.innerHTML = `
      <div class="start-screen-content">
        <div class="start-screen-background"></div>
        <div class="start-screen-overlay">
          <div class="game-title">
            <h1>Anxiety</h1>
            <h2>Minotaur</h2>
          </div>
          
          <div class="start-screen-info">
            <h3>🏠 Tutorial: Helping Your Neighbor</h3>
            <p>Your gardener neighbor needs help identifying some seeds. Explore your home, talk to your duck for comfort, and help solve the mystery!</p>
            
            <div class="tutorial-benefits">
              <h3>🎯 What You'll Learn:</h3>
              <p>• Navigate between rooms in your home<br>
              • Chat with friendly characters for support<br>
              • Find and examine helpful items<br>
              • Unlock achievements for your progress</p>
            </div>
            
            <div class="controls-hint">
              <h3>🎮 How to Play:</h3>
              <p>• Click on characters to talk with them<br>
              • Click on items to examine them closely<br>
              • Use the navigation arrows to move between rooms<br>
              • Check your achievements in the drawer (top-left)</p>
            </div>
          </div>

          <div class="start-screen-buttons">
            <button class="start-button" id="tutorial-start-button">
              <span class="button-text">🏠 Start Tutorial</span>
            </button>
          </div>

          <div class="start-screen-footer">
            <p>A gentle introduction to managing social anxiety</p>
            <div class="version-info">Tutorial v1.0 - Your journey begins at home</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.startScreenElement);

    // Set up event listeners
    this.setupEventListeners();

    console.log("🎮 Tutorial start screen created");
  }

  setupEventListeners() {
    const startButton = this.startScreenElement.querySelector(
      "#tutorial-start-button"
    );

    if (startButton) {
      startButton.addEventListener("click", async () => {
        console.log("🎮 Tutorial start button clicked");

        // Enable audio context on user interaction
        if (this.gameEngine.audioManager) {
          this.gameEngine.audioManager.resumeAudioContext();
        }

        await this.hide();
        await this.gameEngine.startGameplay();
      });
    }

    // ESC key to start game (keyboard accessibility)
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && this.isVisible) {
        startButton.click();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    // Store reference for cleanup
    this.keyPressHandler = handleKeyPress;
  }

  async loadStartScreenAssets() {
    try {
      // Try to load the tutorial background
      const backgroundElement = this.startScreenElement.querySelector(
        ".start-screen-background"
      );
      const backgroundImage =
        await this.gameEngine.renderer.assetManager.loadBackground("level0_bg");

      if (backgroundImage && backgroundImage.src) {
        backgroundElement.style.backgroundImage = `url(${backgroundImage.src})`;
        console.log("🖼️ Tutorial start screen background loaded");
      }
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

    // ✅ REMOVED: Inline CSS styles - add to start-screen.css instead
    // Now only sets the class name, styles handled by CSS

    this.startScreenElement
      .querySelector(".start-screen-content")
      .appendChild(sparkleContainer);

    // Create gentle tutorial-themed sparkles
    const sparkleOptions = ["🌱", "🦆", "💝", "⭐", "✨", "🏠", "🌟"];

    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        sparkle.className = "tutorial-sparkle"; // ✅ Use CSS class instead of inline styles
        sparkle.textContent =
          sparkleOptions[Math.floor(Math.random() * sparkleOptions.length)];

        // Set position via CSS custom properties (data attributes)
        sparkle.style.setProperty("--random-left", Math.random() * 100 + "%");
        sparkle.style.setProperty("--random-top", Math.random() * 100 + "%");
        sparkle.style.setProperty(
          "--random-size",
          Math.random() * 16 + 12 + "px"
        );

        sparkleContainer.appendChild(sparkle);

        // ✅ REMOVED: Inline animation styles - handle in CSS with classes
        sparkle.classList.add("sparkle-animate");

        // Clean up sparkle after animation
        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
          }
        }, 4000);
      }, i * 200);
    }
  }

  async hide() {
    if (!this.isVisible) return;

    // Animate out
    if (this.startScreenElement) {
      gsap.to(this.startScreenElement, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          this.startScreenElement.classList.remove("visible");
        },
      });
    }

    this.isVisible = false;
    console.log("🎮 Tutorial start screen hidden");
  }

  isStartScreenShowing() {
    return this.isVisible;
  }

  destroy() {
    // Remove event listeners
    if (this.keyPressHandler) {
      document.removeEventListener("keydown", this.keyPressHandler);
    }

    // Remove from DOM
    if (this.startScreenElement && this.startScreenElement.parentNode) {
      this.startScreenElement.parentNode.removeChild(this.startScreenElement);
    }

    console.log("🗑️ Tutorial start screen destroyed");
  }
}

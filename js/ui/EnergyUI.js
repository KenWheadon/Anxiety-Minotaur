// js/ui/EnergyUI.js - Left Sidebar Menu with Vertical Social Energy

class EnergyUI {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.energyContainer = null;
    this.menuPopup = null;
    this.energyBar = null;
    this.energyText = null;
    this.isVisible = false;

    // Create UI immediately and show it
    this.createEnergyUI();
    this.setupEventListeners();
    this.show();

    console.log("💝 Energy UI initialized and shown");
  }

  setupEventListeners() {
    // Listen for level changes to show energy UI in all levels
    GameEvents.on(GAME_EVENTS.LEVEL_CHANGED, (data) => {
      this.show(); // Show in all levels now
    });

    // Listen for conversation events to update energy display
    GameEvents.on(GAME_EVENTS.CONVERSATION_STARTED, () => {
      this.updateEnergyDisplay();
    });

    GameEvents.on(GAME_EVENTS.CONVERSATION_ENDED, () => {
      this.updateEnergyDisplay();
    });

    // FIXED: Update energy display more frequently
    setInterval(() => {
      if (this.isVisible) {
        this.updateEnergyDisplay();
      }
    }, 500); // FIXED: Update every 500ms instead of 1000ms
  }

  createEnergyUI() {
    // Remove existing energy UI if it exists
    if (this.energyContainer) {
      this.energyContainer.remove();
    }
    if (this.menuPopup) {
      this.menuPopup.remove();
    }

    // Create left menu container (the vertical bar)
    this.energyContainer = document.createElement("div");
    this.energyContainer.className = "energy-ui-container left-menu-container";
    this.energyContainer.innerHTML = `
      <div class="left-bar-header">
        <span class="left-bar-menu-icon">☰</span>
        <span class="left-bar-title">Menu</span>
      </div>
      <div class="vertical-energy-wrapper">
        <span class="vertical-energy-label">💝</span>
        <div class="vertical-energy-bar">
          <div class="vertical-energy-fill"></div>
        </div>
        <div class="vertical-energy-text">0/0</div>
      </div>
      <div class="left-bar-footer">
        <span class="duck-menu-icon" title="Talk to duck to recharge!">🦆</span>
      </div>
    `;

    document.body.appendChild(this.energyContainer);

    // Get references for vertical fill and badge
    this.energyBar = this.energyContainer.querySelector(".vertical-energy-fill");
    this.energyText = this.energyContainer.querySelector(".vertical-energy-text");

    // Create the slide-out menu popup
    this.menuPopup = document.createElement("div");
    this.menuPopup.className = "left-menu-popup";
    this.menuPopup.innerHTML = `
      <div class="menu-popup-header">
        <h3>Dashboard</h3>
      </div>
      <button class="menu-popup-option trophies-option" id="menu-btn-trophies">
        <span class="option-icon">🏆</span>
        <span class="option-label">Trophies</span>
      </button>
      <button class="menu-popup-option journal-option" id="menu-btn-journal">
        <span class="option-icon">📖</span>
        <span class="option-label">Discovery Journal</span>
      </button>
      <button class="menu-popup-option music-option" id="menu-btn-music">
        <span class="option-icon">🎵</span>
        <span class="option-label">Music & Sounds</span>
      </button>
    `;

    document.body.appendChild(this.menuPopup);

    // Setup menu interactions
    this.setupMenuInteractions();

    console.log("💝 Left menu bar & popup created and added to DOM");
  }

  setupMenuInteractions() {
    // Toggle menu popup on left bar click
    this.energyContainer.addEventListener("click", (e) => {
      this.toggleMenu();
      e.stopPropagation();
    });

    // Stop propagation inside menu popup so clicking it doesn't trigger close
    this.menuPopup.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close menu when clicking anywhere else on document
    document.addEventListener("click", () => {
      this.closeMenu();
    });

    // Close menu on ESC if it is open
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.menuPopup.classList.contains("open")) {
        this.closeMenu();
      }
    });

    // Trophies option
    this.menuPopup.querySelector("#menu-btn-trophies").addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeMenu();
      if (this.gameEngine.achievementManager) {
        this.gameEngine.achievementManager.showAchievementPanel();
      }
    });

    // Discovery Journal option
    this.menuPopup.querySelector("#menu-btn-journal").addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeMenu();
      if (this.gameEngine.explorationDrawer) {
        this.gameEngine.explorationDrawer.showDrawer();
      }
    });

    // Music option
    this.menuPopup.querySelector("#menu-btn-music").addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeMenu();
      if (this.gameEngine.audioSettingsUI) {
        this.gameEngine.audioSettingsUI.toggleSettingsPanel();
      }
    });
  }

  toggleMenu() {
    const isOpen = this.menuPopup.classList.toggle("open");
    this.energyContainer.classList.toggle("popup-open", isOpen);
  }

  closeMenu() {
    this.menuPopup.classList.remove("open");
    this.energyContainer.classList.remove("popup-open");
  }

  show() {
    if (this.isVisible) return;

    // Create UI if it doesn't exist
    if (!this.energyContainer) {
      this.createEnergyUI();
    }

    this.isVisible = true;
    this.energyContainer.classList.add("visible");
    this.updateEnergyDisplay();

    console.log("💝 Energy UI shown");
  }

  hide() {
    if (!this.isVisible) return;

    this.isVisible = false;
    if (this.energyContainer) {
      this.energyContainer.classList.remove("visible");
    }
    this.closeMenu();

    console.log("💝 Energy UI hidden");
  }

  updateEnergyDisplay() {
    if (!this.isVisible || !this.energyBar || !this.energyText) {
      console.log("💝 Cannot update energy display - missing elements");
      return;
    }

    const gameState = this.gameEngine.gameState;

    const currentEnergy =
      gameState.socialEnergy !== undefined
        ? gameState.socialEnergy
        : CONFIG.STARTING_SOCIAL_ENERGY;
    const maxEnergy = gameState.maxSocialEnergy || CONFIG.MAX_SOCIAL_ENERGY;
    const percentage = (currentEnergy / maxEnergy) * 100;

    // Update vertical bar height
    this.energyBar.style.height = Math.max(percentage, 2) + "%";

    // Update text badge
    this.energyText.textContent = `${currentEnergy}/${maxEnergy}`;

    // Update container styling based on energy level
    const container = this.energyContainer;
    container.classList.remove("low-energy", "no-energy");

    if (currentEnergy === 0) {
      container.classList.add("no-energy");
    } else if (currentEnergy <= 2) {
      container.classList.add("low-energy");
    }

    // Update energy bar color based on level with vertical gradient orientation
    const energyFill = this.energyBar;
    if (currentEnergy === 0) {
      energyFill.style.background = "#e74c3c";
      energyFill.style.boxShadow = "0 0 12px rgba(231, 76, 60, 0.6)";
    } else if (currentEnergy <= 2) {
      energyFill.style.background = "linear-gradient(180deg, #f39c12, #e74c3c)";
      energyFill.style.boxShadow = "0 0 12px rgba(231, 76, 60, 0.6)";
    } else if (currentEnergy <= 5) {
      energyFill.style.background = "linear-gradient(180deg, #f1c40f, #f39c12)";
      energyFill.style.boxShadow = "0 0 12px rgba(243, 156, 18, 0.6)";
    } else {
      energyFill.style.background = "linear-gradient(180deg, #2ecc71, #f1c40f)";
      energyFill.style.boxShadow = "0 0 12px rgba(46, 204, 113, 0.6)";
    }
  }

  // Enhanced energy gain animation next to Left Sidebar
  showEnergyGain(amount) {
    if (!this.isVisible) return;

    const gainText = document.createElement("div");
    gainText.className = "energy-gain-popup";
    gainText.textContent = `+${amount} Energy!`;
    gainText.style.cssText = `
      position: fixed;
      top: 60px;
      left: 95px;
      color: #2ecc71;
      font-weight: bold;
      font-size: 18px;
      pointer-events: none;
      z-index: 1001;
      background: rgba(0, 0, 0, 0.85);
      padding: 8px 12px;
      border-radius: 8px;
      border: 2px solid #2ecc71;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;

    document.body.appendChild(gainText);

    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        gainText,
        { opacity: 0, y: 0, scale: 0.8 },
        {
          opacity: 1,
          y: -40,
          scale: 1.2,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(gainText, {
              opacity: 0,
              y: -60,
              duration: 0.4,
              onComplete: () => gainText.remove(),
            });
          },
        }
      );

      // Pulse the vertical energy bar wrapper
      gsap.to(this.energyContainer, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    } else {
      gainText.style.animation = "energyGainFallback 1.5s ease-out forwards";
      setTimeout(() => gainText.remove(), 1500);
    }

    console.log(`💝 Energy gain animation shown: +${amount}`);
  }

  // Energy loss animation next to Left Sidebar
  showEnergyLoss(amount) {
    if (!this.isVisible) return;

    const lossText = document.createElement("div");
    lossText.className = "energy-loss-popup";
    lossText.textContent = `-${amount} Energy`;
    lossText.style.cssText = `
      position: fixed;
      top: 60px;
      left: 95px;
      color: #e74c3c;
      font-weight: bold;
      font-size: 16px;
      pointer-events: none;
      z-index: 1001;
      background: rgba(0, 0, 0, 0.85);
      padding: 6px 10px;
      border-radius: 8px;
      border: 2px solid #e74c3c;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;

    document.body.appendChild(lossText);

    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        lossText,
        { opacity: 0, y: 0, scale: 0.8 },
        {
          opacity: 1,
          y: -30,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(lossText, {
              opacity: 0,
              y: -50,
              duration: 0.4,
              onComplete: () => lossText.remove(),
            });
          },
        }
      );
    } else {
      lossText.style.animation = "energyLossFallback 1.2s ease-out forwards";
      setTimeout(() => lossText.remove(), 1200);
    }

    console.log(`💝 Energy loss animation shown: -${amount}`);
  }

  // Get current energy status for external use
  getEnergyStatus() {
    const gameState = this.gameEngine.gameState;
    const currentEnergy = gameState.socialEnergy || 10;
    const maxEnergy = gameState.maxSocialEnergy || 10;

    return {
      current: currentEnergy,
      max: maxEnergy,
      percentage: (currentEnergy / maxEnergy) * 100,
      isEmpty: currentEnergy === 0,
      isLow: currentEnergy <= 2,
      isFull: currentEnergy === maxEnergy,
    };
  }

  // FIXED: Reset method for game resets
  reset() {
    if (this.energyContainer) {
      this.energyContainer.classList.remove("low-energy", "no-energy");
    }
    this.updateEnergyDisplay();
    console.log("💝 Energy UI reset");
  }

  // FIXED: Force refresh method for debugging
  forceRefresh() {
    console.log("💝 Force refreshing Energy UI...");
    this.updateEnergyDisplay();

    // FIXED: Log current state for debugging
    const status = this.getEnergyStatus();
    console.log("💝 Current energy status:", status);

    if (!this.isVisible) {
      this.show();
    }
  }

  destroy() {
    if (this.energyContainer && this.energyContainer.parentNode) {
      this.energyContainer.parentNode.removeChild(this.energyContainer);
    }
    if (this.menuPopup && this.menuPopup.parentNode) {
      this.menuPopup.parentNode.removeChild(this.menuPopup);
    }

    console.log("🗑️ Energy UI destroyed");
  }
}

// FIXED: Add CSS animations as fallback
if (!document.querySelector("#energy-ui-fallback-styles")) {
  const style = document.createElement("style");
  style.id = "energy-ui-fallback-styles";
  style.textContent = `
    @keyframes energyGainFallback {
      0% { opacity: 0; transform: translateY(0) scale(0.8); }
      30% { opacity: 1; transform: translateY(-20px) scale(1.1); }
      100% { opacity: 0; transform: translateY(-50px) scale(1); }
    }
    
    @keyframes energyLossFallback {
      0% { opacity: 0; transform: translateY(0) scale(0.8); }
      30% { opacity: 1; transform: translateY(-15px) scale(1); }
      100% { opacity: 0; transform: translateY(-40px) scale(0.9); }
    }
  `;
  document.head.appendChild(style);
}

// js/ui/EnergyUI.js - FIXED: Social Energy Display for All Levels

class EnergyUI {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.energyContainer = null;
    this.energyBar = null;
    this.energyText = null;
    this.isVisible = false;

    // FIXED: Create UI immediately and show it
    this.createEnergyUI();
    this.setupEventListeners();
    this.show(); // FIXED: Show immediately for testing

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
    // FIXED: Remove existing energy UI if it exists
    if (this.energyContainer) {
      this.energyContainer.remove();
    }

    this.energyContainer = document.createElement("div");
    this.energyContainer.className = "energy-ui-container";
    this.energyContainer.innerHTML = `
      <div class="energy-ui-panel">
        <div class="energy-ui-header">
          <span class="energy-icon">💝</span>
          <span class="energy-label">Social Energy</span>
        </div>
        <div class="energy-bar-container">
          <div class="energy-bar">
            <div class="energy-fill"></div>
          </div>
          <div class="energy-text">10/10</div>
        </div>
        <div class="energy-hint">
          <span class="duck-icon">🦆</span>
          <span class="hint-text">Talk to duck to recharge!</span>
        </div>
      </div>
    `;

    // FIXED: Use the CSS styles from the conversation.css file
    document.body.appendChild(this.energyContainer);

    // Get references
    this.energyBar = this.energyContainer.querySelector(".energy-fill");
    this.energyText = this.energyContainer.querySelector(".energy-text");

    console.log("💝 Energy UI created and added to DOM");
  }

  show() {
    if (this.isVisible) return;

    // FIXED: Create UI if it doesn't exist
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

    console.log("💝 Energy UI hidden");
  }

  updateEnergyDisplay() {
    if (!this.isVisible || !this.energyBar || !this.energyText) {
      console.log("💝 Cannot update energy display - missing elements");
      return;
    }

    const gameState = this.gameEngine.gameState;

    // DEBUG: Log the actual values
    console.log("💝 DEBUG - Raw gameState values:");
    console.log("  gameState.socialEnergy:", gameState.socialEnergy);
    console.log("  gameState.maxSocialEnergy:", gameState.maxSocialEnergy);
    console.log(
      "  CONFIG.STARTING_SOCIAL_ENERGY:",
      CONFIG.STARTING_SOCIAL_ENERGY
    );
    console.log("  CONFIG.MAX_SOCIAL_ENERGY:", CONFIG.MAX_SOCIAL_ENERGY);

    // FIXED: Use !== undefined to properly handle 0 values
    const currentEnergy =
      gameState.socialEnergy !== undefined
        ? gameState.socialEnergy
        : CONFIG.STARTING_SOCIAL_ENERGY;
    const maxEnergy = gameState.maxSocialEnergy || CONFIG.MAX_SOCIAL_ENERGY;
    const percentage = (currentEnergy / maxEnergy) * 100;

    console.log("💝 DEBUG - Calculated values:");
    console.log("  currentEnergy:", currentEnergy);
    console.log("  maxEnergy:", maxEnergy);
    console.log("  percentage:", percentage);

    // Update bar width
    this.energyBar.style.width = Math.max(percentage, 2) + "%";

    // Update text
    this.energyText.textContent = `${currentEnergy}/${maxEnergy}`;
    // FIXED: Update container styling based on energy level
    const container = this.energyContainer;
    container.classList.remove("low-energy", "no-energy");

    if (currentEnergy === 0) {
      container.classList.add("no-energy");
    } else if (currentEnergy <= 2) {
      container.classList.add("low-energy");
    }

    // FIXED: Update energy bar color based on level with more specific targeting
    const energyFill = this.energyBar;
    if (currentEnergy === 0) {
      energyFill.style.background = "#e74c3c";
    } else if (currentEnergy <= 2) {
      energyFill.style.background = "linear-gradient(90deg, #e74c3c, #f39c12)";
    } else if (currentEnergy <= 5) {
      energyFill.style.background = "linear-gradient(90deg, #f39c12, #f1c40f)";
    } else {
      energyFill.style.background = "linear-gradient(90deg, #f1c40f, #2ecc71)";
    }

    // console.log(`💝 Energy bar updated: ${percentage}% width`);
  }

  // FIXED: Enhanced energy gain animation
  showEnergyGain(amount) {
    if (!this.isVisible) return;

    const gainText = document.createElement("div");
    gainText.className = "energy-gain-popup";
    gainText.textContent = `+${amount} Energy!`;
    gainText.style.cssText = `
      position: fixed;
      top: 60px;
      right: 30px;
      color: #2ecc71;
      font-weight: bold;
      font-size: 18px;
      pointer-events: none;
      z-index: 1001;
      background: rgba(0, 0, 0, 0.8);
      padding: 8px 12px;
      border-radius: 8px;
      border: 2px solid #2ecc71;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    `;

    document.body.appendChild(gainText);

    // FIXED: Better animation with GSAP fallback
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

      // Pulse the energy bar
      gsap.to(this.energyBar, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    } else {
      // FIXED: CSS fallback animation
      gainText.style.animation = "energyGainFallback 1.5s ease-out forwards";
      setTimeout(() => gainText.remove(), 1500);
    }

    console.log(`💝 Energy gain animation shown: +${amount}`);
  }

  // FIXED: Energy loss animation
  showEnergyLoss(amount) {
    if (!this.isVisible) return;

    const lossText = document.createElement("div");
    lossText.className = "energy-loss-popup";
    lossText.textContent = `-${amount} Energy`;
    lossText.style.cssText = `
      position: fixed;
      top: 60px;
      right: 30px;
      color: #e74c3c;
      font-weight: bold;
      font-size: 16px;
      pointer-events: none;
      z-index: 1001;
      background: rgba(0, 0, 0, 0.8);
      padding: 6px 10px;
      border-radius: 8px;
      border: 2px solid #e74c3c;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
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

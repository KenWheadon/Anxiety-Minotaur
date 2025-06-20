// js/ui/EnergyUI.js - Social Energy Display for Level 2

class EnergyUI {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.energyContainer = null;
    this.energyBar = null;
    this.energyText = null;
    this.isVisible = false;

    this.setupEventListeners();
    console.log("💝 Energy UI initialized");
  }

  setupEventListeners() {
    // Listen for level changes to show/hide energy UI
    GameEvents.on(GAME_EVENTS.LEVEL_CHANGED, (data) => {
      if (data.level === 2) {
        this.show();
      } else {
        this.hide();
      }
    });

    // Listen for conversation events to update energy display
    GameEvents.on(GAME_EVENTS.CONVERSATION_STARTED, () => {
      this.updateEnergyDisplay();
    });

    GameEvents.on(GAME_EVENTS.CONVERSATION_ENDED, () => {
      this.updateEnergyDisplay();
    });

    // Update energy display regularly
    setInterval(() => {
      if (this.isVisible) {
        this.updateEnergyDisplay();
      }
    }, 1000);
  }

  createEnergyUI() {
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

    // Add CSS styles
    const style = document.createElement("style");
    style.textContent = `
      .energy-ui-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        pointer-events: none;
      }

      .energy-ui-container.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .energy-ui-panel {
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        padding: 15px;
        min-width: 200px;
        backdrop-filter: blur(10px);
      }

      .energy-ui-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }

      .energy-icon {
        font-size: 20px;
      }

      .energy-label {
        color: white;
        font-size: 14px;
        font-weight: bold;
      }

      .energy-bar-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }

      .energy-bar {
        flex: 1;
        height: 20px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .energy-fill {
        height: 100%;
        background: linear-gradient(90deg, #e74c3c, #f39c12, #f1c40f, #2ecc71);
        border-radius: 9px;
        transition: width 0.5s ease;
        position: relative;
      }

      .energy-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      .energy-text {
        color: white;
        font-size: 12px;
        font-weight: bold;
        min-width: 35px;
        text-align: center;
      }

      .energy-hint {
        display: flex;
        align-items: center;
        gap: 5px;
        opacity: 0.7;
      }

      .duck-icon {
        font-size: 16px;
      }

      .hint-text {
        color: white;
        font-size: 11px;
        font-style: italic;
      }

      /* Low energy warning */
      .energy-ui-panel.low-energy {
        border-color: rgba(231, 76, 60, 0.6);
        animation: pulse-warning 1.5s infinite;
      }

      @keyframes pulse-warning {
        0%, 100% { 
          border-color: rgba(231, 76, 60, 0.6);
          box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
        }
        50% { 
          border-color: rgba(231, 76, 60, 1);
          box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
        }
      }

      /* Empty energy critical warning */
      .energy-ui-panel.no-energy {
        border-color: rgba(192, 57, 43, 0.8);
        background: rgba(192, 57, 43, 0.2);
        animation: pulse-critical 1s infinite;
      }

      @keyframes pulse-critical {
        0%, 100% { 
          transform: scale(1);
          border-color: rgba(192, 57, 43, 0.8);
        }
        50% { 
          transform: scale(1.05);
          border-color: rgba(192, 57, 43, 1);
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.energyContainer);

    // Get references
    this.energyBar = this.energyContainer.querySelector(".energy-fill");
    this.energyText = this.energyContainer.querySelector(".energy-text");
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

    console.log("💝 Energy UI hidden");
  }

  updateEnergyDisplay() {
    if (!this.isVisible || !this.energyBar || !this.energyText) return;

    const gameState = this.gameEngine.gameState;

    // Only update if we're in Level 2
    if (!gameState.shouldTrackSocialEnergy()) return;

    const currentEnergy = gameState.socialEnergy;
    const maxEnergy = gameState.maxSocialEnergy;
    const percentage = (currentEnergy / maxEnergy) * 100;

    // Update bar width
    this.energyBar.style.width = percentage + "%";

    // Update text
    this.energyText.textContent = `${currentEnergy}/${maxEnergy}`;

    // Update panel styling based on energy level
    const panel = this.energyContainer.querySelector(".energy-ui-panel");
    panel.classList.remove("low-energy", "no-energy");

    if (currentEnergy === 0) {
      panel.classList.add("no-energy");
    } else if (currentEnergy <= 2) {
      panel.classList.add("low-energy");
    }

    // Update energy bar color based on level
    if (currentEnergy === 0) {
      this.energyBar.style.background = "#e74c3c";
    } else if (currentEnergy <= 2) {
      this.energyBar.style.background =
        "linear-gradient(90deg, #e74c3c, #f39c12)";
    } else if (currentEnergy <= 5) {
      this.energyBar.style.background =
        "linear-gradient(90deg, #f39c12, #f1c40f)";
    } else {
      this.energyBar.style.background =
        "linear-gradient(90deg, #f1c40f, #2ecc71)";
    }
  }

  // Show energy restoration animation
  showEnergyGain(amount) {
    if (!this.isVisible) return;

    const gainText = document.createElement("div");
    gainText.className = "energy-gain-popup";
    gainText.textContent = `+${amount}`;
    gainText.style.cssText = `
      position: absolute;
      top: -10px;
      right: 50px;
      color: #2ecc71;
      font-weight: bold;
      font-size: 16px;
      pointer-events: none;
      z-index: 1001;
    `;

    this.energyContainer.style.position = "relative";
    this.energyContainer.appendChild(gainText);

    // Animate the gain popup
    gsap.fromTo(
      gainText,
      { opacity: 0, y: 0, scale: 0.8 },
      {
        opacity: 1,
        y: -30,
        scale: 1.2,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(gainText, {
            opacity: 0,
            y: -50,
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
  }

  // Get current energy status for external use
  getEnergyStatus() {
    const gameState = this.gameEngine.gameState;

    if (!gameState.shouldTrackSocialEnergy()) {
      return null;
    }

    return {
      current: gameState.socialEnergy,
      max: gameState.maxSocialEnergy,
      percentage: (gameState.socialEnergy / gameState.maxSocialEnergy) * 100,
      isEmpty: gameState.socialEnergy === 0,
      isLow: gameState.socialEnergy <= 2,
      isFull: gameState.socialEnergy === gameState.maxSocialEnergy,
    };
  }

  destroy() {
    if (this.energyContainer && this.energyContainer.parentNode) {
      this.energyContainer.parentNode.removeChild(this.energyContainer);
    }

    console.log("🗑️ Energy UI destroyed");
  }
}

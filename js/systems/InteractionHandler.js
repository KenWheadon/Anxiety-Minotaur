class InteractionHandler {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.isInteractionBlocked = false;
    this.activeTooltips = new Map();
    this.setupEventListeners();

    console.log("🖱️ Interaction handler initialized");
  }

  setupEventListeners() {
    // Click handling
    document.addEventListener("click", (e) => this.handleClick(e));

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    // Touch support for mobile
    document.addEventListener("touchstart", (e) => this.handleTouch(e));

    // Context menu prevention (right-click)
    document.addEventListener("contextmenu", (e) => {
      if (e.target.closest(".interactable")) {
        e.preventDefault();
        this.handleRightClick(e);
      }
    });
  }

  // FIXED: Enhanced handleClick to close tooltips when clicking elsewhere
  handleClick(event) {
    // Check if clicking on a tooltip to close it
    if (
      event.target.closest(".floating-text") ||
      event.target.closest(".detailed-tooltip")
    ) {
      const tooltip =
        event.target.closest(".floating-text") ||
        event.target.closest(".detailed-tooltip");
      this.closeTooltip(tooltip);
      return;
    }

    if (this.isInteractionBlocked) {
      return;
    }

    const interactable = event.target.closest(".interactable");
    if (!interactable) {
      // FIXED: Close all tooltips when clicking on empty space
      this.closeAllTooltips();

      // Clicked on empty space - close any open panels but NOT tooltips
      GameEvents.emit("ui_click_outside");
      return;
    }

    const type = interactable.dataset.type;
    const key = interactable.dataset.key;

    console.log(`👆 Clicked ${type}: ${key}`);

    // Add click animation
    this.playClickAnimation(interactable);

    // Route to appropriate handler
    switch (type) {
      case "character":
        this.interactWithCharacter(key, interactable);
        break;
      case "item":
        this.examineItem(key, interactable, event);
        break;
      default:
        console.warn(`Unknown interactable type: ${type}`);
    }
  }

  handleRightClick(event) {
    const interactable = event.target.closest(".interactable");
    if (!interactable) return;

    const type = interactable.dataset.type;
    const key = interactable.dataset.key;

    // Right-click shows detailed description (same as left-click now)
    if (type === "item") {
      this.examineItem(key, interactable, event);
    } else {
      this.showDetailedDescription(key, type, event.clientX, event.clientY);
    }
  }

  handleKeyPress(event) {
    // Keyboard shortcuts disabled during development
    // TODO: Re-enable keyboard shortcuts later if needed
  }

  handleTouch(event) {
    // Convert touch to click for mobile
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.closest(".interactable")) {
      // Prevent default touch behavior on interactables
      event.preventDefault();
    }
  }

  playClickAnimation(element) {
    // Quick scale animation on click
    gsap.to(element, {
      scale: 0.9,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });

    // Add ripple effect
    this.createRippleEffect(element);
  }

  createRippleEffect(element) {
    const ripple = document.createElement("div");
    ripple.className = "click-ripple";

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.position = "fixed"; // Use fixed positioning for screen coordinates
    ripple.style.left = rect.left + rect.width / 2 - size / 2 + "px";
    ripple.style.top = rect.top + rect.height / 2 - size / 2 + "px";
    ripple.style.background = "rgba(255,255,255,0.6)";
    ripple.style.borderRadius = "50%";
    ripple.style.transform = "scale(0)";
    ripple.style.pointerEvents = "none";
    ripple.style.zIndex = "9999";

    document.body.appendChild(ripple);

    gsap.to(ripple, {
      scale: 1,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      },
    });
  }

  interactWithCharacter(characterKey, element) {
    const character = characters[characterKey];
    if (!character) {
      console.error(`Character not found: ${characterKey}`);
      return;
    }

    // Block further interactions during conversation setup
    this.blockInteractions(500);

    // Emit interaction event
    GameEvents.emit(GAME_EVENTS.CHARACTER_INTERACTION, {
      characterKey,
      character,
      element,
    });

    // Start conversation
    this.gameEngine.conversationManager.startConversation(
      characterKey,
      character
    );

    // Play interaction sound
    this.gameEngine.renderer.assetManager.playSound(
      "effects/character_interact.mp3",
      0.5
    );

    console.log(`💬 Starting conversation with ${characterKey}`);
  }

  // FIXED: Enhanced examineItem to close all existing tooltips first - REMOVED CLUE CHECKING
  examineItem(itemKey, element, event) {
    const item = items[itemKey];
    if (!item) {
      console.error(`Item not found: ${itemKey}`);
      return;
    }

    // FIXED: Close ALL existing tooltips before showing new one
    this.closeAllTooltips();

    // Block rapid clicking
    this.blockInteractions(200);

    // Get click position for tooltip
    const x = event
      ? event.clientX
      : element.getBoundingClientRect().left +
        element.getBoundingClientRect().width / 2;
    const y = event ? event.clientY : element.getBoundingClientRect().top - 10;

    // Show detailed description (same as right-click)
    this.showDetailedDescription(itemKey, "item", x, y);

    // Emit examination event
    GameEvents.emit(GAME_EVENTS.ITEM_EXAMINED, {
      itemKey,
      item,
      element,
    });

    // REMOVED: clue checking system - no longer needed
    // this.checkForClues(item.description, itemKey);

    // Play examination sound
    this.gameEngine.renderer.assetManager.playSound(
      "effects/item_examine.mp3",
      0.3
    );

    console.log(`🔍 Examined item: ${itemKey}`);
  }

  // FIXED: Enhanced closeTooltip method
  closeTooltip(tooltip) {
    if (!tooltip || !tooltip.parentNode) return;

    // Find and remove from active tooltips
    for (const [key, activeTooltip] of this.activeTooltips.entries()) {
      if (activeTooltip === tooltip) {
        this.activeTooltips.delete(key);
        console.log(`💬 Closed tooltip: ${key}`);
        break;
      }
    }

    gsap.to(tooltip, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      },
    });
  }

  // FIXED: Enhanced showDetailedDescription to ensure only one tooltip
  showDetailedDescription(key, type, x, y) {
    let data;
    if (type === "character") {
      data = characters[key];
    } else if (type === "item") {
      data = items[key];
    }

    if (!data) return;

    // FIXED: Close all existing tooltips first
    this.closeAllTooltips();

    // Create detailed tooltip using screen coordinates
    const tooltip = document.createElement("div");
    tooltip.className = "detailed-tooltip floating-text";
    tooltip.innerHTML = `
      <div class="tooltip-header">${this.formatName(key)}</div>
      <div class="tooltip-description">${data.description}</div>
      <div class="tooltip-close-hint">Click to close</div>
    `;

    tooltip.style.position = "fixed"; // Use fixed positioning for screen coordinates
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    tooltip.style.backgroundColor = "rgba(0,0,0,0.9)";
    tooltip.style.color = "white";
    tooltip.style.padding = "12px";
    tooltip.style.borderRadius = "8px";
    tooltip.style.maxWidth = "250px";
    tooltip.style.fontSize = "12px";
    tooltip.style.zIndex = "10000";
    tooltip.style.cursor = "pointer";
    tooltip.style.transform = "translate(-50%, -100%)"; // Center and position above cursor

    // Add close hint styling
    const closeHint = tooltip.querySelector(".tooltip-close-hint");
    if (closeHint) {
      closeHint.style.fontSize = "10px";
      closeHint.style.opacity = "0.7";
      closeHint.style.marginTop = "6px";
      closeHint.style.textAlign = "center";
      closeHint.style.fontStyle = "italic";
    }

    document.body.appendChild(tooltip);

    // Position adjustment if off-screen
    const rect = tooltip.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      tooltip.style.transform = "translate(-100%, -100%)";
    }
    if (rect.left < 0) {
      tooltip.style.transform = "translate(0%, -100%)";
    }
    if (rect.top < 0) {
      tooltip.style.transform = tooltip.style.transform.replace(
        "-100%)",
        "0%)"
      );
    }

    // FIXED: Store in active tooltips with unique key
    const tooltipKey = `detailed_${type}_${key}`;
    this.activeTooltips.set(tooltipKey, tooltip);

    // Fade in
    gsap.fromTo(
      tooltip,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.2 }
    );

    // FIXED: Add click listener to close this specific tooltip
    tooltip.addEventListener("click", () => {
      this.closeTooltip(tooltip);
    });

    console.log(`💬 Showing tooltip for ${type}: ${key}`);
  }

  interactWithNearestCharacter() {
    const characters = document.querySelectorAll(
      '.interactable[data-type="character"]'
    );
    if (characters.length === 0) return;

    // For now, just interact with the first character
    // Could be enhanced to find truly nearest character
    const firstCharacter = characters[0];
    const key = firstCharacter.dataset.key;
    this.interactWithCharacter(key, firstCharacter);
  }

  // REMOVED: Clue checking and related methods
  // checkForClues, showClueDiscovered methods removed

  blockInteractions(duration) {
    this.isInteractionBlocked = true;
    setTimeout(() => {
      this.isInteractionBlocked = false;
    }, duration);
  }

  formatName(key) {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Enable/disable interactions (for conversation mode, etc.)
  setInteractionsEnabled(enabled) {
    this.isInteractionBlocked = !enabled;
  }

  // FIXED: Enhanced closeAllTooltips method
  closeAllTooltips() {
    if (this.activeTooltips.size === 0) return;

    console.log(`💬 Closing ${this.activeTooltips.size} active tooltips`);

    // Create array of tooltips to close (to avoid modification during iteration)
    const tooltipsToClose = Array.from(this.activeTooltips.values());

    // Clear the active tooltips map
    this.activeTooltips.clear();

    // Close each tooltip
    tooltipsToClose.forEach((tooltip) => {
      if (tooltip && tooltip.parentNode) {
        gsap.to(tooltip, {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            if (tooltip.parentNode) {
              tooltip.parentNode.removeChild(tooltip);
            }
          },
        });
      }
    });
  }
}

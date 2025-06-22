// js/systems/LocationNavigator.js - Complete Location Navigation System with Fixed Tooltips

class LocationNavigator {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.currentLocationKey = null;
    this.availableLocations = [];
    this.navigationContainer = null;
    this.isEnabled = true;

    this.createNavigationUI();
    this.setupEventListeners();

    console.log("🧭 LocationNavigator initialized");
  }

  createNavigationUI() {
    // Create navigation container
    this.navigationContainer = document.createElement("div");
    this.navigationContainer.className = "location-navigator";
    this.navigationContainer.innerHTML = `
      <div class="nav-buttons-container"></div>
      <div class="nav-info">
        <div class="current-location">Loading...</div>
      </div>
    `;

    document.body.appendChild(this.navigationContainer);
    console.log("🧭 Navigation UI created");
  }

  setupEventListeners() {
    // Listen for location changes
    GameEvents.on(GAME_EVENTS.LOCATION_CHANGED, (data) => {
      this.updateNavigation(data.location);
    });

    // Keyboard shortcuts for location navigation (1-9)
    document.addEventListener("keydown", (e) => {
      if (!this.isEnabled) return;

      // Only handle if not in conversation and not focused on input
      const isConversationActive =
        this.gameEngine.conversationManager &&
        this.gameEngine.conversationManager.isConversationActive;
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (!isConversationActive && !isInputFocused) {
        if (e.key >= "1" && e.key <= "9") {
          const locationIndex = parseInt(e.key) - 1;
          this.navigateByIndex(locationIndex);
        }
      }
    });

    console.log("🧭 Event listeners set up");
  }

  // FIXED: Add the missing updateNavigation method
  updateNavigation(locationKey) {
    if (!locationKey || !locations[locationKey]) {
      console.warn("🧭 Invalid location key:", locationKey);
      return;
    }

    this.currentLocationKey = locationKey;
    const currentLocationData = locations[locationKey];

    // Get available locations from current location
    this.availableLocations = currentLocationData.locations || [];

    console.log(`🧭 Updating navigation for ${locationKey}`);
    console.log(`🧭 Available locations:`, this.availableLocations);

    this.renderNavigationButtons();
    this.updateCurrentLocationDisplay();
  }

  renderNavigationButtons() {
    const buttonsContainer = this.navigationContainer.querySelector(
      ".nav-buttons-container"
    );
    if (!buttonsContainer) return;

    // Clear existing buttons
    buttonsContainer.innerHTML = "";

    // Create buttons for each available location
    this.availableLocations.forEach((locationKey, index) => {
      const locationData = locations[locationKey];
      if (!locationData) return;

      const button = document.createElement("button");
      button.className = "location-nav-button";
      button.dataset.locationKey = locationKey;
      button.dataset.index = index;

      // Create readable name from location key
      const displayName = this.formatLocationName(locationKey);
      button.textContent = displayName;

      // Add keyboard shortcut indicator
      if (index < 9) {
        const shortcut = document.createElement("span");
        shortcut.className = "nav-shortcut";
        shortcut.textContent = (index + 1).toString();
        button.appendChild(shortcut);
      }

      // Add click handler
      button.addEventListener("click", () => {
        this.navigateToLocation(locationKey);
      });

      // FIXED: Add hover preview with proper positioning
      button.addEventListener("mouseenter", (e) => {
        this.showLocationPreview(e, locationData);
      });

      button.addEventListener("mouseleave", () => {
        this.hideLocationPreview();
      });

      buttonsContainer.appendChild(button);
    });

    console.log(
      `🧭 Rendered ${this.availableLocations.length} navigation buttons`
    );
  }

  updateCurrentLocationDisplay() {
    const currentLocationElement =
      this.navigationContainer.querySelector(".current-location");
    if (!currentLocationElement) return;

    const displayName = this.formatLocationName(this.currentLocationKey);
    currentLocationElement.textContent = displayName;
  }

  formatLocationName(locationKey) {
    if (!locationKey) return "Unknown";

    // Convert snake_case to Title Case and remove level prefixes
    return locationKey
      .replace(/^level\d+_/, "") // Remove level prefixes like "level1_"
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Navigate to location by array index (for keyboard shortcuts)
  navigateByIndex(index) {
    if (index < 0 || index >= this.availableLocations.length) {
      console.warn(`🧭 Invalid location index: ${index}`);
      return;
    }

    const locationKey = this.availableLocations[index];
    this.navigateToLocation(locationKey);
  }

  // Navigate to specific location
  async navigateToLocation(locationKey) {
    if (!this.isEnabled) {
      console.warn("🧭 Navigation is disabled");
      return;
    }

    if (!locations[locationKey]) {
      console.error(`🧭 Location ${locationKey} not found`);
      return;
    }

    if (locationKey === this.currentLocationKey) {
      console.log(`🧭 Already at location ${locationKey}`);
      return;
    }

    console.log(`🧭 Navigating to ${locationKey}`);

    try {
      // Use the game engine's loadLocation method
      await this.gameEngine.loadLocation(locationKey);

      // Update button states
      this.updateButtonStates();
    } catch (error) {
      console.error(`🧭 Navigation failed:`, error);
    }
  }

  updateButtonStates() {
    const buttons = this.navigationContainer.querySelectorAll(
      ".location-nav-button"
    );
    buttons.forEach((button) => {
      button.classList.remove("current");

      // Note: We don't mark current location button since we show available destinations
      // But we could add visual feedback here if needed
    });
  }

  // FIXED: Improved tooltip positioning that appears above the button
  showLocationPreview(event, locationData) {
    this.hideLocationPreview(); // Remove any existing preview

    const preview = document.createElement("div");
    preview.className = "location-preview";
    preview.textContent = locationData.description;

    // Add some basic styling to ensure proper sizing
    preview.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      max-width: 200px;
      word-wrap: break-word;
      z-index: 1001;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    // Add to DOM first so we can measure it
    document.body.appendChild(preview);

    // Get button and preview dimensions
    const buttonRect = event.target.getBoundingClientRect();
    const previewRect = preview.getBoundingClientRect();

    // Calculate position - center horizontally above the button
    let left = buttonRect.left + buttonRect.width / 2 - previewRect.width / 2;
    let top = buttonRect.top - previewRect.height - 8; // 8px gap above button

    // Ensure tooltip doesn't go off screen horizontally
    const screenPadding = 10;
    if (left < screenPadding) {
      left = screenPadding;
    } else if (left + previewRect.width > window.innerWidth - screenPadding) {
      left = window.innerWidth - previewRect.width - screenPadding;
    }

    // If tooltip would appear above viewport, show it below the button instead
    if (top < screenPadding) {
      top = buttonRect.bottom + 8; // 8px gap below button
    }

    // Apply final position
    preview.style.left = left + "px";
    preview.style.top = top + "px";

    // Store reference for cleanup
    this.currentPreview = preview;

    console.log(`🧭 Showing preview for location at (${left}, ${top})`);
  }

  hideLocationPreview() {
    if (this.currentPreview) {
      this.currentPreview.remove();
      this.currentPreview = null;
    }
  }

  // Enable/disable navigation (useful for cutscenes, etc.)
  setEnabled(enabled) {
    this.isEnabled = enabled;
    this.navigationContainer.style.display = enabled ? "flex" : "none";
    console.log(`🧭 Navigation ${enabled ? "enabled" : "disabled"}`);
  }

  // Get current navigation state
  getNavigationState() {
    return {
      currentLocation: this.currentLocationKey,
      availableLocations: this.availableLocations,
      enabled: this.isEnabled,
    };
  }

  // Reset navigation (for game resets)
  reset() {
    this.currentLocationKey = null;
    this.availableLocations = [];
    this.hideLocationPreview();

    const buttonsContainer = this.navigationContainer.querySelector(
      ".nav-buttons-container"
    );
    if (buttonsContainer) {
      buttonsContainer.innerHTML = "";
    }

    const currentLocationElement =
      this.navigationContainer.querySelector(".current-location");
    if (currentLocationElement) {
      currentLocationElement.textContent = "Loading...";
    }

    console.log("🧭 Navigation reset");
  }

  // Show/hide navigation UI
  show() {
    if (this.navigationContainer) {
      this.navigationContainer.style.display = "flex";
    }
  }

  hide() {
    if (this.navigationContainer) {
      this.navigationContainer.style.display = "none";
    }
  }

  // Cleanup
  destroy() {
    this.hideLocationPreview();

    if (this.navigationContainer && this.navigationContainer.parentNode) {
      this.navigationContainer.parentNode.removeChild(this.navigationContainer);
    }

    // Remove event listeners would be automatic since we're removing the elements
    console.log("🧭 LocationNavigator destroyed");
  }
}

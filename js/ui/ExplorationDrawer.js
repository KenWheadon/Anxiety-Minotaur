class ExplorationDrawer {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.drawerPanel = null;
    this.drawerButton = null;
    this.isOpen = false;

    // Initialize as empty Sets - will be populated by loadDiscoveries
    this.discoveredCharacters = new Set();
    this.discoveredItems = new Set();
    this.currentFilter = "all";

    // Load discoveries FIRST - this should populate the Sets with actual names
    this.loadDiscoveries();

    // DEBUG: Verify what we loaded
    console.log("🔍 CONSTRUCTOR DEBUG:");
    console.log(
      "  discoveredCharacters type:",
      typeof this.discoveredCharacters
    );
    console.log(
      "  discoveredCharacters contents:",
      Array.from(this.discoveredCharacters)
    );
    console.log("  discoveredItems type:", typeof this.discoveredItems);
    console.log(
      "  discoveredItems contents:",
      Array.from(this.discoveredItems)
    );

    this.createExplorationUI();
    this.createExplorationButton();
    this.setupEventListeners();
    this.waitForGameDataAndUpdate();

    console.log("🗺️ Exploration drawer initialized");
    console.log(
      `🗺️ Loaded ${this.discoveredCharacters.size} characters, ${this.discoveredItems.size} items`
    );
  }

  async waitForGameDataAndUpdate() {
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      if (
        typeof characters !== "undefined" &&
        typeof items !== "undefined" &&
        Object.keys(characters).length > 0 &&
        Object.keys(items).length > 0
      ) {
        console.log("✅ Game data loaded! Updating discovery UI...");
        this.updateButtonProgress();
        this.updateProgress();

        if (this.isOpen) {
          this.renderExplorationItems();
        }

        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    console.warn("⚠️ Game data not loaded after timeout");
  }

  // FIXED: Ensure we save actual names, not counts
  saveDiscoveries() {
    try {
      // FIXED: Convert Sets to Arrays of actual names
      const charactersArray = Array.from(this.discoveredCharacters);
      const itemsArray = Array.from(this.discoveredItems);

      const discoveryData = {
        characters: charactersArray, // Array of character names
        items: itemsArray, // Array of item names
        saveTime: Date.now(),
        version: "4.0",
        debug: {
          charactersType: typeof charactersArray,
          itemsType: typeof itemsArray,
          charactersLength: charactersArray.length,
          itemsLength: itemsArray.length,
          charactersContent: charactersArray,
          itemsContent: itemsArray,
        },
      };

      const jsonData = JSON.stringify(discoveryData);
      localStorage.setItem("anxiety-minotaur-discoveries", jsonData);
      localStorage.setItem("anxiety-minotaur-discoveries-backup", jsonData);

      console.log("💾 Discoveries saved:");
      console.log("  Characters:", charactersArray);
      console.log("  Items:", itemsArray);
      console.log("  JSON preview:", jsonData.substring(0, 200) + "...");
    } catch (error) {
      console.error("❌ Failed to save discoveries:", error);
    }
  }

  // FIXED: Ensure we load actual names, not counts
  loadDiscoveries() {
    try {
      let savedData = localStorage.getItem("anxiety-minotaur-discoveries");

      if (!savedData) {
        console.log("🔄 No main save, trying backup...");
        savedData = localStorage.getItem("anxiety-minotaur-discoveries-backup");
      }

      if (savedData) {
        console.log("📂 Raw saved data:", savedData.substring(0, 200) + "...");

        const discoveryData = JSON.parse(savedData);
        console.log("📂 Parsed discovery data:", discoveryData);

        // FIXED: Ensure we have arrays of strings (names), not numbers
        let charactersArray = [];
        let itemsArray = [];

        if (Array.isArray(discoveryData.characters)) {
          charactersArray = discoveryData.characters.filter(
            (name) => typeof name === "string"
          );
        } else {
          console.warn(
            "⚠️ Characters data is not an array:",
            discoveryData.characters
          );
        }

        if (Array.isArray(discoveryData.items)) {
          itemsArray = discoveryData.items.filter(
            (name) => typeof name === "string"
          );
        } else {
          console.warn("⚠️ Items data is not an array:", discoveryData.items);
        }

        // FIXED: Create Sets from arrays of actual names
        this.discoveredCharacters = new Set(charactersArray);
        this.discoveredItems = new Set(itemsArray);

        console.log("📂 Loaded discoveries:");
        console.log("  Characters:", charactersArray);
        console.log("  Items:", itemsArray);
        console.log("  Character Set:", Array.from(this.discoveredCharacters));
        console.log("  Item Set:", Array.from(this.discoveredItems));
      } else {
        console.log("🆕 No saved discoveries found, starting fresh");
        this.discoveredCharacters = new Set();
        this.discoveredItems = new Set();
      }
    } catch (error) {
      console.error("❌ Failed to load discoveries:", error);
      console.error(
        "Raw data was:",
        localStorage.getItem("anxiety-minotaur-discoveries")
      );

      // Reset to empty sets on error
      this.discoveredCharacters = new Set();
      this.discoveredItems = new Set();
    }
  }

  // FIXED: Clear localStorage and verify
  resetDiscoveries() {
    const confirmed = confirm(
      "Are you sure you want to reset ALL discoveries? This cannot be undone!"
    );

    if (!confirmed) {
      return;
    }

    console.log("🔄 Resetting discoveries...");
    console.log(
      "  Before reset - Characters:",
      Array.from(this.discoveredCharacters)
    );
    console.log("  Before reset - Items:", Array.from(this.discoveredItems));

    this.discoveredCharacters.clear();
    this.discoveredItems.clear();

    try {
      localStorage.removeItem("anxiety-minotaur-discoveries");
      localStorage.removeItem("anxiety-minotaur-discoveries-backup");
      console.log("🔄 localStorage cleared");
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }

    console.log(
      "  After reset - Characters:",
      Array.from(this.discoveredCharacters)
    );
    console.log("  After reset - Items:", Array.from(this.discoveredItems));

    this.updateButtonProgress();
    if (this.isOpen) {
      this.renderExplorationItems();
    }
  }

  createExplorationButton() {
    this.drawerButton = document.createElement("button");
    this.drawerButton.className = "exploration-trigger";
    this.drawerButton.innerHTML = "🔍";
    this.drawerButton.title = "Open Discovery Journal F1";
    this.drawerButton.setAttribute("data-discovered", "0");

    document.body.appendChild(this.drawerButton);

    this.drawerButton.addEventListener("click", () => {
      this.toggleDrawer();
    });

    this.updateButtonProgress();
  }

  updateButtonProgress() {
    if (this.drawerButton) {
      const discovered =
        this.discoveredCharacters.size + this.discoveredItems.size;

      let total = 0;
      if (typeof characters !== "undefined" && typeof items !== "undefined") {
        total = Object.keys(characters).length + Object.keys(items).length;
      } else {
        total = 42; // Fallback estimate
      }

      this.drawerButton.setAttribute(
        "data-discovered",
        `${discovered}/${total}`
      );
      console.log(`🔢 Button: ${discovered} discovered out of ${total} total`);
    }
  }

  createExplorationUI() {
    this.drawerPanel = document.createElement("div");
    this.drawerPanel.className = "exploration-drawer";
    this.drawerPanel.innerHTML = `
      <div class="exploration-header">
        <h2>🗺️ Discovery Journal</h2>
        <div class="exploration-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <span class="progress-text">Loading...</span>
        </div>
        <button class="close-exploration">×</button>
      </div>
      
      <div class="exploration-tabs">
        <button class="exploration-tab active" data-filter="all">All</button>
        <button class="exploration-tab" data-filter="characters">Characters</button>
        <button class="exploration-tab" data-filter="items">Items</button>
        <button class="exploration-tab" data-filter="discovered">Found</button>
      </div>
      
      <div class="exploration-content">
        <div class="exploration-list">
          <div class="loading-message">Loading...</div>
        </div>
      </div>
      
      <div class="exploration-footer">
        <p class="exploration-hint">💡 Interact with characters and items to discover them!</p>
        <div class="exploration-persistence-info">
          <small>📌 Discoveries saved permanently</small>
          <button class="reset-discoveries-btn" style="margin-left: 10px; font-size: 10px; padding: 2px 6px;">Reset All</button>
          <button class="debug-discoveries-btn" style="margin-left: 5px; font-size: 10px; padding: 2px 6px;">Debug</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.drawerPanel);
    this.hideDrawer();
  }

  setupEventListeners() {
    this.drawerPanel
      .querySelector(".close-exploration")
      .addEventListener("click", () => {
        this.hideDrawer();
      });

    this.drawerPanel.querySelectorAll(".exploration-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.filter);
      });
    });

    this.drawerPanel
      .querySelector(".reset-discoveries-btn")
      .addEventListener("click", () => {
        this.resetDiscoveries();
      });

    // DEBUG: Add debug button to inspect current state
    this.drawerPanel
      .querySelector(".debug-discoveries-btn")
      .addEventListener("click", () => {
        this.debugDiscoveries();
      });

    GameEvents.on(GAME_EVENTS.CHARACTER_INTERACTION, (data) => {
      this.discoverCharacter(data.characterKey);
    });

    GameEvents.on(GAME_EVENTS.ITEM_EXAMINED, (data) => {
      this.discoverItem(data.itemKey);
    });

    // Auto-save every 30 seconds
    setInterval(() => {
      this.saveDiscoveries();
    }, 30000);

    // Save on page unload
    window.addEventListener("beforeunload", () => {
      this.saveDiscoveries();
    });

    document.addEventListener("keydown", (e) => {
      const isConversationActive =
        this.gameEngine.conversationManager.isConversationActive;
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (!isConversationActive && !isInputFocused) {
        if (e.key === "F1") {
          e.preventDefault();
          this.toggleDrawer();
        }
      }
    });
  }

  // DEBUG: Method to inspect current discovery state
  debugDiscoveries() {
    console.log("🔍 DISCOVERY DEBUG:");
    console.log(
      "  discoveredCharacters:",
      Array.from(this.discoveredCharacters)
    );
    console.log("  discoveredItems:", Array.from(this.discoveredItems));
    console.log(
      "  localStorage main:",
      localStorage.getItem("anxiety-minotaur-discoveries")
    );
    console.log(
      "  localStorage backup:",
      localStorage.getItem("anxiety-minotaur-discoveries-backup")
    );

    alert(`Debug Info (check console for details):
Characters: ${Array.from(this.discoveredCharacters).join(", ") || "none"}
Items: ${Array.from(this.discoveredItems).join(", ") || "none"}
Total: ${this.discoveredCharacters.size + this.discoveredItems.size}`);
  }

  toggleDrawer() {
    if (this.isOpen) {
      this.hideDrawer();
    } else {
      this.showDrawer();
    }
  }

  async showDrawer() {
    this.isOpen = true;
    this.drawerPanel.style.display = "flex";

    // Wait for game data if needed
    await this.waitForGameDataAndUpdate();

    this.renderExplorationItems();
    this.updateProgress();

    gsap.fromTo(
      this.drawerPanel,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
    );
  }

  hideDrawer() {
    this.isOpen = false;
    gsap.to(this.drawerPanel, {
      opacity: 0,
      scale: 0.8,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        this.drawerPanel.style.display = "none";
      },
    });
  }

  switchTab(filter) {
    this.currentFilter = filter;

    this.drawerPanel.querySelectorAll(".exploration-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.filter === filter);
    });

    this.renderExplorationItems();
  }

  // FIXED: Ensure we save the actual character name
  discoverCharacter(characterKey) {
    if (!characterKey || typeof characterKey !== "string") {
      console.error("❌ Invalid characterKey:", characterKey);
      return;
    }

    if (!this.discoveredCharacters.has(characterKey)) {
      console.log(`✨ Discovering character: ${characterKey}`);

      // FIXED: Add the actual character name to the Set
      this.discoveredCharacters.add(characterKey);

      console.log(
        `  Added to Set. Current characters:`,
        Array.from(this.discoveredCharacters)
      );

      // Immediate save with verification
      this.saveDiscoveries();

      // Verify it was saved
      setTimeout(() => {
        const verification = localStorage.getItem(
          "anxiety-minotaur-discoveries"
        );
        if (verification && verification.includes(characterKey)) {
          console.log(`✅ Character ${characterKey} verified in localStorage`);
        } else {
          console.error(
            `❌ Character ${characterKey} NOT found in localStorage!`
          );
          console.log("  Attempting recovery...");
          this.discoveredCharacters.add(characterKey);
          this.saveDiscoveries();
        }
      }, 100);

      this.showDiscoveryNotification("character", characterKey);
      this.updateProgress();
      this.updateButtonProgress();

      if (this.isOpen) {
        this.renderExplorationItems();
      }
    } else {
      console.log(`👥 Character ${characterKey} already discovered`);
    }
  }

  // FIXED: Ensure we save the actual item name
  discoverItem(itemKey) {
    if (!itemKey || typeof itemKey !== "string") {
      console.error("❌ Invalid itemKey:", itemKey);
      return;
    }

    if (!this.discoveredItems.has(itemKey)) {
      console.log(`✨ Discovering item: ${itemKey}`);

      // FIXED: Add the actual item name to the Set
      this.discoveredItems.add(itemKey);

      console.log(
        `  Added to Set. Current items:`,
        Array.from(this.discoveredItems)
      );

      // Immediate save with verification
      this.saveDiscoveries();

      // Verify it was saved
      setTimeout(() => {
        const verification = localStorage.getItem(
          "anxiety-minotaur-discoveries"
        );
        if (verification && verification.includes(itemKey)) {
          console.log(`✅ Item ${itemKey} verified in localStorage`);
        } else {
          console.error(`❌ Item ${itemKey} NOT found in localStorage!`);
          console.log("  Attempting recovery...");
          this.discoveredItems.add(itemKey);
          this.saveDiscoveries();
        }
      }, 100);

      this.showDiscoveryNotification("item", itemKey);
      this.updateProgress();
      this.updateButtonProgress();

      if (this.isOpen) {
        this.renderExplorationItems();
      }
    } else {
      console.log(`📦 Item ${itemKey} already discovered`);
    }
  }

  showDiscoveryNotification(type, key) {
    const data =
      type === "character"
        ? typeof characters !== "undefined"
          ? characters[key]
          : null
        : typeof items !== "undefined"
        ? items[key]
        : null;

    if (!data) {
      console.warn(
        `Cannot show notification for ${type} ${key} - data not available`
      );
      return;
    }

    const notification = document.createElement("div");
    notification.className = "discovery-notification";

    const icon = type === "character" ? "👤" : "📦";
    const name = key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    notification.innerHTML = `
      <div class="discovery-notification-icon">${icon}</div>
      <div class="discovery-notification-text">
        <strong>Discovered!</strong><br>
        ${name}
        <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Saved ✓</div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      gsap.to(notification, {
        opacity: 0,
        x: 100,
        duration: 0.3,
        onComplete: () => notification.remove(),
      });
    }, 3000);
  }

  renderExplorationItems() {
    const listContainer = this.drawerPanel.querySelector(".exploration-list");

    if (typeof characters === "undefined" || typeof items === "undefined") {
      console.log("⏳ Game data not ready for rendering");
      listContainer.innerHTML = `
        <div class="loading-message" style="text-align: center; padding: 40px; color: #666;">
          <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
          <div>Waiting for game data...</div>
          <div style="margin-top: 10px; font-size: 12px;">
            Ready to show: ${this.discoveredCharacters.size} characters, ${this.discoveredItems.size} items
          </div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = "";

    const allItems = this.getAllExplorationItems();
    const filteredItems = this.filterItems(allItems);
    const discoveredCount = allItems.filter((item) => item.discovered).length;

    console.log(
      `🗺️ Rendering: ${allItems.length} total, ${filteredItems.length} filtered, ${discoveredCount} discovered`
    );

    // Sort: discovered first, then by name
    filteredItems.sort((a, b) => {
      if (a.discovered !== b.discovered) {
        return b.discovered - a.discovered;
      }
      return a.name.localeCompare(b.name);
    });

    // Render each item
    filteredItems.forEach((item, index) => {
      const itemElement = this.createExplorationItemElement(item);
      listContainer.appendChild(itemElement);

      gsap.fromTo(
        itemElement,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          delay: index * 0.02,
          ease: "power2.out",
        }
      );
    });
  }

  getAllExplorationItems() {
    const allItems = [];

    if (typeof characters === "undefined" || typeof items === "undefined") {
      return allItems;
    }

    // Process characters
    Object.entries(characters).forEach(([key, data]) => {
      if (!data) return;

      const location = this.findCharacterLocation(key);
      const isDiscovered = this.discoveredCharacters.has(key);

      // DEBUG: Log each character check
      if (this.discoveredCharacters.size > 0) {
        console.log(`🔍 Character ${key}: discovered = ${isDiscovered}`);
      }

      allItems.push({
        key,
        type: "character",
        name: key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        description: data.description || "No description available",
        discovered: isDiscovered,
        location: location
          ? location
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Unknown",
        image: data.img,
        data,
      });
    });

    // Process items
    Object.entries(items).forEach(([key, data]) => {
      if (!data) return;

      const location = this.findItemLocation(key);
      const isDiscovered = this.discoveredItems.has(key);

      // DEBUG: Log each item check
      if (this.discoveredItems.size > 0) {
        console.log(`🔍 Item ${key}: discovered = ${isDiscovered}`);
      }

      allItems.push({
        key,
        type: "item",
        name: key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        description: data.description || "No description available",
        discovered: isDiscovered,
        location: location
          ? location
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Unknown",
        image: data.img,
        data,
      });
    });

    return allItems;
  }

  findCharacterLocation(characterKey) {
    if (typeof locations === "undefined") return null;

    for (const [locationKey, locationData] of Object.entries(locations)) {
      if (
        locationData &&
        locationData.characters &&
        Array.isArray(locationData.characters)
      ) {
        if (locationData.characters.includes(characterKey)) {
          return locationKey;
        }
      }
    }
    return null;
  }

  findItemLocation(itemKey) {
    if (typeof locations === "undefined") return null;

    for (const [locationKey, locationData] of Object.entries(locations)) {
      if (
        locationData &&
        locationData.items &&
        Array.isArray(locationData.items)
      ) {
        if (locationData.items.includes(itemKey)) {
          return locationKey;
        }
      }
    }
    return null;
  }

  filterItems(items) {
    switch (this.currentFilter) {
      case "characters":
        return items.filter((item) => item.type === "character");
      case "items":
        return items.filter((item) => item.type === "item");
      case "discovered":
        return items.filter((item) => item.discovered);
      default:
        return items;
    }
  }

  // UPDATED: createExplorationItemElement method with new image loading
  createExplorationItemElement(item) {
    const element = document.createElement("div");
    element.className = `exploration-item ${
      item.discovered ? "discovered" : "undiscovered"
    }`;
    element.dataset.key = item.key;
    element.dataset.type = item.type;

    if (item.discovered) {
      let imageStyle = "";

      // UPDATED: Use the new getImage method that works with filenames
      if (this.gameEngine.renderer && this.gameEngine.renderer.assetManager) {
        // Just pass the image filename - getImage now searches all cached images
        const preloadedImage = this.gameEngine.renderer.assetManager.getImage(
          item.image // Just the filename, no path needed
        );

        if (preloadedImage) {
          imageStyle = `background-image: url(${preloadedImage.src})`;
        } else {
          // Fallback: construct path manually if not found in cache
          const imagePath = `images/${
            item.type === "character" ? "characters" : "items"
          }/${item.image}.png`;
          imageStyle = `background-image: url(${imagePath})`;
        }
      } else {
        // Fallback: construct path manually if assetManager not available
        const imagePath = `images/${
          item.type === "character" ? "characters" : "items"
        }/${item.image}.png`;
        imageStyle = `background-image: url(${imagePath})`;
      }

      element.innerHTML = `
        <div class="exploration-item-type ${item.type}">${item.type}</div>
        <div class="exploration-item-image" style="${imageStyle}"></div>
        <div class="exploration-item-name">${item.name}</div>
        <div class="exploration-item-description">${item.description}</div>
        <div class="exploration-item-location">📍 ${item.location}</div>
      `;

      element.addEventListener("click", () => {
        this.showItemDetails(item);
      });
    } else {
      element.innerHTML = `
        <div class="exploration-item-type ${item.type}">${item.type}</div>
        <div class="exploration-item-image undiscovered-placeholder">?</div>
        <div class="exploration-item-name">???</div>
        <div class="exploration-item-description">Explore to discover...</div>
        <div class="exploration-item-location">📍 ???</div>
      `;
    }

    return element;
  }

  // UPDATED: showItemDetails method with new image loading
  showItemDetails(item) {
    const modal = document.createElement("div");
    modal.className = "exploration-detail-modal";

    // UPDATED: Construct image path properly for the detail modal
    const imagePath = `images/${
      item.type === "character" ? "characters" : "items"
    }/${item.image}.png`;

    modal.innerHTML = `
      <div class="exploration-detail-content">
        <div class="exploration-detail-header">
          <h3>${item.name}</h3>
          <button class="close-detail">×</button>
        </div>
        <div class="exploration-detail-body">
          <div class="exploration-detail-image" style="background-image: url(${imagePath})"></div>
          <div class="exploration-detail-info">
            <p><strong>Type:</strong> ${item.type}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Description:</strong> ${item.description}</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".close-detail");
    closeBtn.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    gsap.fromTo(
      modal.querySelector(".exploration-detail-content"),
      { scale: 0.8 },
      { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
  }

  updateProgress() {
    const discovered =
      this.discoveredCharacters.size + this.discoveredItems.size;
    let total = 0;

    if (typeof characters !== "undefined" && typeof items !== "undefined") {
      total = Object.keys(characters).length + Object.keys(items).length;
    }

    const percentage = total > 0 ? (discovered / total) * 100 : 0;

    const progressFill = this.drawerPanel.querySelector(".progress-fill");
    const progressText = this.drawerPanel.querySelector(".progress-text");

    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }

    if (progressText) {
      if (total > 0) {
        progressText.textContent = `${discovered} / ${total}`;
      } else {
        progressText.textContent = `${discovered} discovered`;
      }
    }
  }

  getStats() {
    const discovered =
      this.discoveredCharacters.size + this.discoveredItems.size;
    let total = 0;
    let charactersTotal = 0;
    let itemsTotal = 0;

    if (typeof characters !== "undefined" && typeof items !== "undefined") {
      charactersTotal = Object.keys(characters).length;
      itemsTotal = Object.keys(items).length;
      total = charactersTotal + itemsTotal;
    }

    return {
      total,
      discovered,
      characters: {
        total: charactersTotal,
        discovered: this.discoveredCharacters.size,
      },
      items: {
        total: itemsTotal,
        discovered: this.discoveredItems.size,
      },
      percentage: total > 0 ? Math.round((discovered / total) * 100) : 0,
      isPersistent: true,
      actualNames: {
        characters: Array.from(this.discoveredCharacters),
        items: Array.from(this.discoveredItems),
      },
    };
  }

  destroy() {
    this.saveDiscoveries();

    if (this.drawerPanel && this.drawerPanel.parentNode) {
      this.drawerPanel.parentNode.removeChild(this.drawerPanel);
    }

    if (this.drawerButton && this.drawerButton.parentNode) {
      this.drawerButton.parentNode.removeChild(this.drawerButton);
    }

    console.log("🗑️ Exploration drawer destroyed (discoveries preserved)");
  }
}

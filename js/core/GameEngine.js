// js/core/GameEngine.js - FIXED: Proper initialization flow and dependency injection + Victory Persistence

class GameEngine {
  constructor() {
    // Use CONFIG to determine starting location
    this.currentLocation = CONFIG.DEFAULT_LOCATION;
    this.gameState = new GameState();
    this.loadingScreen = new LoadingScreen();
    this.startScreen = new StartScreen(this);
    this.renderer = new Renderer();
    this.interactionHandler = new InteractionHandler(this);
    this.conversationManager = new ConversationManager(this);

    // FIXED: Initialize KeywordGenerationManager but don't generate keywords yet
    this.keywordGenerationManager = new KeywordGenerationManager(this);

    this.locationNavigator = new LocationNavigator(this);
    this.levelManager = new LevelManager(this);

    // FIXED: Initialize AchievementManager but don't load achievements yet
    this.achievementManager = new AchievementManager(this);

    this.explorationDrawer = new ExplorationDrawer(this);
    this.victoryScreen = new VictoryScreen(this);
    this.cutsceneManager = new CutsceneManager(this);

    // Audio system integration
    this.audioManager = this.renderer.assetManager.getAudioManager();
    this.audioSettingsUI = new AudioSettingsUI(this.audioManager);

    // Initialize EnergyUI
    this.energyUI = new EnergyUI(this);

    this.isReady = false;
    this.currentLevel = CONFIG.DEFAULT_LEVEL;
    this.gameStarted = false;

    // FIXED: Set up tutorial completion callback
    this.achievementManager.setTutorialCompleteCallback(() => {
      this.handleTutorialVictory();
    });

    // Set up audio event listeners
    this.setupAudioEventListeners();
  }

  // Set up audio event listeners for level changes
  setupAudioEventListeners() {
    // Listen for level changes to update background music
    GameEvents.on(GAME_EVENTS.LEVEL_CHANGED, (eventData) => {
      console.log(
        `🎵 Level changed to ${eventData.level}, starting background music`
      );
      this.playBackgroundMusic(eventData.level);
    });

    // Audio control keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // ESC key to toggle audio settings (when not in conversation)
      if (e.key === "Escape" && !this.conversationManager.isActive()) {
        e.preventDefault();
        this.audioSettingsUI.toggleSettingsPanel();
      }

      // M key to toggle mute
      if (e.key === "m" || e.key === "M") {
        if (!this.conversationManager.isActive()) {
          e.preventDefault();
          this.toggleMute();
        }
      }
    });
  }

  // Development environment detection
  setupDevelopmentEnvironment() {
    if (CONFIG.DEBUG) {
      // Expose debug interface
      window.gameDebug = {
        gameEngine: this,
        gameState: this.gameState,
        currentLocation: () => this.currentLocation,
        currentLevel: () => this.currentLevel,
        achievements: () => this.gameState.getUnlockedAchievements(),
        energy: () => this.gameState.socialEnergy,
        resetGame: () => this.reset(),
        loadLocation: (locationKey) => this.loadLocation(locationKey),
        keywordManager: this.keywordGenerationManager,
        showKeywords: () => this.keywordGenerationManager.debugShowKeywords(),

        // ADDED: Victory screen debugging
        checkVictoryState: () => {
          console.log("🎉 Victory Screen Debug:");
          console.log(
            "  - Victory button unlocked:",
            this.victoryScreen.isUnlocked
          );
          console.log(
            "  - Victory button visible:",
            this.victoryScreen.victoryButton.style.display
          );
          console.log(
            "  - Tutorial completed flag:",
            this.gameState.tutorialCompleted
          );
          console.log(
            "  - Tutorial achievement:",
            this.gameState.hasAchievement(TUTORIAL_COMPLETE)
          );
          console.log(
            "  - All achievements:",
            this.gameState.getUnlockedAchievements()
          );
        },

        forceShowVictoryButton: () => {
          this.victoryScreen.forceUnlock();
          console.log("🎉 Victory button force unlocked");
        },
      };
      console.log("🐛 Debug mode enabled. Access via window.gameDebug");
      console.log(
        "🐛 Use gameDebug.checkVictoryState() to debug victory button"
      );
    }
  }

  // Main game initialization
  async start() {
    console.log("🎮 Starting tutorial game engine...");
    this.setupDevelopmentEnvironment();

    // Set up asset manager progress callback
    this.renderer.assetManager.setProgressCallback((progress) => {
      this.loadingScreen.updateProgress(progress);
    });

    try {
      // Preload all assets (now includes audio)
      console.log("📦 Preloading tutorial assets...");
      await this.renderer.assetManager.preloadAllAssets();

      // Show start screen first to ensure audio interaction
      console.log("🎮 Showing start screen (required for audio)");
      this.loadingScreen.hide();
      await this.startScreen.show();
    } catch (error) {
      console.error("❌ Failed to start tutorial:", error);
      this.handleStartupError(error);
    }
  }

  // UPDATED: Proper initialization order with dependency injection + Victory Persistence
  async startGameplay() {
    if (this.gameStarted) {
      console.log("⚠️ Tutorial already started");
      return;
    }

    console.log("🎮 Starting tutorial gameplay...");
    this.gameStarted = true;

    try {
      // Hide start screen if showing
      if (this.startScreen.isStartScreenShowing()) {
        this.startScreen.hide();
      }

      // Try to load saved game
      const gameLoaded = this.gameState.load();

      if (gameLoaded) {
        // Load saved tutorial state
        console.log(`Loading saved tutorial progress`);
        this.currentLocation =
          this.gameState.currentLocation || CONFIG.DEFAULT_LOCATION;
      } else {
        // NEW TUTORIAL: Start fresh
        console.log(`Starting new tutorial at ${CONFIG.DEFAULT_LOCATION}`);
        this.currentLocation = CONFIG.DEFAULT_LOCATION;
        this.gameState.currentLocation = CONFIG.DEFAULT_LOCATION;
      }

      // Initialize game state for tutorial
      this.gameState.initializeForLevel(1);

      // FIXED: Initialize keyword manager with game data
      console.log("🔑 Initializing keyword generation system...");
      await this.keywordGenerationManager.initialize();

      // FIXED: Load achievements with keyword data via dependency injection
      console.log("🏆 Loading achievements with keyword data...");
      this.achievementManager.loadAchievementsWithKeywords(
        this.keywordGenerationManager.characterKeywords
      );

      // Sync achievements from saved game state if loaded
      if (gameLoaded) {
        this.achievementManager.syncFromGameState(
          this.gameState.unlockedAchievements
        );

        // ADDED: Sync victory screen state after loading
        this.victoryScreen.syncWithGameState();
      }

      // Set up event listeners for cleanup
      this.setupEventListeners();

      // Mark as ready BEFORE loading location to avoid infinite loop
      this.isReady = true;
      console.log("✅ Tutorial initialization complete!");

      // Load the current location
      await this.loadLocation(this.currentLocation);

      // Start background music for tutorial
      console.log("🎵 Starting background music for tutorial");
      this.playBackgroundMusic(1);

      // Save initial state
      this.gameState.save();
    } catch (error) {
      console.error("❌ Failed to start tutorial gameplay:", error);
      this.handleStartupError(error);
    }
  }

  handleStartupError(error) {
    console.error("🚨 Critical startup error:", error);

    // Show error message to user
    document.body.innerHTML = `
      <div style="
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background: rgba(0,0,0,0.9); 
        color: white; 
        padding: 30px; 
        border-radius: 10px; 
        text-align: center;
        max-width: 500px;
        z-index: 10000;
      ">
        <h2>🚨 Tutorial Loading Error</h2>
        <p>Sorry, there was a problem starting the tutorial.</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <button onclick="location.reload()" style="
          background: #4CAF50; 
          color: white; 
          border: none; 
          padding: 10px 20px; 
          border-radius: 5px; 
          cursor: pointer; 
          margin-top: 20px;
        ">Try Again</button>
      </div>
    `;
  }

  setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (!this.isReady) return;

      // Location navigation shortcuts (1-3 for tutorial)
      if (
        e.key >= "1" &&
        e.key <= "3" &&
        !this.conversationManager.isActive()
      ) {
        const locationIndex = parseInt(e.key) - 1;
        this.locationNavigator.navigateByIndex(locationIndex);
      }

      // Achievement panel toggle (A key)
      if (e.key === "a" || e.key === "A") {
        if (!this.conversationManager.isActive()) {
          e.preventDefault();
          this.achievementManager.showAchievementPanel();
        }
      }

      // Exploration drawer toggle (E key)
      if (e.key === "e" || e.key === "E") {
        if (!this.conversationManager.isActive()) {
          e.preventDefault();
          this.explorationDrawer.toggleDrawer();
        }
      }
    });

    // Handle page unload
    window.addEventListener("beforeunload", () => {
      this.gameState.save();
      this.destroy();
    });
  }

  async loadLocation(locationKey) {
    if (!this.isReady) {
      console.warn("🚫 Tutorial not ready, cannot load location");
      return;
    }

    console.log(`🗺️ Loading tutorial location: ${locationKey}`);

    // Play location change sound
    this.playSoundEffect("locationChange", 0.35);

    // Close any open UI elements that might interfere
    this.closeUIElements();

    try {
      // Get location data
      const locationData = locations[locationKey];
      if (!locationData) {
        throw new Error(`Tutorial location ${locationKey} not found`);
      }

      console.log(`📍 Tutorial location data:`, locationData);

      // Update current location
      this.currentLocation = locationKey;
      this.gameState.currentLocation = locationKey;

      // Render the location
      await this.renderer.renderLocation(locationData);

      // Update navigation
      this.locationNavigator.updateNavigation(locationKey);

      // Save game state
      this.gameState.save();

      console.log(`✅ Tutorial location loaded successfully: ${locationKey}`);

      // FIXED: Emit standardized location changed event
      GameEvents.emit(
        GAME_EVENTS.LOCATION_CHANGED,
        EventData.locationChange(locationKey, locationData)
      );
    } catch (error) {
      console.error(
        `❌ Failed to load tutorial location ${locationKey}:`,
        error
      );
    }
  }

  closeUIElements() {
    console.log("🧹 Closed all open descriptions due to location change");

    // Close any open item/character descriptions
    const openDescriptions = document.querySelectorAll(
      ".detailed-tooltip.visible"
    );
    openDescriptions.forEach((desc) => {
      desc.classList.remove("visible");
    });
  }

  // Tutorial completion handling
  handleTutorialVictory() {
    console.log("🎉 TUTORIAL COMPLETE! Victory achieved!");

    // Disable interactions to prevent further input
    this.interactionHandler.setInteractionsEnabled(false);

    // Close any open conversations
    if (this.conversationManager.isActive()) {
      this.conversationManager.endConversation();
    }

    // Show victory screen
    this.victoryScreen.show(true); // true = try to play cutscene first if available
  }

  // NEW: Complete game reset - called from victory screen "Complete Game" button
  completeGameReset() {
    console.log("🔄 Starting complete game reset...");

    // Show loading screen during reset
    this.loadingScreen.show();
    this.loadingScreen.updateProgress({
      percentage: 0,
      status: "Resetting game...",
    });

    // Hide victory screen immediately
    this.victoryScreen.hide();

    // Perform complete reset in stages with progress updates
    setTimeout(() => {
      this.loadingScreen.updateProgress({
        percentage: 20,
        status: "Clearing save data...",
      });

      // Clear ALL save data including tutorial completion
      try {
        localStorage.removeItem(CONFIG.SAVE_KEY);
        localStorage.removeItem("anxiety-minotaur-discoveries");
        localStorage.removeItem("anxiety-minotaur-discoveries-backup");
        console.log("💾 All save data cleared");
      } catch (error) {
        console.warn("Failed to clear some save data:", error);
      }

      setTimeout(() => {
        this.loadingScreen.updateProgress({
          percentage: 50,
          status: "Resetting game systems...",
        });

        // Reset victory screen state completely
        this.victoryScreen.isUnlocked = false;
        this.victoryScreen.victoryButton.style.display = "none";

        // Do full reset (clears all progress)
        this.fullReset();

        setTimeout(() => {
          this.loadingScreen.updateProgress({
            percentage: 80,
            status: "Preparing fresh start...",
          });

          setTimeout(() => {
            this.loadingScreen.updateProgress({
              percentage: 100,
              status: "Ready for new adventure!",
            });

            setTimeout(() => {
              this.loadingScreen.hide();
              console.log(
                "🎮 Complete game reset finished - ready for fresh start"
              );
            }, 1000);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }

  // Reset tutorial state (keep discoveries and audio settings)
  reset() {
    console.log("🔄 Resetting tutorial state...");

    // Reset core game state but preserve discoveries and audio settings
    this.gameState.reset();

    // Reset all system states
    this.currentLocation = CONFIG.DEFAULT_LOCATION;
    this.currentLevel = CONFIG.DEFAULT_LEVEL;
    this.gameStarted = false;
    this.isReady = false;

    // Reset managers
    if (this.conversationManager) {
      this.conversationManager.endConversation();
    }

    if (this.achievementManager) {
      this.achievementManager.reset();
    }

    if (this.interactionHandler) {
      this.interactionHandler.setInteractionsEnabled(true);
      this.interactionHandler.closeAllTooltips();
    }

    if (this.locationNavigator) {
      this.locationNavigator.reset();
    }

    if (this.energyUI) {
      this.energyUI.reset();
    }

    if (this.keywordGenerationManager) {
      this.keywordGenerationManager.reset();
    }

    // Reset UI screens
    if (this.victoryScreen) {
      this.victoryScreen.hide();
    }

    // NOTE: We DON'T reset explorationDrawer.discoveries to preserve discovery progress
    // NOTE: We DON'T reset audio settings to preserve user preferences

    // Show start screen again
    this.startScreen.show();

    console.log(
      "🔄 Tutorial reset complete - showing start screen (discoveries preserved)"
    );
  }

  // UPDATED: Enhanced fullReset method with better feedback
  fullReset() {
    console.log("🔄 Performing full tutorial reset...");

    // Do normal reset first
    this.reset();

    // Then reset discoveries completely
    if (this.explorationDrawer) {
      try {
        this.explorationDrawer.resetDiscoveries();
        console.log("🗺️ Discovery progress reset");
      } catch (error) {
        console.warn("Failed to reset discoveries:", error);
      }
    }

    // Keep audio settings (don't reset to preserve user preferences)
    // The user specifically asked to keep audio settings

    // Reset victory screen completely
    if (this.victoryScreen) {
      this.victoryScreen.isUnlocked = false;
      if (this.victoryScreen.victoryButton) {
        this.victoryScreen.victoryButton.style.display = "none";
      }
    }

    console.log(
      "🔄 Full tutorial reset complete - all progress cleared, audio settings preserved"
    );
  }

  // Audio control methods for external access
  playBackgroundMusic(level) {
    if (this.audioManager) {
      this.audioManager.playBackgroundMusic(level, true);
    }
  }

  stopBackgroundMusic() {
    if (this.audioManager) {
      this.audioManager.stopBackgroundMusic(true);
    }
  }

  playSoundEffect(effectKey, volume = 1.0) {
    if (this.audioManager) {
      this.audioManager.playSoundEffect(effectKey, volume);
    }
  }

  toggleMute() {
    if (this.audioManager) {
      return this.audioManager.toggleMute();
    }
    return false;
  }

  // Cleanup on page unload
  destroy() {
    // Stop all audio first
    if (this.audioManager) {
      this.audioManager.stopBackgroundMusic(false);
      this.audioManager.destroy();
    }

    if (this.audioSettingsUI) {
      this.audioSettingsUI.destroy();
    }

    if (this.startScreen) {
      this.startScreen.destroy();
    }

    if (this.gameState) {
      this.gameState.destroy();
    }

    if (this.conversationManager) {
      this.conversationManager.destroy();
    }

    if (this.levelManager) {
      this.levelManager.destroy();
    }

    if (this.explorationDrawer) {
      this.explorationDrawer.destroy();
    }

    if (this.victoryScreen) {
      this.victoryScreen.destroy();
    }

    if (this.cutsceneManager) {
      this.cutsceneManager.destroy();
    }

    if (this.renderer) {
      this.renderer.destroy();
    }

    if (this.loadingScreen) {
      this.loadingScreen.destroy();
    }

    if (this.energyUI) {
      this.energyUI.destroy();
    }

    if (this.keywordGenerationManager) {
      this.keywordGenerationManager = null;
    }

    console.log("🗑️ Tutorial game engine destroyed");
  }
}

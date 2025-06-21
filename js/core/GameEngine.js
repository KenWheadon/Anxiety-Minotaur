// js/core/GameEngine.js - Updated with Start Screen integration

class GameEngine {
  constructor() {
    // Use CONFIG to determine starting location
    this.currentLocation = CONFIG.DEFAULT_LOCATION;
    this.gameState = new GameState();
    this.loadingScreen = new LoadingScreen();
    this.startScreen = new StartScreen(this); // NEW: Add start screen
    this.renderer = new Renderer();
    this.interactionHandler = new InteractionHandler(this);
    this.conversationManager = new ConversationManager(this);
    this.locationNavigator = new LocationNavigator(this);
    this.levelManager = new LevelManager(this);
    this.achievementManager = new AchievementManager(this);
    this.explorationDrawer = new ExplorationDrawer(this);
    this.victoryScreen = new VictoryScreen(this);
    this.gameOverScreen = new GameOverScreen(this);
    this.cutsceneManager = new CutsceneManager(this);

    // Audio system integration
    this.audioManager = this.renderer.assetManager.getAudioManager();
    this.audioSettingsUI = new AudioSettingsUI(this.audioManager);

    this.isReady = false;
    this.currentLevel = CONFIG.DEFAULT_LEVEL;
    this.gameStarted = false; // NEW: Track if gameplay has started

    // Set up the callback for when Level 3 is completed (final victory)
    this.achievementManager.setAllAchievementsUnlockedCallback(() => {
      this.handleVictory();
    });

    // Set up the callback for game over condition
    this.achievementManager.setGameOverCallback((achievementId) => {
      this.handleGameOver(achievementId);
    });

    // Set up audio event listeners
    this.setupAudioEventListeners();
  }

  // Set up audio event listeners for game events
  setupAudioEventListeners() {
    // Play sound for character interactions
    GameEvents.on(GAME_EVENTS.CHARACTER_INTERACTION, () => {
      this.audioManager.playSoundEffect("characterInteract", 0.8);
    });

    // Play sound for item examinations
    GameEvents.on(GAME_EVENTS.ITEM_EXAMINED, () => {
      this.audioManager.playSoundEffect("discovery", 0.6);
    });

    // Play sound for location changes
    GameEvents.on(GAME_EVENTS.LOCATION_CHANGED, () => {
      this.audioManager.playSoundEffect("locationChange", 0.5);
    });

    // Play sound for achievements
    GameEvents.on(GAME_EVENTS.ACHIEVEMENT_UNLOCKED, () => {
      this.audioManager.playSoundEffect("achievement", 0.8);
    });

    // Play sound for conversation start
    GameEvents.on(GAME_EVENTS.CONVERSATION_STARTED, () => {
      this.audioManager.playSoundEffect("chatOpen", 0.5);
    });

    // Play background music when level changes
    GameEvents.on(GAME_EVENTS.LEVEL_CHANGED, (data) => {
      console.log(
        `🎵 Level changed to ${data.level}, starting background music`
      );
      this.audioManager.playBackgroundMusic(data.level, true);
    });

    console.log("🎵 Audio event listeners set up");
  }

  async start() {
    console.log("Starting Anxiety Minotaur...");

    // UPDATED: Show loading screen first, then start screen
    this.loadingScreen.show();

    // Wait for local config to load in development
    if (CONFIG.IS_DEVELOPMENT) {
      console.log("🔧 Development mode detected, waiting for local config...");
      await CONFIG.waitForLocalConfig();
    }

    // Log environment info after config is ready
    await CONFIG.logEnvironment();

    // Set up asset manager progress callback
    this.renderer.assetManager.setProgressCallback((progress) => {
      this.loadingScreen.updateProgress(progress);
    });

    try {
      // Preload all assets (now includes audio)
      console.log("📦 Preloading assets...");
      await this.renderer.assetManager.preloadAllAssets();

      // ALWAYS show start screen first to ensure audio interaction
      console.log("🎮 Showing start screen (required for audio)");
      this.loadingScreen.hide();
      await this.startScreen.show();
    } catch (error) {
      console.error("❌ Failed to start game:", error);
      this.handleStartupError(error);
    }
  }

  // NEW: Separated gameplay initialization from start()
  async startGameplay() {
    if (this.gameStarted) {
      console.log("⚠️ Gameplay already started");
      return;
    }

    console.log("🎮 Starting gameplay...");
    this.gameStarted = true;

    try {
      // Hide start screen if showing
      if (this.startScreen.isStartScreenShowing()) {
        this.startScreen.hide();
      }

      // Try to load saved game
      const gameLoaded = this.gameState.load();

      if (gameLoaded) {
        // Load saved level and location
        if (this.gameState.currentLevel) {
          console.log(`Loading saved level: ${this.gameState.currentLevel}`);
          this.currentLevel = this.gameState.currentLevel;

          try {
            await this.levelManager.loadLevel(this.gameState.currentLevel);
          } catch (error) {
            console.warn("Level loading failed, using fallback approach");
          }

          this.currentLocation = this.gameState.currentLocation;
          console.log(`Loading saved location: ${this.currentLocation}`);
        } else {
          console.log(
            `Legacy save detected, starting at Level ${CONFIG.DEFAULT_LEVEL}`
          );
          this.currentLocation =
            this.gameState.currentLocation || CONFIG.DEFAULT_LOCATION;
          this.currentLevel = CONFIG.DEFAULT_LEVEL;

          try {
            await this.levelManager.loadLevel(CONFIG.DEFAULT_LEVEL);
          } catch (error) {
            console.warn(
              `Level ${CONFIG.DEFAULT_LEVEL} loading failed, using direct location approach`
            );
          }
        }

        // Sync achievements with the achievement manager
        this.achievementManager.syncFromGameState(
          this.gameState.unlockedAchievements
        );
      } else {
        // NEW GAME: Start with configured default level
        console.log(
          `Starting new game at Level ${CONFIG.DEFAULT_LEVEL} (${CONFIG.DEFAULT_LOCATION})`
        );
        this.currentLocation = CONFIG.DEFAULT_LOCATION;
        this.currentLevel = CONFIG.DEFAULT_LEVEL;

        try {
          await this.levelManager.loadLevel(CONFIG.DEFAULT_LEVEL);
        } catch (error) {
          console.warn("Level manager failed, using direct approach");
        }

        this.gameState.currentLevel = CONFIG.DEFAULT_LEVEL;
        this.gameState.currentLocation = CONFIG.DEFAULT_LOCATION;
      }

      // Set up event listeners for cleanup
      this.setupEventListeners();

      // Mark as ready BEFORE loading location to avoid infinite loop
      this.isReady = true;
      console.log("✅ Game initialization complete!");

      // Load initial location directly, bypassing level validation
      await this.loadLocationDirect(this.currentLocation);

      // Start background music for current level
      this.startBackgroundMusicForCurrentLevel();

      // Hide loading screen if still showing
      this.loadingScreen.hide();

      // Start game loop
      this.gameLoop();
    } catch (error) {
      console.error("❌ Failed to start gameplay:", error);
      this.handleStartupError(error);
    }
  }

  // Enable audio interaction (required for some browsers)
  enableAudioInteraction() {
    const enableAudio = () => {
      this.audioManager.resumeAudioContext();
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
      console.log("🎵 Audio interaction enabled");
    };

    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("keydown", enableAudio, { once: true });
  }

  // Start background music for current level
  startBackgroundMusicForCurrentLevel() {
    if (this.currentLevel && this.audioManager) {
      console.log(
        `🎵 Starting background music for level ${this.currentLevel}`
      );
      this.audioManager.playBackgroundMusic(this.currentLevel, true);
    }
  }

  setupEventListeners() {
    // Listen for location changes to close open descriptions
    GameEvents.on(GAME_EVENTS.LOCATION_CHANGED, () => {
      this.closeAllOpenDescriptions();
    });

    // Listen for level changes to update data
    GameEvents.on(GAME_EVENTS.LEVEL_CHANGED, (data) => {
      console.log(`🎯 Level changed to: ${data.level}`);
      this.currentLevel = data.level;
      this.onLevelChanged(data);
    });

    // Enhanced click sound effects (avoid keyboard shortcuts entirely)
    document.addEventListener("click", (e) => {
      // Play click sound for UI elements
      if (e.target.matches("button, .interactable, [data-clickable]")) {
        this.audioManager.playSoundEffect("click", 0.3);
      }
    });
  }

  // Handle level change events
  onLevelChanged(levelData) {
    // Update current locations/characters/items from level data
    this.updateGameDataFromLevel(levelData.levelData);

    // Save the level change
    this.gameState.currentLevel = levelData.level;
    this.gameState.save();
  }

  // Update global game data from current level
  updateGameDataFromLevel(levelData) {
    if (!levelData) return;

    // Update global references to current level's data
    if (levelData.locations) {
      Object.assign(locations, levelData.locations);
    }

    if (levelData.characters) {
      Object.assign(characters, levelData.characters);
    }

    if (levelData.items) {
      Object.assign(items, levelData.items);
    }

    if (levelData.achievements) {
      Object.assign(achievements, levelData.achievements);
    }

    console.log("🔄 Updated game data from level");
  }

  closeAllOpenDescriptions() {
    // Close all floating tooltips
    if (this.interactionHandler) {
      this.interactionHandler.closeAllTooltips();
    }

    // Close location previews
    if (this.locationNavigator) {
      this.locationNavigator.hideLocationPreview();
    }

    // Close exploration drawer
    if (this.explorationDrawer && this.explorationDrawer.isOpen) {
      this.explorationDrawer.hideDrawer();
    }

    // Close audio settings if open
    if (this.audioSettingsUI && this.audioSettingsUI.isOpen) {
      this.audioSettingsUI.hideSettingsPanel();
    }

    console.log("🧹 Closed all open descriptions due to location change");
  }

  handleStartupError(error) {
    // Show error message on loading screen
    const statusElement =
      this.loadingScreen.loadingElement?.querySelector(".loading-status");
    if (statusElement) {
      statusElement.textContent =
        "Failed to load game. Please refresh the page.";
      statusElement.style.color = "#ff4444";
    }

    // Log detailed error
    console.error("Game startup failed:", error);

    // Try to continue with minimal functionality
    setTimeout(() => {
      console.log("Attempting to continue with reduced functionality...");
      this.loadingScreen.hide();
      this.startMinimalMode();
    }, 3000);
  }

  async startMinimalMode() {
    try {
      this.currentLocation = CONFIG.DEFAULT_LOCATION;
      this.currentLevel = CONFIG.DEFAULT_LEVEL;
      this.isReady = true;
      this.gameStarted = true;
      await this.loadLocationDirect(this.currentLocation);

      // Try to start background music even in minimal mode
      this.startBackgroundMusicForCurrentLevel();

      this.gameLoop();
      console.log("⚠️ Game started in minimal mode");
    } catch (error) {
      console.error("❌ Even minimal mode failed:", error);
    }
  }

  // Load location directly without level manager validation
  async loadLocationDirect(locationKey) {
    console.log(`🗺️ Loading location directly: ${locationKey}`);

    // Use global locations object directly
    if (!locations[locationKey]) {
      console.error(`❌ Location not found: ${locationKey}`);
      // Fallback to configured default
      locationKey = CONFIG.DEFAULT_LOCATION;
      console.log(`🔄 Falling back to: ${locationKey}`);
    }

    this.currentLocation = locationKey;
    this.gameState.visitLocation(locationKey);

    // Close any open descriptions when changing locations
    this.closeAllOpenDescriptions();

    try {
      // Render location using global locations object
      const locationData = locations[locationKey];
      console.log(`📍 Location data:`, locationData);

      await this.renderer.renderLocation(locationData);
      this.locationNavigator.renderNavigation(locationKey);

      console.log(`✅ Location loaded successfully: ${locationKey}`);
    } catch (error) {
      console.error(`❌ Failed to load location ${locationKey}:`, error);

      // Try ultimate fallback
      if (locationKey !== CONFIG.DEFAULT_LOCATION) {
        console.log("🔄 Attempting ultimate fallback...");
        await this.loadLocationDirect(CONFIG.DEFAULT_LOCATION);
      }
    }
  }

  // Keep the original loadLocation method for compatibility
  async loadLocation(locationKey) {
    return await this.loadLocationDirect(locationKey);
  }

  // Handle victory with audio and cutscene
  handleVictory() {
    console.log(`🎉 Victory triggered!`);

    // Stop background music and play victory sound
    this.audioManager.stopBackgroundMusic(true);
    setTimeout(() => {
      this.audioManager.playSoundEffect("achievement", 1.0);
    }, 1000);

    // Disable all interactions immediately
    if (this.interactionHandler) {
      this.interactionHandler.setInteractionsEnabled(false);
    }

    // Close any open conversations
    if (
      this.conversationManager &&
      this.conversationManager.isConversationActive
    ) {
      this.conversationManager.endConversation();
    }

    // Close any open UI panels
    this.closeAllOpenDescriptions();

    // Show victory screen with cutscene if available
    const withCutscene = true; // Always attempt cutscene for first victory
    console.log(`🎬 Calling victory screen with cutscene: ${withCutscene}`);

    this.victoryScreen.show(withCutscene);

    // Save the game state (so they can see their final stats)
    this.save();

    console.log("🎉 Victory sequence initiated");
  }

  // Handle game over condition with audio and cutscene
  handleGameOver(achievementId) {
    console.log(`💀 Game Over triggered by achievement: ${achievementId}`);

    // Stop background music and play dramatic sound
    this.audioManager.stopBackgroundMusic(true);
    setTimeout(() => {
      this.audioManager.playSoundEffect("achievement", 0.5); // Lower volume for dramatic effect
    }, 500);

    // Disable all interactions immediately
    if (this.interactionHandler) {
      this.interactionHandler.setInteractionsEnabled(false);
    }

    // Close any open conversations
    if (
      this.conversationManager &&
      this.conversationManager.isConversationActive
    ) {
      this.conversationManager.endConversation();
    }

    // Close any open UI panels
    this.closeAllOpenDescriptions();

    // Show game over screen with cutscene if on Level 3
    const isLevel3 = this.levelManager && this.levelManager.currentLevel === 3;
    const withCutscene =
      isLevel3 &&
      this.cutsceneManager &&
      this.cutsceneManager.hasCutscene("level3_gameover");

    this.gameOverScreen.show(withCutscene);

    // Save the game state (so they can see their final stats)
    this.save();

    console.log("💀 Game Over sequence initiated");
  }

  gameLoop() {
    // Main game loop
    if (this.renderer) {
      this.renderer.update();
    }

    // Update game state timing
    if (this.gameState) {
      this.gameState.updatePlayTime();
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  // Get detailed game status
  getStatus() {
    return {
      isReady: this.isReady,
      gameStarted: this.gameStarted, // NEW: Include game started status
      currentLocation: this.currentLocation,
      currentLevel: this.levelManager?.currentLevel || this.currentLevel,
      assetStats: this.renderer?.assetManager?.getStats(),
      gameStats: this.gameState?.getStats(),
      achievementStats: this.achievementManager?.getStats(),
      explorationStats: this.explorationDrawer?.getStats(),
      conversationStatus: this.conversationManager?.getStatus(),
      isGameOver: this.gameOverScreen?.isGameOverShowing() || false,
      cutsceneStatus: this.cutsceneManager?.getStatus(),
      audioStats: this.audioManager?.getStats(),
      startScreenStatus: this.startScreen?.getStatus(), // NEW: Start screen status
      levelStats: this.levelManager
        ? {
            currentLevel: this.levelManager.currentLevel,
            totalLevels: this.levelManager.getTotalLevels(),
          }
        : {
            currentLevel: this.currentLevel,
            totalLevels: 3,
          },
    };
  }

  // Save game state
  save() {
    if (this.gameState) {
      this.gameState.save();
    }

    // Also save audio settings
    if (this.audioManager) {
      this.audioManager.saveSettings();
    }
  }

  // UPDATED: Reset game with start screen option
  reset() {
    // Close ALL open UIs including game over screen
    this.closeAllOpenDescriptions();

    if (
      this.conversationManager &&
      this.conversationManager.isConversationActive
    ) {
      this.conversationManager.endConversation();
    }

    // Hide game over screen if showing
    if (this.gameOverScreen && this.gameOverScreen.isGameOverShowing()) {
      this.gameOverScreen.hide();
    }

    // Hide victory screen if showing
    if (this.victoryScreen && this.victoryScreen.isShowing) {
      this.victoryScreen.hide();
    }

    // Stop any playing cutscenes
    if (this.cutsceneManager && this.cutsceneManager.isPlaying) {
      this.cutsceneManager.completeCutscene();
    }

    // Reset audio to default level background music
    if (this.audioManager) {
      this.audioManager.stopBackgroundMusic(false);
    }

    // Reset game state (this will reset achievements but NOT discoveries)
    if (this.gameState) {
      this.gameState.reset();
    }

    // Reset achievements (as before)
    if (this.achievementManager) {
      this.achievementManager.resetAll();
    }

    // Reset victory screen unlock status
    if (this.victoryScreen) {
      this.victoryScreen.isUnlocked = false;
      this.victoryScreen.victoryButton.style.display = "none";
    }

    // Reset to configured default level
    this.currentLocation = CONFIG.DEFAULT_LOCATION;
    this.currentLevel = CONFIG.DEFAULT_LEVEL;
    this.gameStarted = false; // NEW: Reset game started flag

    if (this.levelManager) {
      try {
        this.levelManager.currentLevel = CONFIG.DEFAULT_LEVEL;
        this.levelManager.loadLevel(CONFIG.DEFAULT_LEVEL);
      } catch (error) {
        console.warn("Level manager reset failed, using direct approach");
      }
    }

    // Re-enable interactions
    if (this.interactionHandler) {
      this.interactionHandler.setInteractionsEnabled(true);
    }

    // NEW: Show start screen instead of going directly to game
    this.startScreen.show();

    console.log(
      `🔄 Game reset complete - showing start screen (discoveries preserved)`
    );
  }

  // Full reset including discoveries (for complete game reset)
  fullReset() {
    // Do normal reset first
    this.reset();

    // Then reset discoveries
    if (this.explorationDrawer) {
      this.explorationDrawer.resetDiscoveries();
    }

    // Reset audio settings to defaults
    if (this.audioManager) {
      this.audioManager.setMasterVolume(1.0);
      this.audioManager.setBackgroundVolume(0.3);
      this.audioManager.setSfxVolume(0.7);
      this.audioManager.isBackgroundMusicEnabled = true;
      this.audioManager.isSfxEnabled = true;
      this.audioManager.isMuted = false;
      this.audioManager.saveSettings();
    }

    console.log(
      "🔄 Full game reset complete - all progress and settings cleared"
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
      // NEW: Destroy start screen
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

    if (this.gameOverScreen) {
      this.gameOverScreen.destroy();
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

    console.log("🗑️ Game engine destroyed");
  }
}

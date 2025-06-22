// js/core/GameEngine.js - UPDATED: Uses centralized ContentManager system

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

    this.locationNavigator = new LocationNavigator(this);
    this.levelManager = new LevelManager(this);
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

    // Set up tutorial completion callback
    this.achievementManager.setTutorialCompleteCallback(() => {
      this.handleTutorialVictory();
    });

    // Set up audio event listeners
    this.setupAudioEventListeners();
  }

  setupAudioEventListeners() {
    GameEvents.on(GAME_EVENTS.LEVEL_CHANGED, (eventData) => {
      console.log(
        `🎵 Level changed to ${eventData.level}, starting background music`
      );
      this.playBackgroundMusic(eventData.level);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.conversationManager.isActive()) {
        e.preventDefault();
        this.audioSettingsUI.toggleSettingsPanel();
      }

      if (e.key === "m" || e.key === "M") {
        if (!this.conversationManager.isActive()) {
          e.preventDefault();
          this.toggleMute();
        }
      }
    });
  }

  setupDevelopmentEnvironment() {
    if (CONFIG.DEBUG) {
      window.gameDebug = {
        gameEngine: this,
        gameState: this.gameState,
        currentLocation: () => this.currentLocation,
        currentLevel: () => this.currentLevel,
        achievements: () => this.gameState.getUnlockedAchievements(),
        energy: () => this.gameState.socialEnergy,
        resetGame: () => this.reset(),
        loadLocation: (locationKey) => this.loadLocation(locationKey),

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
            this.gameState.hasAchievement(MENT_TUTORIAL_COMPLETE)
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

  async start() {
    console.log("🎮 Starting tutorial game engine...");
    this.setupDevelopmentEnvironment();

    this.renderer.assetManager.setProgressCallback((progress) => {
      this.loadingScreen.updateProgress(progress);
    });

    try {
      console.log("📦 Preloading tutorial assets...");
      await this.renderer.assetManager.preloadAllAssets();

      console.log("🎮 Showing start screen (required for audio)");
      this.loadingScreen.hide();
      await this.startScreen.show();
    } catch (error) {
      console.error("❌ Failed to start tutorial:", error);
      this.handleStartupError(error);
    }
  }

  async startGameplay() {
    if (this.gameStarted) {
      console.log("⚠️ Tutorial already started");
      return;
    }

    console.log("🎮 Starting tutorial gameplay...");
    this.gameStarted = true;

    try {
      if (this.startScreen.isStartScreenShowing()) {
        this.startScreen.hide();
      }

      const gameLoaded = this.gameState.load();

      if (gameLoaded) {
        console.log(`Loading saved tutorial progress`);
        this.currentLocation =
          this.gameState.currentLocation || CONFIG.DEFAULT_LOCATION;
      } else {
        console.log(`Starting new tutorial at ${CONFIG.DEFAULT_LOCATION}`);
        this.currentLocation = CONFIG.DEFAULT_LOCATION;
        this.gameState.currentLocation = CONFIG.DEFAULT_LOCATION;
      }

      this.gameState.initializeForLevel(1);

      console.log("🏆 Loading achievements from ContentManager...");
      this.achievementManager.loadAchievementsWithKeywords();

      if (gameLoaded) {
        this.achievementManager.syncFromGameState(
          this.gameState.unlockedAchievements
        );
        this.victoryScreen.syncWithGameState();
      }

      this.setupEventListeners();
      this.isReady = true;
      console.log("✅ Tutorial initialization complete!");

      await this.loadLocation(this.currentLocation);
      console.log("🎵 Starting background music for tutorial");
      this.playBackgroundMusic(1);
      this.gameState.save();
    } catch (error) {
      console.error("❌ Failed to start tutorial gameplay:", error);
      this.handleStartupError(error);
    }
  }

  handleStartupError(error) {
    console.error("🚨 Critical startup error:", error);

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
    document.addEventListener("keydown", (e) => {
      if (!this.isReady) return;

      if (
        e.key >= "1" &&
        e.key <= "3" &&
        !this.conversationManager.isActive()
      ) {
        const locationIndex = parseInt(e.key) - 1;
        this.locationNavigator.navigateByIndex(locationIndex);
      }

      if (e.key === "a" || e.key === "A") {
        if (!this.conversationManager.isActive()) {
          e.preventDefault();
          this.achievementManager.showAchievementPanel();
        }
      }

      if (e.key === "e" || e.key === "E") {
        if (!this.conversationManager.isActive()) {
          e.preventDefault();
          this.explorationDrawer.toggleDrawer();
        }
      }
    });

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
    this.playSoundEffect("locationChange", 0.35);
    this.closeUIElements();

    try {
      const locationData = locations[locationKey];
      if (!locationData)
        throw new Error(`Tutorial location ${locationKey} not found`);

      this.currentLocation = locationKey;
      this.gameState.currentLocation = locationKey;
      await this.renderer.renderLocation(locationData);
      this.locationNavigator.updateNavigation(locationKey);
      this.gameState.save();

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
    const openDescriptions = document.querySelectorAll(
      ".detailed-tooltip.visible"
    );
    openDescriptions.forEach((desc) => desc.classList.remove("visible"));
  }

  handleTutorialVictory() {
    console.log("🎉 TUTORIAL COMPLETE! Victory achieved!");
    this.interactionHandler.setInteractionsEnabled(false);
    if (this.conversationManager.isActive())
      this.conversationManager.endConversation();
    this.victoryScreen.show(true);
  }

  completeGameReset() {
    console.log("🔄 Starting complete game reset...");
    this.loadingScreen.show();
    this.loadingScreen.updateProgress({
      percentage: 0,
      status: "Resetting game...",
    });
    this.victoryScreen.hide();

    setTimeout(() => {
      this.loadingScreen.updateProgress({
        percentage: 20,
        status: "Clearing save data...",
      });
      try {
        localStorage.removeItem(CONFIG.SAVE_KEY);
        localStorage.removeItem("anxiety-minotaur-discoveries");
        localStorage.removeItem("anxiety-minotaur-discoveries-backup");
      } catch (error) {
        console.warn("Failed to clear some save data:", error);
      }

      setTimeout(() => {
        this.loadingScreen.updateProgress({
          percentage: 50,
          status: "Resetting game systems...",
        });
        this.victoryScreen.isUnlocked = false;
        this.victoryScreen.victoryButton.style.display = "none";
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

  reset() {
    console.log("🔄 Resetting tutorial state...");
    this.gameState.reset();
    this.currentLocation = CONFIG.DEFAULT_LOCATION;
    this.currentLevel = CONFIG.DEFAULT_LEVEL;
    this.gameStarted = false;
    this.isReady = false;

    if (this.conversationManager) this.conversationManager.endConversation();
    if (this.achievementManager) this.achievementManager.reset();
    if (this.interactionHandler) {
      this.interactionHandler.setInteractionsEnabled(true);
      this.interactionHandler.closeAllTooltips();
    }
    if (this.locationNavigator) this.locationNavigator.reset();
    if (this.energyUI) this.energyUI.reset();
    if (this.victoryScreen) this.victoryScreen.hide();
    this.startScreen.show();
  }

  fullReset() {
    this.reset();
    if (this.explorationDrawer) {
      try {
        this.explorationDrawer.resetDiscoveries();
      } catch (error) {
        console.warn("Failed to reset discoveries:", error);
      }
    }
    if (this.victoryScreen) {
      this.victoryScreen.isUnlocked = false;
      if (this.victoryScreen.victoryButton) {
        this.victoryScreen.victoryButton.style.display = "none";
      }
    }
  }

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
    return this.audioManager ? this.audioManager.toggleMute() : false;
  }

  destroy() {
    if (this.audioManager) {
      this.audioManager.stopBackgroundMusic(false);
      this.audioManager.destroy();
    }
    if (this.audioSettingsUI) this.audioSettingsUI.destroy();
    if (this.startScreen) this.startScreen.destroy();
    if (this.gameState) this.gameState.destroy();
    if (this.conversationManager) this.conversationManager.destroy();
    if (this.levelManager) this.levelManager.destroy();
    if (this.explorationDrawer) this.explorationDrawer.destroy();
    if (this.victoryScreen) this.victoryScreen.destroy();
    if (this.cutsceneManager) this.cutsceneManager.destroy();
    if (this.renderer) this.renderer.destroy();
    if (this.loadingScreen) this.loadingScreen.destroy();
    if (this.energyUI) this.energyUI.destroy();

    console.log("🗑️ Tutorial game engine destroyed");
  }
}

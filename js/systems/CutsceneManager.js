// js/systems/CutsceneManager.js - Handles video cutscenes with fullscreen support

class CutsceneManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.cutsceneContainer = null;
    this.videoElement = null;
    this.isPlaying = false;
    this.currentCutscene = null;
    this.onCompleteCallback = null;
    this.preloadedVideos = new Map(); // NEW: Track preloaded videos
    this.preloadingPromises = new Map(); // NEW: Track ongoing preload operations

    // Cut-scene definitions
    this.cutscenes = {
      level3_victory: {
        video: "cutscenes/you_win.mp4",
        fallback: "cutscenes/you_win.webm",
      },
      level3_gameover: {
        video: "cutscenes/game_over.mp4",
        fallback: "cutscenes/game_over.webm",
      },
    };

    this.createCutsceneUI();
    this.setupLevelChangeListener(); // NEW: Listen for level changes
    console.log("🎬 Cutscene Manager initialized");
  }

  createCutsceneUI() {
    this.cutsceneContainer = document.createElement("div");
    this.cutsceneContainer.className = "cutscene-overlay";
    this.cutsceneContainer.innerHTML = `
      <div class="cutscene-content">
        <video class="cutscene-video" preload="metadata">
          <source src="" type="video/mp4">
          <source src="" type="video/webm">
          <p>Your browser doesn't support HTML5 video.</p>
        </video>
        <div class="cutscene-controls">
          <button class="skip-cutscene">Skip</button>
        </div>
        <div class="cutscene-loading">
          <div class="loading-spinner"></div>
          <p>Loading cutscene...</p>
        </div>
      </div>
    `;

    // Add CSS styles
    const style = document.createElement("style");
    style.textContent = `
      .cutscene-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        display: none;
        z-index: 99999;
        overflow: hidden;
      }

      .cutscene-overlay.active {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cutscene-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cutscene-video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
      }

      .cutscene-controls {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 100001;
      }

      .skip-cutscene {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      .skip-cutscene:hover {
        background: rgba(0, 0, 0, 0.9);
        border-color: rgba(255, 255, 255, 0.6);
        transform: scale(1.05);
      }

      .cutscene-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: white;
        z-index: 100000;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 10px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .cutscene-loading p {
        margin: 0;
        font-size: 16px;
      }

      /* Hide loading when video is ready */
      .cutscene-overlay.video-ready .cutscene-loading {
        display: none;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.cutsceneContainer);

    this.videoElement = this.cutsceneContainer.querySelector(".cutscene-video");
    this.setupEventListeners();
  }

  setupEventListeners() {
    const skipButton = this.cutsceneContainer.querySelector(".skip-cutscene");

    // Skip button
    skipButton.addEventListener("click", () => {
      this.skipCutscene();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (this.isPlaying) {
        if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
          e.preventDefault();
          this.skipCutscene();
        }
      }
    });

    // Video events
    this.videoElement.addEventListener("loadeddata", () => {
      this.cutsceneContainer.classList.add("video-ready");
      console.log("🎬 Cutscene video loaded");
    });

    this.videoElement.addEventListener("ended", () => {
      console.log("🎬 Cutscene finished naturally");
      this.completeCutscene();
    });

    this.videoElement.addEventListener("error", (e) => {
      console.error("🎬 Cutscene video error:", e);
      this.handleVideoError();
    });

    // Prevent right-click context menu during cutscene
    this.videoElement.addEventListener("contextmenu", (e) => {
      if (this.isPlaying) {
        e.preventDefault();
      }
    });

    // FIXED: Listen for achievement unlock event with proper data extraction
    GameEvents.on(GAME_EVENTS.ACHIEVEMENT_UNLOCK, (eventData) => {
      // Extract the achievement ID from the event data
      const achievementId = eventData.achievementKey || eventData.achievementId;

      if (achievementId === READY_FOR_THE_DAY) {
        // Level 1 → Level 2 transition
        setTimeout(() => {
          this.transitionToLevel2();
        }, 2000);
      } else if (achievementId === RECRUITMENT_COMPLETE) {
        // Level 2 → Level 3 transition
        setTimeout(() => {
          this.transitionToLevel3();
        }, 2000);
      }
    });
  }

  // NEW: Set up listener for level changes to preload Level 3 cutscenes
  setupLevelChangeListener() {
    GameEvents.on(GAME_EVENTS.LEVEL_CHANGED, (data) => {
      if (data.level === 3) {
        console.log("🎬 Level 3 reached - starting cutscene preload");
        this.preloadLevel3Cutscenes();
      }
    });

    // Also check current level on initialization
    if (
      this.gameEngine.levelManager &&
      this.gameEngine.levelManager.currentLevel === 3
    ) {
      console.log("🎬 Already on Level 3 - starting cutscene preload");
      this.preloadLevel3Cutscenes();
    }
  }

  // NEW: Preload Level 3 cutscenes in the background
  async preloadLevel3Cutscenes() {
    const level3Cutscenes = ["level3_victory", "level3_gameover"];

    for (const cutsceneId of level3Cutscenes) {
      if (
        !this.preloadedVideos.has(cutsceneId) &&
        !this.preloadingPromises.has(cutsceneId)
      ) {
        this.preloadingPromises.set(
          cutsceneId,
          this.preloadCutscene(cutsceneId)
        );
      }
    }

    // Wait for all preloads to complete (but don't block the game)
    Promise.allSettled(Array.from(this.preloadingPromises.values())).then(
      (results) => {
        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;
        console.log(
          `🎬 Cutscene preload complete: ${successful} successful, ${failed} failed`
        );
      }
    );
  }

  // NEW: Preload a specific cutscene
  async preloadCutscene(cutsceneId) {
    const cutscene = this.cutscenes[cutsceneId];
    if (!cutscene) {
      console.warn(`🎬 Cannot preload unknown cutscene: ${cutsceneId}`);
      return false;
    }

    try {
      console.log(`🎬 Preloading cutscene: ${cutsceneId}`);

      // Create a hidden video element for preloading
      const preloadVideo = document.createElement("video");
      preloadVideo.style.display = "none";
      preloadVideo.preload = "auto";
      preloadVideo.muted = true; // Required for autoplay policies

      // Add sources
      const mp4Source = document.createElement("source");
      mp4Source.src = cutscene.video;
      mp4Source.type = "video/mp4";
      preloadVideo.appendChild(mp4Source);

      const webmSource = document.createElement("source");
      webmSource.src = cutscene.fallback;
      webmSource.type = "video/webm";
      preloadVideo.appendChild(webmSource);

      document.body.appendChild(preloadVideo);

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Preload timeout"));
        }, 5000); // 5 second timeout

        preloadVideo.addEventListener("loadeddata", () => {
          clearTimeout(timeout);
          console.log(`🎬 Successfully preloaded: ${cutsceneId}`);
          resolve();
        });

        preloadVideo.addEventListener("error", (e) => {
          clearTimeout(timeout);
          console.warn(`🎬 Failed to preload ${cutsceneId}:`, e);
          reject(e);
        });

        // Start loading
        preloadVideo.load();
      });

      // Store the preloaded video
      this.preloadedVideos.set(cutsceneId, preloadVideo);
      return true;
    } catch (error) {
      console.warn(`🎬 Preload failed for ${cutsceneId}:`, error);
      return false;
    } finally {
      // Clean up the promise tracking
      this.preloadingPromises.delete(cutsceneId);
    }
  }

  // NEW: Check if a cutscene is preloaded
  isCutscenePreloaded(cutsceneId) {
    return this.preloadedVideos.has(cutsceneId);
  }

  async playCutscene(cutsceneId, onComplete = null) {
    if (this.isPlaying) {
      console.warn("🎬 Cutscene already playing");
      return;
    }

    const cutscene = this.cutscenes[cutsceneId];
    if (!cutscene) {
      console.error(`🎬 Cutscene not found: ${cutsceneId}`);
      if (onComplete) onComplete();
      return;
    }

    console.log(`🎬 Starting cutscene: ${cutsceneId}`);

    this.currentCutscene = cutsceneId;
    this.onCompleteCallback = onComplete;
    this.isPlaying = true;

    // Disable all game interactions
    if (this.gameEngine.interactionHandler) {
      this.gameEngine.interactionHandler.setInteractionsEnabled(false);
    }

    // Close any open UI
    this.closeAllGameUI();

    // NEW: Check if we have a preloaded video for this cutscene
    const preloadedVideo = this.preloadedVideos.get(cutsceneId);
    if (preloadedVideo) {
      console.log(`🎬 Using preloaded video for: ${cutsceneId}`);

      // Clone the preloaded video's sources to our main video element
      this.videoElement.innerHTML = "";
      Array.from(preloadedVideo.children).forEach((source) => {
        this.videoElement.appendChild(source.cloneNode(true));
      });

      // Copy the current time and loaded state
      this.videoElement.currentTime = 0;

      // Mark as ready immediately since it's preloaded
      this.cutsceneContainer.classList.add("video-ready");
    } else {
      console.log(`🎬 Loading video on-demand for: ${cutsceneId}`);

      // Set video sources as before
      const sources = this.videoElement.querySelectorAll("source");
      sources[0].src = cutscene.video;
      sources[1].src = cutscene.fallback;

      // Reset video and container state
      this.cutsceneContainer.classList.remove("video-ready");
      this.videoElement.currentTime = 0;
      this.videoElement.load();
    }

    // Show cutscene overlay
    this.cutsceneContainer.classList.add("active");

    // Prevent body scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Start playing when ready
    try {
      await this.videoElement.play();
      console.log("🎬 Cutscene playback started");
    } catch (error) {
      console.error("🎬 Failed to play cutscene:", error);
      this.handleVideoError();
    }
  }

  skipCutscene() {
    if (!this.isPlaying) return;

    console.log("🎬 Cutscene skipped by user");
    this.completeCutscene();
  }

  completeCutscene() {
    if (!this.isPlaying) return;

    console.log("🎬 Cutscene completed");

    // Stop video
    this.videoElement.pause();
    this.videoElement.currentTime = 0;

    // Hide cutscene overlay
    this.cutsceneContainer.classList.remove("active", "video-ready");

    // Restore body scrolling
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    // Re-enable game interactions
    if (this.gameEngine.interactionHandler) {
      this.gameEngine.interactionHandler.setInteractionsEnabled(true);
    }

    // Reset state
    this.isPlaying = false;

    // Call completion callback
    if (this.onCompleteCallback) {
      const callback = this.onCompleteCallback;
      this.onCompleteCallback = null;
      callback();
    }

    this.currentCutscene = null;
  }

  handleVideoError() {
    console.warn("🎬 Video playback failed, skipping cutscene");

    // Show error message briefly
    const loadingText = this.cutsceneContainer.querySelector(
      ".cutscene-loading p"
    );
    if (loadingText) {
      loadingText.textContent = "Video unavailable - continuing...";
    }

    // Skip after a brief delay
    setTimeout(() => {
      this.completeCutscene();
    }, 2000);
  }

  closeAllGameUI() {
    // Close any open conversations
    if (
      this.gameEngine.conversationManager &&
      this.gameEngine.conversationManager.isConversationActive
    ) {
      this.gameEngine.conversationManager.endConversation();
    }

    // Close exploration drawer
    if (
      this.gameEngine.explorationDrawer &&
      this.gameEngine.explorationDrawer.isOpen
    ) {
      this.gameEngine.explorationDrawer.hideDrawer();
    }

    // Close achievement panel
    if (this.gameEngine.achievementManager) {
      this.gameEngine.achievementManager.hideAchievementPanel();
    }

    // Close tooltips
    if (this.gameEngine.interactionHandler) {
      this.gameEngine.interactionHandler.closeAllTooltips();
    }
  }

  // Check if cutscene exists
  hasCutscene(cutsceneId) {
    return this.cutscenes.hasOwnProperty(cutsceneId);
  }

  // Get cutscene status
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentCutscene: this.currentCutscene,
      availableCutscenes: Object.keys(this.cutscenes),
      preloadedCutscenes: Array.from(this.preloadedVideos.keys()), // NEW: Show preloaded cutscenes
      preloadingCutscenes: Array.from(this.preloadingPromises.keys()), // NEW: Show currently preloading
    };
  }

  destroy() {
    // Clean up
    if (this.isPlaying) {
      this.completeCutscene();
    }

    // NEW: Clean up preloaded videos
    this.preloadedVideos.forEach((video, cutsceneId) => {
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
      console.log(`🎬 Cleaned up preloaded video: ${cutsceneId}`);
    });
    this.preloadedVideos.clear();
    this.preloadingPromises.clear();

    if (this.cutsceneContainer && this.cutsceneContainer.parentNode) {
      this.cutsceneContainer.parentNode.removeChild(this.cutsceneContainer);
    }

    // Restore body overflow
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    console.log("🗑️ Cutscene manager destroyed");
  }
}

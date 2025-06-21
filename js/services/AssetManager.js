// js/services/AssetManager.js - Complete version using centralized constants

class AssetManager {
  constructor() {
    this.images = new Map();
    this.sounds = new Map();
    this.loadedAssets = new Set();
    this.failedAssets = new Set();
    this.loadingPromises = new Map();
    this.preloadProgress = { loaded: 0, total: 0, percentage: 0 };
    this.onProgressCallback = null;

    // Initialize AudioManager
    this.audioManager = new AudioManager();

    // Get asset paths from constants (single source of truth)
    this.assetPaths = getAllAssetPaths();

    console.log(
      "📦 AssetManager initialized with",
      Object.keys(this.assetPaths).length,
      "asset paths"
    );

    // Placeholder colors for different asset types
    this.placeholderColors = {
      character: "#4CAF50",
      item: "#2196F3",
      background: "#8BC34A",
      unknown: "#666666",
    };
  }

  // Set progress callback for loading indicators
  setProgressCallback(callback) {
    this.onProgressCallback = callback;
  }

  // Update progress and notify callback
  updateProgress() {
    if (this.preloadProgress.total > 0) {
      this.preloadProgress.percentage = Math.round(
        (this.preloadProgress.loaded / this.preloadProgress.total) * 100
      );
    }

    if (this.onProgressCallback) {
      this.onProgressCallback(this.preloadProgress);
    }
  }

  // Preload all game assets including audio
  async preloadAllAssets() {
    console.log("📦 Starting asset preload from constants...");

    // Load audio settings first
    this.audioManager.loadSettings();

    // Get all image assets from our constants
    const imageAssets = Object.keys(this.assetPaths);
    this.preloadProgress.total = imageAssets.length;
    this.preloadProgress.loaded = 0;

    this.updateProgress();

    // Start audio preloading in parallel (don't block on it)
    const audioPromise = this.audioManager.preloadAllAudio().catch((error) => {
      console.warn("Audio preload failed, continuing without audio:", error);
      return { successful: 0, failed: 0 };
    });

    // Load all images
    const promises = imageAssets.map(async (assetKey) => {
      try {
        await this.loadImageDirect(assetKey);
        this.preloadProgress.loaded++;
        this.updateProgress();
      } catch (error) {
        console.warn(`Failed to preload ${assetKey}:`, error);
        this.preloadProgress.loaded++;
        this.updateProgress();
      }
    });

    // Wait for image assets
    await Promise.allSettled(promises);

    // Wait for audio (but don't fail if it doesn't work)
    const audioResults = await audioPromise;

    console.log(
      `📦 Asset preload complete: ${this.preloadProgress.loaded}/${this.preloadProgress.total} images`
    );

    if (audioResults.successful !== undefined) {
      console.log(
        `🎵 Audio preload: ${audioResults.successful} successful, ${audioResults.failed} failed`
      );
    }

    return this.preloadProgress;
  }

  // Extract filename from path (for backward compatibility)
  extractFilename(path) {
    if (path.includes("/")) {
      return path.split("/").pop();
    }
    return path;
  }

  // Get all assets used in the game
  getAllGameAssets() {
    const assets = [];

    // Add all predefined asset paths
    Object.entries(this.assetPaths).forEach(([key, path]) => {
      assets.push({
        filename: key,
        path: path,
        type: "image",
        category: this.getCategoryFromPath(path),
      });
    });

    // Legacy sound effects (now handled by AudioManager, but kept for compatibility)
    const soundEffects = [
      "effects/character_interact.mp3",
      "effects/item_examine.mp3",
      "effects/location_change.mp3",
      "effects/achievement.mp3",
      "effects/ui_hover.mp3",
    ];

    soundEffects.forEach((sound) => {
      assets.push({
        path: sound,
        type: "sound",
        category: "effect",
      });
    });

    return assets;
  }

  getCategoryFromPath(path) {
    if (path.includes("/characters/")) return "character";
    if (path.includes("/items/")) return "item";
    if (path.includes("/backgrounds/")) return "background";
    return "misc";
  }

  // Main image loading method - uses constants for paths
  async loadImage(assetKey) {
    const normalizedKey = assetKey.toLowerCase();

    // Check if we have a path for this asset in our constants
    if (this.assetPaths[normalizedKey]) {
      return await this.loadImageDirect(normalizedKey);
    }

    // Fallback: try to find by searching constants
    const foundPath = getAssetPath(assetKey);
    if (foundPath) {
      console.log(`📸 Found asset ${assetKey} via fallback search`);
      // Cache it for next time
      this.assetPaths[normalizedKey] = foundPath;
      return await this.loadImageDirect(normalizedKey);
    }

    console.warn(`❌ Unknown asset requested: ${assetKey}`);
    // Create placeholder for unknown assets
    const category = getAssetCategory(assetKey);
    const placeholder = this.createPlaceholderImage(category, assetKey);
    this.images.set(normalizedKey, placeholder);
    return placeholder;
  }

  // Load image directly using path from constants
  async loadImageDirect(assetKey) {
    const fullPath = this.assetPaths[assetKey];

    if (!fullPath) {
      throw new Error(`No path defined for asset: ${assetKey}`);
    }

    // Check cache
    if (this.images.has(assetKey)) {
      return this.images.get(assetKey);
    }

    // Check if loading
    if (this.loadingPromises.has(assetKey)) {
      return this.loadingPromises.get(assetKey);
    }

    console.log(`📸 Loading ${assetKey} from ${fullPath}`);

    const loadPromise = this._loadImageInternal(fullPath);
    this.loadingPromises.set(assetKey, loadPromise);

    try {
      const result = await loadPromise;
      this.loadingPromises.delete(assetKey);
      this.images.set(assetKey, result);
      this.loadedAssets.add(fullPath);
      console.log(`✅ Loaded ${assetKey}`);
      return result;
    } catch (error) {
      this.loadingPromises.delete(assetKey);
      console.warn(`❌ Failed to load ${assetKey}, using placeholder`);

      // Create placeholder
      const category = getAssetCategory(assetKey);
      const placeholder = this.createPlaceholderImage(category, assetKey);
      this.images.set(assetKey, placeholder);
      this.failedAssets.add(fullPath);

      return placeholder;
    }
  }

  async _loadImageInternal(fullPath) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load ${fullPath}`));
      };

      img.src = fullPath;
    });
  }

  // Create colored placeholder image
  createPlaceholderImage(category, name) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 64;
    canvas.height = 64;

    // Fill with category-specific color
    ctx.fillStyle =
      this.placeholderColors[category] || this.placeholderColors.unknown;
    ctx.fillRect(0, 0, 64, 64);

    // Add border
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 62, 62);

    // Add text label
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Truncate long names
    const displayName = name.length > 8 ? name.substring(0, 6) + ".." : name;
    ctx.fillText(displayName, 32, 32);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  // Background loading (delegates to main loadImage)
  async loadBackground(backgroundKey) {
    try {
      return await this.loadImage(backgroundKey);
    } catch (error) {
      console.warn(
        `Failed to load background ${backgroundKey}, using placeholder`
      );
      return this.createPlaceholderBackground(backgroundKey);
    }
  }

  // Create placeholder background
  createPlaceholderBackground(name) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    // Create gradient based on location name
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);

    switch (name.toLowerCase()) {
      case "garden":
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(1, "#228B22");
        break;
      case "livingroom":
        gradient.addColorStop(0, "#D2B48C");
        gradient.addColorStop(1, "#8B4513");
        break;
      case "bedroom":
        gradient.addColorStop(0, "#FFB6C1");
        gradient.addColorStop(1, "#9370DB");
        break;
      default:
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(1, "#4682B4");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add location name
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name.toUpperCase().replace(/_/g, " "), 400, 300);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  // Load sound with existence check (legacy method - now uses AudioManager)
  async loadSound(path) {
    const fullPath = `sounds/${path}`;

    if (this.sounds.has(fullPath)) {
      return this.sounds.get(fullPath);
    }

    try {
      // Check if file exists first
      const response = await fetch(fullPath, { method: "HEAD" });

      if (!response.ok) {
        console.warn(`🔇 Sound file not found: ${fullPath}`);
        this.failedAssets.add(fullPath);
        return null;
      }

      const audio = new Audio(fullPath);

      return new Promise((resolve) => {
        audio.addEventListener("canplaythrough", () => {
          console.log(`🔊 Loaded sound: ${fullPath}`);
          this.sounds.set(fullPath, audio);
          this.loadedAssets.add(fullPath);
          resolve(audio);
        });

        audio.addEventListener("error", () => {
          console.warn(`🔇 Failed to load sound: ${fullPath}`);
          this.failedAssets.add(fullPath);
          resolve(null);
        });

        audio.load();
      });
    } catch (error) {
      console.warn(`Error loading sound ${fullPath}:`, error);
      this.failedAssets.add(fullPath);
      return null;
    }
  }

  // Enhanced play sound using AudioManager
  playSound(path, volume = 1.0) {
    // Map old sound paths to new AudioManager keys
    const soundMapping = {
      "effects/character_interact.mp3": "characterInteract",
      "effects/item_examine.mp3": "itemExamine",
      "effects/location_change.mp3": "locationChange",
      "effects/achievement.mp3": "achievement",
      "effects/ui_hover.mp3": "uiHover",
      "effects/ui_click.mp3": "click",
      "effects/discovery.mp3": "discovery",
      "effects/chat_open.mp3": "chatOpen",
    };

    const soundKey = soundMapping[path];
    if (soundKey && this.audioManager) {
      this.audioManager.playSoundEffect(soundKey, volume);
    } else {
      // Fallback to legacy method
      this.playSoundLegacy(path, volume);
    }
  }

  // Legacy play sound method (for backward compatibility)
  playSoundLegacy(path, volume = 1.0) {
    try {
      const audio = this.sounds.get(`sounds/${path}`);
      if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch((e) => {
          console.warn(`Failed to play sound ${path}:`, e);
        });
      }
    } catch (error) {
      console.warn(`Error playing sound ${path}:`, error);
    }
  }

  // Play background music for level
  playBackgroundMusic(level) {
    if (this.audioManager) {
      this.audioManager.playBackgroundMusic(level, true);
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.audioManager) {
      this.audioManager.stopBackgroundMusic(true);
    }
  }

  // Get image from cache
  getImage(assetKey) {
    const normalizedKey = assetKey.toLowerCase();
    return this.images.get(normalizedKey) || null;
  }

  // Preload all assets for a location
  async preloadLocationAssets(locationData) {
    const promises = [];

    // Load background
    promises.push(this.loadBackground(locationData.background));

    // Load character images
    locationData.characters.forEach((charKey) => {
      const char = characters[charKey];
      if (char && char.img) {
        promises.push(this.loadImage(char.img));
      }
    });

    // Load item images
    locationData.items.forEach((itemKey) => {
      const item = items[itemKey];
      if (item && item.img) {
        promises.push(this.loadImage(item.img));
      }
    });

    try {
      await Promise.all(promises);
      console.log(
        `📦 Location assets ready for ${locationData.description || "location"}`
      );
    } catch (error) {
      console.warn(
        "Some location assets failed to load, but placeholders are ready"
      );
    }
  }

  // Get audio manager for external access
  getAudioManager() {
    return this.audioManager;
  }

  // Get loading statistics
  getStats() {
    const audioStats = this.audioManager ? this.audioManager.getStats() : {};
    return {
      loaded: this.loadedAssets.size,
      failed: this.failedAssets.size,
      total: this.loadedAssets.size + this.failedAssets.size,
      preloadProgress: this.preloadProgress,
      audio: audioStats,
      totalAssetPaths: Object.keys(this.assetPaths).length,
    };
  }

  // Check if all critical assets are loaded
  isReady() {
    return this.preloadProgress.loaded >= this.preloadProgress.total * 0.8; // 80% loaded is "ready"
  }

  // Cleanup including audio
  destroy() {
    if (this.audioManager) {
      this.audioManager.destroy();
    }
    console.log("📦 AssetManager destroyed");
  }
}

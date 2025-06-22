// js/services/AssetManager.js - Updated for ContentManager integration

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

    console.log("📦 AssetManager initialized with ContentManager integration");

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
    console.log("📦 Starting asset preload from ContentManager...");

    // Load audio settings first
    this.audioManager.loadSettings();

    // Get all assets from ContentManager
    const allAssets = this.getAllGameAssets();
    this.preloadProgress.total = allAssets.length;
    this.preloadProgress.loaded = 0;

    this.updateProgress();

    // Start audio preloading in parallel (don't block on it)
    const audioPromise = this.audioManager.preloadAllAudio().catch((error) => {
      console.warn("Audio preload failed, continuing without audio:", error);
      return { successful: 0, failed: 0 };
    });

    // Load all images
    const promises = allAssets.map(async (asset) => {
      try {
        await this.loadImageDirect(asset.key, asset.path);
        this.preloadProgress.loaded++;
        this.updateProgress();
      } catch (error) {
        console.warn(`Failed to preload ${asset.key}:`, error);
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

  // Get all assets from ContentManager
  getAllGameAssets() {
    const assets = [];

    // Get character assets
    Object.entries(contentManager.getAllCharacters()).forEach(([key, data]) => {
      if (data.assetPath) {
        assets.push({
          key: key.toLowerCase(),
          path: data.assetPath,
          type: "character",
        });
      }
    });

    // Get item assets
    Object.entries(contentManager.getAllItems()).forEach(([key, data]) => {
      if (data.assetPath) {
        assets.push({
          key: key.toLowerCase(),
          path: data.assetPath,
          type: "item",
        });
      }
    });

    // Get background assets
    Object.entries(contentManager.getAllLocations()).forEach(([key, data]) => {
      if (data.backgroundPath) {
        assets.push({
          key: key.toLowerCase(),
          path: data.backgroundPath,
          type: "background",
        });
      }
    });

    return assets;
  }

  // Main image loading method - uses ContentManager for paths
  async loadImage(assetKey) {
    const normalizedKey = assetKey.toLowerCase();

    // Check cache first
    if (this.images.has(normalizedKey)) {
      return this.images.get(normalizedKey);
    }

    // Get asset path from ContentManager
    let assetPath = null;
    let assetType = "unknown";

    // Try character
    const character = contentManager.getCharacter(normalizedKey);
    if (character && character.assetPath) {
      assetPath = character.assetPath;
      assetType = "character";
    }

    // Try item
    if (!assetPath) {
      const item = contentManager.getItem(normalizedKey);
      if (item && item.assetPath) {
        assetPath = item.assetPath;
        assetType = "item";
      }
    }

    // Try location background
    if (!assetPath) {
      const location = contentManager.getLocation(normalizedKey);
      if (location && location.backgroundPath) {
        assetPath = location.backgroundPath;
        assetType = "background";
      }
    }

    if (assetPath) {
      console.log(
        `📸 Loading ${assetType} asset: ${normalizedKey} from ${assetPath}`
      );
      return await this.loadImageDirect(normalizedKey, assetPath);
    }

    console.warn(`❌ Unknown asset requested: ${assetKey}`);
    // Create placeholder for unknown assets
    const placeholder = this.createPlaceholderImage(assetType, assetKey);
    this.images.set(normalizedKey, placeholder);
    return placeholder;
  }

  // Load image with explicit path
  async loadImageDirect(assetKey, assetPath) {
    const normalizedKey = assetKey.toLowerCase();

    // Check cache
    if (this.images.has(normalizedKey)) {
      return this.images.get(normalizedKey);
    }

    // Check if loading
    if (this.loadingPromises.has(normalizedKey)) {
      return this.loadingPromises.get(normalizedKey);
    }

    console.log(`📸 Loading ${normalizedKey} from ${assetPath}`);

    const loadPromise = this._loadImageInternal(assetPath);
    this.loadingPromises.set(normalizedKey, loadPromise);

    try {
      const result = await loadPromise;
      this.loadingPromises.delete(normalizedKey);
      this.images.set(normalizedKey, result);
      this.loadedAssets.add(assetPath);
      console.log(`✅ Loaded ${normalizedKey}`);
      return result;
    } catch (error) {
      this.loadingPromises.delete(normalizedKey);
      console.warn(`❌ Failed to load ${normalizedKey}, using placeholder`);

      // Determine type from path for better placeholder
      let category = "unknown";
      if (assetPath.includes("/characters/")) category = "character";
      else if (assetPath.includes("/items/")) category = "item";
      else if (assetPath.includes("/backgrounds/")) category = "background";

      const placeholder = this.createPlaceholderImage(category, normalizedKey);
      this.images.set(normalizedKey, placeholder);
      this.failedAssets.add(assetPath);

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
      case "forest":
        gradient.addColorStop(0, "#2F4F2F");
        gradient.addColorStop(1, "#228B22");
        break;
      case "labyrinth":
      case "outside_labyrinth":
      case "middle_of_labyrinth":
        gradient.addColorStop(0, "#4B0082");
        gradient.addColorStop(1, "#191970");
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

  // Play sound using AudioManager
  playSound(path, volume = 1.0) {
    // Map paths to AudioManager keys
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
      console.warn(`Unknown sound effect: ${path}`);
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
    if (locationData.background) {
      promises.push(this.loadBackground(locationData.background));
    }

    // Load character images
    if (locationData.characters) {
      locationData.characters.forEach((charKey) => {
        promises.push(this.loadImage(charKey));
      });
    }

    // Load item images
    if (locationData.items) {
      locationData.items.forEach((itemKey) => {
        promises.push(this.loadImage(itemKey));
      });
    }

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
      cachedImages: this.images.size,
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

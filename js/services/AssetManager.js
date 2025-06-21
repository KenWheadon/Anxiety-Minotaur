// js/services/AssetManager.js - Updated with cleaner loadImage integration

class AssetManager {
  constructor() {
    this.images = new Map();
    this.sounds = new Map();
    this.loadedAssets = new Set();
    this.failedAssets = new Set();
    this.loadingPromises = new Map();
    this.preloadProgress = { loaded: 0, total: 0, percentage: 0 };
    this.onProgressCallback = null;

    // NEW: Initialize AudioManager
    this.audioManager = new AudioManager();

    // Placeholder colors for different asset types
    this.placeholderColors = {
      character: "#4CAF50",
      item: "#2196F3",
      background: "#8BC34A",
      ui: "#FF9800",
    };
  }

  // HELPER: Extract filename from path (e.g., "characters/npc_duck" -> "npc_duck")
  extractFilename(path) {
    if (path.includes("/")) {
      return path.split("/").pop();
    }
    return path;
  }

  // HELPER: Get folder type from filename by checking which folder it exists in
  // This is used for placeholder generation when we only have filename
  async getFolderTypeForFilename(filename) {
    const folders = ["characters", "backgrounds", "items"];
    for (const folder of folders) {
      const fullPath = `images/${folder}/${filename}.png`;
      if (this.images.has(fullPath)) {
        return folder;
      }
    }
    // Default to "item" if not found
    return "item";
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

  // NEW: Preload all game assets including audio
  async preloadAllAssets() {
    console.log("📦 Starting comprehensive asset preload...");

    // Load audio settings first
    this.audioManager.loadSettings();

    const allAssets = this.getAllGameAssets();
    this.preloadProgress.total = allAssets.length;
    this.preloadProgress.loaded = 0;

    this.updateProgress();

    // Start audio preloading in parallel
    const audioPromise = this.audioManager.preloadAllAudio();

    const promises = allAssets.map(async (asset) => {
      try {
        if (asset.type === "image") {
          // UPDATED: Extract filename from asset.path before calling loadImage
          const filename = this.extractFilename(asset.path);
          await this.loadImage(filename);
        } else if (asset.type === "sound") {
          await this.loadSound(asset.path);
        }
        this.preloadProgress.loaded++;
        this.updateProgress();
      } catch (error) {
        console.warn(`Failed to preload ${asset.path}:`, error);
        this.preloadProgress.loaded++;
        this.updateProgress();
      }
    });

    // Wait for both image/sound assets and audio manager to complete
    const [assetResults, audioResults] = await Promise.allSettled([
      Promise.allSettled(promises),
      audioPromise,
    ]);

    console.log(
      `📦 Preload complete: ${this.preloadProgress.loaded}/${this.preloadProgress.total} assets`
    );

    if (audioResults.status === "fulfilled") {
      console.log(
        `🎵 Audio preload: ${audioResults.value.successful} successful, ${audioResults.value.failed} failed`
      );
    }

    return this.preloadProgress;
  }

  // UPDATED: Get all assets used in the game - now stores just filenames for consistency
  getAllGameAssets() {
    const assets = [];

    // Background images - store just the background name as filename
    Object.entries(locations).forEach(([key, location]) => {
      assets.push({
        path: location.background, // Just the filename, not full path
        type: "image",
        category: "background",
      });
    });

    // Character images - store just the image name as filename
    Object.entries(characters).forEach(([key, character]) => {
      assets.push({
        path: character.img, // Just the filename, not full path
        type: "image",
        category: "character",
      });
    });

    // Item images - store just the image name as filename
    Object.entries(items).forEach(([key, item]) => {
      assets.push({
        path: item.img, // Just the filename, not full path
        type: "image",
        category: "item",
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

  // Load image with smart folder ordering to minimize 404s
  async loadImage(filename) {
    // Convert filename to lowercase for consistent file lookups
    const lowerFilename = filename.toLowerCase();

    // Smart folder ordering based on filename patterns
    const folders = this.getSmartFolderOrder(lowerFilename);
    let lastError = null;

    // Check each subfolder for the image
    for (const folder of folders) {
      const fullPath = `images/${folder}/${lowerFilename}.png`;

      // Check if already cached
      if (this.images.has(fullPath)) {
        return this.images.get(fullPath);
      }

      // Check if already loading to prevent race conditions
      if (this.loadingPromises.has(fullPath)) {
        return this.loadingPromises.get(fullPath);
      }

      // Check if image exists silently
      const exists = await this.checkImageExistsSilently(fullPath);
      if (!exists) {
        continue; // File doesn't exist, try next folder
      }

      // Try to load from this path
      try {
        console.log(`🔍 Loading ${lowerFilename} from ${folder} folder...`);

        const loadPromise = this._loadImageInternal(
          fullPath,
          folder,
          lowerFilename
        );
        this.loadingPromises.set(fullPath, loadPromise);

        const result = await loadPromise;
        this.loadingPromises.delete(fullPath);

        console.log(
          `✅ Successfully loaded ${lowerFilename} from ${folder} folder`
        );
        return result;
      } catch (error) {
        this.loadingPromises.delete(fullPath);
        lastError = error;
        // Continue to next folder
      }
    }

    // If we get here, the image wasn't found in any subfolder
    console.warn(`Image ${lowerFilename}.png not found, using placeholder`);

    // Create a placeholder
    const placeholderType = folders[0]; // Use first folder as best guess
    const placeholder = this.createPlaceholderImage(
      placeholderType,
      lowerFilename
    );

    // Cache the placeholder using the most likely path
    const fallbackPath = `images/${placeholderType}/${lowerFilename}.png`;
    this.images.set(fallbackPath, placeholder);
    this.failedAssets.add(fallbackPath);

    return placeholder;
  }

  // ADDED: Smart folder ordering based on filename patterns
  getSmartFolderOrder(filename) {
    const lowerFilename = filename.toLowerCase();

    // Items folder first for item_ prefixed files
    if (
      lowerFilename.startsWith("item_") ||
      lowerFilename.includes("seed") ||
      lowerFilename.includes("letter") ||
      lowerFilename.includes("book") ||
      lowerFilename.includes("help") ||
      lowerFilename.includes("mag") ||
      lowerFilename.includes("dig")
    ) {
      return ["items", "characters", "backgrounds"];
    }

    // Characters folder first for character files
    if (
      lowerFilename.includes("npc_") ||
      lowerFilename.includes("character_") ||
      lowerFilename.includes("_duck") ||
      lowerFilename.includes("pig") ||
      lowerFilename.startsWith("you_")
    ) {
      return ["characters", "items", "backgrounds"];
    }

    // Backgrounds folder first for background files
    if (
      lowerFilename.includes("bg") ||
      lowerFilename.includes("background") ||
      lowerFilename.includes("level") ||
      lowerFilename === "bedroom" ||
      lowerFilename === "livingroom" ||
      lowerFilename === "garden"
    ) {
      return ["backgrounds", "items", "characters"];
    }

    // Default order if no pattern matches
    return ["items", "characters", "backgrounds"];
  }

  // Silent existence check using Image object
  async checkImageExistsSilently(imagePath) {
    return new Promise((resolve) => {
      const img = new Image();

      // Set up handlers before setting src
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      // Start the check
      img.src = imagePath;

      // Timeout after 500ms to avoid hanging
      setTimeout(() => resolve(false), 500);
    });
  }

  async _loadImageInternal(fullPath, type, originalPath) {
    try {
      const img = new Image();
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => {
          console.log(`✅ Loaded image: ${fullPath}`);
          this.images.set(fullPath, img);
          this.loadedAssets.add(fullPath);
          resolve(img);
        };

        img.onerror = () => {
          console.warn(`❌ Failed to load image: ${fullPath}`);
          this.failedAssets.add(fullPath);
          reject(new Error(`Failed to load ${fullPath}`));
        };
      });

      img.src = fullPath;
      return await loadPromise;
    } catch (error) {
      console.warn(`Error loading image ${fullPath}:`, error);
      this.failedAssets.add(fullPath);
      throw error;
    }
  }

  // Create colored placeholder image
  createPlaceholderImage(type, name) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 64;
    canvas.height = 64;

    // Fill with type-specific color
    ctx.fillStyle = this.placeholderColors[type] || "#666666";
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

  // UPDATED: Load background image with fallback - now just passes filename
  async loadBackground(name) {
    try {
      // Extract filename if a path was passed (for backward compatibility)
      const filename = this.extractFilename(name);
      return await this.loadImage(filename);
    } catch (error) {
      console.warn(`Failed to load background ${name}, using solid color`);
      return this.createPlaceholderBackground(name);
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

    switch (name) {
      case "garden":
      case OUTSIDE_GANG_CLUB:
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(1, "#228B22");
        break;
      case "greenhouse":
      case "saloon":
        gradient.addColorStop(0, "#98FB98");
        gradient.addColorStop(1, "#006400");
        break;
      case "shed":
      case "saloon_backroom":
        gradient.addColorStop(0, "#D2B48C");
        gradient.addColorStop(1, "#8B4513");
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

  // NEW: Enhanced play sound using AudioManager
  playSound(path, volume = 1.0) {
    // Map old sound paths to new AudioManager keys
    const soundMapping = {
      "effects/character_interact.mp3": "characterInteract",
      "effects/item_examine.mp3": "itemExamine",
      "effects/location_change.mp3": "locationChange",
      "effects/achievement.mp3": "achievement",
      "effects/ui_hover.mp3": "uiHover",
      // New sound effects
      "effects/ui_click.mp3": "click",
      "effects/discovery.mp3": "discovery",
      "effects/chat_open.mp3": "chatOpen",
    };

    const soundKey = soundMapping[path];
    if (soundKey) {
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

  // NEW: Play background music for level
  playBackgroundMusic(level) {
    this.audioManager.playBackgroundMusic(level, true);
  }

  // NEW: Stop background music
  stopBackgroundMusic() {
    this.audioManager.stopBackgroundMusic(true);
  }

  // UPDATED: Get image - now searches through all cached images by filename
  getImage(filenameOrPath) {
    // Extract filename if a path was passed
    const filename = this.extractFilename(filenameOrPath);

    // Search through all cached images to find one with this filename
    for (const [fullPath, image] of this.images.entries()) {
      if (fullPath.includes(`/${filename}.png`)) {
        return image;
      }
    }

    // If not found, return null
    return null;
  }

  // UPDATED: Preload all assets for a location - now passes just filenames
  async preloadLocationAssets(locationData) {
    const promises = [];

    // Load background - just pass the background name
    promises.push(this.loadBackground(locationData.background));

    // Load character images - extract just the filename
    locationData.characters.forEach((charKey) => {
      const char = characters[charKey];
      if (char) {
        promises.push(this.loadImage(char.img));
      }
    });

    // Load item images - extract just the filename
    locationData.items.forEach((itemKey) => {
      const item = items[itemKey];
      if (item) {
        promises.push(this.loadImage(item.img));
      }
    });

    try {
      await Promise.all(promises);
      console.log(`📦 Location assets ready (cached)`);
    } catch (error) {
      console.warn("Some assets failed to load, but placeholders are ready");
    }
  }

  // NEW: Get audio manager for external access
  getAudioManager() {
    return this.audioManager;
  }

  // Get loading statistics
  getStats() {
    const audioStats = this.audioManager.getStats();
    return {
      loaded: this.loadedAssets.size,
      failed: this.failedAssets.size,
      total: this.loadedAssets.size + this.failedAssets.size,
      preloadProgress: this.preloadProgress,
      audio: audioStats,
    };
  }

  // Check if all critical assets are loaded
  isReady() {
    return this.preloadProgress.loaded >= this.preloadProgress.total * 0.8; // 80% loaded is "ready"
  }

  // NEW: Cleanup including audio
  destroy() {
    if (this.audioManager) {
      this.audioManager.destroy();
    }
    console.log("📦 AssetManager destroyed");
  }
}

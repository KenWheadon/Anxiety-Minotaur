// js/systems/AudioManager.js - Enhanced audio system for background music and sound effects

class AudioManager {
  constructor() {
    this.backgroundMusic = new Map();
    this.soundEffects = new Map();
    this.currentBackgroundTrack = null;
    this.backgroundVolume = 0.3; // Default background volume (30%)
    this.sfxVolume = 0.7; // Default sound effects volume (70%)
    this.masterVolume = 1.0; // Master volume control
    this.isMuted = false;
    this.isBackgroundMusicEnabled = true;
    this.isSfxEnabled = true;
    this.fadeOutTimer = null;
    this.loadedAssets = new Set();
    this.failedAssets = new Set();

    // Audio file definitions
    this.audioFiles = {
      // Background music for each level
      backgroundMusic: {
        level1: "music/level1_background.mp3",
        level2: "music/level2_background.mp3",
        level3: "music/level3_background.mp3",
      },
      // Sound effects
      soundEffects: {
        click: "effects/ui_click.mp3",
        achievement: "effects/achievement.mp3",
        discovery: "effects/discovery.mp3",
        chatOpen: "effects/chat_open.mp3",
        // Existing sound effects from your game
        characterInteract: "effects/character_interact.mp3",
        itemExamine: "effects/item_examine.mp3",
        locationChange: "effects/location_change.mp3",
        uiHover: "effects/ui_hover.mp3",
      },
    };

    this.setupAudioContext();
    console.log("🎵 Audio Manager initialized");
  }

  setupAudioContext() {
    // Create audio context for better control (optional, for advanced features)
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      console.log("🎵 Audio context created");
    } catch (error) {
      console.warn("🎵 Audio context not supported, using basic audio");
      this.audioContext = null;
    }
  }

  // Preload all audio assets
  async preloadAllAudio() {
    console.log("🎵 Preloading audio assets...");

    const promises = [];

    // Load background music
    Object.entries(this.audioFiles.backgroundMusic).forEach(([key, path]) => {
      promises.push(this.loadBackgroundMusic(key, path));
    });

    // Load sound effects
    Object.entries(this.audioFiles.soundEffects).forEach(([key, path]) => {
      promises.push(this.loadSoundEffect(key, path));
    });

    const results = await Promise.allSettled(promises);

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(
      `🎵 Audio preload complete: ${successful} successful, ${failed} failed`
    );
    return { successful, failed, total: results.length };
  }

  // Load background music track
  async loadBackgroundMusic(key, path) {
    try {
      const audio = new Audio(path);
      audio.loop = true; // Background music should loop
      audio.preload = "auto";
      audio.volume = this.backgroundVolume * this.masterVolume;

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Background music load timeout: ${path}`));
        }, 10000);

        audio.addEventListener("canplaythrough", () => {
          clearTimeout(timeout);
          console.log(`🎵 Loaded background music: ${key}`);
          this.backgroundMusic.set(key, audio);
          this.loadedAssets.add(path);
          resolve(audio);
        });

        audio.addEventListener("error", (e) => {
          clearTimeout(timeout);
          console.warn(`🎵 Failed to load background music: ${path}`, e);
          this.failedAssets.add(path);
          reject(e);
        });

        audio.load();
      });
    } catch (error) {
      console.warn(`🎵 Error loading background music ${key}:`, error);
      this.failedAssets.add(path);
      throw error;
    }
  }

  // Load sound effect
  async loadSoundEffect(key, path) {
    try {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.volume = this.sfxVolume * this.masterVolume;

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Sound effect load timeout: ${path}`));
        }, 5000);

        audio.addEventListener("canplaythrough", () => {
          clearTimeout(timeout);
          console.log(`🎵 Loaded sound effect: ${key}`);
          this.soundEffects.set(key, audio);
          this.loadedAssets.add(path);
          resolve(audio);
        });

        audio.addEventListener("error", (e) => {
          clearTimeout(timeout);
          console.warn(`🎵 Failed to load sound effect: ${path}`, e);
          this.failedAssets.add(path);
          // Don't reject for sound effects - game should continue without them
          resolve(null);
        });

        audio.load();
      });
    } catch (error) {
      console.warn(`🎵 Error loading sound effect ${key}:`, error);
      this.failedAssets.add(path);
      return null;
    }
  }

  // Play background music for a specific level
  playBackgroundMusic(levelKey, fadeIn = true) {
    if (!this.isBackgroundMusicEnabled || this.isMuted) {
      console.log(`🎵 Background music disabled or muted`);
      return;
    }

    const trackKey = `level${levelKey}`;
    const track = this.backgroundMusic.get(trackKey);

    if (!track) {
      console.warn(`🎵 Background music not found for level: ${levelKey}`);
      return;
    }

    // Stop current track if playing
    if (this.currentBackgroundTrack && this.currentBackgroundTrack !== track) {
      this.stopBackgroundMusic(true); // Fade out current track
    }

    // Don't restart if same track is already playing
    if (this.currentBackgroundTrack === track && !track.paused) {
      console.log(`🎵 Background music already playing for level ${levelKey}`);
      return;
    }

    this.currentBackgroundTrack = track;

    try {
      if (fadeIn) {
        track.volume = 0;
        track
          .play()
          .then(() => {
            this.fadeIn(track, this.backgroundVolume * this.masterVolume, 2000);
          })
          .catch((e) => {
            console.warn(`🎵 Failed to play background music:`, e);
          });
      } else {
        track.volume = this.backgroundVolume * this.masterVolume;
        track.play().catch((e) => {
          console.warn(`🎵 Failed to play background music:`, e);
        });
      }

      console.log(`🎵 Playing background music for level ${levelKey}`);
    } catch (error) {
      console.warn(`🎵 Error playing background music:`, error);
    }
  }

  // Stop background music
  stopBackgroundMusic(fadeOut = true) {
    if (!this.currentBackgroundTrack) return;

    if (fadeOut) {
      this.fadeOut(this.currentBackgroundTrack, 1000, () => {
        if (this.currentBackgroundTrack) {
          this.currentBackgroundTrack.pause();
          this.currentBackgroundTrack.currentTime = 0;
          this.currentBackgroundTrack = null;
        }
      });
    } else {
      this.currentBackgroundTrack.pause();
      this.currentBackgroundTrack.currentTime = 0;
      this.currentBackgroundTrack = null;
    }

    console.log("🎵 Background music stopped");
  }

  // Play sound effect
  playSoundEffect(effectKey, volume = 1.0) {
    if (!this.isSfxEnabled || this.isMuted) {
      return;
    }

    const effect = this.soundEffects.get(effectKey);
    if (!effect) {
      console.warn(`🎵 Sound effect not found: ${effectKey}`);
      return;
    }

    try {
      // Create a clone for overlapping sounds
      const effectClone = effect.cloneNode();
      effectClone.volume = Math.min(
        1.0,
        this.sfxVolume * volume * this.masterVolume
      );
      effectClone.currentTime = 0;

      effectClone.play().catch((e) => {
        console.warn(`🎵 Failed to play sound effect ${effectKey}:`, e);
      });

      // Clean up after playing
      effectClone.addEventListener("ended", () => {
        effectClone.remove();
      });

      console.log(
        `🎵 Playing sound effect: ${effectKey} (volume: ${effectClone.volume.toFixed(
          2
        )})`
      );
    } catch (error) {
      console.warn(`🎵 Error playing sound effect ${effectKey}:`, error);
    }
  }

  // Fade in audio
  fadeIn(audio, targetVolume, duration) {
    const startVolume = 0;
    const volumeStep = targetVolume / (duration / 50);
    let currentVolume = startVolume;

    const fadeInterval = setInterval(() => {
      currentVolume += volumeStep;
      if (currentVolume >= targetVolume) {
        currentVolume = targetVolume;
        clearInterval(fadeInterval);
      }
      audio.volume = Math.min(1.0, currentVolume);
    }, 50);
  }

  // Fade out audio
  fadeOut(audio, duration, callback = null) {
    const startVolume = audio.volume;
    const volumeStep = startVolume / (duration / 50);
    let currentVolume = startVolume;

    const fadeInterval = setInterval(() => {
      currentVolume -= volumeStep;
      if (currentVolume <= 0) {
        currentVolume = 0;
        clearInterval(fadeInterval);
        if (callback) callback();
      }
      audio.volume = Math.max(0, currentVolume);
    }, 50);
  }

  // Volume controls
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
    console.log(
      `🎵 Master volume set to: ${(this.masterVolume * 100).toFixed(0)}%`
    );
  }

  setBackgroundVolume(volume) {
    this.backgroundVolume = Math.max(0, Math.min(1, volume));
    if (this.currentBackgroundTrack) {
      this.currentBackgroundTrack.volume =
        this.backgroundVolume * this.masterVolume;
    }
    console.log(
      `🎵 Background volume set to: ${(this.backgroundVolume * 100).toFixed(
        0
      )}%`
    );
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    console.log(`🎵 SFX volume set to: ${(this.sfxVolume * 100).toFixed(0)}%`);
  }

  // Update all audio volumes
  updateAllVolumes() {
    // Update background music
    if (this.currentBackgroundTrack) {
      this.currentBackgroundTrack.volume =
        this.backgroundVolume * this.masterVolume;
    }

    // Update sound effects (they use volume on play, so this is for future reference)
    console.log(`🎵 All volumes updated`);
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      if (this.currentBackgroundTrack) {
        this.currentBackgroundTrack.volume = 0;
      }
    } else {
      this.updateAllVolumes();
    }

    console.log(`🎵 Audio ${this.isMuted ? "muted" : "unmuted"}`);
    return this.isMuted;
  }

  // Toggle background music
  toggleBackgroundMusic() {
    this.isBackgroundMusicEnabled = !this.isBackgroundMusicEnabled;

    if (!this.isBackgroundMusicEnabled && this.currentBackgroundTrack) {
      this.stopBackgroundMusic(true);
    }

    console.log(
      `🎵 Background music ${
        this.isBackgroundMusicEnabled ? "enabled" : "disabled"
      }`
    );
    return this.isBackgroundMusicEnabled;
  }

  // Toggle sound effects
  toggleSoundEffects() {
    this.isSfxEnabled = !this.isSfxEnabled;
    console.log(
      `🎵 Sound effects ${this.isSfxEnabled ? "enabled" : "disabled"}`
    );
    return this.isSfxEnabled;
  }

  // Resume audio context (required for some browsers)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume().then(() => {
        console.log("🎵 Audio context resumed");
      });
    }
  }

  // Get audio statistics
  getStats() {
    return {
      loadedAssets: this.loadedAssets.size,
      failedAssets: this.failedAssets.size,
      backgroundMusicTracks: this.backgroundMusic.size,
      soundEffects: this.soundEffects.size,
      currentlyPlaying: this.currentBackgroundTrack ? "yes" : "no",
      volumes: {
        master: this.masterVolume,
        background: this.backgroundVolume,
        sfx: this.sfxVolume,
      },
      settings: {
        isMuted: this.isMuted,
        backgroundMusicEnabled: this.isBackgroundMusicEnabled,
        sfxEnabled: this.isSfxEnabled,
      },
    };
  }

  // Save audio settings to localStorage
  saveSettings() {
    const settings = {
      masterVolume: this.masterVolume,
      backgroundVolume: this.backgroundVolume,
      sfxVolume: this.sfxVolume,
      isMuted: this.isMuted,
      isBackgroundMusicEnabled: this.isBackgroundMusicEnabled,
      isSfxEnabled: this.isSfxEnabled,
    };

    try {
      localStorage.setItem(
        "frog-police-audio-settings",
        JSON.stringify(settings)
      );
      console.log("🎵 Audio settings saved");
    } catch (error) {
      console.warn("🎵 Failed to save audio settings:", error);
    }
  }

  // Load audio settings from localStorage
  loadSettings() {
    try {
      const settings = localStorage.getItem("frog-police-audio-settings");
      if (settings) {
        const parsed = JSON.parse(settings);

        this.masterVolume = parsed.masterVolume ?? 1.0;
        this.backgroundVolume = parsed.backgroundVolume ?? 0.3;
        this.sfxVolume = parsed.sfxVolume ?? 0.7;
        this.isMuted = parsed.isMuted ?? false;
        this.isBackgroundMusicEnabled = parsed.isBackgroundMusicEnabled ?? true;
        this.isSfxEnabled = parsed.isSfxEnabled ?? true;

        this.updateAllVolumes();
        console.log("🎵 Audio settings loaded");
      }
    } catch (error) {
      console.warn("🎵 Failed to load audio settings:", error);
    }
  }

  // Cleanup
  destroy() {
    // Stop all audio
    this.stopBackgroundMusic(false);

    // Clear fade timers
    if (this.fadeOutTimer) {
      clearTimeout(this.fadeOutTimer);
    }

    // Save settings
    this.saveSettings();

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
    }

    console.log("🎵 Audio Manager destroyed");
  }
}

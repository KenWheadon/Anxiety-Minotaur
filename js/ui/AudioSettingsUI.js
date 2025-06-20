// js/ui/AudioSettingsUI.js - Audio control panel for players

class AudioSettingsUI {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.settingsPanel = null;
    this.settingsButton = null;
    this.isOpen = false;

    this.createAudioSettingsUI();
    this.createAudioSettingsButton();
    this.setupEventListeners();

    console.log("🎵 Audio Settings UI initialized");
  }

  createAudioSettingsButton() {
    // Create floating audio settings button
    this.settingsButton = document.createElement("button");
    this.settingsButton.className = "audio-settings-trigger";
    this.settingsButton.innerHTML = "🎵";
    this.settingsButton.title = "Audio Settings (ESC when not chatting)";

    // Position it near other UI buttons
    this.settingsButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3);
      background: rgba(0,0,0,0.7);
      color: white;
      font-size: 20px;
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    document.body.appendChild(this.settingsButton);

    // Add click listener
    this.settingsButton.addEventListener("click", () => {
      this.toggleSettingsPanel();
    });

    // Update button state based on audio settings
    this.updateButtonState();
  }

  createAudioSettingsUI() {
    this.settingsPanel = document.createElement("div");
    this.settingsPanel.className = "audio-settings-panel";
    this.settingsPanel.innerHTML = `
      <div class="audio-settings-content">
        <div class="audio-settings-header">
          <h2>🎵 Audio Settings</h2>
          <button class="close-audio-settings">×</button>
        </div>
        
        <div class="audio-settings-body">
          <!-- Master Volume -->
          <div class="audio-setting-group">
            <label for="master-volume">Master Volume</label>
            <div class="volume-control">
              <input type="range" id="master-volume" min="0" max="100" value="100">
              <span class="volume-value">100%</span>
            </div>
          </div>

          <!-- Background Music -->
          <div class="audio-setting-group">
            <label for="background-volume">Background Music</label>
            <div class="volume-control">
              <input type="range" id="background-volume" min="0" max="100" value="30">
              <span class="volume-value">30%</span>
              <button class="toggle-button" id="toggle-background" data-enabled="true">ON</button>
            </div>
          </div>

          <!-- Sound Effects -->
          <div class="audio-setting-group">
            <label for="sfx-volume">Sound Effects</label>
            <div class="volume-control">
              <input type="range" id="sfx-volume" min="0" max="100" value="70">
              <span class="volume-value">70%</span>
              <button class="toggle-button" id="toggle-sfx" data-enabled="true">ON</button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="audio-setting-group">
            <label>Quick Actions</label>
            <div class="quick-actions">
              <button class="audio-action-button" id="mute-all">🔇 Mute All</button>
              <button class="audio-action-button" id="test-sound">🔊 Test Sound</button>
            </div>
          </div>

          <!-- Audio Info -->
          <div class="audio-setting-group">
            <label>Audio Status</label>
            <div class="audio-status">
              <div class="status-item">
                <span class="status-label">Background Music:</span>
                <span class="status-value" id="bg-status">Loading...</span>
              </div>
              <div class="status-item">
                <span class="status-label">Sound Effects:</span>
                <span class="status-value" id="sfx-status">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // CSS styles are now in css/audio-settings.css
    document.body.appendChild(this.settingsPanel);
    this.hideSettingsPanel();
  }

  setupEventListeners() {
    // Close button
    this.settingsPanel
      .querySelector(".close-audio-settings")
      .addEventListener("click", () => {
        this.hideSettingsPanel();
      });

    // Click outside to close
    this.settingsPanel.addEventListener("click", (e) => {
      if (e.target === this.settingsPanel) {
        this.hideSettingsPanel();
      }
    });

    // Volume sliders
    const masterSlider = this.settingsPanel.querySelector("#master-volume");
    const backgroundSlider =
      this.settingsPanel.querySelector("#background-volume");
    const sfxSlider = this.settingsPanel.querySelector("#sfx-volume");

    masterSlider.addEventListener("input", (e) => {
      const value = parseInt(e.target.value) / 100;
      this.audioManager.setMasterVolume(value);
      this.updateVolumeDisplay(e.target, value);
    });

    backgroundSlider.addEventListener("input", (e) => {
      const value = parseInt(e.target.value) / 100;
      this.audioManager.setBackgroundVolume(value);
      this.updateVolumeDisplay(e.target, value);
    });

    sfxSlider.addEventListener("input", (e) => {
      const value = parseInt(e.target.value) / 100;
      this.audioManager.setSfxVolume(value);
      this.updateVolumeDisplay(e.target, value);
    });

    // Toggle buttons
    this.settingsPanel
      .querySelector("#toggle-background")
      .addEventListener("click", (e) => {
        const enabled = this.audioManager.toggleBackgroundMusic();
        this.updateToggleButton(e.target, enabled);
      });

    this.settingsPanel
      .querySelector("#toggle-sfx")
      .addEventListener("click", (e) => {
        const enabled = this.audioManager.toggleSoundEffects();
        this.updateToggleButton(e.target, enabled);
      });

    // Quick action buttons
    this.settingsPanel
      .querySelector("#mute-all")
      .addEventListener("click", () => {
        const isMuted = this.audioManager.toggleMute();
        this.updateButtonState();
        this.updateStatus();

        // Visual feedback
        const button = this.settingsPanel.querySelector("#mute-all");
        button.textContent = isMuted ? "🔊 Unmute All" : "🔇 Mute All";
      });

    this.settingsPanel
      .querySelector("#test-sound")
      .addEventListener("click", () => {
        this.audioManager.playSoundEffect("achievement", 1.0);
      });

    // Keyboard shortcuts - ONLY non-letter keys to avoid chat conflicts
    document.addEventListener("keydown", (e) => {
      // Only trigger when NOT in conversation mode to avoid chat conflicts
      const isConversationActive =
        document.querySelector(".conversation-panel")?.style.display === "flex";
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (!isConversationActive && !isInputFocused) {
        // Use Escape key for audio settings (safe non-letter key)
        if (e.key === "Escape") {
          e.preventDefault();
          this.toggleSettingsPanel();
        }
      }
    });

    // Update status periodically
    setInterval(() => {
      if (this.isOpen) {
        this.updateStatus();
      }
    }, 1000);
  }

  toggleSettingsPanel() {
    if (this.isOpen) {
      this.hideSettingsPanel();
    } else {
      this.showSettingsPanel();
    }
  }

  showSettingsPanel() {
    this.isOpen = true;
    this.settingsPanel.classList.add("visible");
    this.updateAllControls();
    this.updateStatus();

    // Resume audio context if needed
    this.audioManager.resumeAudioContext();

    // Animate in
    const content = this.settingsPanel.querySelector(".audio-settings-content");
    gsap.fromTo(
      content,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
    );
  }

  hideSettingsPanel() {
    this.isOpen = false;

    const content = this.settingsPanel.querySelector(".audio-settings-content");
    gsap.to(content, {
      opacity: 0,
      scale: 0.8,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        this.settingsPanel.classList.remove("visible");
      },
    });

    // Save settings when closing
    this.audioManager.saveSettings();
  }

  updateAllControls() {
    const stats = this.audioManager.getStats();

    // Update sliders
    this.settingsPanel.querySelector("#master-volume").value = Math.round(
      stats.volumes.master * 100
    );
    this.settingsPanel.querySelector("#background-volume").value = Math.round(
      stats.volumes.background * 100
    );
    this.settingsPanel.querySelector("#sfx-volume").value = Math.round(
      stats.volumes.sfx * 100
    );

    // Update volume displays
    this.updateVolumeDisplay(
      this.settingsPanel.querySelector("#master-volume"),
      stats.volumes.master
    );
    this.updateVolumeDisplay(
      this.settingsPanel.querySelector("#background-volume"),
      stats.volumes.background
    );
    this.updateVolumeDisplay(
      this.settingsPanel.querySelector("#sfx-volume"),
      stats.volumes.sfx
    );

    // Update toggle buttons
    this.updateToggleButton(
      this.settingsPanel.querySelector("#toggle-background"),
      stats.settings.backgroundMusicEnabled
    );
    this.updateToggleButton(
      this.settingsPanel.querySelector("#toggle-sfx"),
      stats.settings.sfxEnabled
    );

    // Update mute button
    const muteButton = this.settingsPanel.querySelector("#mute-all");
    muteButton.textContent = stats.settings.isMuted
      ? "🔊 Unmute All"
      : "🔇 Mute All";
  }

  updateVolumeDisplay(slider, value) {
    const volumeValue = slider.parentElement.querySelector(".volume-value");
    volumeValue.textContent = Math.round(value * 100) + "%";
  }

  updateToggleButton(button, enabled) {
    button.textContent = enabled ? "ON" : "OFF";
    button.setAttribute("data-enabled", enabled.toString());
  }

  updateButtonState() {
    const stats = this.audioManager.getStats();

    if (stats.settings.isMuted) {
      this.settingsButton.classList.add("muted");
      this.settingsButton.innerHTML = "🔇";
    } else {
      this.settingsButton.classList.remove("muted");
      this.settingsButton.innerHTML = "🎵";
    }
  }

  updateStatus() {
    const stats = this.audioManager.getStats();

    const bgStatus = this.settingsPanel.querySelector("#bg-status");
    const sfxStatus = this.settingsPanel.querySelector("#sfx-status");

    // Background music status
    if (stats.settings.isMuted) {
      bgStatus.textContent = "Muted";
      bgStatus.style.color = "#e74c3c";
    } else if (!stats.settings.backgroundMusicEnabled) {
      bgStatus.textContent = "Disabled";
      bgStatus.style.color = "#f39c12";
    } else if (stats.currentlyPlaying === "yes") {
      bgStatus.textContent = "Playing";
      bgStatus.style.color = "#27ae60";
    } else {
      bgStatus.textContent = "Ready";
      bgStatus.style.color = "#3498db";
    }

    // Sound effects status
    if (stats.settings.isMuted) {
      sfxStatus.textContent = "Muted";
      sfxStatus.style.color = "#e74c3c";
    } else if (!stats.settings.sfxEnabled) {
      sfxStatus.textContent = "Disabled";
      sfxStatus.style.color = "#f39c12";
    } else {
      sfxStatus.textContent = `Ready (${stats.soundEffects} loaded)`;
      sfxStatus.style.color = "#27ae60";
    }
  }

  // Get current settings for external access
  getSettings() {
    return this.audioManager.getStats();
  }

  destroy() {
    if (this.settingsPanel && this.settingsPanel.parentNode) {
      this.settingsPanel.parentNode.removeChild(this.settingsPanel);
    }

    if (this.settingsButton && this.settingsButton.parentNode) {
      this.settingsButton.parentNode.removeChild(this.settingsButton);
    }

    console.log("🎵 Audio Settings UI destroyed");
  }
}

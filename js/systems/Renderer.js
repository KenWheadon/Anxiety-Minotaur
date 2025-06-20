class Renderer {
  constructor(assetManager = null) {
    this.container = document.getElementById("game-container");
    this.assetManager = assetManager || new AssetManager();
    this.currentLocationData = null;

    // Initialize responsive positioning system
    this.responsivePositioning = new ResponsivePositioning(1920, 1080);

    if (!this.container) {
      console.error("Game container not found!");
      return;
    }

    this.setupContainer();
  }

  setupContainer() {
    // The ResponsivePositioning class now handles container setup
    // Just ensure we have the right reference to the scaled container
    this.scaledContainer = this.responsivePositioning.getScaledContainer();
  }

  async renderLocation(locationData) {
    console.log(`🎨 Rendering location: ${locationData.description}`);

    this.currentLocationData = locationData;

    // Clear current content
    this.clearScreen();

    // Preload assets for this location
    await this.assetManager.preloadLocationAssets(locationData);

    // Set background
    await this.setBackground(locationData.background);

    // Render interactive elements
    this.renderCharacters(locationData.characters);
    this.renderItems(locationData.items);

    // Add location entrance animation
    this.playLocationTransition();
  }

  clearScreen() {
    // Remove all interactive elements but keep background
    const interactables =
      this.scaledContainer.querySelectorAll(".interactable");
    interactables.forEach((element) => element.remove());
  }

  async setBackground(backgroundName) {
    try {
      const backgroundImg = await this.assetManager.loadBackground(
        backgroundName
      );

      if (backgroundImg.src.includes("data:")) {
        // It's a canvas-generated placeholder
        this.scaledContainer.style.backgroundImage = `url(${backgroundImg.src})`;
      } else {
        // It's a real image
        this.scaledContainer.style.backgroundImage = `url(${backgroundImg.src})`;
      }

      this.scaledContainer.style.backgroundSize = "cover";
      this.scaledContainer.style.backgroundPosition = "center";
      this.scaledContainer.style.backgroundRepeat = "no-repeat";
    } catch (error) {
      console.warn("Failed to set background, using fallback color");
      this.scaledContainer.style.background =
        "linear-gradient(to bottom, #87CEEB, #228B22)";
    }
  }

  async renderCharacters(characterKeys) {
    const promises = characterKeys.map(async (key) => {
      const char = characters[key];
      if (char) {
        return await this.createInteractable("character", key, char);
      }
    });

    await Promise.all(promises);
  }

  async renderItems(itemKeys) {
    const promises = itemKeys.map(async (key) => {
      const item = items[key];
      if (item) {
        return await this.createInteractable("item", key, item);
      }
    });

    await Promise.all(promises);
  }

  async createInteractable(type, key, data) {
    const element = document.createElement("div");
    element.className = `interactable ${type}`;
    element.dataset.type = type;
    element.dataset.key = key;
    element.title = data.description;

    // Load and set image first to get dimensions
    const imagePath =
      type === "character" ? `characters/${data.img}` : `items/${data.img}`;
    const image = await this.assetManager.loadImage(imagePath, type);

    // Get actual image dimensions (fallback to 64 if not available)
    let imageWidth = 64;
    let imageHeight = 64;

    if (image && !image.src.includes("data:")) {
      // Real image - get natural dimensions
      imageWidth = image.naturalWidth || image.width || 64;
      imageHeight = image.naturalHeight || image.height || 64;
    } else if (image && image.src.includes("data:")) {
      // Canvas placeholder - use canvas dimensions
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imageWidth;
      canvas.height = imageHeight;
      // Placeholder images are created as 64x64 in AssetManager
      imageWidth = 64;
      imageHeight = 64;
    }

    console.log(
      `📐 ${type} ${key}: Using dimensions ${imageWidth}x${imageHeight}`
    );

    // Apply responsive positioning with actual dimensions
    this.responsivePositioning.applyResponsivePositionWithDimensions(
      element,
      data.X,
      data.Y,
      data.scale || 1,
      imageWidth,
      imageHeight
    );

    element.style.cursor = "pointer";
    element.style.transition = "transform 0.2s ease";

    // Set the background image
    if (image.src.includes("data:")) {
      // Canvas-generated placeholder
      element.style.backgroundImage = `url(${image.src})`;
    } else {
      // Real image
      element.style.backgroundImage = `url(${image.src})`;
    }

    element.style.backgroundSize = "contain";
    element.style.backgroundRepeat = "no-repeat";
    element.style.backgroundPosition = "center";

    // Add hover effects
    this.addHoverEffects(element);

    // Add to scaled container with entrance animation
    this.scaledContainer.appendChild(element);
    this.animateElementEntrance(element);

    return element;
  }

  addHoverEffects(element) {
    element.addEventListener("mouseenter", () => {
      gsap.to(element, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out",
      });

      element.style.filter = "brightness(1.2) saturate(1.1)";
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });

      element.style.filter = "none";
    });

    // Updated click animation to work with responsive positioning
    element.addEventListener("mousedown", () => {
      gsap.to(element, {
        scale: 0.95,
        duration: 0.1,
      });
    });

    element.addEventListener("mouseup", () => {
      gsap.to(element, {
        scale: 1.1,
        duration: 0.1,
      });
    });
  }

  animateElementEntrance(element) {
    // Start invisible and small
    gsap.set(element, {
      opacity: 0,
      scale: 0.5,
    });

    // Animate in with bounce
    gsap.to(element, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      delay: Math.random() * 0.3, // Stagger entrances
    });
  }

  playLocationTransition() {
    // Fade in the entire scaled container
    gsap.fromTo(
      this.scaledContainer,
      {
        opacity: 0,
        filter: "blur(5px)",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power2.out",
      }
    );
  }

  // Updated showFloatingText to work with responsive positioning
  showFloatingText(text, x, y, duration = 3000) {
    const textElement = document.createElement("div");
    textElement.className = "floating-text";
    textElement.textContent = text;

    // Convert screen coordinates to design coordinates if needed
    const designCoords = this.responsivePositioning.screenToDesign(x, y);

    textElement.style.position = "absolute";
    textElement.style.left = designCoords.x + "px";
    textElement.style.top = designCoords.y + "px";
    textElement.style.color = "white";
    textElement.style.backgroundColor = "rgba(0,0,0,0.8)";
    textElement.style.padding = "8px 12px";
    textElement.style.borderRadius = "8px";
    textElement.style.fontSize = "14px";
    textElement.style.pointerEvents = duration === 0 ? "auto" : "none";
    textElement.style.zIndex = "1000";
    textElement.style.maxWidth = "200px";
    textElement.style.wordWrap = "break-word";
    textElement.style.cursor = duration === 0 ? "pointer" : "default";
    textElement.style.transform = "translate(-50%, -50%)";

    // Add close hint for permanent tooltips
    if (duration === 0) {
      const closeHint = document.createElement("div");
      closeHint.textContent = "Click to close";
      closeHint.style.fontSize = "10px";
      closeHint.style.opacity = "0.7";
      closeHint.style.marginTop = "4px";
      closeHint.style.textAlign = "center";
      closeHint.style.fontStyle = "italic";
      textElement.appendChild(closeHint);
    }

    this.scaledContainer.appendChild(textElement);

    // Position adjustment if off-screen (using design coordinates)
    const rect = textElement.getBoundingClientRect();
    const containerRect = this.scaledContainer.getBoundingClientRect();

    if (rect.right > containerRect.right) {
      textElement.style.left = designCoords.x - rect.width + "px";
    }
    if (rect.bottom > containerRect.bottom) {
      textElement.style.top = designCoords.y - rect.height - 10 + "px";
    }

    // Animate in
    gsap.fromTo(
      textElement,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      }
    );

    // Remove after duration only if duration > 0
    if (duration > 0) {
      setTimeout(() => {
        gsap.to(textElement, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            if (textElement.parentNode) {
              textElement.parentNode.removeChild(textElement);
            }
          },
        });
      }, duration);
    }

    return textElement;
  }

  // Updated highlight element to work with responsive positioning
  highlightElement(key, type) {
    const element = this.scaledContainer.querySelector(
      `[data-key="${key}"][data-type="${type}"]`
    );
    if (element) {
      // Add pulsing highlight
      gsap.to(element, {
        scale: 1.2,
        duration: 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 3,
      });

      // Add glow effect
      element.style.filter = "drop-shadow(0 0 20px #FFD700)";
      setTimeout(() => {
        element.style.filter = "none";
      }, 2000);
    }
  }

  // Updated getElementPosition to return screen coordinates
  getElementPosition(key, type) {
    const element = this.scaledContainer.querySelector(
      `[data-key="${key}"][data-type="${type}"]`
    );
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    return null;
  }

  // Get responsive positioning system for external access
  getResponsivePositioning() {
    return this.responsivePositioning;
  }

  update() {
    // Called each frame - can be used for animations, particle effects, etc.
    // Currently empty but ready for expansion
  }

  // Cleanup
  destroy() {
    if (this.responsivePositioning) {
      this.responsivePositioning.destroy();
    }
  }
}

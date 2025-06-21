// js/utils/Config.js - Environment-aware configuration for Anxiety Minotaur
const CONFIG = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,

  // Detect if we're in development (localhost) or production
  IS_DEVELOPMENT:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("localhost"),

  // Detect if we're running on itch.io
  get IS_ITCH_IO() {
    return (
      window.location.hostname.includes(".itch.io") ||
      window.location.hostname.includes("itch.zone") ||
      window.location.hostname.includes("ssl.hwcdn.net")
    );
  },

  // Game Level Configuration - Start at Level 1 (Home)
  DEFAULT_LEVEL: 2,

  // Get the starting location based on the default level
  get DEFAULT_LOCATION() {
    return LEVEL2_FOREST;

    // if (this.DEFAULT_LEVEL === 1) {
    //   return LEVEL1_HOUSE;
    // } else if (this.DEFAULT_LEVEL === 2) {
    //   return LEVEL2_OUTSIDELAB;
    // } else if (this.DEFAULT_LEVEL === 3) {
    //   return LEVEL3_BG;
    // } else {
    //   return LEVEL1_HOUSE;
    // }
  },

  // AI Configuration - Enhanced proxy detection
  get AI_API_URL() {
    if (this.IS_DEVELOPMENT) {
      // In development, you can choose to use proxy or direct
      // Use direct if you have local config, proxy if you want to test proxy
      const useProxy = false; // Set to true to test proxy in development
      if (useProxy) {
        return this.PROXY_URL;
      } else {
        return "https://openrouter.ai/api/v1/chat/completions";
      }
    } else {
      // In production (including itch.io), always use proxy
      return this.PROXY_URL;
    }
  },

  // Proxy URL - Update this with your actual Vercel deployment URL
  get PROXY_URL() {
    // Replace 'your-vercel-app' with your actual Vercel app name
    return "https://minotaur-labyrinth.vercel.app/api/chat";
  },

  // API Key - only used in development for direct calls
  get OPENROUTER_API_KEY() {
    if (this.IS_DEVELOPMENT) {
      // Check if local config has been loaded
      if (
        typeof window !== "undefined" &&
        window.LOCAL_CONFIG &&
        window.LOCAL_CONFIG.OPENROUTER_API_KEY
      ) {
        return window.LOCAL_CONFIG.OPENROUTER_API_KEY;
      } else {
        return null;
      }
    } else {
      // In production, the API key is handled server-side by the proxy
      return null;
    }
  },

  // Site configuration
  get SITE_URL() {
    if (this.IS_DEVELOPMENT) {
      return "http://localhost:3000";
    } else if (this.IS_ITCH_IO) {
      return window.location.origin; // Use current itch.io URL
    } else {
      return window.location.origin; // Use current domain
    }
  },

  SITE_TITLE: "Anxiety Minotaur",
  MODEL: "deepseek/deepseek-r1-0528-qwen3-8b:free", // Free model - change as needed
  MAX_TOKENS: 10000, // Maximum tokens for AI responses

  // Game Configuration
  SAVE_KEY: "minotaur-labyrinth-save",
  ANIMATION_SPEED: 0.3,
  DEBUG: true, // Set to false for production

  // Social Energy Configuration (Level 2 only)
  STARTING_SOCIAL_ENERGY: 10,
  MAX_SOCIAL_ENERGY: 10,
  DUCK_ENERGY_RESTORE: 2,
  CONVERSATION_ENERGY_COST: 1,

  // Helper method to check if we're using the proxy
  get IS_USING_PROXY() {
    return this.AI_API_URL.includes("/api/chat");
  },

  // Helper method to check if local config is available (for development)
  isLocalConfigReady() {
    return (
      !this.IS_DEVELOPMENT ||
      (typeof window !== "undefined" &&
        window.LOCAL_CONFIG &&
        window.LOCAL_CONFIG.OPENROUTER_API_KEY)
    );
  },

  // Helper method to wait for local config to load
  async waitForLocalConfig(timeoutMs = 5000) {
    if (!this.IS_DEVELOPMENT) return true;

    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (window.LOCAL_CONFIG && window.LOCAL_CONFIG.OPENROUTER_API_KEY) {
        console.log("✅ Local config loaded successfully");
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.warn("⚠️ LOCAL_CONFIG not found or missing API key after timeout.");
    console.warn(
      "⚠️ Create js/utils/local.config.js with your OPENROUTER_API_KEY."
    );
    console.warn("⚠️ Will use proxy for API calls.");
    return false;
  },

  // Helper method to log current environment - enhanced
  async logEnvironment() {
    console.log("🌍 Environment Info:");
    console.log("  - Development:", this.IS_DEVELOPMENT);
    console.log("  - Itch.io:", this.IS_ITCH_IO);
    console.log("  - Default Level:", this.DEFAULT_LEVEL);
    console.log("  - Default Location:", this.DEFAULT_LOCATION);
    console.log("  - API URL:", this.AI_API_URL);
    console.log("  - Using Proxy:", this.IS_USING_PROXY);
    console.log("  - Site URL:", this.SITE_URL);
    console.log("  - Game Title:", this.SITE_TITLE);

    if (this.IS_DEVELOPMENT) {
      // Wait for local config to load before logging
      const configReady = await this.waitForLocalConfig();
      console.log("  - Local Config Loaded:", configReady);
      console.log("  - Has API Key:", !!this.OPENROUTER_API_KEY);
    } else {
      console.log("  - API Key:", "Handled by proxy");
    }

    // Show what will happen with AI requests
    if (this.IS_USING_PROXY) {
      console.log("🔗 API requests will go through proxy at:", this.PROXY_URL);
    } else {
      console.log("🔗 API requests will go directly to OpenRouter");
    }
  },
};

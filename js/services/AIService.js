class AIService {
  constructor() {
    this.apiUrl = CONFIG.AI_API_URL;
    this.apiKey = null;
    this.isAvailable = false;
    this.isInitialized = false;
    this.fallbackResponses = new Map();
    this.requestQueue = [];
    this.isProcessingQueue = false;

    this.setupFallbackResponses();

    console.log("🤖 AI Service created (will initialize when first used)");
  }

  // Initialize the service when first needed
  async initialize() {
    if (this.isInitialized) return;

    console.log("🤖 Initializing AI Service...");
    console.log("🔗 API URL:", this.apiUrl);
    console.log("🚀 Using Proxy:", CONFIG.IS_USING_PROXY);

    // Wait for local config if in development and not using proxy
    if (CONFIG.IS_DEVELOPMENT && !CONFIG.IS_USING_PROXY) {
      await CONFIG.waitForLocalConfig(2000);
    }

    await this.checkServiceAvailability();
    this.isInitialized = true;

    console.log("🤖 AI Service initialization complete");
  }

  setupFallbackResponses() {
    // Generic fallback responses by character personality type
    this.fallbackResponses.set("shy", [
      "Oh... um... hello there. I don't really know what to say...",
      "I'm not very good at talking to people... sorry.",
      "Maybe we could just... sit quietly together?",
      "I hope I'm not bothering you...",
      "Sometimes I wish I could be braver...",
    ]);

    this.fallbackResponses.set("wise", [
      "In my many years, I have learned that patience is a virtue.",
      "Every season brings change, and with it, new understanding.",
      "Sometimes the most profound truths are found in silence.",
    ]);

    this.fallbackResponses.set("cheerful", [
      "Oh how wonderful to see you! What a beautiful day!",
      "There's always something exciting happening around here!",
      "You simply must tell me about your adventures!",
    ]);

    this.fallbackResponses.set("mysterious", [
      "Some secrets are meant to be discovered slowly...",
      "Perhaps you will understand in time...",
      "Listen carefully to what the wind whispers...",
    ]);

    // Default responses for unknown personalities
    this.fallbackResponses.set("default", [
      "Hello there! Nice to meet you.",
      "Feel free to look around and explore.",
      "Is there anything you'd like to know?",
    ]);
  }

  async checkServiceAvailability() {
    if (CONFIG.IS_USING_PROXY) {
      // When using proxy, we assume it's available (proxy handles API key)
      this.isAvailable = true;
      console.log("🤖 AI Service using proxy - assumed available");
      return;
    }

    // Direct API calls - check for API key
    this.apiKey = CONFIG.OPENROUTER_API_KEY;

    if (CONFIG.IS_DEVELOPMENT) {
      if (!this.apiKey || !this.apiUrl) {
        if (!this.apiKey) {
          console.warn(
            "🤖 No API key found in local config - using fallback responses"
          );
          console.log(
            "🤖 To enable AI responses: add OPENROUTER_API_KEY to js/utils/local.config.js"
          );
        }
        this.isAvailable = false;
        return;
      }
      this.isAvailable = true;
      console.log(
        "🤖 AI Service configured for development with direct API calls"
      );
    } else {
      // In production without proxy (shouldn't happen with current config)
      this.isAvailable = false;
      console.warn("🤖 Production without proxy - this shouldn't happen");
    }

    console.log("🤖 Service available:", this.isAvailable);
  }

  async generateResponse(characterKey, message, conversationHistory = []) {
    // Initialize on first use
    if (!this.isInitialized) {
      await this.initialize();
    }

    const character = characters[characterKey];
    if (!character) {
      return this.getFallbackResponse("default");
    }

    console.log(`🤖 Generating response for ${characterKey}: "${message}"`);

    // Add to queue and process
    return new Promise((resolve) => {
      this.requestQueue.push({
        characterKey,
        character,
        message,
        conversationHistory,
        resolve,
      });

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();

      try {
        let response;

        if (this.isAvailable) {
          console.log(`🤖 Making API request for ${request.characterKey}`);
          response = await this.makeAPIRequest(
            request.characterKey,
            request.message,
            request.character.prompt,
            request.conversationHistory
          );
          console.log(`🤖 API response received: "${response}"`);
        } else {
          console.log(`🤖 Using fallback response for ${request.characterKey}`);
          response = this.getFallbackResponse(
            request.character,
            request.message
          );
        }

        request.resolve(response);

        // Rate limiting - wait between requests
        await this.delay(500);
      } catch (error) {
        console.warn(
          `🤖 AI request failed for ${request.characterKey}:`,
          error
        );
        const fallback = this.getFallbackResponse(
          request.character,
          request.message
        );
        console.log(`🤖 Using fallback response: "${fallback}"`);
        request.resolve(fallback);
      }
    }

    this.isProcessingQueue = false;
  }

  async makeAPIRequest(
    characterKey,
    message,
    prompt,
    conversationHistory = []
  ) {
    const messages = [
      {
        role: "system",
        content: `${prompt}\n\nYou are in a frog police gang exploration game. Keep responses short (1-3 sentences) and in character. If the player asks about secrets or hidden things, be mysterious but give subtle hints.`,
      },
    ];

    // Add recent conversation history
    const recentHistory = conversationHistory.slice(-6); // Last 6 exchanges
    recentHistory.forEach((exchange) => {
      messages.push(
        { role: "user", content: exchange.player },
        { role: "assistant", content: exchange.character }
      );
    });

    // Add current message
    messages.push({ role: "user", content: message });

    const requestBody = {
      model: CONFIG.MODEL,
      messages: messages,
      max_tokens: CONFIG.MAX_TOKENS,
      temperature: 0.8,
      top_p: 0.9,
    };

    console.log("🤖 API Request:", {
      url: this.apiUrl,
      model: CONFIG.MODEL,
      messageCount: messages.length,
      usingProxy: CONFIG.IS_USING_PROXY,
      isProduction: !CONFIG.IS_DEVELOPMENT,
    });

    // Different request headers based on proxy usage
    const headers = {
      "Content-Type": "application/json",
    };

    // Only add auth header for direct API calls (not proxy)
    if (!CONFIG.IS_USING_PROXY && CONFIG.IS_DEVELOPMENT && this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
      headers["HTTP-Referer"] = CONFIG.SITE_URL;
      headers["X-Title"] = CONFIG.SITE_TITLE;
    }
    // For proxy calls, the proxy handles authentication

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🤖 API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        usingProxy: CONFIG.IS_USING_PROXY,
      });
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    // Enhanced logging for debugging
    console.log("🤖 API Response Data:", {
      hasChoices: !!data.choices,
      choiceCount: data.choices?.length,
      model: data.model,
      usage: data.usage,
    });

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("🤖 Invalid API response format:", data);
      throw new Error("Invalid API response format");
    }
  }

  getFallbackResponse(character, message = "") {
    // Try to match character personality to fallback type
    let personalityType = "default";

    if (character && character.prompt) {
      const prompt = character.prompt.toLowerCase();
      if (prompt.includes("shy") || prompt.includes("bashful")) {
        personalityType = "shy";
      } else if (
        prompt.includes("wise") ||
        prompt.includes("ancient") ||
        prompt.includes("old")
      ) {
        personalityType = "wise";
      } else if (
        prompt.includes("cheerful") ||
        prompt.includes("excited") ||
        prompt.includes("happy")
      ) {
        personalityType = "cheerful";
      } else if (
        prompt.includes("mysterious") ||
        prompt.includes("secret") ||
        prompt.includes("enigmatic")
      ) {
        personalityType = "mysterious";
      }
    }

    const responses = this.fallbackResponses.get(personalityType);

    // Simple context-aware response selection
    let selectedResponse;
    if (
      message.toLowerCase().includes("secret") ||
      message.toLowerCase().includes("hidden")
    ) {
      const mysteriousResponses = this.fallbackResponses.get("mysterious");
      selectedResponse =
        mysteriousResponses[
          Math.floor(Math.random() * mysteriousResponses.length)
        ];
    } else if (
      message.toLowerCase().includes("hello") ||
      message.toLowerCase().includes("hi")
    ) {
      selectedResponse = responses[0]; // Use first response for greetings
    } else {
      selectedResponse =
        responses[Math.floor(Math.random() * responses.length)];
    }

    return selectedResponse;
  }

  // Utility methods
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setApiKey(key) {
    this.apiKey = key;
    this.checkServiceAvailability();
  }

  setApiUrl(url) {
    this.apiUrl = url;
    this.checkServiceAvailability();
  }

  getStats() {
    return {
      isAvailable: this.isAvailable,
      isInitialized: this.isInitialized,
      queueLength: this.requestQueue.length,
      fallbackResponseCount: Array.from(this.fallbackResponses.values()).reduce(
        (total, responses) => total + responses.length,
        0
      ),
      environment: CONFIG.IS_DEVELOPMENT ? "development" : "production",
      usingProxy: CONFIG.IS_USING_PROXY,
      apiUrl: this.apiUrl,
      hasApiKey: !!this.apiKey,
    };
  }
}

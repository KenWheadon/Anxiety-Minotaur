class ConversationManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.aiService = new AIService();
    this.currentCharacter = null;
    this.isConversationActive = false;
    this.conversationPanel = null;
    this.messageHistory = [];
    this.isWaitingForResponse = false;
    this.isClosing = false;

    this.createConversationUI();
    this.setupEventListeners();

    console.log("💬 Conversation manager initialized (Minotaur's Labyrinth)");
  }

  createConversationUI() {
    // Create conversation panel (same as original)
    this.conversationPanel = document.createElement("div");
    this.conversationPanel.className = "conversation-panel";
    this.conversationPanel.innerHTML = `
            <div class="conversation-header">
                <div class="character-info">
                    <div class="character-avatar"></div>
                    <div class="character-details">
                        <div class="character-name"></div>
                        <div class="character-description"></div>
                    </div>
                </div>
                <button class="close-conversation">×</button>
            </div>
            <div class="conversation-messages"></div>
            <div class="conversation-input-area">
                <input type="text" class="conversation-input" placeholder="Type your message...">
                <button class="send-button">Send</button>
            </div>
            <div class="conversation-footer">
                <div class="typing-indicator">
                    <span class="typing-dots">
                        <span></span><span></span><span></span>
                    </span>
                    <span class="typing-text">Character is thinking...</span>
                </div>
                <div class="energy-warning" style="display: none;">
                    <span class="energy-text">💔 Too drained to talk! Chat with duck to recharge.</span>
                </div>
            </div>
        `;

    document.body.appendChild(this.conversationPanel);
    this.hideConversation();
  }

  setupEventListeners() {
    // Close button
    this.conversationPanel
      .querySelector(".close-conversation")
      .addEventListener("click", () => {
        this.endConversation();
      });

    // Send button
    this.conversationPanel
      .querySelector(".send-button")
      .addEventListener("click", () => {
        this.sendMessage();
      });

    // Enter key in input
    this.conversationPanel
      .querySelector(".conversation-input")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

    // Stop propagation on conversation panel clicks
    this.conversationPanel.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Listen for location changes to close conversations
    GameEvents.on(GAME_EVENTS.LOCATION_CHANGED, () => {
      if (this.isConversationActive) {
        console.log("💬 Closing conversation due to location change");
        this.endConversation();
      }
    });
  }

  async startConversation(characterKey, character) {
    console.log(
      `💬 START CONVERSATION - Current: ${this.currentCharacter}, New: ${characterKey}, Active: ${this.isConversationActive}, Closing: ${this.isClosing}`
    );

    // NEW: Check social energy before starting (Level 2 only, non-duck NPCs)
    if (this.shouldCheckSocialEnergy(character)) {
      if (this.gameEngine.gameState.socialEnergy <= 0) {
        this.showEnergyWarning();
        return;
      }
    }

    // If clicking the same character while conversation is active, do nothing
    if (
      this.isConversationActive &&
      this.currentCharacter === characterKey &&
      !this.isClosing
    ) {
      console.log(`💬 Already talking to ${characterKey}, ignoring click`);
      return;
    }

    // If currently closing a conversation, wait for it to complete
    if (this.isClosing) {
      console.log(`💬 Currently closing conversation, waiting...`);
      await this.waitForClose();
    }

    // If a different conversation is active, end it properly first
    if (this.isConversationActive && this.currentCharacter !== characterKey) {
      console.log(
        `💬 Switching conversation from ${this.currentCharacter} to ${characterKey}`
      );
      await this.endConversationAndWait();
    }

    // Double-check we're not in a closing state after waiting
    if (this.isClosing) {
      await this.waitForClose();
    }

    // NEW: Deduct social energy AFTER confirming conversation will start
    if (this.shouldCheckSocialEnergy(character)) {
      this.gameEngine.gameState.socialEnergy--;
      console.log(
        `💔 Social energy: ${this.gameEngine.gameState.socialEnergy}/${CONFIG.MAX_SOCIAL_ENERGY}`
      );
    }

    this.currentCharacter = characterKey;
    this.isConversationActive = true;
    this.messageHistory = [];

    console.log(`💬 Setting up new conversation with ${characterKey}`);

    // Update UI
    this.updateCharacterInfo(character);
    this.clearMessages();
    this.showConversation();

    // Disable world interactions
    this.gameEngine.interactionHandler.setInteractionsEnabled(false);

    // Get conversation history
    const history =
      this.gameEngine.gameState.getConversationHistory(characterKey);
    console.log(
      `💬 Found ${history.length} previous messages with ${characterKey}`
    );

    // Generate greeting
    const greeting = await this.generateGreeting(character, history);
    console.log(`💬 Generated greeting: "${greeting}"`);
    this.addMessage("character", greeting);

    // Focus input
    this.conversationPanel.querySelector(".conversation-input").focus();

    // Emit event
    GameEvents.emit(GAME_EVENTS.CHARACTER_INTERACTION, {
      characterKey,
      character,
    });

    console.log(`💬 Conversation with ${characterKey} fully initialized`);
  }

  // NEW: Check if we should deduct social energy for this conversation
  shouldCheckSocialEnergy(character) {
    // Only in Level 2 and for non-duck characters
    return this.gameEngine.gameState.currentLevel === 2 && !character.isDuck;
  }

  // NEW: Show energy warning
  showEnergyWarning() {
    const warning = this.conversationPanel.querySelector(".energy-warning");
    if (warning) {
      warning.style.display = "block";
      setTimeout(() => {
        warning.style.display = "none";
      }, 3000);
    }

    // Also show floating text
    this.gameEngine.renderer.showFloatingText(
      "Too drained to talk! Find duck to recharge.",
      400,
      300,
      3000
    );

    console.log("💔 Showed energy warning - player needs to talk to duck");
  }

  async waitForClose() {
    return new Promise((resolve) => {
      const checkClosed = () => {
        if (!this.isClosing && !this.isConversationActive) {
          resolve();
        } else {
          setTimeout(checkClosed, 50);
        }
      };
      checkClosed();
    });
  }

  async endConversationAndWait() {
    this.endConversation();
    await this.waitForClose();
  }

  async generateGreeting(character, history) {
    // NEW: Special duck greeting
    if (character.isDuck) {
      return this.generateDuckResponse("hello");
    }

    if (history.length === 0) {
      return this.getFirstMeetingGreeting(character);
    } else {
      // Returning visitor greeting
      const contextualGreeting = await this.aiService.generateResponse(
        this.currentCharacter,
        "The player has returned to talk to you again. Give a brief, friendly greeting acknowledging you've met before.",
        history
      );
      return contextualGreeting;
    }
  }

  getFirstMeetingGreeting(character) {
    // Simple greeting based on character personality
    const prompt = character.prompt.toLowerCase();

    if (prompt.includes("shy") || prompt.includes("nervous")) {
      return "Oh! H-hello there... I wasn't expecting visitors...";
    } else if (prompt.includes("wise") || prompt.includes("ancient")) {
      return "Welcome, young minotaur. I sense you have questions to ask.";
    } else if (prompt.includes("cheerful") || prompt.includes("excited")) {
      return "Oh wonderful! A new friend has come to visit! How delightful!";
    } else if (prompt.includes("mysterious")) {
      return "Ah... so you've found me. I wondered when someone would come asking the right questions...";
    } else {
      return "Hello there, minotaur!";
    }
  }

  async sendMessage() {
    const input = this.conversationPanel.querySelector(".conversation-input");
    const message = input.value.trim();

    if (!message || this.isWaitingForResponse) {
      console.log(
        `💬 SEND MESSAGE BLOCKED - Message: "${message}", Waiting: ${this.isWaitingForResponse}`
      );
      return;
    }

    console.log(`💬 SENDING MESSAGE: "${message}" to ${this.currentCharacter}`);

    // Clear input and disable it
    input.value = "";
    input.disabled = true;
    this.conversationPanel.querySelector(".send-button").disabled = true;
    this.isWaitingForResponse = true;

    // Add player message
    this.addMessage("player", message);

    // Show typing indicator (except for duck)
    const character = characters[this.currentCharacter];
    if (!character.isDuck) {
      this.showTypingIndicator();
    }

    try {
      let response;

      // NEW: Handle duck conversations differently
      if (character.isDuck) {
        response = this.generateDuckResponse(message);
        console.log(`🦆 DUCK RESPONSE: "${response}"`);
      } else {
        // Get conversation history for context
        const history = this.gameEngine.gameState.getConversationHistory(
          this.currentCharacter
        );
        console.log(`💬 Using ${history.length} previous messages for context`);

        // Generate AI response
        console.log(`💬 Requesting AI response from ${this.currentCharacter}`);
        response = await this.aiService.generateResponse(
          this.currentCharacter,
          message,
          history
        );
        console.log(`💬 AI RESPONSE RECEIVED: "${response}"`);
      }

      // Hide typing indicator
      this.hideTypingIndicator();

      // Add character response
      this.addMessage("character", response);

      // Save to conversation history (including duck conversations)
      this.gameEngine.gameState.addConversation(
        this.currentCharacter,
        message,
        response
      );
      console.log(`💬 Conversation saved to game state`);

      // Check for achievement triggers
      this.checkAchievementTriggers(message, response);
    } catch (error) {
      console.error("💬 ERROR generating response:", error);
      this.hideTypingIndicator();
      this.addMessage(
        "character",
        "I'm sorry, I seem to have lost my words for a moment..."
      );
    }

    // Re-enable input
    input.disabled = false;
    this.conversationPanel.querySelector(".send-button").disabled = false;
    this.isWaitingForResponse = false;
    input.focus();

    console.log(`💬 Message send cycle completed`);
  }

  // NEW: Generate duck responses
  generateDuckResponse(message) {
    const quackVariations = [
      "Quack!",
      "Quack quack!",
      "Quack quack quack!",
      "Quack?",
      "Quack!!",
      "Quack quack?",
      "Quack quack quack!!",
      "Quack! Quack!",
      "Quaaaack!",
      "Quack quack quack?",
      "Quack! Quack quack!",
      "Quaaaaaack!!",
    ];

    // Give energy back (Level 2 only)
    if (this.gameEngine.gameState.currentLevel === 2) {
      const oldEnergy = this.gameEngine.gameState.socialEnergy;
      this.gameEngine.gameState.socialEnergy = Math.min(
        CONFIG.MAX_SOCIAL_ENERGY,
        this.gameEngine.gameState.socialEnergy + CONFIG.DUCK_ENERGY_RESTORE
      );
      const newEnergy = this.gameEngine.gameState.socialEnergy;

      if (newEnergy > oldEnergy) {
        console.log(`💝 Duck restored energy: ${oldEnergy} → ${newEnergy}`);
      }
    }

    // Check for "ready" keywords in Level 1
    if (this.gameEngine.gameState.currentLevel === 1) {
      const readyKeywords = [
        "ready",
        "start",
        "begin",
        "go",
        "day",
        "adventure",
      ];
      const messageWords = message.toLowerCase().split(" ");

      if (readyKeywords.some((keyword) => messageWords.includes(keyword))) {
        // Trigger level completion
        this.gameEngine.achievementManager.unlockAchievement(READY_FOR_THE_DAY);
        return "Quack quack!! Quack! (Duck seems excited and ready!)";
      }
    }

    // Return random quack
    return quackVariations[Math.floor(Math.random() * quackVariations.length)];
  }

  addMessage(sender, text) {
    const messagesContainer = this.conversationPanel.querySelector(
      ".conversation-messages"
    );

    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}`;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageElement.innerHTML = `
            <div class="message-bubble">${text}</div>
            <div class="message-time">${timeString}</div>
        `;

    messagesContainer.appendChild(messageElement);

    // Animate message in
    gsap.fromTo(
      messageElement,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
    );

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store in local history
    this.messageHistory.push({ sender, text, timestamp: now });
  }

  showTypingIndicator() {
    const indicator = this.conversationPanel.querySelector(".typing-indicator");
    indicator.classList.add("active");
  }

  hideTypingIndicator() {
    const indicator = this.conversationPanel.querySelector(".typing-indicator");
    indicator.classList.remove("active");
  }

  checkAchievementTriggers(playerMessage, characterResponse) {
    console.log(`🏆 CHECKING ACHIEVEMENTS for ${this.currentCharacter}`);
    console.log(`🏆 Player message: "${playerMessage}"`);
    console.log(`🏆 Character response: "${characterResponse}"`);

    // Check if the response contains achievement trigger words using AchievementManager
    if (this.gameEngine.achievementManager) {
      this.gameEngine.achievementManager.checkTriggers(
        this.currentCharacter,
        playerMessage,
        characterResponse
      );
    } else {
      console.warn("🏆 AchievementManager not available");
    }
  }

  updateCharacterInfo(character) {
    const characterName = this.currentCharacter
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    this.conversationPanel.querySelector(".character-name").textContent =
      characterName;
    this.conversationPanel.querySelector(".character-description").textContent =
      character.description;

    // Update character avatar
    const avatar = this.conversationPanel.querySelector(".character-avatar");
    const imagePath = `images/characters/${character.img}.png`;
    const preloadedImage = this.gameEngine.renderer.assetManager.getImage(
      `characters/${character.img}`
    );

    if (preloadedImage) {
      avatar.style.backgroundImage = `url(${preloadedImage.src})`;
    } else {
      avatar.style.backgroundImage = `url(${imagePath})`;
    }

    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "top center";
    avatar.style.backgroundRepeat = "no-repeat";
  }

  clearMessages() {
    const messagesContainer = this.conversationPanel.querySelector(
      ".conversation-messages"
    );
    messagesContainer.innerHTML = "";
  }

  showConversation() {
    this.conversationPanel.style.display = "flex";

    // Animate in
    gsap.fromTo(
      this.conversationPanel,
      {
        opacity: 0,
        scale: 0.8,
        y: 50,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      }
    );
  }

  hideConversation() {
    gsap.to(this.conversationPanel, {
      opacity: 0,
      scale: 0.8,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        this.conversationPanel.style.display = "none";
        this.isClosing = false;
      },
    });
  }

  endConversation() {
    if (!this.isConversationActive || this.isClosing) return;

    console.log(`💬 Ending conversation with ${this.currentCharacter}`);

    this.isClosing = true;
    this.isConversationActive = false;
    this.hideConversation();

    // Re-enable world interactions
    this.gameEngine.interactionHandler.setInteractionsEnabled(true);

    // Emit event
    GameEvents.emit(GAME_EVENTS.CONVERSATION_ENDED, {
      characterKey: this.currentCharacter,
      messageCount: this.messageHistory.length,
    });

    // Clear current conversation data
    this.currentCharacter = null;
    this.messageHistory = [];
    this.isWaitingForResponse = false;

    console.log("💬 Conversation ended");
  }

  // Get current conversation status
  getStatus() {
    return {
      isActive: this.isConversationActive,
      currentCharacter: this.currentCharacter,
      messageCount: this.messageHistory.length,
      isWaiting: this.isWaitingForResponse,
      isClosing: this.isClosing,
    };
  }

  destroy() {
    // End any active conversation
    if (this.isConversationActive) {
      this.endConversation();
    }

    // Remove conversation panel
    if (this.conversationPanel && this.conversationPanel.parentNode) {
      this.conversationPanel.parentNode.removeChild(this.conversationPanel);
    }

    console.log("🗑️ Conversation manager destroyed");
  }
}

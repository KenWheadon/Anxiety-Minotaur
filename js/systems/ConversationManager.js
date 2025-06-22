// js/systems/ConversationManager.js - FIXED: Energy management and event handling

class ConversationManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.conversationPanel = null;
    this.currentCharacter = null;
    this.isConversationActive = false;
    this.isClosing = false;
    this.isWaitingForResponse = false;
    this.messageHistory = [];

    this.aiService = new AIService();

    this.createConversationUI();
    this.setupEventListeners();

    console.log("💬 Conversation manager initialized for tutorial");
  }

  createConversationUI() {
    this.conversationPanel = document.createElement("div");
    this.conversationPanel.className = "conversation-panel";
    this.conversationPanel.innerHTML = `
      <div class="conversation-header">
        <div class="character-info">
          <div class="character-avatar"></div>
          <div class="character-details">
            <div class="character-name">Character</div>
            <div class="character-description">Description</div>
          </div>
        </div>
        <button class="close-conversation">×</button>
      </div>
      
      <div class="conversation-messages"></div>
      
      <div class="typing-indicator">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="typing-text">Thinking...</span>
      </div>
      
      <div class="conversation-input-container">
        <textarea class="conversation-input" placeholder="Type your message..." rows="2"></textarea>
        <button class="send-button">Send</button>
        <div class="energy-warning" style="display: none;">
          <span class="warning-icon">💔</span>
          <span class="warning-text">Too drained to talk! Chat with duck to recharge.</span>
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
      `💬 START TUTORIAL CONVERSATION - Current: ${this.currentCharacter}, New: ${characterKey}`
    );

    // FIXED: NO energy check here - energy only deducted when sending messages
    // This allows players to open conversations freely

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

    this.currentCharacter = characterKey;
    this.isConversationActive = true;
    this.messageHistory = [];

    console.log(`💬 Setting up new tutorial conversation with ${characterKey}`);

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

    // Emit event with standardized data structure
    GameEvents.emit(GAME_EVENTS.CHARACTER_INTERACT, {
      type: "interaction",
      interactionType: "character",
      characterKey,
      character,
      timestamp: Date.now(),
    });

    console.log(
      `💬 Tutorial conversation with ${characterKey} fully initialized`
    );
  }

  // Check if we should deduct social energy for this conversation
  shouldCheckSocialEnergy(character) {
    // Only deduct energy for non-duck characters
    return !character.isDuck;
  }

  // FIXED: Show energy warning when trying to send a message without energy
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
    // Special duck greeting with energy restoration
    if (character.isDuck) {
      // Duck always restores energy when conversation starts
      const energyRestored = this.gameEngine.gameState.restoreEnergy();

      if (energyRestored && this.gameEngine.energyUI) {
        this.gameEngine.energyUI.showEnergyGain(CONFIG.DUCK_ENERGY_RESTORE);
        this.gameEngine.energyUI.updateEnergyDisplay();
        console.log("💝 Duck greeting restored energy automatically");
      }

      return "Quack! Quack! (Your faithful companion is happy to see you - you feel recharged!)";
    }

    if (history.length === 0) {
      return this.getFirstMeetingGreeting(character);
    } else {
      // Returning visitor greeting
      const contextualGreeting = await this.aiService.generateResponse(
        this.currentCharacter,
        "The player has returned to talk to you again. Give a brief, friendly greeting acknowledging you've met before.",
        history.slice(-3)
      );

      return (
        contextualGreeting ||
        this.getFirstMeetingGreeting(character) + " Good to see you again!"
      );
    }
  }

  getFirstMeetingGreeting(character) {
    // Tutorial pig specific greeting
    if (this.currentCharacter === NPC_PIG) {
      return "Oh, hello there! I'm so glad you're here. I really need some help with something garden-related. I can't see very well anymore, and I'm having trouble identifying some seeds that were delivered today.";
    }

    // Generic greetings for other characters
    const greetings = [
      "Hello there! Nice to meet you.",
      "Oh, hello! I wasn't expecting company.",
      "Greetings, neighbor. What brings you here?",
      "Well hello! Always nice to see a new face.",
      "Oh my, a visitor! How delightful!",
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  async sendMessage() {
    const input = this.conversationPanel.querySelector(".conversation-input");
    const message = input.value.trim();

    if (!message || this.isWaitingForResponse) {
      return;
    }

    const character = characters[this.currentCharacter];

    // Check social energy BEFORE sending message (not when opening chat)
    if (this.shouldCheckSocialEnergy(character)) {
      if (this.gameEngine.gameState.socialEnergy <= 0) {
        this.showEnergyWarning();
        return; // Don't send message if no energy
      }
    }

    console.log(
      `💬 Sending tutorial message to ${this.currentCharacter}: "${message}"`
    );

    // Clear input and disable
    input.value = "";
    input.disabled = true;
    this.conversationPanel.querySelector(".send-button").disabled = true;
    this.isWaitingForResponse = true;

    // Add player message
    this.addMessage("player", message);

    // Show typing indicator for non-duck characters
    if (!character?.isDuck) {
      this.showTypingIndicator();
    }

    try {
      let response;

      // Handle duck conversations with energy restoration
      if (character && character.isDuck) {
        // Every message to duck restores energy
        const energyRestored = this.gameEngine.gameState.restoreEnergy();

        if (energyRestored && this.gameEngine.energyUI) {
          this.gameEngine.energyUI.showEnergyGain(CONFIG.DUCK_ENERGY_RESTORE);
          this.gameEngine.energyUI.updateEnergyDisplay();
          console.log("💝 Duck message restored energy automatically");
        }

        response = this.generateDuckResponse();
      } else {
        // Handle other character conversations normally
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

      // FIXED: Only deduct energy AFTER successful message send
      if (this.shouldCheckSocialEnergy(character)) {
        this.gameEngine.gameState.socialEnergy--;
        console.log(
          `💔 Social energy spent: ${this.gameEngine.gameState.socialEnergy}/${CONFIG.MAX_SOCIAL_ENERGY}`
        );
      }

      // Save to conversation history (including duck conversations)
      this.gameEngine.gameState.addConversation(
        this.currentCharacter,
        message,
        response
      );
      console.log(`💬 Tutorial conversation saved to game state`);

      // FIXED: Emit standardized conversation event
      GameEvents.emit(GAME_EVENTS.CONVERSATION_MESSAGE, {
        type: "conversation",
        characterKey: this.currentCharacter,
        character: character,
        message: message,
        response: response,
        timestamp: Date.now(),
      });
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

    console.log(`💬 Tutorial message send cycle completed`);
  }

  // Generate duck responses - energy restoration happens in sendMessage
  generateDuckResponse() {
    const quackVariations = [
      "Quack!",
      "Quack quack!",
      "Quack?",
      "Quack quack quack!",
      "Quaaaack!",
      "Quack! Quack!",
      "Quack quack?!",
    ];

    // Default supportive response - energy is already restored in sendMessage
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

  updateCharacterInfo(character) {
    const avatar = this.conversationPanel.querySelector(".character-avatar");
    const name = this.conversationPanel.querySelector(".character-name");
    const description = this.conversationPanel.querySelector(
      ".character-description"
    );

    // Set character avatar image if available
    if (character.img) {
      avatar.style.backgroundImage = `url(images/characters/${character.img}.png)`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
    }

    // Format character name (remove prefixes, capitalize)
    name.textContent = this.currentCharacter
      .replace(/^(npc_|tutorial_)/, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    description.textContent = character.description || "A friendly character.";
  }

  showConversation() {
    this.conversationPanel.style.display = "block";
    gsap.fromTo(
      this.conversationPanel,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
    );
  }

  hideConversation() {
    this.conversationPanel.style.display = "none";
  }

  clearMessages() {
    const messagesContainer = this.conversationPanel.querySelector(
      ".conversation-messages"
    );
    messagesContainer.innerHTML = "";
  }

  endConversation() {
    if (!this.isConversationActive || this.isClosing) {
      return;
    }

    console.log(
      `💬 Ending tutorial conversation with ${this.currentCharacter}`
    );
    this.isClosing = true;

    gsap.to(this.conversationPanel, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        this.hideConversation();
        this.currentCharacter = null;
        this.isConversationActive = false;
        this.isClosing = false;
        this.isWaitingForResponse = false;

        // Re-enable world interactions
        this.gameEngine.interactionHandler.setInteractionsEnabled(true);

        // Emit event
        GameEvents.emit(GAME_EVENTS.CONVERSATION_ENDED, {
          type: "conversation",
          action: "ended",
          timestamp: Date.now(),
        });

        console.log("💬 Tutorial conversation ended");
      },
    });
  }

  // Utility method to check if conversation is active
  isActive() {
    return this.isConversationActive;
  }

  // Reset method for tutorial resets
  reset() {
    if (this.isConversationActive) {
      this.endConversation();
    }
    this.messageHistory = [];
    console.log("💬 Tutorial conversation manager reset");
  }

  // Clean up
  destroy() {
    if (this.conversationPanel && this.conversationPanel.parentNode) {
      this.conversationPanel.parentNode.removeChild(this.conversationPanel);
    }

    if (this.aiService) {
      this.aiService.destroy();
    }

    console.log("🗑️ Tutorial conversation manager destroyed");
  }
}

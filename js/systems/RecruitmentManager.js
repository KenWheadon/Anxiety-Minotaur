// js/systems/RecruitmentManager.js - Handle recruitment logic for Minotaur's Labyrinth

class RecruitmentManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.recruitmentPanel = null;
    this.currentNPCDesires = new Map(); // Track what each NPC wants
    this.isInitialized = false;

    this.generateNPCDesires();
    this.createRecruitmentUI();
    this.setupEventListeners();

    console.log("⚔️ Recruitment Manager initialized");
  }

  // NEW: Generate random desires for all NPCs at game start
  generateNPCDesires() {
    console.log("🎲 Generating NPC desires for this playthrough...");

    // Get all recruitables (monsters + trap makers) and info dealers
    const recruitableNPCs = [
      // Monsters
      SKELETON_WARRIOR,
      DRAGON_HATCHLING,
      SPHINX,
      GIANT_SPIDER,
      SIREN,
      TROLL,
      // Trap Makers
      COGWHEEL_KATE,
      PUZZLE_MASTER_PIP,
      ILLUSION_IRIS,
      PIT_BOSS_PETE,
      // Info Dealers
      THE_LIBRARIAN,
      THE_MERCHANT_KING,
      THE_PHILOSOPHER,
    ];

    // Get all clue items
    const clueItems = [
      // Monster clues
      WAR_MEDAL,
      POLISHED_SCALE,
      ANCIENT_SCROLL,
      SILK_THREAD,
      GOLDEN_HARP_STRING,
      TRADE_CONTRACT,
      // Trap maker clues
      CLOCKWORK_GEAR,
      CHESS_PIECE,
      KALEIDOSCOPE,
      HAMMER_HEAD,
      // Info dealer clues
      LIBRARY_CARD,
      MERCHANT_LEDGER,
      THINKING_STONE,
    ];

    // Assign desires randomly (but ensure each NPC gets a unique item)
    const shuffledItems = [...clueItems].sort(() => Math.random() - 0.5);

    recruitableNPCs.forEach((npcKey, index) => {
      if (index < shuffledItems.length) {
        this.currentNPCDesires.set(npcKey, shuffledItems[index]);
      }
    });

    console.log(
      "🎲 NPC Desires generated:",
      Object.fromEntries(this.currentNPCDesires)
    );
    this.isInitialized = true;
  }

  // Get what an NPC desires
  getNPCDesire(npcKey) {
    return this.currentNPCDesires.get(npcKey);
  }

  // Check if player has the item an NPC desires
  hasDesiredItem(npcKey, playerItems = []) {
    const desiredItem = this.getNPCDesire(npcKey);
    if (!desiredItem) return false;

    // For now, assume player "has" all items they've examined
    // In a full implementation, this would check inventory
    return true; // Simplified for now
  }

  // Try to recruit a monster
  recruitMonster(monsterId, conversationContext = null) {
    console.log(`⚔️ Attempting to recruit monster: ${monsterId}`);

    // Check if player has already recruited this monster
    if (this.gameEngine.gameState.recruitedMonsters.has(monsterId)) {
      return {
        success: false,
        reason: "Monster already recruited",
        message: "You've already recruited this ally!",
      };
    }

    // Check if player has reached monster limit
    if (this.gameEngine.gameState.recruitedMonsters.size >= 2) {
      return {
        success: false,
        reason: "Monster limit reached",
        message: "You can only recruit 2 monsters total!",
      };
    }

    // Check if player mentioned the correct item in conversation
    const desiredItem = this.getNPCDesire(monsterId);
    const hasCorrectApproach = this.checkRecruitmentApproach(
      monsterId,
      conversationContext
    );

    if (!hasCorrectApproach) {
      return {
        success: false,
        reason: "Wrong approach",
        message:
          "This monster doesn't seem interested. Try a different approach or find what they desire.",
      };
    }

    // Successful recruitment
    const result = this.gameEngine.gameState.recruitMonster(monsterId);

    if (result.success) {
      console.log(`✅ Successfully recruited monster: ${monsterId}`);
      this.showRecruitmentSuccess(monsterId, "monster");
      return {
        success: true,
        message: `${this.formatName(monsterId)} has joined your cause!`,
      };
    }

    return result;
  }

  // Try to hire a trap maker
  hireTrapMaker(trapMakerId, conversationContext = null) {
    console.log(`🪤 Attempting to hire trap maker: ${trapMakerId}`);

    // Check if player has already hired a trap maker
    if (this.gameEngine.gameState.hiredTrapMaker !== null) {
      return {
        success: false,
        reason: "Trap maker limit reached",
        message: "You can only hire 1 trap maker total!",
      };
    }

    // Check if player mentioned the correct item in conversation
    const hasCorrectApproach = this.checkRecruitmentApproach(
      trapMakerId,
      conversationContext
    );

    if (!hasCorrectApproach) {
      return {
        success: false,
        reason: "Wrong approach",
        message:
          "This trap maker doesn't seem interested. Try a different approach or find what they desire.",
      };
    }

    // Successful hiring
    const result = this.gameEngine.gameState.hireTrapMaker(trapMakerId);

    if (result.success) {
      console.log(`✅ Successfully hired trap maker: ${trapMakerId}`);
      this.showRecruitmentSuccess(trapMakerId, "trap_maker");
      return {
        success: true,
        message: `${this.formatName(
          trapMakerId
        )} has agreed to help with traps!`,
      };
    }

    return result;
  }

  // Get information from an information dealer
  getInformation(dealerId, conversationContext = null) {
    console.log(`🔍 Attempting to get information from: ${dealerId}`);

    const character = characters[dealerId];
    if (!character || !character.revealsStatType) {
      return {
        success: false,
        reason: "Not an information dealer",
        message: "This character doesn't have information to share.",
      };
    }

    // Check if player mentioned the correct item in conversation
    const hasCorrectApproach = this.checkRecruitmentApproach(
      dealerId,
      conversationContext
    );

    if (!hasCorrectApproach) {
      return {
        success: false,
        reason: "Wrong approach",
        message:
          "This information dealer doesn't seem willing to share. Try a different approach.",
      };
    }

    // Reveal the stat
    const statType = character.revealsStatType;
    const revealed = this.gameEngine.gameState.revealAdventurerStat(statType);

    if (revealed) {
      const statValue = this.gameEngine.gameState.adventurerStats[statType];
      console.log(`✅ Revealed ${statType}: ${statValue}`);

      this.showInformationReceived(dealerId, statType, statValue);
      return {
        success: true,
        message: `${this.formatName(
          dealerId
        )} reveals the adventurer's ${statType} level: ${this.formatStatValue(
          statValue
        )}!`,
      };
    }

    return {
      success: false,
      reason: "Already revealed",
      message: "You already know this information.",
    };
  }

  // Check if the conversation approach is correct for recruitment
  checkRecruitmentApproach(npcId, conversationContext) {
    if (!conversationContext) return false;

    const desiredItem = this.getNPCDesire(npcId);
    if (!desiredItem) return true; // If no specific desire, allow recruitment

    // Check if the conversation mentioned the desired item
    const playerMessage = conversationContext.playerMessage.toLowerCase();
    const characterResponse =
      conversationContext.characterResponse.toLowerCase();

    // Look for item name or related keywords in conversation
    const itemName = desiredItem.toLowerCase().replace(/_/g, " ");
    const itemKeywords = this.getItemKeywords(desiredItem);

    const mentionedItem =
      playerMessage.includes(itemName) ||
      itemKeywords.some((keyword) => playerMessage.includes(keyword));

    const npcInterested =
      characterResponse.includes("interest") ||
      characterResponse.includes("perfect") ||
      characterResponse.includes("exactly") ||
      characterResponse.includes("wonderful");

    console.log(`🎯 Recruitment check for ${npcId}:`);
    console.log(`  Desired item: ${desiredItem}`);
    console.log(`  Mentioned item: ${mentionedItem}`);
    console.log(`  NPC interested: ${npcInterested}`);

    return mentionedItem && npcInterested;
  }

  // Get keywords related to an item (for conversation matching)
  getItemKeywords(itemKey) {
    const keywords = {
      [WAR_MEDAL]: ["medal", "honor", "valor", "military", "bronze", "eagle"],
      [POLISHED_SCALE]: [
        "scale",
        "dragon",
        "iridescent",
        "shiny",
        "emerald",
        "gold",
      ],
      [ANCIENT_SCROLL]: [
        "scroll",
        "knowledge",
        "wisdom",
        "parchment",
        "ancient",
      ],
      [SILK_THREAD]: ["thread", "silk", "craftsmanship", "spool", "weaving"],
      [GOLDEN_HARP_STRING]: ["harp", "string", "music", "golden", "melody"],
      [TRADE_CONTRACT]: ["contract", "trade", "agreement", "business", "deal"],
      [CLOCKWORK_GEAR]: [
        "gear",
        "clockwork",
        "mechanical",
        "brass",
        "precision",
      ],
      [CHESS_PIECE]: ["chess", "strategy", "king", "intellect", "game"],
      [KALEIDOSCOPE]: ["kaleidoscope", "illusion", "pattern", "mesmerizing"],
      [HAMMER_HEAD]: ["hammer", "tool", "building", "construction", "work"],
      [LIBRARY_CARD]: ["library", "books", "knowledge", "reading", "card"],
      [MERCHANT_LEDGER]: ["ledger", "trade", "merchant", "business", "records"],
      [THINKING_STONE]: ["stone", "contemplation", "thinking", "philosophy"],
    };

    return keywords[itemKey] || [];
  }

  // Show recruitment success animation
  showRecruitmentSuccess(npcId, type) {
    const notification = document.createElement("div");
    notification.className = "recruitment-success";
    notification.innerHTML = `
      <div class="success-icon">${type === "monster" ? "⚔️" : "🪤"}</div>
      <div class="success-text">
        <strong>${
          type === "monster" ? "Monster Recruited!" : "Trap Maker Hired!"
        }</strong><br>
        ${this.formatName(npcId)}
      </div>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border-radius: 10px;
      border: 2px solid #2ecc71;
      z-index: 10000;
      text-align: center;
      box-shadow: 0 0 20px rgba(46, 204, 113, 0.5);
    `;

    document.body.appendChild(notification);

    // Animate in and out
    gsap.fromTo(
      notification,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(notification, {
              opacity: 0,
              scale: 0.8,
              duration: 0.3,
              onComplete: () => notification.remove(),
            });
          }, 2000);
        },
      }
    );
  }

  // Show information received animation
  showInformationReceived(dealerId, statType, statValue) {
    const notification = document.createElement("div");
    notification.className = "information-received";
    notification.innerHTML = `
      <div class="info-icon">🔍</div>
      <div class="info-text">
        <strong>Intelligence Gathered!</strong><br>
        Adventurer's ${statType}: ${this.formatStatValue(statValue)}
      </div>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border-radius: 10px;
      border: 2px solid #3498db;
      z-index: 10000;
      text-align: center;
      box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
    `;

    document.body.appendChild(notification);

    // Animate in and out
    gsap.fromTo(
      notification,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(notification, {
              opacity: 0,
              scale: 0.8,
              duration: 0.3,
              onComplete: () => notification.remove(),
            });
          }, 3000);
        },
      }
    );
  }

  // Create recruitment tracking UI
  createRecruitmentUI() {
    this.recruitmentPanel = document.createElement("div");
    this.recruitmentPanel.className = "recruitment-panel";
    this.recruitmentPanel.innerHTML = `
      <div class="recruitment-header">
        <h3>📋 Recruitment Progress</h3>
        <button class="close-recruitment">×</button>
      </div>
      <div class="recruitment-content">
        <div class="recruitment-section">
          <h4>⚔️ Monsters (2 needed)</h4>
          <div class="monster-list"></div>
        </div>
        <div class="recruitment-section">
          <h4>🪤 Trap Maker (1 needed)</h4>
          <div class="trap-maker-status"></div>
        </div>
        <div class="recruitment-section">
          <h4>🔍 Intelligence (3 needed)</h4>
          <div class="intelligence-status"></div>
        </div>
      </div>
    `;

    // Add CSS (simplified version)
    const style = document.createElement("style");
    style.textContent = `
      .recruitment-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 15px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        z-index: 10000;
        min-width: 300px;
        display: none;
      }

      .recruitment-panel.visible {
        display: block;
      }

      .recruitment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        padding-bottom: 10px;
      }

      .close-recruitment {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      }

      .recruitment-section {
        margin-bottom: 15px;
      }

      .recruitment-section h4 {
        margin-bottom: 8px;
        color: #3498db;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.recruitmentPanel);
  }

  // Setup event listeners
  setupEventListeners() {
    // Close button
    if (this.recruitmentPanel) {
      this.recruitmentPanel
        .querySelector(".close-recruitment")
        ?.addEventListener("click", () => {
          this.hideRecruitmentPanel();
        });
    }

    // Listen for recruitment events to update UI
    GameEvents.on(GAME_EVENTS.ACHIEVEMENT_UNLOCKED, (achievementId) => {
      if (
        [
          RECRUITED_FIRST_MONSTER,
          RECRUITED_SECOND_MONSTER,
          HIRED_TRAP_MAKER,
          LEARNED_FEAR_LEVEL,
          LEARNED_GREED_LEVEL,
          LEARNED_PRIDE_LEVEL,
        ].includes(achievementId)
      ) {
        this.updateRecruitmentUI();
      }
    });
  }

  // Show recruitment panel
  showRecruitmentPanel() {
    if (this.recruitmentPanel) {
      this.updateRecruitmentUI();
      this.recruitmentPanel.classList.add("visible");
    }
  }

  // Hide recruitment panel
  hideRecruitmentPanel() {
    if (this.recruitmentPanel) {
      this.recruitmentPanel.classList.remove("visible");
    }
  }

  // Update recruitment UI with current status
  updateRecruitmentUI() {
    if (!this.recruitmentPanel) return;

    const status = this.gameEngine.gameState.getRecruitmentStatus();

    // Update monster list
    const monsterList = this.recruitmentPanel.querySelector(".monster-list");
    if (monsterList) {
      monsterList.innerHTML =
        status.monsters.recruited
          .map((id) => `<div>✅ ${this.formatName(id)}</div>`)
          .join("") +
        Array(2 - status.monsters.count)
          .fill("<div>❌ Empty Slot</div>")
          .join("");
    }

    // Update trap maker status
    const trapMakerStatus =
      this.recruitmentPanel.querySelector(".trap-maker-status");
    if (trapMakerStatus) {
      trapMakerStatus.innerHTML = status.trapMaker.hired
        ? `<div>✅ ${this.formatName(status.trapMaker.hired)}</div>`
        : "<div>❌ No trap maker hired</div>";
    }

    // Update intelligence status
    const intelligenceStatus = this.recruitmentPanel.querySelector(
      ".intelligence-status"
    );
    if (intelligenceStatus) {
      const intel = status.intelligence.revealed;
      intelligenceStatus.innerHTML = `
        <div>${intel.fear ? "✅" : "❌"} Fear: ${
        intel.fear ? this.formatStatValue(intel.fear) : "Unknown"
      }</div>
        <div>${intel.greed ? "✅" : "❌"} Greed: ${
        intel.greed ? this.formatStatValue(intel.greed) : "Unknown"
      }</div>
        <div>${intel.pride ? "✅" : "❌"} Pride: ${
        intel.pride ? this.formatStatValue(intel.pride) : "Unknown"
      }</div>
      `;
    }
  }

  // Helper methods
  formatName(key) {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  formatStatValue(value) {
    return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  }

  // Get current recruitment progress
  getProgress() {
    return this.gameEngine.gameState.getRecruitmentStatus();
  }

  // Check if recruitment is complete
  isComplete() {
    const status = this.getProgress();
    return status.overall.complete;
  }

  destroy() {
    if (this.recruitmentPanel && this.recruitmentPanel.parentNode) {
      this.recruitmentPanel.parentNode.removeChild(this.recruitmentPanel);
    }

    console.log("🗑️ Recruitment Manager destroyed");
  }
}

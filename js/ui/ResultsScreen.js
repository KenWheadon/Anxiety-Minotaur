// js/ui/ResultsScreen.js - Level 3 Results Display for Anxiety Minotaur

class ResultsScreen {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.resultsElement = null;
    this.isShowing = false;
    this.currentResults = null;

    this.createResultsUI();
    this.setupEventListeners();

    console.log("🎯 Results Screen initialized");
  }

  createResultsUI() {
    this.resultsElement = document.createElement("div");
    this.resultsElement.className = "results-screen";
    this.resultsElement.innerHTML = `
      <div class="results-content">
        <div class="results-header">
          <div class="results-icon">⚔️</div>
          <h1 class="results-title">The Confrontation</h1>
          <h2 class="results-subtitle">Your strategy meets the adventurer!</h2>
        </div>
        
        <div class="results-main">
          <div class="adventurer-section">
            <h3>🏃 The Adventurer</h3>
            <div class="adventurer-stats">
              <div class="stat-reveal fear-stat">
                <span class="stat-icon">😨</span>
                <span class="stat-label">Fear:</span>
                <span class="stat-value">???</span>
              </div>
              <div class="stat-reveal greed-stat">
                <span class="stat-icon">💰</span>
                <span class="stat-label">Greed:</span>
                <span class="stat-value">???</span>
              </div>
              <div class="stat-reveal pride-stat">
                <span class="stat-icon">👑</span>
                <span class="stat-label">Pride:</span>
                <span class="stat-value">???</span>
              </div>
            </div>
            <div class="adventurer-description"></div>
          </div>

          <div class="vs-section">
            <div class="vs-text">VS</div>
          </div>

          <div class="strategy-section">
            <h3>🛡️ Your Strategy</h3>
            <div class="chosen-allies">
              <div class="monsters-chosen">
                <h4>⚔️ Monsters</h4>
                <div class="monster-list"></div>
              </div>
              <div class="trap-maker-chosen">
                <h4>🪤 Trap Maker</h4>
                <div class="trap-maker-display"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="battle-animation">
          <div class="battle-text">The battle begins...</div>
          <div class="battle-progress">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>

        <div class="results-evaluation" style="display: none;">
          <div class="score-display">
            <div class="score-circle">
              <div class="score-number">0</div>
              <div class="score-label">Score</div>
            </div>
            <div class="score-grade">F</div>
          </div>

          <div class="evaluation-breakdown">
            <div class="eval-section fear-eval">
              <span class="eval-icon">😨</span>
              <span class="eval-label">Fear Counter:</span>
              <span class="eval-result">❌</span>
              <span class="eval-reason">No effective counter</span>
            </div>
            <div class="eval-section greed-eval">
              <span class="eval-icon">💰</span>
              <span class="eval-label">Greed Counter:</span>
              <span class="eval-result">❌</span>
              <span class="eval-reason">No effective counter</span>
            </div>
            <div class="eval-section pride-eval">
              <span class="eval-icon">👑</span>
              <span class="eval-label">Pride Counter:</span>
              <span class="eval-result">❌</span>
              <span class="eval-reason">No effective counter</span>
            </div>
            <div class="eval-section trap-eval">
              <span class="eval-icon">🪤</span>
              <span class="eval-label">Trap Effectiveness:</span>
              <span class="eval-result">❌</span>
              <span class="eval-reason">No trap maker</span>
            </div>
          </div>

          <div class="detailed-feedback">
            <h4>📋 Detailed Analysis</h4>
            <div class="feedback-text"></div>
          </div>
        </div>

        <div class="results-actions" style="display: none;">
          <button class="results-button play-again">Play Again</button>
          <button class="results-button main-menu">Main Menu</button>
        </div>

        <div class="replay-hints" style="display: none;">
          <h4>💡 Strategy Tips</h4>
          <div class="hints-list"></div>
        </div>
      </div>
    `;

    // Add comprehensive CSS
    const style = document.createElement("style");
    style.textContent = `
      .results-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #1a1a2e, #16213e, #0f0f23);
        display: none;
        z-index: 100000;
        overflow-y: auto;
        color: white;
      }

      .results-screen.visible {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .results-content {
        max-width: 900px;
        width: 100%;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 20px;
        padding: 30px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
      }

      .results-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .results-icon {
        font-size: 64px;
        margin-bottom: 15px;
      }

      .results-title {
        font-size: 2.5rem;
        margin: 0 0 10px 0;
        color: #3498db;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      }

      .results-subtitle {
        font-size: 1.2rem;
        margin: 0;
        opacity: 0.8;
      }

      .results-main {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 30px;
        align-items: start;
        margin-bottom: 30px;
      }

      .adventurer-section, .strategy-section {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .adventurer-section h3, .strategy-section h3 {
        margin: 0 0 15px 0;
        color: #e74c3c;
        font-size: 1.3rem;
      }

      .strategy-section h3 {
        color: #2ecc71;
      }

      .adventurer-stats {
        margin-bottom: 15px;
      }

      .stat-reveal {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
        padding: 8px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        border-left: 3px solid transparent;
      }

      .stat-reveal.revealed {
        border-left-color: #3498db;
        animation: reveal-glow 0.5s ease;
      }

      @keyframes reveal-glow {
        0% { box-shadow: 0 0 0 rgba(52, 152, 219, 0.4); }
        50% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.6); }
        100% { box-shadow: 0 0 0 rgba(52, 152, 219, 0.4); }
      }

      .stat-icon {
        font-size: 20px;
        width: 25px;
        text-align: center;
      }

      .stat-label {
        font-weight: bold;
        min-width: 60px;
      }

      .stat-value {
        color: #f39c12;
        font-weight: bold;
      }

      .adventurer-description {
        font-style: italic;
        opacity: 0.8;
        line-height: 1.4;
      }

      .vs-section {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .vs-text {
        font-size: 2rem;
        font-weight: bold;
        color: #e74c3c;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        background: rgba(231, 76, 60, 0.2);
        padding: 15px 25px;
        border-radius: 50%;
        border: 2px solid #e74c3c;
      }

      .chosen-allies h4 {
        color: #f39c12;
        margin: 0 0 10px 0;
        font-size: 1.1rem;
      }

      .monster-list, .trap-maker-display {
        min-height: 60px;
      }

      .ally-item {
        background: rgba(46, 204, 113, 0.2);
        border: 1px solid #2ecc71;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .ally-icon {
        font-size: 20px;
      }

      .ally-name {
        font-weight: bold;
      }

      .ally-description {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .battle-animation {
        text-align: center;
        margin: 30px 0;
        padding: 20px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
      }

      .battle-text {
        font-size: 1.2rem;
        margin-bottom: 15px;
        color: #f39c12;
      }

      .progress-bar {
        height: 10px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3498db, #2ecc71, #f39c12, #e74c3c);
        width: 0%;
        transition: width 0.3s ease;
      }

      .results-evaluation {
        margin: 30px 0;
      }

      .score-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 30px;
        margin-bottom: 30px;
      }

      .score-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #3498db;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(52, 152, 219, 0.1);
      }

      .score-number {
        font-size: 2rem;
        font-weight: bold;
        color: #3498db;
      }

      .score-label {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .score-grade {
        font-size: 4rem;
        font-weight: bold;
        color: #2ecc71;
      }

      .score-grade.victory {
        color: #2ecc71;
      }

      .score-grade.defeat {
        color: #e74c3c;
      }

      .evaluation-breakdown {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .eval-section {
        display: grid;
        grid-template-columns: 30px 120px 30px 1fr;
        gap: 10px;
        align-items: center;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.02);
      }

      .eval-icon {
        font-size: 18px;
      }

      .eval-label {
        font-weight: bold;
      }

      .eval-result {
        font-size: 18px;
      }

      .eval-reason {
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .detailed-feedback {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
      }

      .detailed-feedback h4 {
        margin: 0 0 15px 0;
        color: #3498db;
      }

      .feedback-text {
        line-height: 1.6;
        white-space: pre-line;
      }

      .results-actions {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 30px 0;
      }

      .results-button {
        background: linear-gradient(45deg, #3498db, #2980b9);
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
      }

      .results-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
      }

      .results-button.play-again {
        background: linear-gradient(45deg, #2ecc71, #27ae60);
        box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
      }

      .results-button.play-again:hover {
        box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
      }

      .replay-hints {
        background: rgba(241, 196, 15, 0.1);
        border: 1px solid rgba(241, 196, 15, 0.3);
        border-radius: 10px;
        padding: 20px;
      }

      .replay-hints h4 {
        margin: 0 0 15px 0;
        color: #f1c40f;
      }

      .hints-list {
        line-height: 1.6;
      }

      .hint-item {
        margin-bottom: 8px;
        padding-left: 20px;
        position: relative;
      }

      .hint-item::before {
        content: '💡';
        position: absolute;
        left: 0;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .results-main {
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .vs-section {
          order: 2;
        }

        .vs-text {
          font-size: 1.5rem;
          padding: 10px 20px;
        }

        .score-display {
          flex-direction: column;
          gap: 20px;
        }

        .eval-section {
          grid-template-columns: 1fr;
          gap: 5px;
          text-align: center;
        }

        .results-actions {
          flex-direction: column;
          align-items: center;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.resultsElement);
    this.hide();
  }

  setupEventListeners() {
    // Play Again button
    this.resultsElement
      .querySelector(".play-again")
      .addEventListener("click", () => {
        this.gameEngine.reset();
        this.hide();
      });

    // Main Menu button
    this.resultsElement
      .querySelector(".main-menu")
      .addEventListener("click", () => {
        this.gameEngine.reset();
        this.hide();
      });

    // Prevent clicks from propagating when results screen is showing
    this.resultsElement.addEventListener("click", (e) => {
      if (this.isShowing) {
        e.stopPropagation();
      }
    });
  }

  async show(results) {
    if (this.isShowing) return;

    console.log("🎯 Showing results screen with data:", results);

    this.isShowing = true;
    this.currentResults = results;

    // Show the screen
    this.resultsElement.classList.add("visible");

    // Prevent body scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Play the results sequence
    await this.playResultsSequence(results);

    console.log("🎯 Results screen fully displayed");
  }

  hide() {
    this.isShowing = false;
    this.resultsElement.classList.remove("visible");

    // Restore body scrolling
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  async playResultsSequence(results) {
    console.log("🎬 Playing results sequence animation...");

    // Step 1: Show adventurer stats (2 seconds)
    await this.revealAdventurerStats(results.adventurer);
    await this.wait(1000);

    // Step 2: Show player's strategy (2 seconds)
    await this.displayPlayerStrategy(results.choices);
    await this.wait(1000);

    // Step 3: Battle animation (3 seconds)
    await this.playBattleAnimation();

    // Step 4: Show results evaluation (3 seconds)
    await this.showEvaluation(results);

    // Step 5: Show final score and actions
    await this.showFinalResults(results);
  }

  async revealAdventurerStats(adventurer) {
    console.log("👤 Revealing adventurer stats...");

    const stats = [
      { type: "fear", value: adventurer.fear },
      { type: "greed", value: adventurer.greed },
      { type: "pride", value: adventurer.pride },
    ];

    for (const stat of stats) {
      const statElement = this.resultsElement.querySelector(
        `.${stat.type}-stat`
      );
      const valueElement = statElement.querySelector(".stat-value");

      // Animate reveal
      valueElement.textContent = this.formatStatValue(stat.value);
      statElement.classList.add("revealed");

      await this.wait(500);
    }

    // Show description
    const descElement = this.resultsElement.querySelector(
      ".adventurer-description"
    );
    descElement.textContent = adventurer.description;

    gsap.fromTo(
      descElement,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
  }

  async displayPlayerStrategy(choices) {
    console.log("🛡️ Displaying player strategy...");

    // Show monsters
    const monsterList = this.resultsElement.querySelector(".monster-list");
    choices.monsters.forEach((monster, index) => {
      setTimeout(() => {
        const monsterItem = document.createElement("div");
        monsterItem.className = "ally-item";
        monsterItem.innerHTML = `
          <span class="ally-icon">⚔️</span>
          <div>
            <div class="ally-name">${monster.name}</div>
            <div class="ally-description">Counters: ${monster.counters
              .map((c) => this.formatStatValue(c))
              .join(", ")}</div>
          </div>
        `;

        monsterList.appendChild(monsterItem);

        gsap.fromTo(
          monsterItem,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3 }
        );
      }, index * 300);
    });

    // Show trap maker
    if (choices.trapMaker) {
      setTimeout(() => {
        const trapMakerDisplay = this.resultsElement.querySelector(
          ".trap-maker-display"
        );
        const trapItem = document.createElement("div");
        trapItem.className = "ally-item";
        trapItem.innerHTML = `
          <span class="ally-icon">🪤</span>
          <div>
            <div class="ally-name">${choices.trapMaker.name}</div>
            <div class="ally-description">Specializes in ${choices.trapMaker.trapType} traps</div>
          </div>
        `;

        trapMakerDisplay.appendChild(trapItem);

        gsap.fromTo(
          trapItem,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3 }
        );
      }, 600);
    }

    await this.wait(1000);
  }

  async playBattleAnimation() {
    console.log("⚔️ Playing battle animation...");

    const battleText = this.resultsElement.querySelector(".battle-text");
    const progressFill = this.resultsElement.querySelector(".progress-fill");

    // Battle text sequence
    const battleMessages = [
      "The adventurer approaches your labyrinth...",
      "Your allies take their positions...",
      "The confrontation begins!",
      "Strategy meets reality...",
      "The outcome is decided!",
    ];

    for (let i = 0; i < battleMessages.length; i++) {
      battleText.textContent = battleMessages[i];

      // Update progress bar
      const progress = ((i + 1) / battleMessages.length) * 100;
      gsap.to(progressFill, { width: progress + "%", duration: 0.5 });

      await this.wait(600);
    }
  }

  async showEvaluation(results) {
    console.log("📊 Showing evaluation breakdown...");

    const evaluation = results.evaluation;

    // Show evaluation section
    const evalSection = this.resultsElement.querySelector(
      ".results-evaluation"
    );
    evalSection.style.display = "block";

    gsap.fromTo(
      evalSection,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    // Update score
    const scoreNumber = this.resultsElement.querySelector(".score-number");
    const scoreGrade = this.resultsElement.querySelector(".score-grade");

    // Animate score counting up
    gsap.to(
      { value: 0 },
      {
        value: results.score,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function () {
          scoreNumber.textContent = Math.round(this.targets()[0].value);
        },
      }
    );

    // Set grade
    const grade = this.calculateGrade(results.percentage);
    scoreGrade.textContent = grade.letter;
    scoreGrade.className = `score-grade ${
      results.victory ? "victory" : "defeat"
    }`;

    await this.wait(500);

    // Show evaluation breakdown with stagger
    const evaluations = [
      { key: "fear", data: evaluation.fearCounter },
      { key: "greed", data: evaluation.greedCounter },
      { key: "pride", data: evaluation.prideCounter },
      { key: "trap", data: evaluation.trapEffectiveness },
    ];

    for (const eval of evaluations) {
      const evalElement = this.resultsElement.querySelector(
        `.${eval.key}-eval`
      );
      const resultElement = evalElement.querySelector(".eval-result");
      const reasonElement = evalElement.querySelector(".eval-reason");

      resultElement.textContent = eval.data.success ? "✅" : "❌";
      reasonElement.textContent = eval.data.reason;

      gsap.fromTo(
        evalElement,
        { opacity: 0.3, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3 }
      );

      await this.wait(200);
    }

    // Show detailed feedback
    setTimeout(() => {
      const feedbackText = this.resultsElement.querySelector(".feedback-text");
      feedbackText.textContent = results.feedback;

      gsap.fromTo(feedbackText, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }, 500);
  }

  async showFinalResults(results) {
    console.log("🎉 Showing final results and actions...");

    // Show actions
    const actionsSection =
      this.resultsElement.querySelector(".results-actions");
    actionsSection.style.display = "flex";

    gsap.fromTo(
      actionsSection,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    // Show replay hints if not victorious
    if (!results.victory && results.replayHints.length > 0) {
      setTimeout(() => {
        const hintsSection = this.resultsElement.querySelector(".replay-hints");
        const hintsList = this.resultsElement.querySelector(".hints-list");

        hintsList.innerHTML = results.replayHints
          .map((hint) => `<div class="hint-item">${hint}</div>`)
          .join("");

        hintsSection.style.display = "block";

        gsap.fromTo(
          hintsSection,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }, 1000);
    }

    // Trigger achievement
    if (results.victory) {
      this.gameEngine.achievementManager.unlockAchievement(DEFEATED_ADVENTURER);

      // Play victory cutscene after a delay
      setTimeout(() => {
        if (
          this.gameEngine.cutsceneManager &&
          this.gameEngine.cutsceneManager.hasCutscene("minotaur_victory")
        ) {
          this.gameEngine.cutsceneManager.playCutscene("minotaur_victory");
        }
      }, 2000);
    } else {
      this.gameEngine.achievementManager.unlockAchievement(KILLED_AT_HOME);

      // Play defeat cutscene after a delay
      setTimeout(() => {
        if (
          this.gameEngine.cutsceneManager &&
          this.gameEngine.cutsceneManager.hasCutscene("minotaur_defeat")
        ) {
          this.gameEngine.cutsceneManager.playCutscene("minotaur_defeat");
        }
      }, 2000);
    }
  }

  calculateGrade(percentage) {
    if (percentage >= 90) return { letter: "A", color: "#2ecc71" };
    if (percentage >= 80) return { letter: "B", color: "#f39c12" };
    if (percentage >= 70) return { letter: "C", color: "#e67e22" };
    if (percentage >= 60) return { letter: "D", color: "#e74c3c" };
    return { letter: "F", color: "#c0392b" };
  }

  formatStatValue(value) {
    return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Check if results screen is showing
  isResultsShowing() {
    return this.isShowing;
  }

  destroy() {
    // Restore body overflow
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (this.resultsElement && this.resultsElement.parentNode) {
      this.resultsElement.parentNode.removeChild(this.resultsElement);
    }

    console.log("🗑️ Results screen destroyed");
  }
}

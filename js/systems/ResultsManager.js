// js/systems/ResultsManager.js - Evaluate player strategy against adventurer

class ResultsManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.lastResults = null;

    console.log("🎯 Results Manager initialized");
  }

  // Calculate the final results based on player's choices
  calculateResults() {
    const gameState = this.gameEngine.gameState;

    console.log("🎯 Calculating final results...");

    // Get player's choices
    const recruitedMonsters = Array.from(gameState.recruitedMonsters);
    const hiredTrapMaker = gameState.hiredTrapMaker;
    const adventurerStats = gameState.adventurerStats;
    const hiddenStats = gameState.hiddenAdventurerStats;

    console.log("📊 Player Choices:");
    console.log("  Monsters:", recruitedMonsters);
    console.log("  Trap Maker:", hiredTrapMaker);
    console.log("  Known Stats:", adventurerStats);
    console.log("  Actual Stats:", hiddenStats);

    // Evaluate the strategy
    const evaluation = this.evaluateStrategy(
      hiddenStats,
      recruitedMonsters,
      hiredTrapMaker
    );

    // Create detailed results object
    const results = {
      victory: evaluation.success,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      percentage: Math.round((evaluation.score / evaluation.maxScore) * 100),

      // Player choices
      choices: {
        monsters: recruitedMonsters.map((id) => ({
          id,
          name: this.formatName(id),
          counters: characters[id]?.counters || [],
        })),
        trapMaker: hiredTrapMaker
          ? {
              id: hiredTrapMaker,
              name: this.formatName(hiredTrapMaker),
              trapType: characters[hiredTrapMaker]?.trapType || "universal",
            }
          : null,
      },

      // Adventurer stats (revealed)
      adventurer: {
        fear: hiddenStats.fear,
        greed: hiddenStats.greed,
        pride: hiddenStats.pride,
        description: this.generateAdventurerDescription(hiddenStats),
      },

      // Detailed evaluation
      evaluation: {
        fearCounter: evaluation.fearCounter,
        greedCounter: evaluation.greedCounter,
        prideCounter: evaluation.prideCounter,
        trapEffectiveness: evaluation.trapEffectiveness,
        bonusPoints: evaluation.bonusPoints,
      },

      // Feedback for player
      feedback: this.generateDetailedFeedback(
        evaluation,
        hiddenStats,
        recruitedMonsters,
        hiredTrapMaker
      ),

      // Replay encouragement
      replayHints: this.generateReplayHints(evaluation, hiddenStats),
    };

    this.lastResults = results;
    console.log("🎯 Results calculated:", results);

    return results;
  }

  // Evaluate how well the player's strategy counters the adventurer
  evaluateStrategy(adventurerStats, monsters, trapMaker) {
    console.log("⚖️ Evaluating strategy effectiveness...");

    let score = 0;
    const maxScore = 100; // Perfect score
    let evaluation = {
      fearCounter: { success: false, points: 0, reason: "" },
      greedCounter: { success: false, points: 0, reason: "" },
      prideCounter: { success: false, points: 0, reason: "" },
      trapEffectiveness: { points: 0, reason: "" },
      bonusPoints: { points: 0, reasons: [] },
    };

    // Check Fear Counter (30 points possible)
    const fearResult = this.checkStatCounter(
      "fear",
      adventurerStats.fear,
      monsters,
      trapMaker
    );
    evaluation.fearCounter = fearResult;
    score += fearResult.points;

    // Check Greed Counter (30 points possible)
    const greedResult = this.checkStatCounter(
      "greed",
      adventurerStats.greed,
      monsters,
      trapMaker
    );
    evaluation.greedCounter = greedResult;
    score += greedResult.points;

    // Check Pride Counter (30 points possible)
    const prideResult = this.checkStatCounter(
      "pride",
      adventurerStats.pride,
      monsters,
      trapMaker
    );
    evaluation.prideCounter = prideResult;
    score += prideResult.points;

    // Trap Maker Effectiveness (10 points possible)
    const trapResult = this.evaluateTrapMaker(trapMaker, adventurerStats);
    evaluation.trapEffectiveness = trapResult;
    score += trapResult.points;

    // Bonus Points for perfect strategy or clever combinations
    const bonusResult = this.calculateBonusPoints(
      monsters,
      trapMaker,
      adventurerStats
    );
    evaluation.bonusPoints = bonusResult;
    score += bonusResult.points;

    const success = score >= 60; // Need 60% to win

    console.log(
      `⚖️ Strategy evaluation complete: ${score}/${maxScore} (${
        success ? "VICTORY" : "DEFEAT"
      })`
    );

    return {
      success,
      score,
      maxScore,
      ...evaluation,
    };
  }

  // Check if a specific stat is properly countered
  checkStatCounter(statType, statValue, monsters, trapMaker) {
    console.log(`🎯 Checking ${statType} counter for ${statValue}...`);

    const expectedCounters = this.getExpectedCounters(statType, statValue);
    let points = 0;
    let success = false;
    let reason = "";

    // Check if any monster counters this stat
    const monsterCounter = monsters.find((monsterId) => {
      const monster = characters[monsterId];
      return (
        monster && monster.counters && monster.counters.includes(statValue)
      );
    });

    if (monsterCounter) {
      points += 25; // Primary counter
      success = true;
      reason = `${this.formatName(
        monsterCounter
      )} perfectly counters ${this.formatStatValue(statValue)}`;
    } else {
      // Check if trap maker can help
      const trapCounter = this.checkTrapCounter(trapMaker, statType, statValue);
      if (trapCounter.effective) {
        points += 15; // Trap counter (less effective than monster)
        success = true;
        reason = `${this.formatName(trapMaker)} provides ${
          trapCounter.effectiveness
        } counter to ${this.formatStatValue(statValue)}`;
      } else {
        reason = `No effective counter for ${this.formatStatValue(
          statValue
        )} - adventurer will exploit this weakness!`;
      }
    }

    // Bonus points for multiple counters
    if (
      monsterCounter &&
      this.checkTrapCounter(trapMaker, statType, statValue).effective
    ) {
      points += 5; // Bonus for layered defense
      reason += " (with trap backup!)";
    }

    return { success, points, reason };
  }

  // Get the expected counters for a stat value
  getExpectedCounters(statType, statValue) {
    const counterMap = {
      fear: {
        [FEAR_HIGH]: [SKELETON_WARRIOR], // Intimidates fearful adventurers
        [FEAR_LOW]: [GIANT_SPIDER], // Effective against brave adventurers
      },
      greed: {
        [GREED_HIGH]: [DRAGON_HATCHLING], // Lures greedy adventurers
        [GREED_LOW]: [TROLL], // Blocks generous adventurers
      },
      pride: {
        [PRIDE_HIGH]: [SPHINX], // Punishes arrogant adventurers
        [PRIDE_LOW]: [SIREN], // Distracts humble adventurers
      },
    };

    return counterMap[statType]?.[statValue] || [];
  }

  // Check if trap maker can counter a specific stat
  checkTrapCounter(trapMaker, statType, statValue) {
    if (!trapMaker) return { effective: false, effectiveness: "none" };

    const trapMakerData = characters[trapMaker];
    if (!trapMakerData) return { effective: false, effectiveness: "none" };

    const trapType = trapMakerData.trapType;

    // Check trap effectiveness
    if (trapType === "universal") {
      return { effective: true, effectiveness: "moderate" }; // Pit Boss Pete works on anyone
    }

    const trapEffectiveness = {
      fear: trapType === "fear", // Cogwheel Kate counters fear
      greed: trapType === "greed", // Illusion Iris counters greed
      pride: trapType === "pride", // Puzzle Master Pip counters pride
    };

    if (trapEffectiveness[statType]) {
      return { effective: true, effectiveness: "strong" };
    }

    return { effective: false, effectiveness: "weak" };
  }

  // Evaluate trap maker effectiveness overall
  evaluateTrapMaker(trapMaker, adventurerStats) {
    if (!trapMaker) {
      return {
        points: 0,
        reason:
          "No trap maker hired - missed opportunity for additional defense!",
      };
    }

    const trapMakerData = characters[trapMaker];
    const trapType = trapMakerData?.trapType || "universal";

    let points = 5; // Base points for having a trap maker
    let reason = `${this.formatName(trapMaker)} provides ${trapType} traps`;

    // Check how well trap type matches adventurer
    let matchCount = 0;

    if (
      trapType === "fear" &&
      [FEAR_HIGH, FEAR_LOW].includes(adventurerStats.fear)
    )
      matchCount++;
    if (
      trapType === "greed" &&
      [GREED_HIGH, GREED_LOW].includes(adventurerStats.greed)
    )
      matchCount++;
    if (
      trapType === "pride" &&
      [PRIDE_HIGH, PRIDE_LOW].includes(adventurerStats.pride)
    )
      matchCount++;
    if (trapType === "universal") matchCount = 1; // Universal always gets some credit

    if (matchCount > 0) {
      points += matchCount * 2;
      reason += ` - good match for this adventurer type`;
    } else {
      reason += ` - not ideal for this adventurer type`;
    }

    return { points, reason };
  }

  // Calculate bonus points for exceptional strategies
  calculateBonusPoints(monsters, trapMaker, adventurerStats) {
    let points = 0;
    let reasons = [];

    // Perfect counter strategy bonus
    const perfectCounters = this.checkPerfectCounters(
      monsters,
      adventurerStats
    );
    if (perfectCounters >= 3) {
      points += 5;
      reasons.push("Perfect counter strategy!");
    }

    // Complementary monster bonus (monsters that work well together)
    const synergy = this.checkMonsterSynergy(monsters);
    if (synergy.points > 0) {
      points += synergy.points;
      reasons.push(synergy.reason);
    }

    // Trap maker synergy bonus
    const trapSynergy = this.checkTrapSynergy(
      monsters,
      trapMaker,
      adventurerStats
    );
    if (trapSynergy.points > 0) {
      points += trapSynergy.points;
      reasons.push(trapSynergy.reason);
    }

    return { points, reasons };
  }

  // Check how many stats have perfect counters
  checkPerfectCounters(monsters, adventurerStats) {
    let perfectCount = 0;

    // Check each stat
    [
      adventurerStats.fear,
      adventurerStats.greed,
      adventurerStats.pride,
    ].forEach((statValue) => {
      const hasCounter = monsters.some((monsterId) => {
        const monster = characters[monsterId];
        return (
          monster && monster.counters && monster.counters.includes(statValue)
        );
      });
      if (hasCounter) perfectCount++;
    });

    return perfectCount;
  }

  // Check for monster synergy (complementary abilities)
  checkMonsterSynergy(monsters) {
    if (monsters.length !== 2) return { points: 0, reason: "" };

    const [monster1, monster2] = monsters;
    const char1 = characters[monster1];
    const char2 = characters[monster2];

    if (!char1 || !char2) return { points: 0, reason: "" };

    // Check for complementary counter types
    const counters1 = char1.counters || [];
    const counters2 = char2.counters || [];

    // Bonus for covering opposite stat values (high/low pairs)
    const complementaryPairs = [
      [FEAR_HIGH, FEAR_LOW],
      [GREED_HIGH, GREED_LOW],
      [PRIDE_HIGH, PRIDE_LOW],
    ];

    let synergyPoints = 0;
    let synergyReason = "";

    complementaryPairs.forEach(([high, low]) => {
      const covers1High = counters1.includes(high);
      const covers1Low = counters1.includes(low);
      const covers2High = counters2.includes(high);
      const covers2Low = counters2.includes(low);

      if ((covers1High && covers2Low) || (covers1Low && covers2High)) {
        synergyPoints += 2;
        const statName = high.split("_")[0];
        synergyReason = `${this.formatName(monster1)} and ${this.formatName(
          monster2
        )} complement each other on ${statName}`;
      }
    });

    return { points: synergyPoints, reason: synergyReason };
  }

  // Check for trap maker synergy with monsters
  checkTrapSynergy(monsters, trapMaker, adventurerStats) {
    if (!trapMaker) return { points: 0, reason: "" };

    const trapData = characters[trapMaker];
    const trapType = trapData?.trapType;

    // Universal traps get bonus for working with any strategy
    if (trapType === "universal") {
      return {
        points: 2,
        reason: `${this.formatName(
          trapMaker
        )}'s universal traps enhance any strategy`,
      };
    }

    // Specialized traps get bonus if they fill gaps in monster coverage
    let gapsFilled = 0;
    let gapReason = "";

    [
      { stat: "fear", high: FEAR_HIGH, low: FEAR_LOW },
      { stat: "greed", high: GREED_HIGH, low: GREED_LOW },
      { stat: "pride", high: PRIDE_HIGH, low: PRIDE_LOW },
    ].forEach(({ stat, high, low }) => {
      const adventurerValue = adventurerStats[stat];

      // Check if monsters don't counter this stat
      const monstersCoverStat = monsters.some((monsterId) => {
        const monster = characters[monsterId];
        return (
          monster &&
          monster.counters &&
          monster.counters.includes(adventurerValue)
        );
      });

      // If monsters don't cover it, but trap maker specializes in it
      if (!monstersCoverStat && trapType === stat) {
        gapsFilled++;
        gapReason = `${this.formatName(
          trapMaker
        )} fills gap in ${stat} coverage`;
      }
    });

    return { points: gapsFilled * 3, reason: gapReason };
  }

  // Generate a description of the adventurer based on their stats
  generateAdventurerDescription(stats) {
    const descriptions = {
      [FEAR_HIGH]: "a cowardly adventurer who scares easily",
      [FEAR_LOW]: "a brave adventurer who faces danger head-on",
      [GREED_HIGH]: "a greedy adventurer obsessed with treasure",
      [GREED_LOW]: "a generous adventurer who cares little for wealth",
      [PRIDE_HIGH]: "an arrogant adventurer overconfident in their abilities",
      [PRIDE_LOW]: "a humble adventurer who doesn't seek glory",
    };

    const fearDesc = descriptions[stats.fear] || "mysterious";
    const greedDesc = descriptions[stats.greed] || "mysterious";
    const prideDesc = descriptions[stats.pride] || "mysterious";

    return `The adventurer is ${fearDesc}, ${greedDesc}, and ${prideDesc}.`;
  }

  // Generate detailed feedback for the player
  generateDetailedFeedback(evaluation, adventurerStats, monsters, trapMaker) {
    let feedback = [];

    // Overall result
    if (evaluation.success) {
      feedback.push(
        "🎉 **Victory!** Your strategy successfully defeated the adventurer!"
      );
    } else {
      feedback.push("💀 **Defeat!** The adventurer escaped your labyrinth...");
    }

    // Stat-by-stat breakdown
    feedback.push("\n**Strategy Analysis:**");

    // Fear
    if (evaluation.fearCounter.success) {
      feedback.push(`✅ **Fear**: ${evaluation.fearCounter.reason}`);
    } else {
      feedback.push(`❌ **Fear**: ${evaluation.fearCounter.reason}`);
    }

    // Greed
    if (evaluation.greedCounter.success) {
      feedback.push(`✅ **Greed**: ${evaluation.greedCounter.reason}`);
    } else {
      feedback.push(`❌ **Greed**: ${evaluation.greedCounter.reason}`);
    }

    // Pride
    if (evaluation.prideCounter.success) {
      feedback.push(`✅ **Pride**: ${evaluation.prideCounter.reason}`);
    } else {
      feedback.push(`❌ **Pride**: ${evaluation.prideCounter.reason}`);
    }

    // Trap effectiveness
    feedback.push(`🪤 **Traps**: ${evaluation.trapEffectiveness.reason}`);

    // Bonus points
    if (evaluation.bonusPoints.points > 0) {
      feedback.push(
        `\n**Bonus Points**: ${evaluation.bonusPoints.reasons.join(", ")}`
      );
    }

    return feedback.join("\n");
  }

  // Generate hints for replay
  generateReplayHints(evaluation, adventurerStats) {
    let hints = [];

    if (evaluation.success) {
      hints.push("Try a different strategy for a new challenge!");
      hints.push(
        "Each playthrough has different NPC desires and adventurer stats."
      );
    } else {
      // Provide specific improvement hints
      if (!evaluation.fearCounter.success) {
        const counter = this.getExpectedCounters(
          "fear",
          adventurerStats.fear
        )[0];
        if (counter) {
          hints.push(
            `Try recruiting ${this.formatName(
              counter
            )} to counter ${this.formatStatValue(
              adventurerStats.fear
            )} adventurers.`
          );
        }
      }

      if (!evaluation.greedCounter.success) {
        const counter = this.getExpectedCounters(
          "greed",
          adventurerStats.greed
        )[0];
        if (counter) {
          hints.push(
            `Try recruiting ${this.formatName(
              counter
            )} to counter ${this.formatStatValue(
              adventurerStats.greed
            )} adventurers.`
          );
        }
      }

      if (!evaluation.prideCounter.success) {
        const counter = this.getExpectedCounters(
          "pride",
          adventurerStats.pride
        )[0];
        if (counter) {
          hints.push(
            `Try recruiting ${this.formatName(
              counter
            )} to counter ${this.formatStatValue(
              adventurerStats.pride
            )} adventurers.`
          );
        }
      }

      if (evaluation.trapEffectiveness.points < 5) {
        hints.push(
          "Consider hiring a trap maker whose specialization matches the adventurer's weaknesses."
        );
      }
    }

    return hints;
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

  // Get the last calculated results
  getLastResults() {
    return this.lastResults;
  }

  // Quick victory check (for achievements)
  isVictory() {
    return this.lastResults ? this.lastResults.victory : false;
  }

  destroy() {
    console.log("🗑️ Results Manager destroyed");
  }
}

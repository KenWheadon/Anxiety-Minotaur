// js/data/ContentManager.js - Auto-generation utilities integrated into system

class ContentManager {
  constructor() {
    this.characters = {};
    this.items = {};
    this.locations = {};
    this.specialBackgrounds = {}; // NEW: pseudo-backgrounds like title

    this.initialize();
  }

  initialize() {
    console.log("🏗️ Initializing centralized content system...");

    // Process and validate content
    this.processCharacters();
    this.processItems();
    this.processLocations();
    this.processSpecialBackgrounds(); // NEW

    // Auto-populate location contents
    this.populateLocationContents();

    console.log("✅ Content system initialized");
    console.log(
      `📊 Loaded: ${Object.keys(this.characters).length} characters, ${
        Object.keys(this.items).length
      } items, ${Object.keys(this.locations).length} locations`
    );
  }

  processCharacters() {
    Object.entries(CHARACTERS).forEach(([constantKey, data]) => {
      const id = constantKey;
      this.characters[id] = {
        ...data,
        img: id,
        assetPath: this.getCharacterImagePath(id),
      };

      if (data.achievement && data.achievement.possibleKeywords) {
        const selectedKeyword = this.selectRandomKeyword(
          data.achievement.possibleKeywords
        );
        this.characters[id].achievement.selectedKeyword = selectedKeyword;
        console.log(`🎲 Selected keyword for ${id}: "${selectedKeyword}"`);
      }
    });
  }

  processItems() {
    Object.entries(ITEMS).forEach(([constantKey, data]) => {
      const id = constantKey;
      this.items[id] = {
        ...data,
        img: id,
        assetPath: this.getItemImagePath(id),
      };

      if (data.description.includes("{keyword}")) {
        const relatedCharacter = this.findCharacterForItem(id);
        if (relatedCharacter && relatedCharacter.achievement) {
          const keyword = relatedCharacter.achievement.selectedKeyword;
          if (keyword) {
            this.items[id].description = this.items[id].description.replace(
              /{keyword}/g,
              keyword
            );
            console.log(`🔑 Applied keyword "${keyword}" to item ${id}`);
          }
        }
      }
    });
  }

  processLocations() {
    Object.entries(LOCATIONS).forEach(([constantKey, data]) => {
      const id = constantKey;
      this.locations[id] = {
        ...data,
        backgroundPath: this.getBackgroundImagePath(data.background),
      };
    });
  }

  processSpecialBackgrounds() {
    // Add any special backgrounds not tied to location constants
    this.specialBackgrounds["title"] = this.getBackgroundImagePath("title");
  }

  populateLocationContents() {
    Object.keys(this.locations).forEach((locationId) => {
      this.locations[locationId].characters = [];
      this.locations[locationId].items = [];
    });

    Object.entries(this.characters).forEach(([charId, charData]) => {
      charData.appearsIn.forEach((locationId) => {
        if (this.locations[locationId]) {
          this.locations[locationId].characters.push(charId);
        } else {
          console.warn(
            `⚠️ Character ${charId} references unknown location: ${locationId}`
          );
        }
      });
    });

    Object.entries(this.items).forEach(([itemId, itemData]) => {
      itemData.appearsIn.forEach((locationId) => {
        if (this.locations[locationId]) {
          this.locations[locationId].items.push(itemId);
        } else {
          console.warn(
            `⚠️ Item ${itemId} references unknown location: ${locationId}`
          );
        }
      });
    });

    console.log("🗺️ Location contents auto-populated");
  }

  // Asset path generators
  getCharacterImagePath(id) {
    return `images/characters/${id}.png`;
  }

  getItemImagePath(id) {
    return `images/items/${id}.png`;
  }

  getBackgroundImagePath(id) {
    return `images/backgrounds/${id}.png`;
  }

  getSpecialBackground(id) {
    return this.specialBackgrounds[id] || this.getBackgroundImagePath(id);
  }

  // Helper methods
  selectRandomKeyword(keywords) {
    return keywords[Math.floor(Math.random() * keywords.length)];
  }

  findCharacterForItem(itemId) {
    return Object.values(this.characters).find(
      (char) => char.achievement && char.achievement.relatedItem === itemId
    );
  }

  // Public API for other systems
  getCharacter(id) {
    return this.characters[id];
  }

  getItem(id) {
    return this.items[id];
  }

  getLocation(id) {
    return this.locations[id];
  }

  getAllCharacters() {
    return this.characters;
  }

  getAllItems() {
    return this.items;
  }

  getAllLocations() {
    return this.locations;
  }

  getAllAchievements() {
    const achievements = {};
    Object.entries(this.characters).forEach(([charId, charData]) => {
      if (charData.achievement) {
        achievements[charData.achievement.id] = {
          ...charData.achievement,
          characterId: charId,
          triggerKeywords: charData.achievement.selectedKeyword
            ? [charData.achievement.selectedKeyword]
            : [],
        };
      }
    });
    return achievements;
  }

  debugContent() {
    console.group("🐛 Content Debug");
    console.log("Characters:", this.characters);
    console.log("Items:", this.items);
    console.log("Locations:", this.locations);
    console.groupEnd();
  }
}

const contentManager = new ContentManager();

window.characters = contentManager.getAllCharacters();
window.items = contentManager.getAllItems();
window.locations = contentManager.getAllLocations();
window.achievements = contentManager.getAllAchievements();

if (typeof CONFIG !== "undefined" && CONFIG.DEBUG) {
  window.contentManager = contentManager;
  console.log("🐛 Access content system via window.contentManager");
}

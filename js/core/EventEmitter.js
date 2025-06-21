// js/core/EventEmitter.js - FIXED: Standardized event system with unified data structures

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }

    // Clean up empty arrays
    if (callbacks.length === 0) {
      this.listeners.delete(event);
    }
  }

  // Add one-time event listener
  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback);
    };

    return this.on(event, onceCallback);
  }

  // Emit event to all listeners
  emit(event, ...args) {
    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);

    // Create a copy to avoid issues if listeners modify the array
    [...callbacks].forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    });
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  // Get listener count for an event
  listenerCount(event) {
    if (!this.listeners.has(event)) {
      return 0;
    }
    return this.listeners.get(event).length;
  }

  // Get all events that have listeners
  eventNames() {
    return Array.from(this.listeners.keys());
  }
}

// Create global event bus
const GameEvents = new EventEmitter();

// FIXED: Standardized game events with consistent naming
const GAME_EVENTS = {
  // Location events
  LOCATION_CHANGED: "location_changed",

  // Interaction events (renamed for consistency)
  CHARACTER_INTERACT: "character_interact", // Renamed from CHARACTER_INTERACTION
  ITEM_INTERACT: "item_interact", // Renamed from ITEM_EXAMINED

  // Conversation events
  CONVERSATION_STARTED: "conversation_started",
  CONVERSATION_ENDED: "conversation_ended",
  CONVERSATION_MESSAGE: "conversation_message", // Renamed from CONVERSATION_MESSAGE_SENT

  // Achievement events
  ACHIEVEMENT_UNLOCK: "achievement_unlock", // Renamed from ACHIEVEMENT_UNLOCKED

  // Character progression events
  CHARACTER_UNLOCK: "character_unlock", // Renamed from CHARACTER_UNLOCKED

  // Level events
  LEVEL_CHANGED: "level_changed",
  LEVEL_COMPLETED: "level_completed",

  // Game state events
  GAME_SAVED: "game_saved",
  GAME_LOADED: "game_loaded",

  // Asset events
  ASSET_LOADED: "asset_loaded",
  ASSET_FAILED: "asset_failed",

  // Keyword system events
  KEYWORDS_GENERATED: "keywords_generated",
};

// FIXED: Standardized event data structures for consistency
class EventData {
  // Conversation event data
  static conversation(
    characterKey,
    character,
    message = null,
    response = null,
    action = "message"
  ) {
    return {
      type: "conversation",
      action: action, // 'started', 'ended', 'message'
      characterKey,
      character,
      message,
      response,
      timestamp: Date.now(),
    };
  }

  // Interaction event data
  static interaction(interactionType, key, data, element = null) {
    return {
      type: "interaction",
      interactionType: interactionType, // 'character' or 'item'
      characterKey: interactionType === "character" ? key : null,
      itemKey: interactionType === "item" ? key : null,
      key, // Keep for backward compatibility
      data,
      element,
      timestamp: Date.now(),
    };
  }

  // Achievement event data
  static achievement(achievementKey, achievement = null) {
    return {
      type: "achievement",
      achievementKey,
      achievement,
      timestamp: Date.now(),
    };
  }

  // Character unlock event data
  static characterUnlock(characterKey, keyword = null) {
    return {
      type: "character_unlock",
      characterKey,
      keyword,
      timestamp: Date.now(),
    };
  }

  // Location change event data
  static locationChange(locationKey, locationData = null) {
    return {
      type: "location_change",
      location: locationKey, // Keep for backward compatibility
      locationKey,
      locationData,
      timestamp: Date.now(),
    };
  }

  // Level change event data
  static levelChange(level, levelData = null) {
    return {
      type: "level_change",
      level,
      levelData,
      timestamp: Date.now(),
    };
  }

  // Generic event data
  static generic(type, data = {}) {
    return {
      type,
      ...data,
      timestamp: Date.now(),
    };
  }
}

// FIXED: Event validation helper
class EventValidator {
  static validateEventData(eventName, eventData) {
    if (!eventData || typeof eventData !== "object") {
      console.warn(`Invalid event data for ${eventName}:`, eventData);
      return false;
    }

    if (!eventData.type) {
      console.warn(
        `Event data missing 'type' field for ${eventName}:`,
        eventData
      );
      return false;
    }

    if (!eventData.timestamp) {
      console.warn(
        `Event data missing 'timestamp' field for ${eventName}:`,
        eventData
      );
      return false;
    }

    return true;
  }

  static validateConversationEvent(eventData) {
    if (!this.validateEventData("conversation", eventData)) return false;

    if (!eventData.characterKey) {
      console.warn("Conversation event missing characterKey:", eventData);
      return false;
    }

    return true;
  }

  static validateInteractionEvent(eventData) {
    if (!this.validateEventData("interaction", eventData)) return false;

    if (
      !eventData.interactionType ||
      !["character", "item"].includes(eventData.interactionType)
    ) {
      console.warn(
        "Interaction event missing or invalid interactionType:",
        eventData
      );
      return false;
    }

    if (!eventData.key) {
      console.warn("Interaction event missing key:", eventData);
      return false;
    }

    return true;
  }
}

// FIXED: Enhanced GameEvents with validation
const ValidatedGameEvents = {
  // Emit with validation
  emit(event, eventData) {
    // Validate common event types
    if (
      event === GAME_EVENTS.CONVERSATION_MESSAGE &&
      !EventValidator.validateConversationEvent(eventData)
    ) {
      return;
    }

    if (
      (event === GAME_EVENTS.CHARACTER_INTERACT ||
        event === GAME_EVENTS.ITEM_INTERACT) &&
      !EventValidator.validateInteractionEvent(eventData)
    ) {
      return;
    }

    // Emit the event
    GameEvents.emit(event, eventData);
  },

  // Pass through other methods
  on: (event, callback) => GameEvents.on(event, callback),
  off: (event, callback) => GameEvents.off(event, callback),
  once: (event, callback) => GameEvents.once(event, callback),
  removeAllListeners: (event) => GameEvents.removeAllListeners(event),
  listenerCount: (event) => GameEvents.listenerCount(event),
  eventNames: () => GameEvents.eventNames(),
};

// Export both for backward compatibility
// Use ValidatedGameEvents for new code, GameEvents for legacy code
window.GameEvents = GameEvents;
window.ValidatedGameEvents = ValidatedGameEvents;
window.EventData = EventData;
window.EventValidator = EventValidator;

import { levelCatalog } from '../data/levelCatalog.js';
import { ItemFactory } from '../entities/items/ItemFactory.js';

export class LevelService {
  constructor(eventBus, learningService, gameStateService) {
    this.eventBus = eventBus;
    this.learning = learningService;
    this.state = gameStateService;
    this.currentLevel = null;
  }

  loadLevel(levelId) {
    const level = levelCatalog[levelId];
    if (!level) {
      throw new Error(`Unknown level: ${levelId}`);
    }

    this.currentLevel = level;
    this.state.reset({ score: 0, timeLeft: level.timeLimit });
    this.eventBus.emit('level.loaded', { level });
    return level;
  }

  createEntitiesForCurrentLevel() {
    if (!this.currentLevel) {
      return [];
    }

    return this.currentLevel.items.map((definition) => {
      const spawnPoint = this.currentLevel.spawnPoints[definition.spawnIndex];
      if (!spawnPoint) {
        throw new Error(`Missing spawn point index ${definition.spawnIndex}`);
      }

      const item = ItemFactory.create(definition.type, {
        x: spawnPoint.x,
        y: spawnPoint.y,
        wordId: definition.wordId,
      });

      if (item.type === 'word') {
        this.learning.attachWordItem(item);
      }

      return item;
    });
  }

  getCurrentLevel() {
    return this.currentLevel;
  }

  getNextLevelId() {
    const levelIds = Object.keys(levelCatalog);
    const index = levelIds.indexOf(this.currentLevel?.id);
    if (index < 0 || index >= levelIds.length - 1) {
      return null;
    }

    return levelIds[index + 1];
  }
}

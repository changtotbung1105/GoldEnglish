import { levelCatalog } from '../data/levelCatalog.js';
import { ItemFactory } from '../entities/items/ItemFactory.js';

export class LevelService {
  constructor(eventBus, learningService, gameStateService) {
    this.eventBus = eventBus;
    this.learning = learningService;
    this.state = gameStateService;
    this.currentLevel = null;
    this.currentTargetIndex = 0;
  }

  loadLevel(levelId) {
    const level = levelCatalog[levelId];
    if (!level) {
      throw new Error(`Unknown level: ${levelId}`);
    }

    this.currentLevel = level;
    this.currentTargetIndex = 0;
    this.state.reset({ score: 0, timeLeft: level.timeLimit });
    this.eventBus.emit('level.loaded', { level });
    this.eventBus.emit('level.target.changed', { target: this.getCurrentTarget() });
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

  getTargetSequence() {
    return this.currentLevel?.targetSequence ?? [];
  }

  getCurrentTarget() {
    const sequence = this.getTargetSequence();
    const targetWordId = sequence[this.currentTargetIndex];
    if (!targetWordId) {
      return null;
    }

    return this.learning.getVocabulary(targetWordId);
  }

  advanceTarget() {
    const sequence = this.getTargetSequence();
    this.currentTargetIndex += 1;

    if (this.currentTargetIndex >= sequence.length) {
      this.eventBus.emit('level.target.changed', { target: null });
      this.eventBus.emit('level.completed', { level: this.currentLevel });
      return null;
    }

    const target = this.getCurrentTarget();
    this.eventBus.emit('level.target.changed', { target });
    return target;
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

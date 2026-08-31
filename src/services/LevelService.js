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

    const placedPositions = [];
    const spawnPoints = this.resolveSpawnPoints(this.currentLevel);

    return this.currentLevel.items.map((definition) => {
      const spawnPoint = spawnPoints[definition.spawnIndex];
      if (!spawnPoint) {
        throw new Error(`Missing spawn point index ${definition.spawnIndex}`);
      }

      const adjustedPoint = this.findFreeSpawnPoint(spawnPoint, placedPositions, 150);
      const item = ItemFactory.create(definition.type, {
        x: adjustedPoint.x,
        y: adjustedPoint.y,
        wordId: definition.wordId,
      });

      if (item.type === 'word') {
        this.learning.attachWordItem(item);
      }

      placedPositions.push({ x: item.x, y: item.y });

      return item;
    });
  }

  resolveSpawnPoints(level) {
    if (Array.isArray(level.spawnPoints) && level.spawnPoints.length > 0) {
      return level.spawnPoints;
    }

    if (level.spawnMode === 'arc') {
      return this.generateArcSpawnPoints(level.items.length, level.spawnArea);
    }

    throw new Error(`Level ${level.id} has no spawnPoints or supported spawnMode`);
  }

  generateArcSpawnPoints(count, area = {}) {
    const centerX = area.centerX ?? 640;
    const centerY = area.centerY ?? 150;
    const radiusMin = area.radiusMin ?? 260;
    const radiusMax = area.radiusMax ?? 430;
    const angleStart = area.angleStart ?? Math.PI * 0.18;
    const angleEnd = area.angleEnd ?? Math.PI * 0.82;
    const points = [];

    for (let i = 0; i < count; i += 1) {
      const t = count <= 1 ? 0.5 : i / (count - 1);
      const angleJitter = (Math.random() * 0.14 - 0.07) * Math.PI;
      const radiusJitter = Math.random() * 40 - 20;
      const angle = angleStart + (angleEnd - angleStart) * t + angleJitter;
      const radius = radiusMin + (radiusMax - radiusMin) * (0.35 + Math.random() * 0.55) + radiusJitter;
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    }

    return points;
  }

  findFreeSpawnPoint(spawnPoint, placedPositions, minDistance) {
    const result = { x: spawnPoint.x, y: spawnPoint.y };
    let attempts = 0;

    while (attempts < 12) {
      const isTooClose = placedPositions.some((placed) => {
        const distance = Math.hypot(result.x - placed.x, result.y - placed.y);
        return distance < minDistance;
      });

      if (!isTooClose) {
        return result;
      }

      result.x += 120;
      result.y += attempts % 2 === 0 ? -60 : 60;
      attempts += 1;
    }

    return result;
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

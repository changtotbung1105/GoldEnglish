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
    const spawnLimits = this.getSpawnLimits(this.currentLevel);

    return this.currentLevel.items.map((definition) => {
      const spawnPoint = spawnPoints[definition.spawnIndex];
      if (!spawnPoint) {
        throw new Error(`Missing spawn point index ${definition.spawnIndex}`);
      }

      const adjustedPoint = this.findFreeSpawnPoint(spawnPoint, placedPositions, 140, spawnLimits);
      const item = ItemFactory.create(definition.type, {
        x: adjustedPoint.x,
        y: adjustedPoint.y,
        wordId: definition.wordId,
        imageKey: this.learning.getVocabulary(definition.wordId)?.imageKey ?? null,
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
    const radiusMin = area.radiusMin ?? 230;
    const radiusMax = area.radiusMax ?? 430;
    const angleStart = area.angleStart ?? Math.PI * 0.18;
    const angleEnd = area.angleEnd ?? Math.PI * 0.82;
    const points = [];
    const angleRange = angleEnd - angleStart;
    const radiusSpan = radiusMax - radiusMin;

    for (let i = 0; i < count; i += 1) {
      const t = count <= 1 ? 0.5 : (i + 0.5) / count;
      const wave = Math.sin(t * Math.PI * 2) * 0.18;
      const angle = angleStart + angleRange * t;
      const radius = radiusMin + radiusSpan * (0.45 + wave * 0.5);
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    }

    return points;
  }

  getSpawnLimits(level) {
    const centerX = level.spawnArea?.centerX ?? 640;
    const centerY = level.spawnArea?.centerY ?? 150;
    const angleStart = level.spawnArea?.angleStart ?? Math.PI * 0.12;
    const angleEnd = level.spawnArea?.angleEnd ?? Math.PI * 0.88;
    const minRadius = level.spawnArea?.radiusMin ?? 220;
    const maxRadius = Math.min(level.spawnArea?.radiusMax ?? 410, 430);

    return {
      centerX,
      centerY,
      angleStart,
      angleEnd,
      minRadius,
      maxRadius,
    };
  }

  isPointInsideSpawnLimits(point, limits) {
    const dx = point.x - limits.centerX;
    const dy = point.y - limits.centerY;
    const angle = Math.atan2(dy, dx);
    const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;
    const radius = Math.hypot(dx, dy);
    const withinAngle = normalizedAngle >= limits.angleStart && normalizedAngle <= limits.angleEnd;
    const withinRadius = radius >= limits.minRadius && radius <= limits.maxRadius;
    return withinAngle && withinRadius;
  }

  clampPointToSpawnLimits(point, limits) {
    const dx = point.x - limits.centerX;
    const dy = point.y - limits.centerY;
    let angle = Math.atan2(dy, dx);
    if (angle < 0) {
      angle += Math.PI * 2;
    }

    angle = Math.max(limits.angleStart, Math.min(limits.angleEnd, angle));
    const radius = Math.max(limits.minRadius, Math.min(limits.maxRadius, Math.hypot(dx, dy)));

    return {
      x: limits.centerX + Math.cos(angle) * radius,
      y: limits.centerY + Math.sin(angle) * radius,
    };
  }

  findFreeSpawnPoint(spawnPoint, placedPositions, minDistance, limits = null) {
    const result = { x: spawnPoint.x, y: spawnPoint.y };
    let attempts = 0;

    while (attempts < 6) {
      const isTooClose = placedPositions.some((placed) => {
        const distance = Math.hypot(result.x - placed.x, result.y - placed.y);
        return distance < minDistance;
      });

      if (!isTooClose) {
        return limits ? this.clampPointToSpawnLimits(result, limits) : result;
      }

      const angleStep = Math.PI / 24;
      const radiusStep = 10;
      const angle = Math.atan2(result.y - limits.centerY, result.x - limits.centerX) + (attempts % 2 === 0 ? angleStep : -angleStep);
      const radius = Math.hypot(result.x - limits.centerX, result.y - limits.centerY) + radiusStep;
      result.x = limits.centerX + Math.cos(angle) * radius;
      result.y = limits.centerY + Math.sin(angle) * radius;

      if (limits && !this.isPointInsideSpawnLimits(result, limits)) {
        const clamped = this.clampPointToSpawnLimits(result, limits);
        result.x = clamped.x;
        result.y = clamped.y;
      }
      attempts += 1;
    }

    return limits ? this.clampPointToSpawnLimits(result, limits) : result;
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

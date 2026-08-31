export class SpawnSystem {
  constructor(levelService) {
    this.levelService = levelService;
  }

  spawnLevelItems() {
    return this.levelService.createEntitiesForCurrentLevel();
  }
}

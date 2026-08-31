export class EntityManager {
  constructor() {
    this.entities = [];
  }

  add(entity) {
    this.entities.push(entity);
    return entity;
  }

  remove(entity) {
    const index = this.entities.indexOf(entity);
    if (index >= 0) {
      this.entities.splice(index, 1);
    }
  }

  update(dt) {
    for (const entity of this.entities) {
      if (entity.active && typeof entity.update === 'function') {
        entity.update(dt);
      }
    }
    this.entities = this.entities.filter((entity) => entity.active);
  }

  render(ctx) {
    for (const entity of this.entities) {
      if (entity.visible && typeof entity.render === 'function') {
        entity.render(ctx);
      }
    }
  }

  getAll() {
    return [...this.entities];
  }
}

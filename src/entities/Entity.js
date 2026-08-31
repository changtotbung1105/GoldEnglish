import { GameObject } from './GameObject.js';

export class Entity extends GameObject {
  constructor(options = {}) {
    super(options);
    this.vx = options.vx ?? 0;
    this.vy = options.vy ?? 0;
  }

  move(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  update(dt) {
    this.move(dt);
  }
}

import { Entity } from '../Entity.js';

export class BaseItem extends Entity {
  constructor(config = {}, options = {}) {
    super({
      x: options.x ?? 0,
      y: options.y ?? 0,
      width: config.width,
      height: config.height,
    });

    this.type = config.type;
    this.spriteKey = config.spriteKey;
    this.value = config.value;
    this.weight = config.weight;
    this.color = config.color;
    this.labelKey = config.labelKey;
    this.config = config;
    this.metadata = options.metadata ?? {};
    this.attached = false;
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  onCollected() {
    this.attached = true;
  }

  render(ctx) {
    const drawn = this.game?.renderer?.drawImageByKey(
      ctx,
      this.spriteKey,
      this.x,
      this.y,
      this.width,
      this.height
    );

    if (drawn) {
      return;
    }

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(this.width, this.height) / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.type.toUpperCase(), this.x, this.y + 4);
    ctx.restore();
  }
}

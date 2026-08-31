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
    this.baseX = this.x;
    this.baseY = this.y;
    this.bobOffset = options.bobOffset ?? ((this.x + this.y) % 7);
    this.floatPhase = options.floatPhase ?? ((this.x * 0.01 + this.y * 0.01) % Math.PI);
    this.floatAmplitude = options.floatAmplitude ?? 4;
    this.floatSpeed = options.floatSpeed ?? 1.2;
    this.collectScale = 1;
    this.collectAlpha = 1;
    this.collidable = true;
  }

  update(dt) {
    if (!this.attached) {
      this.floatPhase += dt * this.floatSpeed;
      this.y = this.baseY + Math.sin(this.floatPhase + this.bobOffset) * this.floatAmplitude;
      this.x = this.baseX + Math.cos(this.floatPhase * 0.7 + this.bobOffset) * 1.2;
      return;
    }

    this.collectScale = Math.max(0.55, this.collectScale - dt * 1.6);
    this.collectAlpha = Math.max(0.35, this.collectAlpha - dt * 1.4);
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
    ctx.globalAlpha = this.collectAlpha;
    ctx.translate(this.x, this.y);
    ctx.scale(this.collectScale, this.collectScale);
    ctx.translate(-this.x, -this.y);

    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(this.width, this.height) / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.arc(this.x - 6, this.y - 6, Math.max(this.width, this.height) / 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.type.toUpperCase(), this.x, this.y + 4);
    ctx.restore();
  }
}

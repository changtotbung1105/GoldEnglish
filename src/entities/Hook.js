import { Entity } from './Entity.js';

export const HookState = Object.freeze({
  IDLE: 'idle',
  EXTENDING: 'extending',
  PULLING: 'pulling',
  RETRACTING: 'retracting',
});

export class Hook extends Entity {
  constructor(options = {}) {
    super(options);
    this.anchorX = options.anchorX ?? this.x;
    this.anchorY = options.anchorY ?? this.y;
    this.length = options.length ?? 0;
    this.minAngle = options.minAngle ?? Math.PI * 0.1;
    this.maxAngle = options.maxAngle ?? Math.PI * 0.9;
    this.angleSpeed = options.angleSpeed ?? 1.1;
    this.manualAngleSpeed = options.manualAngleSpeed ?? 1.8;
    this.autoAimSpeed = options.autoAimSpeed ?? 0.8;
    this.autoAimTargetAngle = null;
    this.reachSpeed = options.reachSpeed ?? 520;
    this.pullSpeed = options.pullSpeed ?? 260;
    this.retractSpeed = options.retractSpeed ?? 520;
    this.maxLength = options.maxLength ?? 560;
    this.chainWobble = 0;
    this.tipPulse = 0;
    this.state = HookState.IDLE;
    this.angle = options.angle ?? Math.PI / 2;
    this.direction = 1;
    this.carrying = null;
  }

  update(dt) {
    switch (this.state) {
      case HookState.IDLE:
        this.updateIdle(dt);
        break;
      case HookState.EXTENDING:
        this.updateExtending(dt);
        break;
      case HookState.PULLING:
        this.updatePulling(dt);
        break;
      case HookState.RETRACTING:
        this.updateRetracting(dt);
        break;
      default:
        break;
    }
  }

  updateIdle(dt) {
    if (this.autoAimTargetAngle !== null) {
      const diff = this.autoAimTargetAngle - this.angle;
      const step = Math.sign(diff) * this.autoAimSpeed * dt;
      if (Math.abs(diff) <= Math.abs(step)) {
        this.angle = this.autoAimTargetAngle;
        this.autoAimTargetAngle = null;
      } else {
        this.angle += step;
      }
    } else {
      this.angle += this.direction * this.angleSpeed * dt;
    }

    if (this.angle >= this.maxAngle) {
      this.angle = this.maxAngle;
      this.direction = -1;
    } else if (this.angle <= this.minAngle) {
      this.angle = this.minAngle;
      this.direction = 1;
    }
  }

  adjustAngle(delta) {
    this.angle = this.clampAngle(this.angle + delta);
    this.direction = this.angle >= this.maxAngle ? -1 : this.direction;
    this.direction = this.angle <= this.minAngle ? 1 : this.direction;
  }

  setAngle(angle) {
    this.angle = this.clampAngle(angle);
  }

  setAutoAimTarget(angle) {
    this.autoAimTargetAngle = this.clampAngle(angle);
  }

  clearAutoAimTarget() {
    this.autoAimTargetAngle = null;
  }

  clampAngle(angle) {
    return Math.max(this.minAngle, Math.min(this.maxAngle, angle));
  }

  updateExtending(dt) {
    this.length += this.reachSpeed * dt;
    this.chainWobble = Math.min(1, this.chainWobble + dt * 5);
    this.tipPulse = Math.min(1, this.tipPulse + dt * 6);

    if (this.length >= this.maxLength) {
      this.length = this.maxLength;
      this.state = HookState.RETRACTING;
    }
  }

  updatePulling(dt) {
    if (!this.carrying) {
      this.state = HookState.RETRACTING;
      return;
    }

    const hookTip = this.getTipPosition();
    this.carrying.x = hookTip.x;
    this.carrying.y = hookTip.y;
    this.chainWobble = Math.min(1, this.chainWobble + dt * 4);
    this.tipPulse = Math.max(0.2, this.tipPulse - dt * 2.5);

    this.length -= this.pullSpeed * dt;
    if (this.length <= 0) {
      this.length = 0;
      this.releaseCarriedObject();
      this.state = HookState.IDLE;
    }
  }

  updateRetracting(dt) {
    this.length -= this.retractSpeed * dt;
    this.chainWobble = Math.max(0, this.chainWobble - dt * 4.5);
    this.tipPulse = Math.max(0, this.tipPulse - dt * 3);
    if (this.length <= 0) {
      this.length = 0;
      this.state = HookState.IDLE;
    }
  }

  fire() {
    if (this.state === HookState.IDLE) {
      this.chainWobble = 0;
      this.tipPulse = 0.1;
      this.state = HookState.EXTENDING;
      return true;
    }

    return false;
  }

  attach(object) {
    this.carrying = object;
    this.state = HookState.PULLING;
  }

  releaseCarriedObject() {
    const carried = this.carrying;
    this.carrying = null;
    return carried;
  }

  reset() {
    this.length = 0;
    this.angle = this.minAngle;
    this.direction = 1;
    this.state = HookState.IDLE;
    this.carrying = null;
  }

  getTipPosition() {
    return {
      x: this.anchorX + Math.cos(this.angle) * this.length,
      y: this.anchorY + Math.sin(this.angle) * this.length,
    };
  }

  getBounds() {
    const tip = this.getTipPosition();
    return {
      x: tip.x - 6,
      y: tip.y - 6,
      width: 12,
      height: 12,
    };
  }

  render(ctx) {
    const tip = this.getTipPosition();
    const guideTip = {
      x: this.anchorX + Math.cos(this.angle) * this.maxLength,
      y: this.anchorY + Math.sin(this.angle) * this.maxLength,
    };
    const wobbleAmount = this.chainWobble * 4;
    const headRadius = 10 + this.tipPulse * 3;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 20;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(this.anchorX, this.anchorY);
    ctx.lineTo(guideTip.x, guideTip.y);
    ctx.stroke();
    ctx.setLineDash([]);

    const chainImage = this.game?.assets?.getImage('hook.chain');
    if (chainImage) {
      const chainLength = Math.hypot(tip.x - this.anchorX, tip.y - this.anchorY);
      ctx.save();
      ctx.translate(this.anchorX, this.anchorY);
      ctx.rotate(this.angle);
      ctx.globalAlpha = 0.95;
      ctx.drawImage(chainImage, 0, -4, chainLength, 8);
      ctx.restore();
    } else {
      ctx.strokeStyle = '#f2d16b';
      ctx.lineWidth = 8 + wobbleAmount * 0.35;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.anchorX, this.anchorY);
      ctx.quadraticCurveTo(
        (this.anchorX + tip.x) / 2 + Math.sin(this.angle + this.length * 0.01) * wobbleAmount,
        (this.anchorY + tip.y) / 2,
        tip.x,
        tip.y
      );
      ctx.stroke();
    }

    const headImage = this.game?.renderer?.drawImageByKey(
      ctx,
      'hook.head',
      tip.x,
      tip.y,
      16,
      16
    );

    if (!headImage) {
      ctx.fillStyle = '#d7b24a';
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, headRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.anchorX, this.anchorY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '14px Arial';
    ctx.fillText('Use Arrow Left / Right to aim', this.anchorX - 120, this.anchorY - 18);
    ctx.restore();
  }
}

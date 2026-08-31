export class MobileControls {
  constructor(game) {
    this.game = game;
    this.buttons = {
      left: { x: 0, y: 0, w: 0, h: 0, label: 'LEFT' },
      fire: { x: 0, y: 0, w: 0, h: 0, label: 'FIRE' },
      right: { x: 0, y: 0, w: 0, h: 0, label: 'RIGHT' },
    };
    this.activeButton = null;
  }

  isMobileLike() {
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
  }

  isInside(button, x, y) {
    return x >= button.x && x <= button.x + button.w && y >= button.y && y <= button.y + button.h;
  }

  updateLayout() {
    const width = this.game.width;
    const height = this.game.height;
    const safeBottom = Math.max(28, Math.round(height * 0.06));
    const padding = Math.max(20, Math.round(width * 0.04));
    const bottom = height - safeBottom;
    const size = Math.max(76, Math.round(Math.min(width, height) * 0.12));
    const fireSize = size + 16;

    this.buttons.left = {
      x: padding,
      y: bottom - size,
      w: size,
      h: size,
      label: 'LEFT',
    };

    this.buttons.fire = {
      x: Math.round(width / 2 - fireSize / 2),
      y: bottom - fireSize - 6,
      w: fireSize,
      h: fireSize,
      label: 'FIRE',
    };

    this.buttons.right = {
      x: width - padding - size,
      y: bottom - size,
      w: size,
      h: size,
      label: 'RIGHT',
    };
  }

  hitTest(x, y) {
    if (!this.isMobileLike()) {
      return null;
    }

    this.updateLayout();

    if (this.isInside(this.buttons.left, x, y)) return 'left';
    if (this.isInside(this.buttons.fire, x, y)) return 'fire';
    if (this.isInside(this.buttons.right, x, y)) return 'right';
    return null;
  }

  render(ctx) {
    if (!this.isMobileLike()) return;

    this.updateLayout();

    ctx.save();
    for (const key of ['left', 'fire', 'right']) {
      const button = this.buttons[key];
      const isFire = key === 'fire';
      const isActive = this.activeButton === key;

      ctx.save();
      ctx.shadowColor = isFire ? 'rgba(245,166,35,0.45)' : 'rgba(255,255,255,0.25)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = isFire ? 'rgba(245,166,35,0.92)' : 'rgba(255,255,255,0.14)';
      ctx.strokeStyle = isFire ? 'rgba(255,235,190,0.85)' : 'rgba(255,255,255,0.45)';
      ctx.lineWidth = isActive ? 4 : 2;
      ctx.beginPath();
      ctx.roundRect(button.x, button.y, button.w, button.h, 18);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = isFire ? 'bold 16px Arial' : 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(button.label, button.x + button.w / 2, button.y + button.h / 2);
      ctx.restore();
    }
    ctx.restore();
  }
}

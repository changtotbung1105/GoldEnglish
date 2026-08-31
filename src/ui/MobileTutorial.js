export class MobileTutorial {
  constructor() {
    this.storageKey = 'gold-miner-english-mobile-tutorial-dismissed';
    this.dismissed = this.loadDismissed();
  }

  loadDismissed() {
    try {
      return window.localStorage.getItem(this.storageKey) === '1';
    } catch {
      return false;
    }
  }

  dismiss() {
    this.dismissed = true;
    try {
      window.localStorage.setItem(this.storageKey, '1');
    } catch {
      // Ignore storage failures.
    }
  }

  shouldShow() {
    return !this.dismissed && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900);
  }

  isInsideSkip(x, y, bounds) {
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.w &&
      y >= bounds.y &&
      y <= bounds.y + bounds.h
    );
  }

  render(ctx, width, height) {
    if (!this.shouldShow()) return;

    const overlay = {
      x: 18,
      y: height - 250,
      w: width - 36,
      h: 170,
    };
    const skip = { x: overlay.x + overlay.w - 110, y: overlay.y + 18, w: 92, h: 34 };

    ctx.save();
    ctx.fillStyle = 'rgba(4, 8, 14, 0.78)';
    ctx.fillRect(overlay.x, overlay.y, overlay.w, overlay.h);
    ctx.strokeStyle = 'rgba(255, 240, 200, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(overlay.x, overlay.y, overlay.w, overlay.h);

    ctx.fillStyle = '#f6e7c1';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('How to play on mobile', overlay.x + 20, overlay.y + 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText('LEFT / RIGHT: aim the hook', overlay.x + 20, overlay.y + 72);
    ctx.fillText('FIRE: launch the hook', overlay.x + 20, overlay.y + 100);
    ctx.fillText('Tip: use arrows on desktop, touch buttons on mobile.', overlay.x + 20, overlay.y + 128);

    ctx.fillStyle = '#f5a623';
    ctx.fillRect(skip.x, skip.y, skip.w, skip.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.strokeRect(skip.x, skip.y, skip.w, skip.h);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Skip', skip.x + 28, skip.y + 22);
    ctx.restore();
  }
}

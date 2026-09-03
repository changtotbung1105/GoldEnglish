export class ViewportManager {
  constructor(canvas, logicalWidth, logicalHeight) {
    this.canvas = canvas;
    this.logicalWidth = logicalWidth;
    this.logicalHeight = logicalHeight;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scaleX = windowWidth / this.logicalWidth;
    const scaleY = windowHeight / this.logicalHeight;
    this.scale = Math.min(scaleX, scaleY);
    const displayWidth = Math.floor(this.logicalWidth * this.scale);
    const displayHeight = Math.floor(this.logicalHeight * this.scale);
    this.offsetX = Math.floor((windowWidth - displayWidth) / 2);
    this.offsetY = Math.floor((windowHeight - displayHeight) / 2);

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(displayWidth * dpr);
    this.canvas.height = Math.floor(displayHeight * dpr);
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = `${this.offsetX}px`;
    this.canvas.style.top = `${this.offsetY}px`;
    this.canvas.style.padding = '0';

    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
    }
  }

  getBounds() {
    return {
      left: this.offsetX,
      top: this.offsetY,
      width: this.logicalWidth * this.scale,
      height: this.logicalHeight * this.scale,
    };
  }
}

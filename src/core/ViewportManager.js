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
    this.offsetX = Math.floor((windowWidth - this.logicalWidth * this.scale) / 2);
    this.offsetY = Math.floor((windowHeight - this.logicalHeight * this.scale) / 2);

    this.canvas.width = this.logicalWidth;
    this.canvas.height = this.logicalHeight;
    this.canvas.style.width = `${this.logicalWidth}px`;
    this.canvas.style.height = `${this.logicalHeight}px`;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = `${this.offsetX}px`;
    this.canvas.style.top = `${this.offsetY}px`;
    this.canvas.style.transform = `scale(${this.scale})`;
    this.canvas.style.transformOrigin = 'top left';
    this.canvas.style.padding = '0';
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

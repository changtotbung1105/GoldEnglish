export class GameObject {
  constructor({ x = 0, y = 0, width = 0, height = 0, active = true, visible = true } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.active = active;
    this.visible = visible;
  }

  update(_dt) {}

  render(_ctx) {}

  destroy() {
    this.active = false;
    this.visible = false;
  }
}

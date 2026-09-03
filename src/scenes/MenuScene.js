import { Scene } from './Scene.js';

export class MenuScene extends Scene {
  constructor() {
    super('MenuScene');
    this.startButton = { x: 520, y: 350, width: 240, height: 72 };
  }

  enter() {
    this.game.eventBus.emit('menu.ready', {});
  }

  update() {
    const { pointer } = this.game.input;
    if (
      (pointer.clicked || pointer.pressed) &&
      this.isInsideStartButton(pointer.x, pointer.y)
    ) {
      this.game.changeScene('PlaygroundScene');
      return;
    }

    if (this.game.input.isKeyPressed('Enter')) {
      this.game.changeScene('PlaygroundScene');
    }
  }

  render(ctx) {
    ctx.save();
    this.drawBackground(ctx);
    this.drawTitle(ctx);
    this.drawSubtitle(ctx);
    this.drawStartButton(ctx);
    ctx.restore();
  }

  drawBackground(ctx) {
    const width = this.game.width;
    const height = this.game.height;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#101c33');
    sky.addColorStop(0.45, '#19324e');
    sky.addColorStop(1, '#2a1b12');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 226, 155, 0.12)';
    ctx.fillRect(0, 0, width, height * 0.28);
  }

  drawTitle(ctx) {
    ctx.fillStyle = '#fff3cc';
    ctx.font = 'bold 58px Georgia';
    ctx.fillText('Gold Miner', 430, 185);
    ctx.fillStyle = '#f6b94b';
    ctx.font = 'bold 58px Georgia';
    ctx.fillText('English', 645, 185);
  }

  drawSubtitle(ctx) {
    ctx.fillStyle = 'rgba(255, 248, 230, 0.92)';
    ctx.font = '20px Arial';
    ctx.fillText('Learn English by digging, aiming, and collecting.', 385, 238);
    ctx.fillStyle = 'rgba(255, 248, 230, 0.72)';
    ctx.font = '16px Arial';
    ctx.fillText('A Canvas-based learning game with Gold Miner mechanics.', 385, 264);
  }

  drawStartButton(ctx) {
    const { x, y, width, height } = this.startButton;
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#f5a623');
    gradient.addColorStop(1, '#b96d13');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = '#fff9ec';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('Start', x + 88, y + 45);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(x + 8, y + 8, width - 16, 14);
  }

  isInsideStartButton(x, y) {
    const { startButton } = this;
    return (
      x >= startButton.x &&
      x <= startButton.x + startButton.width &&
      y >= startButton.y &&
      y <= startButton.y + startButton.height
    );
  }
}

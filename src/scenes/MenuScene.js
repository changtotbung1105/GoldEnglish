import { Scene } from './Scene.js';

export class MenuScene extends Scene {
  constructor() {
    super('MenuScene');
    this.startButton = { x: 540, y: 360, width: 200, height: 64 };
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
    ctx.fillStyle = '#0c1220';
    ctx.fillRect(0, 0, this.game.width, this.game.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '48px Arial';
    ctx.fillText('Gold Miner English', 420, 200);

    ctx.font = '22px Arial';
    ctx.fillText('Learn English through the Gold Miner loop', 400, 250);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.startButton.x,
      this.startButton.y,
      this.startButton.width,
      this.startButton.height
    );

    ctx.font = '28px Arial';
    ctx.fillText('Start', this.startButton.x + 70, this.startButton.y + 40);
    ctx.restore();
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

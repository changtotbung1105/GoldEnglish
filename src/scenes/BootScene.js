import { Scene } from './Scene.js';

export class BootScene extends Scene {
  constructor() {
    super('BootScene');
  }

  enter() {
    console.log('BootScene started');
    queueMicrotask(() => {
      this.game.changeScene('MenuScene');
    });
  }

  render(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px Arial';
    ctx.fillText('Gold Miner English - Boot Scene', 40, 60);
    ctx.font = '18px Arial';
    ctx.fillText('Loading...', 40, 100);
  }
}

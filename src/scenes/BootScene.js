import { Scene } from './Scene.js';

export class BootScene extends Scene {
  constructor() {
    super('BootScene');
  }

  enter() {
    console.log('BootScene started');
    window.setTimeout(() => {
      this.game.changeScene('MenuScene');
    }, 700);
  }

  render(ctx) {
    const centerX = this.game.width / 2;
    const centerY = this.game.height / 2;

    ctx.save();
    ctx.fillStyle = '#0f1726';
    ctx.fillRect(0, 0, this.game.width, this.game.height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#fff3cc';
    ctx.font = 'bold 64px Georgia';
    ctx.fillText('Gold Miner', centerX, centerY - 34);

    ctx.fillStyle = '#f6b94b';
    ctx.font = 'bold 58px Georgia';
    ctx.fillText('English', centerX, centerY + 28);

    ctx.fillStyle = 'rgba(255, 248, 230, 0.78)';
    ctx.font = '18px Arial';
    ctx.fillText('Loading...', centerX, centerY + 92);
    ctx.restore();
  }
}

import { Scene } from './Scene.js';

export class LevelResultScene extends Scene {
  constructor() {
    super('LevelResultScene');
    this.okButton = { x: 520, y: 490, width: 240, height: 68 };
  }

  update() {
    const { pointer } = this.game.input;
    if ((pointer.clicked || pointer.pressed) && this.isInsideOkButton(pointer.x, pointer.y)) {
      this.goNext();
      return;
    }

    if (this.game.input.isKeyPressed('Enter') || this.game.input.isKeyPressed(' ')) {
      this.goNext();
    }
  }

  goNext() {
    if (this.game.settings.lastRoundResult === 'win') {
      if (this.game.settings.nextLevelId) {
        this.game.settings.currentLevelId = this.game.settings.nextLevelId;
      }
      this.game.requestSceneChange('LevelIntroScene');
      return;
    }

    this.game.requestSceneChange('PlaygroundScene');
  }

  render(ctx) {
    const width = this.game.width;
    const height = this.game.height;
    const result = this.game.settings.lastRoundResult ?? 'win';
    const nextLevelId = this.game.settings.nextLevelId ?? 'level02';
    const pass = result === 'win';

    ctx.save();
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#10223d');
    sky.addColorStop(1, '#2a1b12');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = pass ? '#7cff6b' : '#ff6b6b';
    ctx.font = 'bold 60px Georgia';
    ctx.fillText(pass ? 'PASS' : 'FAIL', width / 2, 190);

    ctx.fillStyle = '#fff3cc';
    ctx.font = 'bold 30px Georgia';
    ctx.fillText(pass ? 'You are ready for the next level' : 'Restart and try again', width / 2, 250);

    if (pass) {
      ctx.fillStyle = '#f6b94b';
      ctx.font = 'bold 42px Georgia';
      ctx.fillText(`Next: Level ${nextLevelId.replace('level', '')}`, width / 2, 320);
    }

    const { x, y, width: bw, height: bh } = this.okButton;
    const gradient = ctx.createLinearGradient(x, y, x, y + bh);
    gradient.addColorStop(0, '#f5a623');
    gradient.addColorStop(1, '#b96d13');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, bw, bh);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, bw, bh);
    ctx.fillStyle = '#fff9ec';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('OK', x + bw / 2, y + bh / 2 + 1);
    ctx.restore();
  }

  isInsideOkButton(x, y) {
    const { okButton } = this;
    return x >= okButton.x && x <= okButton.x + okButton.width && y >= okButton.y && y <= okButton.y + okButton.height;
  }
}

import { Scene } from './Scene.js';
import { levelCatalog } from '../data/levelCatalog.js';
import { vocabularyCatalog } from '../data/vocabularyCatalog.js';

export class LevelIntroScene extends Scene {
  constructor() {
    super('LevelIntroScene');
    this.okButton = { x: 540, y: 500, width: 200, height: 68 };
    this.levelId = 'level01';
    this.targetTerm = 'dog';
    this.goalCount = 8;
    this.totalCount = 10;
  }

  enter() {
    const currentLevelId = this.game.settings.currentLevelId ?? 'level01';
    const currentLevel = levelCatalog[currentLevelId] ?? levelCatalog.level01;
    this.levelId = currentLevel.id;
    this.game.settings.currentLevelId = currentLevel.id;
    const targetWordId = currentLevel.targetSequence?.[0];
    this.targetTerm = vocabularyCatalog[targetWordId]?.term ?? 'dog';
    this.goalCount = currentLevel.goalCount ?? currentLevel.targetSequence?.length ?? 8;
    this.totalCount = currentLevel.totalCount ?? currentLevel.items?.length ?? 10;
    this.nextLevelId = currentLevel.id === 'level01' ? 'level02' : 'level02';
  }

  update() {
    const { pointer } = this.game.input;
    if (
      (pointer.clicked || pointer.pressed) &&
      this.isInsideOkButton(pointer.x, pointer.y)
    ) {
      this.goToGame();
      return;
    }

    if (this.game.input.isKeyPressed('Enter') || this.game.input.isKeyPressed(' ')) {
      this.goToGame();
    }
  }

  goToGame() {
    this.game.requestSceneChange('PlaygroundScene');
  }

  render(ctx) {
    ctx.save();
    const width = this.game.width;
    const height = this.game.height;

    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#10223d');
    sky.addColorStop(0.5, '#1e3859');
    sky.addColorStop(1, '#2a1b12');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 226, 155, 0.14)';
    ctx.fillRect(0, 0, width, height * 0.28);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#fff3cc';
    ctx.font = 'bold 42px Georgia';
    ctx.fillText(`Level ${this.levelId.replace('level', '')}`, width / 2, 150);

    ctx.fillStyle = '#f6b94b';
    ctx.font = 'bold 58px Georgia';
    ctx.fillText('Target', width / 2, 235);

    ctx.fillStyle = '#7d2400';
    ctx.font = 'bold 64px Georgia';
    ctx.fillText(this.targetTerm, width / 2, 315);

    ctx.fillStyle = 'rgba(255, 248, 230, 0.9)';
    ctx.font = '20px Arial';
    ctx.fillText('Catch the matching animal picture', width / 2, 390);

    ctx.fillStyle = '#fff7e8';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Goal: ${this.goalCount}/${this.totalCount} words`, width / 2, 432);

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
    return (
      x >= okButton.x &&
      x <= okButton.x + okButton.width &&
      y >= okButton.y &&
      y <= okButton.y + okButton.height
    );
  }
}

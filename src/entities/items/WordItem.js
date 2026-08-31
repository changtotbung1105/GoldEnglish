import { BaseItem } from './BaseItem.js';

export class WordItem extends BaseItem {
  constructor(config, options = {}) {
    super(config, options);
    this.wordId = options.wordId ?? null;
    this.displayWord = options.displayWord ?? null;
    this.translation = options.translation ?? null;
    this.pronunciation = options.pronunciation ?? null;
    this.learningData = null;
  }

  render(ctx) {
    super.render(ctx);

    const label = this.displayWord ?? this.wordId ?? 'WORD';
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 4;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.strokeText(label, this.x, this.y + 6);
    ctx.fillText(label, this.x, this.y + 6);
    ctx.restore();
  }
}

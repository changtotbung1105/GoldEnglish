import { BaseItem } from './BaseItem.js';

export class WordItem extends BaseItem {
  constructor(config, options = {}) {
    super(config, options);
    this.wordId = options.wordId ?? null;
    this.displayWord = options.displayWord ?? null;
    this.translation = options.translation ?? null;
    this.pronunciation = options.pronunciation ?? null;
    this.learningData = null;
    this.spriteKey = options.spriteKey ?? this.spriteKey;
  }

  render(ctx) {
    super.render(ctx);
  }
}

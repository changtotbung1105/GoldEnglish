export class RenderContext {
  constructor(game) {
    this.game = game;
  }

  drawImageByKey(ctx, key, x, y, width, height) {
    const image = this.game.assets.getImage(key);
    if (!image) return false;

    ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
    return true;
  }
}

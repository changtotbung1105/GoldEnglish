export class MobileControls {
  constructor(game) {
    this.game = game;
  }

  isMobileLike() {
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
  }

  render() {}
}

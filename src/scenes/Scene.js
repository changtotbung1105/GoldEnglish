export class Scene {
  constructor(name) {
    this.name = name;
    this.game = null;
    this.entities = null;
  }

  setGame(game) {
    this.game = game;
    this.entities = game.entities;
  }

  enter() {}
  exit() {}
  update() {}
  render() {}
}

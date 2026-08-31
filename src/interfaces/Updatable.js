export class Updatable {
  update(_dt) {
    throw new Error('Updatable.update() must be implemented.');
  }
}

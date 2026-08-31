export class Collidable {
  getBounds() {
    throw new Error('Collidable.getBounds() must be implemented.');
  }

  intersects(other) {
    const a = this.getBounds();
    const b = other.getBounds();

    return !(
      a.x + a.width < b.x ||
      a.x > b.x + b.width ||
      a.y + a.height < b.y ||
      a.y > b.y + b.height
    );
  }
}

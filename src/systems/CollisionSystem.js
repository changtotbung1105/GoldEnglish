export class CollisionSystem {
  static intersects(a, b) {
    const ab = a.getBounds?.();
    const bb = b.getBounds?.();
    if (!ab || !bb) return false;

    return !(
      ab.x + ab.width < bb.x ||
      ab.x > bb.x + bb.width ||
      ab.y + ab.height < bb.y ||
      ab.y > bb.y + bb.height
    );
  }
}

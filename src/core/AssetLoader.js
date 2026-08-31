export class AssetLoader {
  constructor() {
    this.images = new Map();
    this.audio = new Map();
  }

  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        this.images.set(key, image);
        resolve(image);
      };
      image.onerror = reject;
      image.src = src;
    });
  }

  getImage(key) {
    return this.images.get(key);
  }

  async loadManifest(manifest = {}) {
    const imageEntries = Object.entries(manifest.images ?? {});
    await Promise.all(
      imageEntries.map(([key, src]) => this.loadImage(key, src))
    );
  }
}

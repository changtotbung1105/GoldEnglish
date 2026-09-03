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
        console.log(`[AssetLoader] loaded ${key} -> ${src}`);
        resolve(image);
      };
      image.onerror = (error) => {
        console.warn(`[AssetLoader] failed ${key} -> ${src}`);
        reject(error);
      };
      image.src = src;
    });
  }

  getImage(key) {
    return this.images.get(key);
  }

  async loadManifest(manifest = {}) {
    const imageEntries = Object.entries(manifest.images ?? {});
    await Promise.all(
      imageEntries.map(async ([key, src]) => {
        try {
          await this.loadImage(key, src);
        } catch (error) {
          console.warn(`Failed to load image ${key} from ${src}`, error);
        }
      })
    );
  }
}

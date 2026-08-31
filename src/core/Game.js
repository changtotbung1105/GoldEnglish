import { EventBus } from './EventBus.js';
import { Timer } from './Timer.js';
import { InputManager } from './InputManager.js';
import { AssetLoader } from './AssetLoader.js';
import { EntityManager } from '../entities/EntityManager.js';
import { RenderContext } from '../rendering/RenderContext.js';
import { BackgroundRenderer } from '../rendering/BackgroundRenderer.js';
import { ViewportManager } from './ViewportManager.js';

export class Game {
  constructor({ canvas, width, height, scenes = [] }) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.timer = new Timer();
    this.eventBus = new EventBus();
    this.input = new InputManager(canvas);
    this.assets = new AssetLoader();
    this.entities = new EntityManager();
    this.renderer = new RenderContext(this);
    this.background = new BackgroundRenderer();
    this.viewport = new ViewportManager(canvas, width, height);
    this.scenes = new Map();
    this.currentScene = null;
    this.isRunning = false;

    this.input.setViewport(this.viewport);
    this.viewport.resize();
    window.addEventListener('resize', () => this.viewport.resize());
    window.addEventListener('orientationchange', () => this.viewport.resize());

    for (const scene of scenes) {
      this.registerScene(scene);
    }
  }

  registerScene(scene) {
    scene.setGame(this);
    this.scenes.set(scene.name, scene);
  }

  start(sceneName) {
    this.input.attach();
    this.isRunning = true;
    this.changeScene(sceneName ?? [...this.scenes.keys()][0]);
    requestAnimationFrame((time) => this.loop(time));
  }

  async preload(manifest) {
    await this.assets.loadManifest(manifest);
  }

  changeScene(sceneName) {
    const nextScene = this.scenes.get(sceneName);
    if (!nextScene) {
      throw new Error(`Scene not found: ${sceneName}`);
    }

    if (this.currentScene?.exit) {
      this.currentScene.exit();
    }

    this.currentScene = nextScene;
    if (this.currentScene.enter) {
      this.currentScene.enter();
    }
  }

  loop(now) {
    if (!this.isRunning) return;

    const dt = this.timer.tick(now);

    if (this.currentScene?.update) {
      this.currentScene.update(dt);
    }

    this.entities.update(dt);

    this.clear();

    if (this.currentScene?.renderBackground) {
      this.currentScene.renderBackground(this.context, this.background, this.timer.elapsedTime);
    } else if (this.currentScene?.name) {
      this.background.render(this.context, this.canvas.width, this.canvas.height, this.timer.elapsedTime);
    }

    if (this.currentScene?.render) {
      this.currentScene.render(this.context);
    }

    this.entities.render(this.context);

    this.input.update();

    requestAnimationFrame((time) => this.loop(time));
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

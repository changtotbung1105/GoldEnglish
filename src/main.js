import { Game } from './core/Game.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { LevelIntroScene } from './scenes/LevelIntroScene.js';
import { LevelResultScene } from './scenes/LevelResultScene.js';
import { PlaygroundScene } from './scenes/PlaygroundScene.js';
import { assetManifest } from './data/assetManifest.js';

const canvas = document.getElementById('game-canvas');

const game = new Game({
  canvas,
  width: 1280,
  height: 720,
  scenes: [new BootScene(), new MenuScene(), new LevelIntroScene(), new LevelResultScene(), new PlaygroundScene()],
});

await game.preload(assetManifest).catch(() => {
  console.warn('Asset preload failed, fallback rendering will be used.');
});

game.start();

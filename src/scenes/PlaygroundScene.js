import { Scene } from './Scene.js';
import { Hook } from '../entities/Hook.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { viLocale } from '../data/locales/vi.js';
import { enLocale } from '../data/locales/en.js';
import { LocalizationService } from '../services/LocalizationService.js';
import { LearningService } from '../services/LearningService.js';
import { GameStateService } from '../services/GameStateService.js';
import { LevelService } from '../services/LevelService.js';
import { Hud } from '../ui/Hud.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { VoiceService } from '../services/VoiceService.js';

export class PlaygroundScene extends Scene {
  constructor() {
    super('PlaygroundScene');
    this.hook = null;
    this.items = [];
    this.totalItems = 0;
    this.collectedItems = 0;
    this.localization = null;
    this.learning = null;
    this.state = null;
    this.levels = null;
    this.spawner = null;
    this.hud = null;
    this.voice = null;
    this.hudMessage = '';
    this.currentLevelId = 'level01';
  }

  enter() {
    this.localization = new LocalizationService(viLocale);
    this.learning = new LearningService(this.game.eventBus, this.localization);
    this.state = new GameStateService(this.game.eventBus);
    this.levels = new LevelService(this.game.eventBus, this.learning, this.state);
    this.spawner = new SpawnSystem(this.levels);
    this.voice = new VoiceService(this.game.eventBus, this.localization);
    this.levels.loadLevel(this.currentLevelId);

    this.hook = new Hook({
      x: 640,
      y: 120,
      anchorX: 640,
      anchorY: 120,
      minAngle: Math.PI * 0.1,
      maxAngle: Math.PI * 0.9,
      maxLength: 560,
      reachSpeed: 520,
      pullSpeed: 300,
      retractSpeed: 520,
    });

    this.entities.add(this.hook);
    this.spawnLevelItems();
    this.hudMessage = this.localization.t('hud.fire');
    this.hud = new Hud(this.game, this.localization, this.state, this.learning);
    this.hud.bind();
    console.log('PlaygroundScene started');
  }

  exit() {
    if (this.hook) {
      this.entities.remove(this.hook);
      this.hook = null;
    }

    for (const item of this.items) {
      this.entities.remove(item);
    }

    this.items = [];
    this.totalItems = 0;
    this.collectedItems = 0;
    this.learning = null;
    this.localization = null;
    this.levels = null;
    this.spawner = null;
    this.voice = null;
    if (this.hud) {
      this.hud.destroy();
      this.hud = null;
    }
    this.state = null;
  }

  spawnLevelItems() {
    this.items = this.spawner.spawnLevelItems();
    this.totalItems = this.items.length;
    this.collectedItems = 0;
    for (const item of this.items) {
      this.entities.add(item);
    }
  }

  update(dt) {
    if (this.game.input.pointer.clicked && this.hud) {
      const { x, y } = this.game.input.pointer;

      if (this.state?.roundResult === 'win' && this.hud.isInsideNextButton(x, y)) {
        const nextLevelId = this.levels?.getNextLevelId();
        if (nextLevelId) {
          this.currentLevelId = nextLevelId;
          this.game.changeScene('PlaygroundScene');
        }
        return;
      }

      if (this.hud.isInsideRestartButton(x, y)) {
        this.game.changeScene('PlaygroundScene');
        return;
      }
    }

    if (!this.state?.roundActive) {
      return;
    }

    this.state?.update(dt);

    if (this.hook.state === 'idle') {
      if (this.game.input.isKeyDown('ArrowLeft')) {
        this.hook.adjustAngle(-this.hook.manualAngleSpeed * dt);
      }

      if (this.game.input.isKeyDown('ArrowRight')) {
        this.hook.adjustAngle(this.hook.manualAngleSpeed * dt);
      }
    }

    if (this.game.input.isKeyPressed(' ') || this.game.input.isKeyPressed('Space')) {
      this.hook.fire();
    }

    if ((this.game.input.isKeyPressed('v') || this.game.input.isKeyPressed('V')) && this.learning.getCurrentPrompt()) {
      this.voice?.setTarget(this.learning.getCurrentPrompt());
      this.voice?.start();
    }

    if (this.game.input.pointer.clicked && this.learning.getCurrentPrompt() && this.hud) {
      const { x, y } = this.game.input.pointer;
      if (this.hud.isInsideSpeakButton(x, y)) {
        this.voice?.setTarget(this.learning.getCurrentPrompt());
        this.voice?.start();
      }
    }

    if (this.hook.state === 'extending') {
      for (const item of this.items) {
        if (!item.active || item.attached) continue;

        if (CollisionSystem.intersects(this.hook, item)) {
          item.onCollected();
          this.hook.attach(item);
          this.learning.onItemCollected(item);

          const prompt = this.learning.getCurrentPrompt();
          this.hudMessage = prompt
            ? `${this.localization.t('item.word')}: ${prompt.term} - ${prompt.translation}`
            : this.localization.t('hud.fire');

          if (item.type === 'gold') {
            this.state.addScore(item.value);
            this.state.setOutcome('success', `+${item.value} Gold`);
          } else if (item.type === 'bomb') {
            this.state.addScore(item.value);
            this.state.setOutcome('danger', 'Boom! Bomb hit');
          } else if (item.type === 'word') {
            this.state.addScore(item.value);
            this.state.setOutcome('success', `Word collected: ${prompt.term}`);
            this.hudMessage = 'Press V to speak the word';
          }

          this.collectedItems += 1;
          if (this.collectedItems >= this.totalItems) {
            this.state.endRound('win', 'Level cleared!');
            this.hudMessage = 'Level cleared! Click Next';
          }
          break;
        }
      }
    }
  }

  render(ctx) {
    this.hud?.render(ctx);
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText(`EN preview: ${enLocale['hud.fire']}`, 40, 190);
  }
}

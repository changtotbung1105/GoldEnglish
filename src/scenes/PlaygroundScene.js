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
import { MobileControls } from '../ui/MobileControls.js';
import { MobileTutorial } from '../ui/MobileTutorial.js';
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
    this.mobileControls = null;
    this.mobileTutorial = null;
    this.voice = null;
    this.hudMessage = '';
    this.currentLevelId = 'level01';
    this.currentTarget = null;
    this.levelTargetOff = null;
  }

  enter() {
    this.localization = new LocalizationService(viLocale);
    this.learning = new LearningService(this.game.eventBus, this.localization);
    this.state = new GameStateService(this.game.eventBus);
    this.levels = new LevelService(this.game.eventBus, this.learning, this.state);
    this.spawner = new SpawnSystem(this.levels);
    this.voice = new VoiceService(this.game.eventBus, this.localization);
    this.levelTargetOff = this.game.eventBus.on('level.target.changed', ({ target }) => {
      this.currentTarget = target;
      if (this.hud) {
        this.hud.target = target;
      }
    });
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
    this.hud.target = this.currentTarget;
    this.mobileControls = new MobileControls(this.game);
    this.mobileTutorial = new MobileTutorial();
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
    this.mobileControls = null;
    this.mobileTutorial = null;
    this.state = null;
    if (this.levelTargetOff) {
      this.levelTargetOff();
      this.levelTargetOff = null;
    }
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

      if (this.mobileTutorial?.shouldShow()) {
        const skipBounds = {
          x: 18 + (this.game.width - 36) - 110,
          y: this.game.height - 250 + 18,
          w: 92,
          h: 34,
        };
        if (this.mobileTutorial.isInsideSkip(x, y, skipBounds)) {
          this.mobileTutorial.dismiss();
          return;
        }
      }

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

    const mobileHit = this.mobileControls?.hitTest(this.game.input.pointer.x, this.game.input.pointer.y);
    if (this.mobileControls) {
      this.mobileControls.activeButton = mobileHit;
    }
    const isTouchingControls = this.game.input.pointer.down || this.game.input.pointer.pressed;
    if (isTouchingControls) {
      if (mobileHit === 'left') {
        this.game.input.keysDown.add('ArrowLeft');
      } else if (mobileHit === 'right') {
        this.game.input.keysDown.add('ArrowRight');
      } else if (mobileHit === 'fire' && this.game.input.pointer.clicked) {
        this.game.input.keysPressed.add(' ');
      }
    }

    if (!this.state?.roundActive) {
      return;
    }

    this.state?.update(dt);

    if (this.hook.state === 'idle') {
      const manualLeft = this.game.input.isKeyDown('ArrowLeft');
      const manualRight = this.game.input.isKeyDown('ArrowRight');
      const directPointerAim = this.game.input.pointer.down && !mobileHit;

      if (manualLeft || manualRight || directPointerAim) {
        this.hook.clearAutoAimTarget();
      }

      if (manualLeft) {
        this.hook.adjustAngle(-this.hook.manualAngleSpeed * dt);
      }

      if (manualRight) {
        this.hook.adjustAngle(this.hook.manualAngleSpeed * dt);
      }

      if (directPointerAim) {
        const targetAngle = this.getPointerAimAngle();
        if (targetAngle !== null) {
          this.hook.setAngle(targetAngle);
        }
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
        if (!item.active || item.attached || item.collidable === false) continue;

        if (CollisionSystem.intersects(this.hook, item)) {
          const shouldAttach = this.handleCollectedItem(item);
          if (shouldAttach) {
            item.onCollected();
            this.hook.attach(item);
          } else {
            this.hook.state = 'retracting';
          }
          break;
        }
      }
    }
  }

  getPointerAimAngle() {
    const pointer = this.game.input.pointer;
    const dx = pointer.x - this.hook.anchorX;
    const dy = pointer.y - this.hook.anchorY;
    if (dx === 0 && dy === 0) {
      return null;
    }

    const angle = Math.atan2(dy, dx);
    return this.hook.clampAngle(angle < 0 ? angle + Math.PI * 2 : angle);
  }

  handleCollectedItem(item) {
    if (item.type === 'word') {
      const correctTarget = this.currentTarget;
      const isCorrect = !!correctTarget && item.wordId === correctTarget.id;

      if (isCorrect) {
        this.learning.onItemCollected(item);
        this.state.addScore(item.value);
        this.state.setOutcome('success', `Correct: ${correctTarget.term}`);
        this.hudMessage = `Correct: ${correctTarget.term}`;
        this.currentTarget = this.levels.advanceTarget();
        this.collectedItems += 1;
        return true;
      } else {
        this.state.setOutcome('danger', `Wrong word: ${item.displayWord ?? item.wordId}`);
        this.hudMessage = `Wrong! Need: ${correctTarget?.term ?? '---'}`;
        item.collidable = false;
        return false;
      }
    } else if (item.type === 'gold') {
      this.state.addScore(item.value);
      this.state.setOutcome('success', `+${item.value} Gold`);
      this.hudMessage = 'Gold collected';
      return false;
    } else if (item.type === 'bomb') {
      this.state.addScore(item.value);
      this.state.setOutcome('danger', 'Boom! Bomb hit');
      this.hudMessage = 'Avoid bombs';
      item.collidable = false;
      return false;
    }

    if (!this.currentTarget && this.state.roundActive) {
      this.state.endRound('win', 'All target words cleared!');
      this.hudMessage = 'All target words cleared! Click Next';
    }

    return false;
  }

  render(ctx) {
    this.hud?.render(ctx);
    this.mobileControls?.render(ctx);
    this.mobileTutorial?.render(ctx, this.game.width, this.game.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText(`EN preview: ${enLocale['hud.fire']}`, 40, 190);
  }
}

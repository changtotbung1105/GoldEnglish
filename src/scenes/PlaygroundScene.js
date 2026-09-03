import { Scene } from './Scene.js';
import { Hook } from '../entities/Hook.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { viLocale } from '../data/locales/vi.js';
import { enLocale } from '../data/locales/en.js';
import { koLocale } from '../data/locales/ko.js';
import { jaLocale } from '../data/locales/ja.js';
import { zhLocale } from '../data/locales/zh.js';
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
    this.timeExpiredOff = null;
    this.wrongAttempts = 0;
    this.roundLocked = false;
    this.maxWrongAttempts = 0;
    this.languageCode = 'vi';
  }

  enter() {
    this.languageCode = this.game.settings?.languageCode ?? localStorage.getItem('goldenglish.languageCode') ?? 'vi';
    this.currentLevelId = this.game.settings.currentLevelId ?? this.currentLevelId ?? 'level01';
    this.localization = new LocalizationService(this.getLocaleByCode(this.languageCode), this.languageCode);
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
    this.timeExpiredOff = this.game.eventBus.on('game.time.expired', () => {
      this.resolveRoundAtTimeUp();
    });
    this.levels.loadLevel(this.currentLevelId);
    this.maxWrongAttempts = this.levels.getCurrentLevel()?.maxWrongAttempts ?? 0;

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
    this.wrongAttempts = 0;
    this.roundLocked = false;
    this.maxWrongAttempts = this.levels.getCurrentLevel()?.maxWrongAttempts ?? 0;
    this.hud = new Hud(this.game, this.localization, this.state, this.learning);
    this.hud.bind();
    this.hud.target = this.currentTarget;
    this.mobileControls = new MobileControls(this.game);
    this.mobileTutorial = new MobileTutorial();
    console.log('PlaygroundScene started');
  }

  getLocaleByCode(languageCode) {
    const locales = {
      vi: viLocale,
      en: enLocale,
      ko: koLocale,
      ja: jaLocale,
      zh: zhLocale,
    };

    return locales[languageCode] ?? viLocale;
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
    this.wrongAttempts = 0;
    this.roundLocked = false;
    this.maxWrongAttempts = 0;
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
    if (this.timeExpiredOff) {
      this.timeExpiredOff();
      this.timeExpiredOff = null;
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
          this.game.settings.currentLevelId = nextLevelId;
          this.game.requestSceneChange('PlaygroundScene');
        }
        return;
      }

      if (this.hud.isInsideRestartButton(x, y)) {
        this.game.requestSceneChange('PlaygroundScene');
        return;
      }

      if (this.hud.isInsideHelpButton(x, y)) {
        this.hud.toggleHelp();
        return;
      }

      if (this.hud.isInsideSpeakButton(x, y) && this.learning.getCurrentPrompt()) {
        this.voice?.setTarget(this.learning.getCurrentPrompt());
        this.voice?.start();
        return;
      }
    }

    const isMobileLike = this.mobileControls?.isMobileLike?.() ?? false;
    const tapPoint = this.game.input.pointer.clicked ? { x: this.game.input.pointer.x, y: this.game.input.pointer.y } : null;
    if (this.mobileControls) {
      this.mobileControls.activeButton = null;
    }

    if (isMobileLike && tapPoint && this.state?.roundActive) {
      const hitItem = this.getItemAtPoint(tapPoint.x, tapPoint.y);
      if (this.hook.state === 'idle') {
        const targetAngle = this.getPointerAimAngle(tapPoint.x, tapPoint.y);
        if (targetAngle !== null) {
          this.hook.setAngle(targetAngle);
        }

        if (hitItem) {
          this.hook.fire();
          return;
        }
      }
    }

    if (!this.state?.roundActive) {
      return;
    }

    this.state?.update(dt);

    if (this.hook.state === 'idle') {
      const manualLeft = this.game.input.isKeyDown('ArrowLeft');
      const manualRight = this.game.input.isKeyDown('ArrowRight');
      const directPointerAim = this.game.input.pointer.down && !isMobileLike;

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

  resolveRoundAtTimeUp() {
    if (!this.state?.roundActive) {
      return;
    }

    const level = this.levels?.getCurrentLevel();
    const goalCount = level?.goalCount ?? this.levels?.getTargetSequence()?.length ?? 0;
    const success = this.collectedItems >= goalCount;

    this.state.endRound(
      success ? 'win' : 'lose',
      success
        ? `Goal reached: ${this.collectedItems}/${goalCount}`
        : `Need ${goalCount} words, got ${this.collectedItems}`
    );

    this.game.settings.lastRoundResult = success ? 'win' : 'lose';
    this.game.settings.nextLevelId = this.levels?.getNextLevelId() ?? null;
    this.game.requestSceneChange('LevelResultScene');
  }

  getPointerAimAngle(x = this.game.input.pointer.x, y = this.game.input.pointer.y) {
    const dx = x - this.hook.anchorX;
    const dy = y - this.hook.anchorY;
    if (dx === 0 && dy === 0) {
      return null;
    }

    const angle = Math.atan2(dy, dx);
    return this.hook.clampAngle(angle < 0 ? angle + Math.PI * 2 : angle);
  }

  getItemAtPoint(x, y) {
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const item = this.items[i];
      if (!item.active || item.attached || item.collidable === false) continue;

      const radius = item.radius ?? Math.max(item.width ?? 40, item.height ?? 40) * 0.5;
      const dx = x - item.x;
      const dy = y - item.y;
      if (dx * dx + dy * dy <= radius * radius) {
        return item;
      }
    }

    return null;
  }

  handleCollectedItem(item) {
    if (this.roundLocked || !this.state?.roundActive) {
      return false;
    }

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

        const allItemsCollected = this.collectedItems >= this.totalItems;
        if (allItemsCollected && this.state.roundActive) {
          this.resolveRoundAtTimeUp();
        }

        return true;
      }

      this.wrongAttempts += 1;
      this.state.setOutcome('danger', `Wrong word: ${item.displayWord ?? item.wordId}`);
      this.hudMessage = `Wrong! Need: ${correctTarget?.term ?? '---'}`;
      if (this.wrongAttempts > this.maxWrongAttempts && this.state.roundActive) {
        this.state.endRound('lose', 'Too many wrong words. Restart required!');
        this.hudMessage = 'Too many wrong words. Press Restart';
        this.roundLocked = true;
        this.game.settings.lastRoundResult = 'lose';
        this.game.settings.nextLevelId = this.levels?.getNextLevelId() ?? null;
        this.game.requestSceneChange('LevelResultScene');
        if (this.hook) {
          this.hook.state = 'retracting';
          this.hook.carrying = null;
        }
      }
      return false;
    }

    if (item.type === 'gold') {
      this.state.addScore(item.value);
      this.state.setOutcome('success', `+${item.value} Gold`);
      this.hudMessage = 'Gold collected';
      return false;
    }

    if (item.type === 'bomb') {
      this.state.addScore(item.value);
      this.state.setOutcome('danger', 'Boom! Bomb hit');
      this.hudMessage = 'Avoid bombs';
      item.collidable = false;
      return false;
    }

    return false;
  }

  render(ctx) {
    this.hud?.render(ctx);
    this.mobileControls?.render(ctx);
    this.mobileTutorial?.render(ctx, this.game.width, this.game.height);
  }
}


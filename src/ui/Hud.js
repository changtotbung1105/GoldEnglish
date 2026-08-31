export class Hud {
  constructor(game, localizationService, gameStateService, learningService) {
    this.game = game;
    this.localization = localizationService;
    this.state = gameStateService;
    this.learning = learningService;
    this.prompt = null;
    this.target = null;
    this.message = this.localization.t('hud.fire');
    this.helpOpen = false;
    this.unsubscribe = [];
    this.speakButton = { x: 0, y: 0, width: 82, height: 26 };
    this.restartButton = { x: 0, y: 0, width: 82, height: 26 };
    this.helpButton = { x: 0, y: 0, width: 56, height: 26 };
    this.nextButton = { x: 0, y: 0, width: 64, height: 26 };
  }

  bind() {
    this.unsubscribe.push(
      this.game.eventBus.on('learning.word.collected', ({ prompt }) => {
        this.prompt = prompt;
        this.message = `${this.localization.t('item.word')}: ${prompt.term} - ${prompt.translation}`;
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('level.target.changed', ({ target }) => {
        this.target = target;
        this.message = target
          ? `Bắt: ${target.translation?.vi ?? target.term}`
          : 'Level complete. Click Next';
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('game.score.changed', ({ score }) => {
        this.score = score;
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('game.time.changed', ({ timeLeft }) => {
        this.timeLeft = timeLeft;
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('game.outcome.changed', ({ lastOutcome }) => {
        this.outcome = lastOutcome;
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('game.round.ended', ({ roundResult }) => {
        this.message = roundResult === 'win' ? 'You win! Press Next' : 'Game over. Press Restart';
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('learning.item.collected', ({ item }) => {
        if (item.type !== 'word') {
          this.message = `${this.localization.t(`item.${item.type}`, item.type)} collected`;
        }
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('voice.started', () => {
        this.message = 'Listening... say the word now';
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('voice.result', ({ success, message }) => {
        this.message = message;
        this.outcome = {
          type: success ? 'success' : 'danger',
          message,
        };
      })
    );

    this.unsubscribe.push(
      this.game.eventBus.on('voice.error', () => {
        this.message = 'Voice input is not available';
      })
    );
  }

  render(ctx) {
    const score = this.state.score;
    const timeLeft = this.state.timeLeft;
    const targetText = this.target?.translation?.vi ?? '---';
    const level = this.game.currentScene?.currentLevelId?.replace('level', '') ?? '1';
    this.layoutButtons();

    ctx.save();
    const barHeight = 78;
    ctx.fillStyle = 'rgba(245, 190, 58, 0.95)';
    ctx.fillRect(0, 0, this.game.width, barHeight);
    ctx.strokeStyle = '#8d6414';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.game.width, barHeight);

    ctx.fillStyle = '#7b5a14';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`Money: ${score}`, 18, 28);
    ctx.fillText(`Goal: ${this.target ? 1 : 0}`, 18, 54);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#7d2400';
    ctx.font = 'bold 22px Arial';
    ctx.fillText(targetText, this.game.width / 2, 46);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#7b5a14';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`Time: ${Math.ceil(timeLeft)}`, this.game.width - 18, 28);
    ctx.fillText(`Level: ${level}`, this.game.width - 18, 54);

    this.drawButton(ctx, this.speakButton, 'Speak', '#2d7dd2');
    this.drawButton(ctx, this.restartButton, 'Restart', '#8c4a2f');
    this.drawButton(ctx, this.helpButton, 'Help', '#8a6c18');

    if (this.state.roundResult === 'win') {
      this.drawButton(ctx, this.nextButton, 'Next', '#3c9d5d');
      ctx.fillStyle = '#7d2400';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Level cleared!', this.game.width / 2, 72);
    }

    if (this.helpOpen) {
      this.drawHelpPanel(ctx);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff7e8';
    ctx.font = '14px Arial';
    ctx.fillText(this.message, 18, barHeight + 20);

    if (this.outcome) {
      ctx.fillStyle = this.outcome.type === 'success' ? '#7cff6b' : '#ff6b6b';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(this.outcome.message, 18, barHeight + 42);
    }

    ctx.restore();
  }

  layoutButtons() {
    const barY = 0;
    const gap = 8;
    const totalWidth =
      this.speakButton.width +
      this.restartButton.width +
      this.helpButton.width +
      gap * 2;
    const startX = Math.round((this.game.width - totalWidth) / 2);

    this.speakButton.x = startX;
    this.speakButton.y = barY;

    this.restartButton.x = this.speakButton.x + this.speakButton.width + gap;
    this.restartButton.y = barY;

    this.helpButton.x = this.restartButton.x + this.restartButton.width + gap;
    this.helpButton.y = barY;

    this.nextButton.x = this.helpButton.x + this.helpButton.width + gap;
    this.nextButton.y = barY;
  }

  drawButton(ctx, rect, label, fillStyle) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + 1);
    ctx.restore();
  }

  drawHelpPanel(ctx) {
    const x = 30;
    const y = 92;
    const w = 440;
    const h = 156;

    ctx.save();
    ctx.fillStyle = 'rgba(18, 22, 30, 0.92)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(255, 214, 122, 0.7)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = '#fff3cc';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('How to play', x + 16, y + 26);

    ctx.fillStyle = '#f9f0da';
    ctx.font = '14px Arial';
    ctx.fillText('1. Read the Vietnamese meaning on the top bar.', x + 16, y + 54);
    ctx.fillText('2. Rotate the hook with Arrow Left / Right or drag.', x + 16, y + 78);
    ctx.fillText('3. Catch the English word that matches the meaning.', x + 16, y + 102);
    ctx.fillText('4. Wrong catch is allowed, but it gives no score.', x + 16, y + 126);
    ctx.fillText('5. Press Space to fire the hook.', x + 16, y + 150);
    ctx.restore();
  }

  isInsideSpeakButton(x, y) {
    const { speakButton } = this;
    return (
      x >= speakButton.x &&
      x <= speakButton.x + speakButton.width &&
      y >= speakButton.y &&
      y <= speakButton.y + speakButton.height
    );
  }

  isInsideRestartButton(x, y) {
    const { restartButton } = this;
    return (
      x >= restartButton.x &&
      x <= restartButton.x + restartButton.width &&
      y >= restartButton.y &&
      y <= restartButton.y + restartButton.height
    );
  }

  isInsideNextButton(x, y) {
    const { nextButton } = this;
    return (
      x >= nextButton.x &&
      x <= nextButton.x + nextButton.width &&
      y >= nextButton.y &&
      y <= nextButton.y + nextButton.height
    );
  }

  isInsideHelpButton(x, y) {
    const { helpButton } = this;
    return (
      x >= helpButton.x &&
      x <= helpButton.x + helpButton.width &&
      y >= helpButton.y &&
      y <= helpButton.y + helpButton.height
    );
  }

  toggleHelp() {
    this.helpOpen = !this.helpOpen;
  }

  destroy() {
    for (const off of this.unsubscribe) {
      off();
    }
    this.unsubscribe = [];
  }
}

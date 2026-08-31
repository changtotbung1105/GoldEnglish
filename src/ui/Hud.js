export class Hud {
  constructor(game, localizationService, gameStateService, learningService) {
    this.game = game;
    this.localization = localizationService;
    this.state = gameStateService;
    this.learning = learningService;
    this.prompt = null;
    this.target = null;
    this.message = this.localization.t('hud.fire');
    this.unsubscribe = [];
    this.speakButton = { x: 40, y: 230, width: 130, height: 38 };
    this.restartButton = { x: 190, y: 230, width: 130, height: 38 };
    this.nextButton = { x: 340, y: 150, width: 130, height: 38 };
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
          ? `Catch this word: ${target.term}`
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
    const isRoundOver = !this.state.roundActive;
    const isCompact = this.game.width < 1000 || this.game.height < 700;

    ctx.save();
    const panelWidth = isCompact ? this.game.width - 32 : 620;
    const panelHeight = isCompact ? 220 : 180;
    this.drawPanel(ctx, 16, 16, panelWidth, panelHeight);

    ctx.fillStyle = '#f6e7c1';
    ctx.font = '700 24px Arial';
    ctx.fillText('Gold English', 32, 44);

    const badgeW = isCompact ? 112 : 125;
    const badgeGap = 10;
    this.drawBadge(ctx, 32, 56, badgeW, 34, '#1f5f8b', `Score  ${score}`);
    this.drawBadge(ctx, 32 + badgeW + badgeGap, 56, badgeW, 34, '#8a5f1f', `Time  ${Math.ceil(timeLeft)}`);

    this.drawTargetCard(
      ctx,
      isCompact ? 32 : 32,
      isCompact ? 108 : 108,
      isCompact ? panelWidth - 64 : 330,
      isCompact ? 78 : 72,
      this.target
    );

    ctx.fillStyle = '#f9f0da';
    ctx.font = isCompact ? '15px Arial' : '16px Arial';
    ctx.fillText(this.message, isCompact ? 32 : 380, isCompact ? 140 : 136);

    if (this.outcome) {
      const outcomeColor = this.outcome.type === 'success' ? '#7CFF6B' : '#FF6B6B';
      ctx.fillStyle = outcomeColor;
      ctx.font = 'bold 20px Arial';
      ctx.fillText(this.outcome.message, 32, isRoundOver ? (isCompact ? panelHeight - 18 : 162) : (isCompact ? 178 : 162));
    }

    this.drawButton(ctx, this.speakButton, 'Speak', '#2d7dd2');
    this.drawButton(ctx, this.restartButton, 'Restart', '#8c4a2f');

    if (this.state.roundResult === 'win') {
      ctx.fillStyle = '#7CFF6B';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Level cleared! Click Next', 40, 214);
      this.drawButton(ctx, this.nextButton, 'Next', '#3c9d5d');
    }

    ctx.restore();
  }

  drawPanel(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(9, 13, 20, 0.72)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(255, 240, 200, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255, 215, 125, 0.15)';
    ctx.fillRect(x + 1, y + 1, w - 2, 12);
    ctx.restore();
  }

  drawBadge(ctx, x, y, w, h, color, text) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#fff7e8';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(text, x + 12, y + 22);
    ctx.restore();
  }

  drawPromptCard(ctx, x, y, w, h, prompt) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 248, 230, 0.92)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(140, 92, 34, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#3b2a18';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(prompt.term, x + 12, y + 24);
    ctx.font = '14px Arial';
    ctx.fillText(prompt.pronunciation, x + 12, y + 46);
    ctx.fillText(prompt.translation, x + 12, y + 66);
    ctx.restore();
  }

  drawTargetCard(ctx, x, y, w, h, target) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 248, 230, 0.96)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(140, 92, 34, 0.75)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = '#7b4a11';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('NGHIA TIENG VIET', x + 14, y + 20);

    ctx.fillStyle = '#2b1c10';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(target?.translation?.vi ?? '---', x + 14, y + 50);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#6d4b23';
    ctx.fillText(target ? `${target.term}  |  ${target.pronunciation}` : 'Cho muc tieu tiep theo', x + 14, y + 68);
    ctx.restore();
  }

  drawButton(ctx, rect, label, fillStyle) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(label, rect.x + 28, rect.y + 25);
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

  destroy() {
    for (const off of this.unsubscribe) {
      off();
    }
    this.unsubscribe = [];
  }
}

export class Hud {
  constructor(game, localizationService, gameStateService, learningService) {
    this.game = game;
    this.localization = localizationService;
    this.state = gameStateService;
    this.learning = learningService;
    this.prompt = null;
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

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(24, 20, 520, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 40, 52);
    ctx.fillText(`Time: ${timeLeft}`, 40, 82);

    ctx.font = '20px Arial';
    ctx.fillText(this.message, 40, 112);

    if (this.prompt) {
      ctx.font = '18px Arial';
      ctx.fillText(`Prompt: ${this.prompt.term} ${this.prompt.pronunciation}`, 280, 52);
      ctx.fillText(`Meaning: ${this.prompt.translation}`, 280, 82);
      ctx.fillText(`Example: ${this.prompt.example}`, 280, 112);
    }

    if (this.outcome) {
      ctx.fillStyle = this.outcome.type === 'success' ? '#7CFF6B' : '#FF6B6B';
      ctx.font = '22px Arial';
      ctx.fillText(this.outcome.message, 40, 146);
    }

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.speakButton.x,
      this.speakButton.y,
      this.speakButton.width,
      this.speakButton.height
    );
    ctx.font = '20px Arial';
    ctx.fillText('Speak', this.speakButton.x + 28, this.speakButton.y + 26);

    ctx.strokeRect(
      this.restartButton.x,
      this.restartButton.y,
      this.restartButton.width,
      this.restartButton.height
    );
    ctx.fillText('Restart', this.restartButton.x + 18, this.restartButton.y + 26);

    if (this.state.roundResult === 'win') {
      ctx.fillStyle = '#7CFF6B';
      ctx.font = '22px Arial';
      ctx.fillText('Level cleared! Click Next', 40, 172);

      ctx.strokeRect(
        this.nextButton.x,
        this.nextButton.y,
        this.nextButton.width,
        this.nextButton.height
      );
      ctx.fillText('Next', this.nextButton.x + 40, this.nextButton.y + 26);
    }

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

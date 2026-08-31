export class GameStateService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.score = 0;
    this.timeLeft = 60;
    this.roundActive = true;
    this.lastOutcome = null;
    this.roundResult = null;
  }

  update(dt) {
    if (!this.roundActive || this.timeLeft <= 0) {
      return;
    }

    this.setTimeLeft(this.timeLeft - dt);
  }

  reset({ score = 0, timeLeft = 60 } = {}) {
    this.score = score;
    this.timeLeft = timeLeft;
    this.roundActive = true;
    this.lastOutcome = null;
    this.roundResult = null;
    this.eventBus.emit('game.state.changed', this.getSnapshot());
  }

  addScore(amount) {
    this.score += amount;
    this.eventBus.emit('game.score.changed', this.getSnapshot());
  }

  setTimeLeft(timeLeft) {
    this.timeLeft = Math.max(0, timeLeft);
    if (this.timeLeft === 0) {
      this.endRound('lose', 'Time is up!');
    }
    this.eventBus.emit('game.time.changed', this.getSnapshot());
  }

  setOutcome(type, message) {
    this.lastOutcome = { type, message };
    this.eventBus.emit('game.outcome.changed', this.getSnapshot());
  }

  endRound(result, message) {
    this.roundActive = false;
    this.roundResult = result;
    this.lastOutcome = { type: result === 'win' ? 'success' : 'danger', message };
    this.eventBus.emit('game.round.ended', this.getSnapshot());
    this.eventBus.emit('game.outcome.changed', this.getSnapshot());
  }

  getSnapshot() {
    return {
      score: this.score,
      timeLeft: this.timeLeft,
      roundActive: this.roundActive,
      lastOutcome: this.lastOutcome,
    };
  }
}

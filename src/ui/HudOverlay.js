export class HudOverlay {
  constructor(game, localizationService, gameStateService, learningService, rootElement) {
    this.game = game;
    this.localization = localizationService;
    this.state = gameStateService;
    this.learning = learningService;
    this.root = rootElement;
    this.target = null;
    this.message = this.localization.t('hud.fire');
    this.score = 0;
    this.timeLeft = 0;
    this.outcome = null;
    this.roundResult = null;
    this.unsubscribe = [];
    this.elements = {};
    this.visible = true;
  }

  mount() {
    this.root.innerHTML = '';
    this.root.classList.add('hud-overlay');

    const panel = document.createElement('div');
    panel.className = 'hud-panel';

    const title = document.createElement('div');
    title.className = 'hud-title';
    title.textContent = 'Gold English';

    const topRow = document.createElement('div');
    topRow.className = 'hud-toprow';

    const leftStack = document.createElement('div');
    leftStack.className = 'hud-stack';

    const score = document.createElement('div');
    score.className = 'hud-line';
    score.dataset.role = 'score';

    const goal = document.createElement('div');
    goal.className = 'hud-line hud-line-goal';
    goal.dataset.role = 'goal';

    leftStack.append(score, goal);

    const centerBox = document.createElement('div');
    centerBox.className = 'hud-center';

    const targetLabel = document.createElement('div');
    targetLabel.className = 'hud-target-label';
    targetLabel.textContent = 'NGHIA TIENG VIET';

    const targetMeaning = document.createElement('div');
    targetMeaning.className = 'hud-target-meaning';

    const targetWord = document.createElement('div');
    targetWord.className = 'hud-target-word';

    centerBox.append(targetLabel, targetMeaning, targetWord);

    const rightStack = document.createElement('div');
    rightStack.className = 'hud-stack hud-stack-right';

    const time = document.createElement('div');
    time.className = 'hud-line';
    time.dataset.role = 'time';

    const level = document.createElement('div');
    level.className = 'hud-line';
    level.dataset.role = 'level';

    rightStack.append(time, level);

    const message = document.createElement('div');
    message.className = 'hud-message';

    const actions = document.createElement('div');
    actions.className = 'hud-actions';

    const speak = document.createElement('button');
    speak.className = 'hud-btn hud-btn-primary';
    speak.type = 'button';
    speak.textContent = 'Speak';
    speak.addEventListener('click', () => {
      const prompt = this.learning.getCurrentPrompt();
      if (!prompt) return;
      this.game.eventBus.emit('hud.speak.requested', { prompt });
    });

    const restart = document.createElement('button');
    restart.className = 'hud-btn hud-btn-secondary';
    restart.type = 'button';
    restart.textContent = 'Restart';
    restart.addEventListener('click', () => {
      this.game.eventBus.emit('hud.restart.requested', {});
    });

    const next = document.createElement('button');
    next.className = 'hud-btn hud-btn-success';
    next.type = 'button';
    next.textContent = 'Next';
    next.style.display = 'none';
    next.addEventListener('click', () => {
      this.game.eventBus.emit('hud.next.requested', {});
    });

    actions.append(speak, restart, next);
    topRow.append(leftStack, centerBox, rightStack);
    panel.append(title, topRow, message, actions);
    this.root.append(panel);

    this.elements = { panel, score, goal, time, level, targetMeaning, targetWord, message, speak, restart, next };

    this.unsubscribe.push(
      this.game.eventBus.on('level.target.changed', ({ target }) => {
        this.target = target;
        this.render();
      }),
      this.game.eventBus.on('game.score.changed', ({ score }) => {
        this.score = score;
        this.render();
      }),
      this.game.eventBus.on('game.time.changed', ({ timeLeft }) => {
        this.timeLeft = timeLeft;
        this.render();
      }),
      this.game.eventBus.on('game.outcome.changed', ({ lastOutcome }) => {
        this.outcome = lastOutcome;
        this.render();
      }),
      this.game.eventBus.on('game.round.ended', ({ roundResult }) => {
        this.roundResult = roundResult;
        this.render();
      }),
      this.game.eventBus.on('learning.word.collected', ({ prompt }) => {
        this.message = `${this.localization.t('item.word')}: ${prompt.term} - ${prompt.translation}`;
        this.render();
      }),
      this.game.eventBus.on('learning.item.collected', ({ item }) => {
        if (item.type !== 'word') {
          this.message = `${this.localization.t(`item.${item.type}`, item.type)} collected`;
          this.render();
        }
      }),
      this.game.eventBus.on('voice.started', () => {
        this.message = 'Listening... say the word now';
        this.render();
      }),
      this.game.eventBus.on('voice.result', ({ success, message }) => {
        this.message = message;
        this.outcome = { type: success ? 'success' : 'danger', message };
        this.render();
      }),
      this.game.eventBus.on('voice.error', () => {
        this.message = 'Voice input is not available';
        this.render();
      })
    );

    this.render();
  }

  render() {
    if (!this.elements.panel) return;

    const { score, goal, time, level, targetMeaning, targetWord, message, next } = this.elements;
    score.textContent = `Money: ${this.state.score}`;
    goal.textContent = `Goal: ${this.target ? 1 : 0}`;
    time.textContent = `Time: ${Math.ceil(this.state.timeLeft)}`;
    level.textContent = `Level: ${this.game.currentScene?.currentLevelId?.replace('level', '') ?? '1'}`;
    targetMeaning.textContent = this.target?.translation?.vi ?? '---';
    targetWord.textContent = this.target ? `${this.target.term}` : 'Cho muc tieu tiep theo';
    message.textContent = this.message;
    next.style.display = this.state.roundResult === 'win' ? 'inline-flex' : 'none';
  }

  destroy() {
    for (const off of this.unsubscribe) {
      off();
    }
    this.unsubscribe = [];
    this.root.innerHTML = '';
  }
}

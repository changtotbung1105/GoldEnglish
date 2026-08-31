import { vocabularyCatalog } from '../data/vocabularyCatalog.js';

export class LearningService {
  constructor(eventBus, localizationService) {
    this.eventBus = eventBus;
    this.localization = localizationService;
    this.currentPrompt = null;
    this.collectedWords = [];
  }

  getVocabulary(wordId) {
    return vocabularyCatalog[wordId] ?? null;
  }

  attachWordItem(item) {
    const entry = this.getVocabulary(item.wordId);
    if (!entry) {
      return null;
    }

    item.learningData = entry;
    item.displayWord = entry.term;
    item.translation = entry.translation.vi;
    item.pronunciation = entry.pronunciation;
    return entry;
  }

  createPromptFromWord(item) {
    const entry = item.learningData ?? this.getVocabulary(item.wordId);
    if (!entry) {
      return null;
    }

    return {
      wordId: entry.id,
      term: entry.term,
      translation: entry.translation.vi,
      pronunciation: entry.pronunciation,
      example: entry.example.vi,
      partOfSpeech: entry.partOfSpeech,
      difficulty: entry.difficulty,
      tags: entry.tags,
    };
  }

  onItemCollected(item) {
    if (item.type === 'word') {
      const entry = this.attachWordItem(item);
      if (!entry) return;

      this.currentPrompt = this.createPromptFromWord(item);
      this.collectedWords.push(entry.id);
      this.eventBus.emit('learning.word.collected', {
        item,
        vocabulary: entry,
        prompt: this.currentPrompt,
      });
      return;
    }

    this.eventBus.emit('learning.item.collected', { item });
  }

  getCurrentPrompt() {
    return this.currentPrompt;
  }
}

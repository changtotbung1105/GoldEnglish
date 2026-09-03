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

  getLocalizedText(source, fallback = '') {
    if (!source) {
      return fallback;
    }

    const lang = this.localization?.languageCode ?? 'vi';
    return source[lang] ?? source.vi ?? source.en ?? fallback;
  }

  attachWordItem(item) {
    const entry = this.getVocabulary(item.wordId);
    if (!entry) {
      return null;
    }

    item.learningData = entry;
    item.displayWord = entry.term;
    item.translation = this.getLocalizedText(entry.translation, entry.term);
    item.pronunciation = entry.pronunciation;
    item.imageKey = entry.imageKey ?? null;
    if (entry.imageKey) {
      item.spriteKey = entry.imageKey;
    }
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
      translation: this.getLocalizedText(entry.translation, entry.term),
      pronunciation: entry.pronunciation,
      example: this.getLocalizedText(entry.example, ''),
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

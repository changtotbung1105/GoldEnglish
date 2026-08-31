export class LocalizationService {
  constructor(locale = {}) {
    this.locale = locale;
  }

  setLocale(locale) {
    this.locale = locale ?? {};
  }

  t(key, fallback = key) {
    return this.locale[key] ?? fallback;
  }
}

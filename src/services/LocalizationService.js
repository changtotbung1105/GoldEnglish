export class LocalizationService {
  constructor(locale = {}, languageCode = 'vi') {
    this.locale = locale;
    this.languageCode = languageCode;
  }

  setLocale(locale, languageCode = this.languageCode) {
    this.locale = locale ?? {};
    this.languageCode = languageCode;
  }

  t(key, fallback = key) {
    return this.locale[key] ?? fallback;
  }
}

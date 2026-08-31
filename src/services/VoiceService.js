export class VoiceService {
  constructor(eventBus, localizationService) {
    this.eventBus = eventBus;
    this.localization = localizationService;
    this.recognition = null;
    this.isListening = false;
    this.currentTarget = null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.continuous = false;

      this.recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? '';
        this.handleTranscript(transcript);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.eventBus.emit('voice.stopped', {});
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.eventBus.emit('voice.error', { error: event.error });
      };
    }
  }

  isSupported() {
    return !!this.recognition;
  }

  setTarget(prompt) {
    this.currentTarget = prompt ?? null;
  }

  start() {
    if (!this.recognition || this.isListening) {
      return false;
    }

    this.isListening = true;
    this.eventBus.emit('voice.started', {});
    this.recognition.start();
    return true;
  }

  stop() {
    if (!this.recognition || !this.isListening) {
      return;
    }

    this.recognition.stop();
  }

  handleTranscript(transcript) {
    const normalizedTranscript = transcript.trim().toLowerCase();
    const target = this.currentTarget?.term?.trim().toLowerCase() ?? '';
    const success = normalizedTranscript && target && normalizedTranscript.includes(target);

    this.eventBus.emit('voice.result', {
      transcript,
      target: this.currentTarget,
      success,
      message: success
        ? `Correct: ${transcript}`
        : `Try again: expected "${this.currentTarget?.term ?? ''}"`,
    });
  }
}

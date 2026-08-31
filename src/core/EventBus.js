export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, handler) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    this.listeners.get(eventName).add(handler);
    return () => this.off(eventName, handler);
  }

  off(eventName, handler) {
    const handlers = this.listeners.get(eventName);
    if (!handlers) return;
    handlers.delete(handler);
  }

  emit(eventName, payload) {
    const handlers = this.listeners.get(eventName);
    if (!handlers) return;
    for (const handler of handlers) {
      handler(payload);
    }
  }

  clear(eventName) {
    if (eventName) {
      this.listeners.delete(eventName);
      return;
    }
    this.listeners.clear();
  }
}

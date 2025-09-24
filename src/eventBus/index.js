export class ClassEventEmitter {

  constructor() {
    this.events = new Map();
  }

  add(type, callback) {
    const callbacks = this.events.get(type) || [];
    callbacks.push(callback);
    this.events.set(type, callbacks);
  }

  remove(type, callback) {
    const callbacks = this.events.get(type) || [];
    this.events.set(
      type,
      callbacks.filter((fn) => fn !== callback)
    );
  }

  removeByType(type) {
    this.events.delete(type);
  }

  emit(type, ...args) {
    const callbacks = this.events.get(type) || [];
    callbacks.forEach((fn) => fn(...args));
  }

  listeners(type) {
    return Object.freeze(this.events.get(type) || []);
  }
}

export const EventEmitter = new ClassEventEmitter();

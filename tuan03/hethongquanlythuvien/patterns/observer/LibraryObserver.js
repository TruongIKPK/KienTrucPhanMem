class LibraryObserver {
  constructor(name, onNotify = null) {
    this.name = name;
    this.onNotify = onNotify;
  }

  update(event) {
    if (typeof this.onNotify === "function") {
      this.onNotify(event);
    } else {
      console.log(`[Observer:${this.name}] ${event.type} -> ${event.message}`);
    }
  }
}

module.exports = LibraryObserver;

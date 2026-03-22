class Stock {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify() {
    this.observers.forEach(o => o.update(this));
  }

  setPrice(newPrice) {
    console.log(`\n${this.name} changed price: ${this.price} -> ${newPrice}`);
    this.price = newPrice;
    this.notify();
  }
}

module.exports = Stock;
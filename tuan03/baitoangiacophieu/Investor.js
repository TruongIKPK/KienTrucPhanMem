class Investor {
  constructor(name) {
    this.name = name;
  }

  update(stock) {
    console.log(`${this.name} notified: ${stock.name} = ${stock.price}`);
  }
}

module.exports = Investor;
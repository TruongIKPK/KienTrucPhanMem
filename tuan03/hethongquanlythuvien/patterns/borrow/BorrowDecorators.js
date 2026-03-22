const BorrowRequest = require("./BorrowRequest");

class BorrowDecorator extends BorrowRequest {
  constructor(base) {
    super(base.book, base.user, base.dueDays);
    this.base = base;
  }

  describe() {
    return this.base.describe();
  }

  toObject() {
    return this.base.toObject();
  }
}

class ExtendedBorrowDecorator extends BorrowDecorator {
  constructor(base, extraDays = 7) {
    super(base);
    this.extraDays = extraDays;
  }

  describe() {
    return `${this.base.describe()} (+${this.extraDays} days extension)`;
  }

  toObject() {
    const obj = this.base.toObject();
    obj.dueDays += this.extraDays;
    obj.tags = [...obj.tags, "extended"];
    return obj;
  }
}

class SpecialEditionDecorator extends BorrowDecorator {
  describe() {
    return `${this.base.describe()} (special edition requested)`;
  }

  toObject() {
    const obj = this.base.toObject();
    obj.tags = [...obj.tags, "special-edition"];
    return obj;
  }
}

module.exports = {
  BorrowDecorator,
  ExtendedBorrowDecorator,
  SpecialEditionDecorator
};

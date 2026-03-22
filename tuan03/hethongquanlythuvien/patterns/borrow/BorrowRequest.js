class BorrowRequest {
  constructor(book, user, dueDays = 14) {
    this.book = book;
    this.user = user;
    this.dueDays = dueDays;
    this.tags = [];
  }

  describe() {
    const extras = this.tags.length ? ` [${this.tags.join(", ")}]` : "";
    return `${this.user} borrows '${this.book.title}' for ${this.dueDays} days${extras}`;
  }

  toObject() {
    return {
      user: this.user,
      bookTitle: this.book.title,
      dueDays: this.dueDays,
      tags: [...this.tags]
    };
  }
}

module.exports = BorrowRequest;

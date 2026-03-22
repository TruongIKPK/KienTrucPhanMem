class Book {
  constructor(id, title, author, genre, format) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.format = format;
  }

  describe() {
    return `${this.title} by ${this.author} (${this.genre}, ${this.format})`;
  }
}

module.exports = Book;

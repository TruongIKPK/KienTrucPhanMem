const Book = require("./Book");

class EBook extends Book {
  constructor(id, title, author, genre) {
    super(id, title, author, genre, "ebook");
  }
}

module.exports = EBook;

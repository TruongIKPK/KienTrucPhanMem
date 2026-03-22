const PaperBook = require("./PaperBook");
const EBook = require("./EBook");
const AudioBook = require("./AudioBook");

class BookFactory {
  static create(type, id, data) {
    const { title, author, genre } = data;
    switch ((type || "paper").toLowerCase()) {
      case "paper":
      case "paperbook":
        return new PaperBook(id, title, author, genre);
      case "ebook":
        return new EBook(id, title, author, genre);
      case "audio":
      case "audiobook":
        return new AudioBook(id, title, author, genre);
      default:
        return new PaperBook(id, title, author, genre);
    }
  }
}

module.exports = BookFactory;

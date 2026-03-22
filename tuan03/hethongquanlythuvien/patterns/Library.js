const BookFactory = require("./books/BookFactory");

class Library {
  constructor() {
    this.books = [];
    this.observers = [];
    this.nextId = 1;
  }

  static getInstance() {
    if (!Library.instance) {
      Library.instance = new Library();
    }
    return Library.instance;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify(type, message, payload = null) {
    this.observers.forEach(o => o.update({ type, message, payload }));
  }

  addBook(type, data) {
    const book = BookFactory.create(type, this.nextId++, data);
    this.books.push(book);
    this.notify("new-book", `Added '${book.title}'`, book);
    return book;
  }

  getBooks() {
    return [...this.books];
  }

  getBookById(id) {
    return this.books.find(b => b.id === id);
  }

  search(strategy, term) {
    if (!strategy || !term) return [];
    return strategy.search(this.books, term);
  }

  recordBorrow(borrowRequest) {
    const summary = borrowRequest.describe();
    this.notify("borrow", summary, borrowRequest.toObject());
    return summary;
  }
}

module.exports = Library;

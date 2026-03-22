const express = require("express");
const path = require("path");
const Library = require("./patterns/Library");
const LibraryObserver = require("./patterns/observer/LibraryObserver");
const { TitleSearchStrategy, AuthorSearchStrategy, GenreSearchStrategy } = require("./patterns/search/SearchStrategies");
const BorrowRequest = require("./patterns/borrow/BorrowRequest");
const { ExtendedBorrowDecorator, SpecialEditionDecorator } = require("./patterns/borrow/BorrowDecorators");

const app = express();
const library = Library.getInstance();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// Observer: log events
const consoleObserver = new LibraryObserver("Console");
library.addObserver(consoleObserver);

// Seed some books once
if (library.getBooks().length === 0) {
  library.addBook("paper", { title: "Clean Code", author: "Robert C. Martin", genre: "Programming" });
  library.addBook("ebook", { title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "Programming" });
  library.addBook("audio", { title: "1984", author: "George Orwell", genre: "Fiction" });
}

const strategyMap = {
  title: () => new TitleSearchStrategy(),
  author: () => new AuthorSearchStrategy(),
  genre: () => new GenreSearchStrategy()
};

app.get("/", (req, res) => {
  res.render("index", { books: library.getBooks() });
});

app.get("/books", (req, res) => {
  res.render("books", { books: library.getBooks() });
});

app.get("/books/new", (req, res) => {
  res.render("new-book");
});

app.post("/books", (req, res) => {
  const { title, author, genre, type } = req.body;
  library.addBook(type, { title, author, genre });
  res.redirect("/books");
});

app.get("/search", (req, res) => {
  const term = req.query.term || "";
  const strategyKey = (req.query.strategy || "title").toLowerCase();
  let results = [];
  if (term) {
    const strategy = strategyMap[strategyKey]?.();
    results = library.search(strategy, term);
  }
  res.render("search", { term, strategyKey, results });
});

app.get("/borrow", (req, res) => {
  res.render("borrow", { books: library.getBooks(), message: null, detail: null });
});

app.post("/borrow", (req, res) => {
  const { bookId, userName, extend, specialEdition } = req.body;
  const book = library.getBookById(Number(bookId));
  if (!book) {
    return res.render("borrow", {
      books: library.getBooks(),
      message: "Book not found.",
      detail: null
    });
  }

  let borrow = new BorrowRequest(book, userName || "Guest");
  if (extend === "on") {
    borrow = new ExtendedBorrowDecorator(borrow, 7);
  }
  if (specialEdition === "on") {
    borrow = new SpecialEditionDecorator(borrow);
  }

  const summary = library.recordBorrow(borrow);
  const detail = borrow.toObject();

  res.render("borrow", {
    books: library.getBooks(),
    message: summary,
    detail
  });
});

app.listen(3000, () => {
  console.log("Library app listening on http://localhost:3000");
});

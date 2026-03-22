class TitleSearchStrategy {
  search(books, term) {
    const q = term.toLowerCase();
    return books.filter(b => b.title.toLowerCase().includes(q));
  }
}

class AuthorSearchStrategy {
  search(books, term) {
    const q = term.toLowerCase();
    return books.filter(b => b.author.toLowerCase().includes(q));
  }
}

class GenreSearchStrategy {
  search(books, term) {
    const q = term.toLowerCase();
    return books.filter(b => b.genre.toLowerCase().includes(q));
  }
}

module.exports = {
  TitleSearchStrategy,
  AuthorSearchStrategy,
  GenreSearchStrategy
};

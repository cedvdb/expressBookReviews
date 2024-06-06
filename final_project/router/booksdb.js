let books = {
  1: { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": { 'Louis1288': 'Good book' } },
  2: { "author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": { 'Louis1288': 'I liked it' } },
  3: { "author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": { 'Louis1288': 'I did not like it' } },
  4: { "author": "Unknown", "title": "The Epic Of Gilgamesh", "reviews": {} },
  5: { "author": "Unknown", "title": "The Book Of Job", "reviews": {} },
  6: { "author": "Unknown", "title": "One Thousand and One Nights", "reviews": {} },
  7: { "author": "Unknown", "title": "Nj\u00e1l's Saga", "reviews": {} },
  8: { "author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {} },
  9: { "author": "Honor\u00e9 de Balzac", "title": "Le P\u00e8re Goriot", "reviews": {} },
  10: { "author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}

class BookDb {

  static findAllBooks() {
    return Promise.resolve(books);
  }

  static findBookByIsbn(isbn) {
    return Promise.resolve(books[isbn]);
  }

  static findBooksFromAuthor(author) {
    const booksFromAuthor = Object.values(books)
      // using includes instead of equality to be able to search
      .filter((book) => book.author.includes(author));
    return Promise.resolve(booksFromAuthor);
  }

  static findBooksByTitle(title) {
    const book = Object.values(books)
      // using includes instead of equality to be able to search
      .filter((book) => book.title.includes(title));
    return Promise.resolve(book);
  }

  static async upsertBookReview(isbn, username, review) {
    if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return books[isbn];
    }
  }

  static async removeBookReview(isbn, username) {
    delete books[isbn].reviews[username];
    return books[isbn];
  }
}
module.exports = BookDb;

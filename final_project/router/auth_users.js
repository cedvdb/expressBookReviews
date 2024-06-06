const express = require('express');
const jwt = require('jsonwebtoken');
let BooksDatabase = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: 'Louis1288', password: 'HisPassword' }];

const isValid = (username) => users.every((user) => user.username != username);

const authenticatedUser = (username, password) => {
  let userFound = users.find((user) => (user.username === username && user.password === password));
  if (userFound) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "You must provide the username and password" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  const book = await BooksDatabase.findBookByIsbn(isbn);

  if (!book) {
    return res.status(404).json({ error: `book not found for isbn ${isbn}` });
  }
  const updatedBook = await BooksDatabase.upsertBookReview(isbn, username, review);
  return res.status(200).json({
    message: 'Your review was upserted',
    book: updatedBook
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  const book = await BooksDatabase.findBookByIsbn(isbn);

  if (!book) {
    return res.status(404).json({ error: 'book not found' });
  }

  const updatedBook = await BooksDatabase.removeBookReview(isbn, username);

  return res.status(200).json({
    message: 'Your review was removed',
    book: updatedBook,
  });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const doesExist = (username) => users.some((user) => user.username == username);

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User registred successfully." });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({
    message: "Unable to register user. Please provide username and password in the request body"
  });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksFromAuthor = Object.values(books)
    .filter((book) => book.author == author);
  return res.send(JSON.stringify(booksFromAuthor));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const book = Object.values(books)
    .find((book) => book.title == title);
  return res.send(JSON.stringify(book));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const reviews = book.reviews;
  return res.send(JSON.stringify(reviews));
});

module.exports.general = public_users;

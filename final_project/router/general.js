const express = require('express');
let BooksDatabase = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User registered successfully." });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({
    message: "Unable to register user. Please provide username and password in the request body"
  });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  const books = await BooksDatabase.findAllBooks();
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const book = await BooksDatabase.findBookByIsbn(isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.json(book);
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  const books = await BooksDatabase.findBooksFromAuthor(author);
  return res.json(books);
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  const books = await BooksDatabase.findBooksByTitle(title);
  return res.json(books);
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const book = await BooksDatabase.findBookByIsbn(isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = book.reviews;
  return res.json(reviews);
});

module.exports.general = public_users;

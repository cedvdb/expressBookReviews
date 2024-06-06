const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
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
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  if (!books[isbn]) {
    res.status(404).json({ error: 'book not found' });
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: 'Your review was upserted',
    book: books[isbn]
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (!books[isbn]) {
    res.status(404).json({ error: 'book not found' });
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: 'Your review was removed',
    book: books[isbn],
  });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

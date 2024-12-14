const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    const validUser = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    if (validUser.length > 0) return true;
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.name;
    const password = req.body.password;

    if (!username || !password) return res.status(404).json({ message: "Error logging in" });
    if (!authenticatedUser(username, password)) return res.status(208).json({ message: "Invalid Login. Check username and password" });
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const ISBN = req.params.isbn;
    const review = req.query.review;

    if (!review) return res.status(404).json({ message: "Put a review" });
    if (!books[ISBN]) return res.status(404).json({message: "Book not found"});
    books[ISBN].reviews[username] = review;

    return res.status(200).send("Review added!");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const ISBN = req.params.isbn;

    if (!books[ISBN]) return res.status(404).json({message: "Book not found"});
    delete books[ISBN].reviews[username];

    return res.status(200).send("Review deleted!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;

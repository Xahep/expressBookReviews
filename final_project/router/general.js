const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.name;
    const password = req.body.password;

    if (!username || !password) return res.status(404).json({ message: "Unable to register user." });
    if (isValid(username)) return res.status(404).json({ message: "User already exists!" });
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const books = await getBooksAsync(); // Llama a la función que retorna una Promise
        res.send(JSON.stringify(books, null, 4)); // Devuelve los libros en formato JSON
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const ISBN = req.params.isbn;
    try {
        const book = await getBookByISBNAsync(ISBN); // Llama a la función asíncrona
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error.message }); // Maneja el error si el libro no existe
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const booksByAuthor = await getBooksByAuthorAsync(author); // Llama a la función asíncrona
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({ message: error.message }); // Maneja el error si no hay libros para el autor
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    try {
        const booksByTitle = await getBooksByTitleAsync(title); // Llama a la función asíncrona
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(404).json({ message: error.message }); // Maneja el error si no hay libros para el título
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    const bookByISBN = books[ISBN];
    if (!bookByISBN) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(bookByISBN.reviews);
});

function getBooksAsync() {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => resolve(books), 1000);
        } catch (error) {
            reject(new Error('Error al obtener los libros'));
        }
    });
}

function getBookByISBNAsync(isbn) {
    return new Promise((resolve, reject) => {
        try {
            // Simulamos una operación asíncrona con setTimeout
            setTimeout(() => {
                const book = books[isbn];
                if (book) {
                    resolve(book);
                } else {
                    reject(new Error('Book not found'));
                }
            }, 1000); // Simulamos un retraso de 1 segundo
        } catch (error) {
            reject(new Error('Error al buscar el libro'));
        }
    });
}

function getBooksByAuthorAsync(author) {
    return new Promise((resolve, reject) => {
        try {
            // Simulamos una operación asíncrona con setTimeout
            setTimeout(() => {
                const booksByAuthor = Object.values(books).filter((book) => book.author === author);
                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject(new Error('Books not found for the given author'));
                }
            }, 1000); // Simulamos un retraso de 1 segundo
        } catch (error) {
            reject(new Error('Error al buscar libros por autor'));
        }
    });
}

function getBooksByTitleAsync(title) {
    return new Promise((resolve, reject) => {
        try {
            // Simulamos una operación asíncrona con setTimeout
            setTimeout(() => {
                const booksByTitle = Object.values(books).filter((book) => book.title === title);
                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject(new Error('Book not found for the given title'));
                }
            }, 1000); // Simulamos un retraso de 1 segundo
        } catch (error) {
            reject(new Error('Error al buscar libros por título'));
        }
    });
}

module.exports.general = public_users;

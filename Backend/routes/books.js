const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search books
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { isbn: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new book
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        pages: req.body.pages
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.isbn) {
            return res.status(400).json({ message: 'ISBN already exists. Please use a unique ISBN.' });
        }
        res.status(400).json({ message: err.message });
    }
});

// Borrow a book
router.patch('/:id/borrow', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.status === 'borrowed') {
            return res.status(400).json({ message: 'Book is already borrowed' });
        }

        book.status = 'borrowed';
        book.borrowedBy = req.body.borrowedBy;
        book.borrowedDate = new Date();
        book.returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Return a book
router.patch('/:id/return', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.status = 'available';
        book.borrowedBy = null;
        book.borrowedDate = null;
        book.returnDate = null;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update book details
router.patch('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update fields if provided in request body
        if (req.body.title !== undefined) book.title = req.body.title;
        if (req.body.author !== undefined) book.author = req.body.author;
        if (req.body.isbn !== undefined) book.isbn = req.body.isbn;
        if (req.body.pages !== undefined) book.pages = req.body.pages;
        if (req.body.status !== undefined) book.status = req.body.status;
        if (req.body.borrowedBy !== undefined) book.borrowedBy = req.body.borrowedBy;
        if (req.body.borrowedDate !== undefined) book.borrowedDate = req.body.borrowedDate;
        if (req.body.returnDate !== undefined) book.returnDate = req.body.returnDate;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.isbn) {
            return res.status(400).json({ message: 'ISBN already exists. Please use a unique ISBN.' });
        }
        res.status(400).json({ message: err.message });
    }
});

// Delete a book
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        await book.remove();
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 
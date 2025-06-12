const express = require('express');
const router = express.Router();
const Borrowing = require('../models/Borrowing');

// Get all borrowings
router.get('/', async (req, res) => {
    try {
        const borrowings = await Borrowing.find().sort({ borrowDate: -1 });
        res.json(borrowings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search borrowings
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const borrowings = await Borrowing.find({
            $or: [
                { studentName: { $regex: query, $options: 'i' } },
                { studentNumber: { $regex: query, $options: 'i' } },
                { bookTitle: { $regex: query, $options: 'i' } },
                { bookIsbn: { $regex: query, $options: 'i' } }
            ]
        }).sort({ borrowDate: -1 });
        res.json(borrowings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new borrowing
router.post('/', async (req, res) => {
    const borrowing = new Borrowing({
        studentName: req.body.studentName,
        studentNumber: req.body.studentNumber,
        bookTitle: req.body.bookTitle,
        bookIsbn: req.body.bookIsbn,
        returnDate: req.body.returnDate
    });

    try {
        const newBorrowing = await borrowing.save();
        res.status(201).json(newBorrowing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update borrowing status (mark as returned)
router.patch('/:id/return', async (req, res) => {
    try {
        const borrowing = await Borrowing.findById(req.params.id);
        if (!borrowing) {
            return res.status(404).json({ message: 'Borrowing record not found' });
        }

        borrowing.status = 'returned';
        const updatedBorrowing = await borrowing.save();
        res.json(updatedBorrowing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router; 
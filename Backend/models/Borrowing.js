const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    studentNumber: {
        type: String,
        required: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    bookIsbn: {
        type: String,
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'returned'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Borrowing', borrowingSchema); 
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['available', 'borrowed'],
        default: 'available'
    },
    borrowedBy: {
        type: String,
        default: null
    },
    borrowedDate: {
        type: Date,
        default: null
    },
    returnDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema); 
const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    by: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    age_level: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    no_stock: {
        type: Number,
        required: true
    },
    added_by: {
        type: String,
        required: true
    },
    date_creation: {
        type: Date,
        default: Date.now
    },
    modification_date: {
        type: Date,
    }
});

module.exports = mongoose.model('Books',BookSchema);
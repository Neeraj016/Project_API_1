const mongoose = require ("mongoose");

//creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,
});

//create a book modal
const BookModel = mongoose.model("Books",BookSchema);

module.exports = BookModel;
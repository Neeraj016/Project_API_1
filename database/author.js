const mongoose = require("mongoose");

//author achema

const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
      
});

//author model

const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;
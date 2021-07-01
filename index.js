require("dotenv").config();
//frame work
const express = require("express");
const mongoose = require("mongoose");


//batabase
const database = require ("./database/index");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");




//configure 
const shapeAI = express();

shapeAI.use (express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log("connection established!!"));

/*
route     /
description    to get all books
access     public
parameters    none
method   GET
*/
shapeAI.get("/", async(req, res)=>{
  const getAllBooks = await BookModel.find();
  return res.json({books: database.books})
});

/*z
route     /is
description    to get specific books based on isbn
access     public
parameters    isbn
method   GET
*/

shapeAI.get("/is/:isbn",async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn})
  
    if (!getSpecificBook) {
      return res.json({
        error: `No book found for the ISBN of ${req.params.isbn}`,
      });
    }
  
    return res.json({ book: getSpecificBook });
  });
/*
route     /c
description    to get specific books based on category
access     public
parameters    category
method   GET
*/
shapeAI.get("/c/:category" ,async (req, res) => {
 const getSpecificBooks = await BookModel.findOne({category: req.params.category,})

  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ books: getSpecificBooks });
});
/*
route     /a
description    to get all authors
access     public
parameters    none
method   GET
*/

shapeAI.get ("/a/:author",async (req,res)=>
{
  const getAllAuthor = await AuthorModel.find();
  return res.json({authors: database.authors});
});


/*
route     /author
description    to get the list of all authors based on books isbn
access     public
parameters    isbn
method   GET
*/

shapeAI.get("/author/book/:isbn", (req, res) => {
  const getSpecificAuthor = database.author.filter((authors) =>
    authors.books.includes(req.params.isbn)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No Author found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthor });
});
/*
route     /publications
description    to get publications
access     public
parameters    none 
method   GET
*/


shapeAI.get("/publications", (req, res)=>
{
    return res.json ({ publications: database.publications});
});

/*
route     /books
description    to get list of books based on authors
access     public
parameters    authors
method   GET
*/



shapeAI.get("/books/authors/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter((book) =>
    book.authors.includes(req.params.isbn)
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No books found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ books: getSpecificBook });
});


/*
route     /
description    to get specific author
access     public
parameters    none
method   GET
*/

shapeAI.get("/ia/:author", (req, res) => {
    const getSpecificAuthors = database.authors.filter(
      (authors) => authors.ISBN === req.params.isbn
    );
  
    if (getSpecificAuthors.length === 0) {
      return res.json({
        error: `No authors found for the ISBN of ${req.params.isbn}`,
      });
    }
  
    return res.json({ book: getSpecificAuthors });
  });

/*
route     /ip
description    to get specific publications 
access     public
parameters    none
method   GET
*/



  shapeAI.get("/ip/:publications", (req, res) => {
    const getSpecificPublications = database.publications.filter(
      (publications) => publications.ISBN === req.params.isbn
    );
  
    if (getSpecificPublications.length === 0) {
      return res.json({
        error: `No publication found for the ISBN of ${req.params.isbn}`,
      });
    }
  
    return res.json({ book: getSpecificPublications });
  });

/*
route     /ib
description    to get list of publication based on books
access     public
parameters    books
method   GET
*/
shapeAI.get("/publications/:isbn", (req, res) =>
{
    const getSpecificPublications =database.authors.filter((publications) =>
    publications.books.includes(req.params.isbn)
    );
    if (getSpecificPublications.length === 0)
    {
        return res.json({
            error: `no publications found for the book${req.params.isbn}`,
        });
    };
});

/*
route     /book/new
description    to add books
access     public
parameters    none
method   post
*/

shapeAI.post("/book/new",async (req, res) =>{
  const{ newBook} = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({books: database.books,message: "books was added!"})
});

/*
route     /author/new
description    to add author
access     public
parameters    none
method   post
*/
shapeAI.post("/author/new", (req, res) =>{
  const{ newAuthor} = req.body;
  AuthorModel.create(newAuthor);
  return res.json({message: "author was added!"})
});

/*
route     /book/update
description    update title of book
access     public
parameters    isbn
method   put
*/

shapeAI.put("/book/update/:title", (req, res)=>{
  database.books.forEach((book) =>
  {
    if (book.ISBN === req.params.isbn) return
    {
      book.title = req.body.bookTitle;
      return;
    }
  })
  return res.json({books: database.books});
})


/*
route     /book/author/update/
description    update new author
access     public
parameters    isbn
method   put
*/


shapeAI.put("/book/author/update/:isbn",(req, res)=>{
  //update of the book
  database.books.forEach((book)=>{
    if (book.ISBN === req.params.isbn) 
    return book.authors.push(req.body.newAuthor);
  });


  // update the author database
  database.authors.forEach((author)=>
  {
    if(author.id === req.body.newAuthor)
    return author.books.push(req.param.isbn);
  })
  return res.json({books: database.books, authors: database.authors, message: "new authors were added"});
});

/*
route     /publication/update/book
description    update new book to publcation
access     public
parameters    isbn
method   put
*/

shapeAI.put("/publication/update/book/:isbn", (req, res) => {
  //update the publication database
  database.publications.forEach((publication) =>{
    if(publication.id === res.body.pubID){
      return publication.books.push(req.params.isbn);
    }
  })
  //update the books database
  database.books.forEach((book)=>
  {
    if(book.ISBN === req.params.isbn){
      book.publication = req.body.pubID;
      return;
    }
  });

  return res.json({books: database.books, publication: database.publications, message: "successfully running"})

});
/*
route     /book/delete
description    delete a book
access     public
parameters    isbn
method   delete
*/
shapeAI.delete(" /book/delete/:isbn", (req, res)=>{
  const updatedBookDatabase = database.books.filter(
  (book)=> book.ISBN !== req.params.isbn
  );
  database.books = updatedBookDatabase;
  return res.json({books: database.books})

  
});
/*
route     /book/delete/author
description    delete a book author from book
access     public
parameters    isbn, author id
method   delete
*/

shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res)=>{
  //update the book database
  database.books.forEach((books)=> {
  if (books.ISBN === req.params.isbn){
    const newAuthorList = books.authors.filter(
    (author) => author !== parseInt(req.params.authodId)
    );
  
  books.authors = newAuthorList;
  return;
    
};
  })
//update the author databse 
database.authors.forEach((author) =>{
  if(author.id === parseInt(req.params.authorId)){
    const newBooksList = author.books.filter(
      (book) => book !== req.params.isbn
    );
    author.books = newBooksList;
    return;
  }
});
return res.json({books: database.books, author:database.author, message:"author was deleted!"})
});

/*
route     /publication/delete/book
description    delete a book from publication
access     public
parameters    isbn, publication id
method   delete
*/

shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  // update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
  });
});
shapeAI.listen(3000, () => console.log("server running"))

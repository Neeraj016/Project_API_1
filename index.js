
//frame work
const { request } = require("express");
const express = require("express");

//batabase
const database = require ("./database/index");
//configure 
const shapeAI = express();

shapeAI.use (express.json());
/*
route     /
description    to get all books
access     public
parameters    none
method   GET
*/
shapeAI.get("/", (req, res)=>{
    return res.json({books: database.books})
});

/*
route     /is
description    to get specific books based on isbn
access     public
parameters    isbn
method   GET
*/

shapeAI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
      (book) => book.ISBN === req.params.isbn
    );
  
    if (getSpecificBook.length === 0) {
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
*/ //not working
shapeAI.get("/c/:category", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  if (getSpecificBooks.length === 0) {
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

shapeAI.get ("/a/:author", (req,res)=>
{
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

shapeAI.post("/book/new", (req, res) =>{
  const{ newBook} = req.body;
  database.books.push(newBook);
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
  database.author.push(newAuthor);
  return res.json({books: database.author,message: "author was added!"})
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

shapeAI.listen(3000, () => console.log("server running"));

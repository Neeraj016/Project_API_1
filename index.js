
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
route     /
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
*/
shapeAI.get("/c/:category", (req, res)=>
{
    const getSpecificBooks = database.books.filter((book) => 
    book.category.includes (req.params.category))


   if (getSpecificBooks.length === 0) 
   {
       return res.json({
           error: `no book found for the ISBN of ${req.params.isbn}`,
        });
   }
   return res.json({books: getSpecificBooks});
});
/*
route     /a
description    to get all authors
access     public
parameters    none
method   GET
*/

shapeAI.get ("/author", (req,res)=>
{
    return res.json({authors: database.authors});
});


/*
route     /author
description    to get the list of all authors based on books
access     public
parameters    isbn
method   GET
*/

shapeAI.get("/author/:isbn", (req, res) =>
{
    const getSpecificAuthors =database.authors.filter((authors) =>
    authors.books.includes(req.params.isbn)
    );
    if (getSpecificAuthors.length === 0)
    {
        return res.json({
            error: `no authors found for the book${req.params.isbn}`,
        });
    };
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
    return res.json ({ publications: batabase.publications});
});

/*
route     /books
description    to get list of books based on authors
access     public
parameters    authors
method   GET
*/



shapeAI.get("/b/:books", (req, res)=>
{
    const getSpecificBooks = database.books.filter((book) => 
    book.authors.includes (req.params.authors))


   if (getSpecificBooks.length === 0) 
   {
       return res.json({
           error: `no book found for the ISBN of ${req.params.isbn}`,
        });
   }
   return res.json({books: getSpecificBooks});
});


/*
route     /
description    to get specific author
access     public
parameters    isbn
method   GET
*/

shapeAI.get("/ia/:isbn", (req, res) => {
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


shapeAI.listen(3000, () => console.log("server running"));

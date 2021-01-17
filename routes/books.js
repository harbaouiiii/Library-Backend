const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const verify = require('./verifyToken');

router.get('/',verify, async (req,res) => {
    try{
        const books = await Book.find();
        res.json(books);
    } catch(err){
        res.json({ error_message: err});
    }
});

router.get('/:bookId',verify, async (req,res) => {
    try{
        const book = await Book.findById(req.params.bookId);
        res.json(book);
    } catch(err){
        res.json({ error_message: err});
    }
});

router.post('/',verify, async (req,res)=>{
    try{
        if(req.user.is_admin){
            const book = new Book({
                title: req.body.title,
                by: req.body.by,
                genre: req.body.genre,
                age_level: req.body.age_level,
                description: req.body.description,
                no_stock: req.body.no_stock,
                added_by: req.user.name,
                modification_date: Date.now()
            });
            const savedBook = await book.save();
            res.json(savedBook);
        }else{
            res.send("Admin permission required!");
        }
    }catch(err){
        res.json({ error_message: err});
    }
});

router.delete('/:bookId',verify, async (req,res) => {
    try{
        const removedBook = await Book.remove({_id: req.params.bookId});
        res.send('Book deleted!');
    } catch(err){
        res.json({ error_message: err});
    }
});

router.patch('/:bookId',verify, async (req,res) => {
    try{
        const updatedBook = await Book.updateMany(
            {_id: req.params.bookId},
            { $set: {
                title: req.body.title,
                by: req.body.by,
                genre: req.body.genre,
                age_level: req.body.age_level,
                description: req.body.description,
                no_stock: req.body.no_stock,
                modification_date: Date.now()
                }
            }
        );
        res.json(updatedBook);
    } catch(err){
        res.json({ error_message: err});
    }
});

module.exports = router;
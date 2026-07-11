const Book = require('../models/books.model')
const redisClient = require('../config/redis');
const getBooks = async (req, res, next)=>{
    try{
        const cached = await redisClient.get('books');
        if(cached){
            return res.status(200).json(JSON.parse(cached));
        }
        if(!cached){
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const totalBooks = await Book.countDocuments()
    const books = await Book.find().skip(skip).limit(limit)
    await redisClient.setEx('books', 60, JSON.stringify(books))
    res.status(200).json({
    totalBooks,
    totalPages: Math.ceil(totalBooks/limit),
    currentPage: page,
    books
})}
       
    }catch(error){
        next (error)
    }
}

const addBook = async (req, res, next)=>{
    try{const {title, author, category, quantity} = req.body;
    const newBook = new Book ({title, author, category, quantity})
    await newBook.save();
    await redisClient.del('books');
    return res.status(201).json({message: "New book added successfully", book: newBook})
}catch(error){
    next(error)
}
}

const updateBook = async (req, res, next)=>{
    try{
        const {id} = req.params;
        const { title, author, category, quantity, isAvailable } = req.body
        const updatedbook = await Book.findByIdAndUpdate(id, {
            title, author, category, quantity, isAvailable},{new: true}
        );
        if(updatedbook === null){
            return res.status(404).json({message: "Book not found"}
        )}
        await redisClient.del('books');
        res.status(200).json({message: "Book updated successfully", book: updatedbook})
         

    }catch(error){
        next(error);
    }
}

const deleteBook = async(req, res, next)=>{
    try{const {id} = req.params;
    const deletedBook = await Book.findByIdAndDelete(id)
    if(!deletedBook){
        return res.status(404).json({message: "Book not found"})
    }
    await redisClient.del('books');
    res.status(200).json({message: "Book deleted successfully"})
}catch (error){
    next(error);
}
}

const getBooksByCategory = async (req, res, next)=>{
    try{
        const result = await Book.aggregate([
            { $group: {
            _id: '$category',
             count: { $sum: 1 }
            }}

        ])
        return res.status(200).json({message: "Book count is: ", data: result})
    }catch (error){
        next(error)
    }
}
module.exports = {getBooks, addBook, updateBook, deleteBook, getBooksByCategory}
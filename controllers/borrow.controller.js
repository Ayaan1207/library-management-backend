const Borrow = require('../models/borrow.model.js')
const Book = require('../models/books.model')

const borrowBook = async (req, res, next)=>{
    try{const {bookId} = req.body
    const userId = req.user.userId
    const borrowed = await Book.findById(bookId);
    if(!borrowed){
        return res.status(404).json({message: "Book not found"})
    }
    if(!borrowed.isAvailable){
        return res.status(404).json({message: "Book not available"})

    }
    const availability = await Book.findByIdAndUpdate(bookId, {
        isAvailable: false,
        $inc: {quantity: -1}
    })
    const newBorrow = new Borrow({
        userId, bookId, status: 'borrowed'
    });
    await newBorrow.save()
    res.status(201).json({message:"Book borrowed successfully", borrow: newBorrow})
} catch (error){
    next(error);
}
}

const returnBook = async (req, res, next)=>{
    try{
        const borrowId = req.params.id;
        const returnStatus = await Borrow.findById(borrowId);
        if(!returnStatus){
            return res.status(404).json({message:"Borrow record not found"})
        }

        if(returnStatus.status === 'returned'){
            return res.status(400).json({message:"Book already returned"})
        }
        const borrowRecord = await Borrow.findByIdAndUpdate(borrowId, {
            status: "returned",
            returnDate: Date.now()
        })
        await Book.findByIdAndUpdate(returnStatus.bookId,{
            isAvailable: true,
            $inc: {quantity:1}
        })
        res.status(200).json({message: "Book returned successfully"})

    } catch(error){
        next(error)
    }
}

const borrowHistory = async(req, res, next)=>{
    try{
        const userId = req.user.userId;
        const history = await Borrow.find({userId}).populate('bookId')
        res.status(200).json({message:"Borrow History fetched successfully", history})
    } catch(error){
        next(error);
    }
}

module.exports = {borrowBook, returnBook, borrowHistory}
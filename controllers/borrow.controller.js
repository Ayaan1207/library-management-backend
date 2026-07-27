const Borrow = require('../models/borrow.model.js')
const Book = require('../models/books.model');
const calculateFine = require('../utils/calculateFine')
const redisClient = require('../config/redis');
const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    const borrowed = await Book.findOneAndUpdate(
      { _id: bookId, isAvailable: true, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    if (!borrowed) {
      return res.status(400).json({ message: "Book not available" });
    }

    if (borrowed.quantity === 0) {
      borrowed.isAvailable = false;
      await borrowed.save();
    }

    // NEW: actually create the borrow record
    const newBorrow = await Borrow.create({
      userId,
      bookId,
      status: 'borrowed',
      borrowDate: new Date()
    });
    await redisClient.del('books');
    // NEW: send a response back
    return res.status(201).json({ message: "Book borrowed successfully", borrow: newBorrow });

  } catch (error) {
    next(error);
  }
};

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
        const returnDate = new Date(); // NEW: capture the return moment once, reuse it below
        const fine = calculateFine(returnStatus.borrowDate, returnDate); // NEW: calculate fine

        const borrowRecord = await Borrow.findByIdAndUpdate(borrowId, {
            status: "returned",
            returnDate: returnDate, // CHANGED: use the same returnDate variable, not Date.now()
            fine: fine // NEW: save the calculated fine
        })
        await Book.findByIdAndUpdate(returnStatus.bookId,{
            isAvailable: true,
            $inc: {quantity:1}
        })

        await redisClient.del('books');
        res.status(200).json({message: "Book returned successfully", fine: fine})
         
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

const getMostBorrowedBooks = async(req, res, next)=>{
    try{
        const result = await Borrow.aggregate([
    { $match: { status: 'borrowed' } },  // only borrowed records
    { $group: { 
        _id: '$bookId',                   // group by bookId
        borrowCount: { $sum: 1 }          // count each occurrence
    }},
    { $sort: { borrowCount: -1 }},        // highest first
    { $limit: 5 }                         // top 5 only
    ])
    return res.status(200).json({message: "Most borrowed book fetched successfully!", data: result})
    }catch(error){
        next(error)
    }
}

module.exports = {borrowBook, returnBook, borrowHistory, getMostBorrowedBooks}
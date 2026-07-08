const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { borrowBook, returnBook, borrowHistory, getMostBorrowedBooks } = require('../controllers/borrow.controller');

router.post('/borrow', authMiddleware, borrowBook);
router.patch('/:id/return', authMiddleware, returnBook);
router.get('/history', authMiddleware, borrowHistory);
router.get('/most-borrowed', getMostBorrowedBooks)
module.exports = router;
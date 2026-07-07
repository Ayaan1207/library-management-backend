const express = require('express');
const router = express.Router();
const {getBooks, addBook, updateBook, deleteBook} = require('../controllers/book.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.get('/', getBooks);
router.post('/add', authMiddleware, adminMiddleware, addBook);
router.patch('/:id', authMiddleware, adminMiddleware, updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBook);

module.exports = router;
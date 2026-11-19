import express from 'express';
import { getBooks, addBook, deleteBook } from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBooks);
router.post('/', protect, addBook);
router.delete('/:id', protect, deleteBook);

export default router;

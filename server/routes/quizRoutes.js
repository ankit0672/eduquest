import express from 'express';
import { getQuizById, submitQuiz, createQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:quizId', getQuizById);
router.post('/:quizId/submit', protect, submitQuiz);
router.post('/', protect, createQuiz);

export default router;

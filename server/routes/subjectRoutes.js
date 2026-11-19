import express from 'express';
import { getSubjects, getChapterDetail } from '../controllers/subjectController.js';

const router = express.Router();

router.get('/', getSubjects);
router.get('/:grade/:subjectId/:chapterId', getChapterDetail);

export default router;

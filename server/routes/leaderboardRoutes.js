import express from 'express';
import { getLeaderboard, getAllBadges } from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', getLeaderboard);
router.get('/badges', getAllBadges);

export default router;

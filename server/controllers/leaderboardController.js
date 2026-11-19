import User from '../models/User.js';
import { getIsMongoConnected } from '../config/db.js';
import { getStore } from '../config/store.js';
import { badgesSeed } from '../data/curriculumData.js';

// @desc    Get Leaderboard (Global or by Grade)
// @route   GET /api/leaderboard?grade=10
export const getLeaderboard = async (req, res) => {
  try {
    const grade = req.query.grade ? Number(req.query.grade) : null;

    if (getIsMongoConnected()) {
      const filter = grade ? { grade } : {};
      const users = await User.find(filter)
        .select('name grade avatar xp level streak badges')
        .sort({ xp: -1 })
        .limit(20);

      const ranked = users.map((u, index) => ({
        rank: index + 1,
        _id: u._id,
        name: u.name,
        grade: u.grade,
        avatar: u.avatar,
        xp: u.xp,
        level: u.level,
        streak: u.streak,
        badgeCount: u.badges ? u.badges.length : 0,
      }));

      return res.json({ success: true, count: ranked.length, data: ranked });
    } else {
      const store = getStore();
      let users = [...store.users];

      if (grade) {
        users = users.filter((u) => u.grade === grade);
      }

      users.sort((a, b) => (b.xp || 0) - (a.xp || 0));

      const ranked = users.slice(0, 20).map((u, index) => ({
        rank: index + 1,
        _id: u._id,
        name: u.name,
        grade: u.grade,
        avatar: u.avatar || '🚀',
        xp: u.xp || 0,
        level: u.level || 1,
        streak: u.streak || 1,
        badgeCount: (u.badges || []).length,
      }));

      return res.json({ success: true, count: ranked.length, data: ranked });
    }
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard' });
  }
};

// @desc    Get list of all platform badges
// @route   GET /api/leaderboard/badges
export const getAllBadges = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: badgesSeed,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching badges' });
  }
};

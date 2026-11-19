import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
});

const quizHistorySchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  quizTitle: { type: String, required: true },
  subjectId: { type: String, required: true },
  chapterTitle: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  xpEarned: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    grade: { type: Number, required: true, min: 6, max: 10, default: 8 },
    avatar: { type: String, default: '🚀' },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 1 },
    lastActiveDate: { type: Date, default: Date.now },
    badges: [badgeSchema],
    quizHistory: [quizHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Method to calculate level based on XP
userSchema.methods.calculateLevel = function () {
  // Level threshold: Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 500, Level 5: 850, etc.
  const xp = this.xp;
  let lvl = 1;
  let required = 100;
  while (xp >= required && lvl < 20) {
    lvl++;
    required += lvl * 150;
  }
  this.level = lvl;
  return lvl;
};

// Method to update daily streak
userSchema.methods.checkAndUpdateStreak = function () {
  const now = new Date();
  const last = new Date(this.lastActiveDate);

  const diffTime = Math.abs(now.setHours(0, 0, 0, 0) - last.setHours(0, 0, 0, 0));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    this.streak += 1;
  } else if (diffDays > 1) {
    // Streak broken
    this.streak = 1;
  }
  this.lastActiveDate = new Date();
};

export default mongoose.models.User || mongoose.model('User', userSchema);

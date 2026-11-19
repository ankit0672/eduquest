import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import { getIsMongoConnected } from '../config/db.js';
import { getStore, saveLocalStore } from '../config/store.js';

// @desc    Get Quiz by ID
// @route   GET /api/quizzes/:quizId
export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (getIsMongoConnected()) {
      const quiz = await Quiz.findOne({ quizId });
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }
      return res.json({ success: true, data: quiz });
    } else {
      const store = getStore();
      const quiz = store.quizzes.find((q) => q.quizId === quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }
      return res.json({ success: true, data: quiz });
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ success: false, message: 'Server error fetching quiz' });
  }
};

// @desc    Submit Quiz answers & award XP, Level up, and Badges
// @route   POST /api/quizzes/:quizId/submit
export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of selected option indices: [0, 2, 1, ...]

    let quiz;
    if (getIsMongoConnected()) {
      quiz = await Quiz.findOne({ quizId });
    } else {
      const store = getStore();
      quiz = store.quizzes.find((q) => q.quizId === quizId);
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Evaluate answers
    let correctCount = 0;
    const detailedResults = quiz.questions.map((q, idx) => {
      const studentAnswer = answers ? answers[idx] : null;
      const isCorrect = studentAnswer === q.correctAnswerIndex;
      if (isCorrect) correctCount++;

      return {
        questionText: q.questionText,
        options: q.options,
        selectedAnswerIndex: studentAnswer,
        correctAnswerIndex: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation,
        hint: q.hint,
      };
    });

    const totalQuestions = quiz.questions.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    // Calculate XP:
    // Base XP: (correctCount / totalQuestions) * quiz.xpReward
    // Bonus: +20 XP for 100% accuracy, +10 XP completion bonus
    let xpEarned = Math.round((correctCount / totalQuestions) * (quiz.xpReward || 50)) + 10;
    if (accuracy === 100) xpEarned += 20;

    const newlyUnlockedBadges = [];

    // Update user stats
    let updatedUser;

    if (getIsMongoConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.xp += xpEarned;
      user.calculateLevel();

      // Check Badges
      const existingBadgeIds = new Set(user.badges.map((b) => b.id));

      // Badge: First Step
      if (!existingBadgeIds.has('first-step')) {
        const badge = {
          id: 'first-step',
          title: 'First Step',
          icon: '🎯',
          description: 'Completed your first quiz!',
          unlockedAt: new Date(),
        };
        user.badges.push(badge);
        newlyUnlockedBadges.push(badge);
      }

      // Badge: Sharp Shooter (100% accuracy)
      if (accuracy === 100 && !existingBadgeIds.has('perfect-score')) {
        const badge = {
          id: 'perfect-score',
          title: 'Sharp Shooter',
          icon: '⭐',
          description: 'Scored 100% on a chapter quiz!',
          unlockedAt: new Date(),
        };
        user.badges.push(badge);
        newlyUnlockedBadges.push(badge);
      }

      // Badge: Math Magician or Einstein Junior
      if (quiz.subjectId === 'science' && !existingBadgeIds.has('science-titan')) {
        const sciCount = user.quizHistory.filter((h) => h.subjectId === 'science').length + 1;
        if (sciCount >= 3) {
          const badge = {
            id: 'science-titan',
            title: 'Einstein Junior',
            icon: '🔬',
            description: 'Conquered 3 Science quizzes!',
            unlockedAt: new Date(),
          };
          user.badges.push(badge);
          newlyUnlockedBadges.push(badge);
        }
      }

      if (quiz.subjectId === 'math' && !existingBadgeIds.has('math-whiz')) {
        const mathCount = user.quizHistory.filter((h) => h.subjectId === 'math').length + 1;
        if (mathCount >= 3) {
          const badge = {
            id: 'math-whiz',
            title: 'Math Magician',
            icon: '📐',
            description: 'Solved 3 Math challenges!',
            unlockedAt: new Date(),
          };
          user.badges.push(badge);
          newlyUnlockedBadges.push(badge);
        }
      }

      // Record quiz history
      user.quizHistory.unshift({
        quizId: quiz.quizId,
        quizTitle: quiz.title,
        subjectId: quiz.subjectId,
        chapterTitle: quiz.chapterTitle,
        score: correctCount,
        totalQuestions,
        accuracy,
        xpEarned,
        completedAt: new Date(),
      });

      await user.save();
      const userObj = user.toObject();
      delete userObj.password;
      updatedUser = userObj;
    } else {
      const store = getStore();
      const user = store.users.find((u) => u._id === req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.xp = (user.xp || 0) + xpEarned;

      // Calculate level
      let lvl = 1;
      let required = 100;
      while (user.xp >= required && lvl < 20) {
        lvl++;
        required += lvl * 150;
      }
      user.level = lvl;

      const existingBadgeIds = new Set((user.badges || []).map((b) => b.id));

      // First Step
      if (!existingBadgeIds.has('first-step')) {
        const badge = {
          id: 'first-step',
          title: 'First Step',
          icon: '🎯',
          description: 'Completed your first quiz!',
          unlockedAt: new Date().toISOString(),
        };
        user.badges.push(badge);
        newlyUnlockedBadges.push(badge);
      }

      // Sharp Shooter
      if (accuracy === 100 && !existingBadgeIds.has('perfect-score')) {
        const badge = {
          id: 'perfect-score',
          title: 'Sharp Shooter',
          icon: '⭐',
          description: 'Scored 100% on a chapter quiz!',
          unlockedAt: new Date().toISOString(),
        };
        user.badges.push(badge);
        newlyUnlockedBadges.push(badge);
      }

      // Science / Math badges
      if (quiz.subjectId === 'science' && !existingBadgeIds.has('science-titan')) {
        const count = (user.quizHistory || []).filter((h) => h.subjectId === 'science').length + 1;
        if (count >= 3) {
          const badge = {
            id: 'science-titan',
            title: 'Einstein Junior',
            icon: '🔬',
            description: 'Conquered 3 Science quizzes!',
            unlockedAt: new Date().toISOString(),
          };
          user.badges.push(badge);
          newlyUnlockedBadges.push(badge);
        }
      }

      if (quiz.subjectId === 'math' && !existingBadgeIds.has('math-whiz')) {
        const count = (user.quizHistory || []).filter((h) => h.subjectId === 'math').length + 1;
        if (count >= 3) {
          const badge = {
            id: 'math-whiz',
            title: 'Math Magician',
            icon: '📐',
            description: 'Solved 3 Math challenges!',
            unlockedAt: new Date().toISOString(),
          };
          user.badges.push(badge);
          newlyUnlockedBadges.push(badge);
        }
      }

      if (!user.quizHistory) user.quizHistory = [];
      user.quizHistory.unshift({
        quizId: quiz.quizId,
        quizTitle: quiz.title,
        subjectId: quiz.subjectId,
        chapterTitle: quiz.chapterTitle,
        score: correctCount,
        totalQuestions,
        accuracy,
        xpEarned,
        completedAt: new Date().toISOString(),
      });

      saveLocalStore();
      const { password: _, ...userWithoutPassword } = user;
      updatedUser = userWithoutPassword;
    }

    return res.json({
      success: true,
      results: {
        score: correctCount,
        totalQuestions,
        accuracy,
        xpEarned,
        newlyUnlockedBadges,
        detailedResults,
      },
      user: updatedUser,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ success: false, message: 'Server error processing quiz submission' });
  }
};

// @desc    Create a new quiz (Teacher / Admin feature)
// @route   POST /api/quizzes
export const createQuiz = async (req, res) => {
  try {
    const { title, grade, subjectId, chapterId, chapterTitle, difficulty, questions, durationSeconds, xpReward } = req.body;

    if (!title || !grade || !subjectId || !questions || !questions.length) {
      return res.status(400).json({ success: false, message: 'Missing required quiz fields' });
    }

    const quizId = 'quiz-' + Date.now();
    const newQuizData = {
      quizId,
      title,
      grade: Number(grade),
      subjectId,
      chapterId: chapterId || `chap-${Date.now()}`,
      chapterTitle: chapterTitle || title,
      difficulty: difficulty || 'Medium',
      durationSeconds: durationSeconds || 120,
      xpReward: xpReward || 50,
      questions,
    };

    if (getIsMongoConnected()) {
      const created = await Quiz.create(newQuizData);
      return res.status(201).json({ success: true, data: created });
    } else {
      const store = getStore();
      store.quizzes.push(newQuizData);
      saveLocalStore();
      return res.status(201).json({ success: true, data: newQuizData });
    }
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error creating quiz' });
  }
};

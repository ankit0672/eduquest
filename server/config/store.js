import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { subjectsSeed, quizzesSeed, badgesSeed } from '../data/curriculumData.js';
import { booksSeed } from '../data/booksSeed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/local_db.json');

// Memory store state
let inMemoryDB = {
  users: [],
  subjects: [],
  quizzes: [],
  badges: [],
  books: [],
};

// Initialize seed data
export const initLocalStore = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed.subjects && parsed.subjects.length > 0 && parsed.quizzes && parsed.quizzes.length > 0) {
        inMemoryDB = parsed;
        console.log(`📦 Loaded existing local file database (${inMemoryDB.subjects.length} subjects, ${inMemoryDB.quizzes.length} quizzes).`);
        return;
      }
    }
  } catch (err) {
    console.warn('Could not read existing local DB file, initializing fresh store.', err.message);
  }

  // Seed default demo user
  const hashedPassword = bcrypt.hashSync('student123', 10);
  const adminHashed = bcrypt.hashSync('admin123', 10);

  inMemoryDB = {
    users: [
      {
        _id: 'user-demo-1',
        name: 'Aarav Sharma',
        email: 'aarav@eduquest.in',
        password: hashedPassword,
        grade: 10,
        avatar: '🚀',
        role: 'student',
        xp: 450,
        level: 3,
        streak: 4,
        lastActiveDate: new Date().toISOString(),
        badges: [
          {
            id: 'first-step',
            title: 'First Step',
            icon: '🎯',
            description: 'Complete your very first quiz on the platform!',
            unlockedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          },
          {
            id: 'perfect-score',
            title: 'Sharp Shooter',
            icon: '⭐',
            description: 'Score a perfect 100% on any chapter quiz!',
            unlockedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
        ],
        quizHistory: [
          {
            quizId: 'quiz-sci-10-1',
            quizTitle: 'Class 10 Science: Chemical Reactions Board Drill',
            subjectId: 'science',
            chapterTitle: 'Chemical Reactions and Equations',
            score: 3,
            totalQuestions: 3,
            accuracy: 100,
            xpEarned: 80,
            completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'user-demo-2',
        name: 'Priya Patel',
        email: 'priya@eduquest.in',
        password: hashedPassword,
        grade: 9,
        avatar: '🔬',
        role: 'student',
        xp: 620,
        level: 4,
        streak: 7,
        lastActiveDate: new Date().toISOString(),
        badges: [
          {
            id: 'first-step',
            title: 'First Step',
            icon: '🎯',
            description: 'Complete your very first quiz on the platform!',
            unlockedAt: new Date().toISOString(),
          },
          {
            id: 'streak-3',
            title: 'On Fire',
            icon: '🔥',
            description: 'Maintain a 3-day study streak!',
            unlockedAt: new Date().toISOString(),
          },
        ],
        quizHistory: [],
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'user-demo-3',
        name: 'Rohan Verma',
        email: 'rohan@eduquest.in',
        password: hashedPassword,
        grade: 8,
        avatar: '📐',
        role: 'student',
        xp: 280,
        level: 2,
        streak: 2,
        lastActiveDate: new Date().toISOString(),
        badges: [],
        quizHistory: [],
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'user-demo-admin',
        name: 'Mrs. Anita Rao (Teacher)',
        email: 'teacher@eduquest.in',
        password: adminHashed,
        grade: 10,
        avatar: '🎓',
        role: 'teacher',
        xp: 1500,
        level: 8,
        streak: 15,
        lastActiveDate: new Date().toISOString(),
        badges: [],
        quizHistory: [],
        createdAt: new Date().toISOString(),
      },
    ],
    subjects: subjectsSeed,
    quizzes: quizzesSeed,
    badges: badgesSeed,
    books: booksSeed,
  };

  saveLocalStore();
  console.log('✅ Local store seeded with demo students and NCERT curriculum.');
};

export const saveLocalStore = () => {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDB, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist local DB file:', err.message);
  }
};

// NOTE: initLocalStore() is called explicitly by db.js when MongoDB is unavailable.
// Do NOT call it here on module load — it must only run as a fallback.

export const getStore = () => inMemoryDB;

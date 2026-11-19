import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject.js';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import { subjectsSeed, quizzesSeed } from '../data/curriculumData.js';
import { booksSeed } from '../data/booksSeed.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduquest';
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoURI);
    console.log('Connected! Clearing old collections...');

    await Subject.deleteMany({});
    await Quiz.deleteMany({});
    await User.deleteMany({});
    await Book.deleteMany({});

    console.log('Seeding subjects and chapters...');
    await Subject.insertMany(subjectsSeed);

    console.log('Seeding quizzes...');
    await Quiz.insertMany(quizzesSeed);

    console.log('Seeding official NCERT books & PDFs...');
    await Book.insertMany(booksSeed);

    console.log('Creating demo users...');
    const hashed = await bcrypt.hash('student123', 10);
    const adminHashed = await bcrypt.hash('admin123', 10);

    await User.create([
      {
        name: 'Aarav Sharma',
        email: 'aarav@eduquest.in',
        password: hashed,
        grade: 10,
        avatar: '🚀',
        role: 'student',
        xp: 450,
        level: 3,
        streak: 4,
        badges: [
          {
            id: 'first-step',
            title: 'First Step',
            icon: '🎯',
            description: 'Completed your first quiz!',
            unlockedAt: new Date(),
          },
          {
            id: 'perfect-score',
            title: 'Sharp Shooter',
            icon: '⭐',
            description: 'Scored 100% on a chapter quiz!',
            unlockedAt: new Date(),
          },
        ],
      },
      {
        name: 'Mrs. Anita Rao',
        email: 'teacher@eduquest.in',
        password: adminHashed,
        grade: 10,
        avatar: '🎓',
        role: 'teacher',
        xp: 1500,
        level: 8,
        streak: 15,
        badges: [],
      },
    ]);

    console.log('✨ Database seeding complete successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();

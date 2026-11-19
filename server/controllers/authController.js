import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getIsMongoConnected } from '../config/db.js';
import { getStore, saveLocalStore } from '../config/store.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new student/user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, grade = 8, avatar = '🚀', role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (getIsMongoConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'A student with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        grade: Number(grade),
        avatar,
        role,
        xp: 0,
        level: 1,
        streak: 1,
        lastActiveDate: new Date(),
        badges: [],
        quizHistory: [],
      });

      const userObj = user.toObject();
      delete userObj.password;

      return res.status(201).json({
        success: true,
        user: userObj,
        token: generateToken(user._id),
      });
    } else {
      const store = getStore();
      const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'A student with this email already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        _id: 'user-' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        grade: Number(grade),
        avatar,
        role,
        xp: 0,
        level: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString(),
        badges: [],
        quizHistory: [],
        createdAt: new Date().toISOString(),
      };

      store.users.push(newUser);
      saveLocalStore();

      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json({
        success: true,
        user: userWithoutPassword,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (getIsMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      user.checkAndUpdateStreak();
      await user.save();

      const userObj = user.toObject();
      delete userObj.password;

      return res.json({
        success: true,
        user: userObj,
        token: generateToken(user._id),
      });
    } else {
      const store = getStore();
      const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Check streak
      const now = new Date();
      const last = new Date(user.lastActiveDate || now);
      const diffTime = Math.abs(now.setHours(0, 0, 0, 0) - last.setHours(0, 0, 0, 0));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak = (user.streak || 1) + 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
      user.lastActiveDate = new Date().toISOString();
      saveLocalStore();

      const { password: _, ...userWithoutPassword } = user;
      return res.json({
        success: true,
        user: userWithoutPassword,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Demo 1-Click Guest Login
// @route   POST /api/auth/guest
export const guestLogin = async (req, res) => {
  try {
    const { grade = 10, role = 'student' } = req.body;

    if (getIsMongoConnected()) {
      let guest = await User.findOne({ email: 'aarav@eduquest.in' });
      if (!guest) {
        const hashedPassword = await bcrypt.hash('student123', 10);
        guest = await User.create({
          name: 'Aarav Sharma (Demo Student)',
          email: 'aarav@eduquest.in',
          password: hashedPassword,
          grade: Number(grade),
          avatar: '🚀',
          role,
          xp: 450,
          level: 3,
          streak: 4,
          badges: [],
          quizHistory: [],
        });
      }

      const userObj = guest.toObject();
      delete userObj.password;

      return res.json({
        success: true,
        user: userObj,
        token: generateToken(guest._id),
      });
    } else {
      const store = getStore();
      const guest = store.users[0]; // Aarav Sharma
      const { password: _, ...userWithoutPassword } = guest;

      return res.json({
        success: true,
        user: userWithoutPassword,
        token: generateToken(guest._id),
      });
    }
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ success: false, message: 'Server error during guest login' });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user' });
  }
};

// @desc    Update student profile (avatar, name, grade)
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, grade } = req.body;

    if (getIsMongoConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (avatar) user.avatar = avatar;
      if (grade) user.grade = Number(grade);

      await user.save();
      const userObj = user.toObject();
      delete userObj.password;

      return res.json({ success: true, user: userObj });
    } else {
      const store = getStore();
      const user = store.users.find((u) => u._id === req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (avatar) user.avatar = avatar;
      if (grade) user.grade = Number(grade);

      saveLocalStore();
      const { password: _, ...userWithoutPassword } = user;

      return res.json({ success: true, user: userWithoutPassword });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

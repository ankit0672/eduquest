# 🚀 EduQuest — CBSE Class 6 to 10 Gamified Study Platform

A full-stack modern learning platform designed specifically for **CBSE / NCERT** students in Grades 6 through 10. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

---

## 🌟 Key Highlights

- 📚 **CBSE / NCERT Curriculum Aligned**: Comprehensive syllabus coverage for **Science, Mathematics, Social Studies, and English** across Classes 6, 7, 8, 9, and 10.
- ⚡ **Interactive Quiz Engine**: Multiple choice quizzes with countdown timers, teacher hints, real-time scoring, and step-by-step NCERT explanations.
- 🎮 **Gamification Engine**:
  - **XP & Levels**: Earn Experience Points on every completed quiz and level up from *Novice Explorer* to *Grand Scholar*.
  - **Daily Study Streaks**: Visual flame tracker to build regular study habits.
  - **Badges & Achievements**: Unlock milestones like *First Step*, *Sharp Shooter (100% score)*, *On Fire (3-day streak)*, *Math Magician*, and *Einstein Junior*.
  - **Live Leaderboard**: Filter rankings globally or by specific class (Class 6 to 10).
- 🗂️ **Interactive Memory Flashcards**: 3D flip card active recall system to master key definitions and equations before testing.
- 📐 **Formula Cheat Sheets**: High-yield equations, laws, and chemical reactions ready for revision.
- 🎓 **Teacher / Admin Studio**: Create and publish custom practice quizzes with multiple options, explanations, and hints.
- 🔌 **Zero-Config Dual Database Engine**: Seamlessly connects to real MongoDB / MongoDB Atlas, with an embedded JSON store fallback so the entire platform works 100% out of the box with zero external configuration!

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, Mongoose.
- **Database**: MongoDB / MongoDB Atlas (with automatic zero-config local storage fallback).

---

## 🚀 Quick Start Guide

### 1. Run the Platform
To launch both client and backend servers with a single command:
```bash
npm run dev
```
- **Client (Frontend)**: Runs at [http://localhost:5173](http://localhost:5173)
- **Server (Backend API)**: Runs at [http://localhost:5000](http://localhost:5000)

### 2. Instant 1-Click Demo Accounts
On the login screen, you can click either 1-click button or use these test credentials:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `aarav@eduquest.in` | `student123` | Class 10 Scholar with XP, Streaks & Badges |
| **Demo Student 2** | `priya@eduquest.in` | `student123` | Class 9 Scholar with 7-day streak |
| **Teacher / Admin** | `teacher@eduquest.in` | `admin123` | Teacher Studio to create & publish quizzes |

---

## 📂 Project Directory Structure

```
Full Stack project/
├── client/                     # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, FlashcardDeck, BadgeCard
│   │   ├── context/            # AuthContext (Auth, XP, Grade state)
│   │   ├── pages/              # Home, Subjects, ChapterDetail, Quiz, Leaderboard, Profile, Login, Register, TeacherAdmin
│   │   ├── services/           # api.js client API service
│   │   ├── App.jsx             # React Router routing configuration
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind base & custom animations
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express + Mongoose Backend
│   ├── config/                 # db.js & smart local store fallback
│   ├── controllers/            # auth, quiz, subject, and leaderboard logic
│   ├── data/                   # NCERT curriculum seed data for Classes 6-10
│   ├── middleware/             # JWT auth middleware
│   ├── models/                 # User, Quiz, Subject schemas
│   ├── routes/                 # Express API routes
│   ├── scripts/                # Database seed script
│   ├── server.js               # Main Express application entrypoint
│   └── package.json
│
└── package.json                # Root orchestrator (concurrently)
```

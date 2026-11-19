import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Flame, Trophy, Sparkles, BookOpen, Atom, Calculator, Globe, BookText, ArrowRight, Zap, Target, Star, CheckCircle } from 'lucide-react';

export const HomePage = () => {
  const { user, selectedGrade, setSelectedGrade, isAuthenticated, guestLogin } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [subRes, leadRes] = await Promise.all([
          api.getSubjects(selectedGrade),
          api.getLeaderboard(selectedGrade),
        ]);

        if (subRes.success) setSubjects(subRes.data);
        if (leadRes.success) setTopStudents(leadRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [selectedGrade]);

  const grades = [6, 7, 8, 9, 10];

  const getSubjectIcon = (iconName) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-6 h-6 text-white" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-white" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-white" />;
      default:
        return <BookText className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-5 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>NCERT / CBSE Curriculum for Classes 6 to 10</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Master Your Syllabus.{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                Level Up Daily.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-indigo-200 max-w-xl leading-relaxed">
              Crack your exams with bite-sized chapter notes, formula cheat sheets, rapid-fire quizzes, and earn badges as you study!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                to="/subjects"
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Explore Class {selectedGrade} Syllabus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {!isAuthenticated && (
                <button
                  onClick={() => guestLogin(selectedGrade, 'student')}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Try Demo Student</span>
                </button>
              )}
            </div>
          </div>

          {/* Gamification Status Card in Hero */}
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-white shadow-2xl">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl p-2 bg-white/10 rounded-2xl">{user.avatar || '🚀'}</span>
                    <div>
                      <h3 className="font-extrabold text-lg">{user.name}</h3>
                      <p className="text-xs text-indigo-200">Class {user.grade} Student</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                    <span>{user.streak || 1}d Streak</span>
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs font-bold text-indigo-200">
                    <span>Level {user.level || 1} Scholar</span>
                    <span className="text-amber-300">{user.xp || 0} Total XP</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-indigo-950/60 rounded-full h-2.5 overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, ((user.xp || 0) % 300) / 3)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-indigo-300 text-right">
                    {300 - ((user.xp || 0) % 300)} XP to Next Level
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/profile"
                    className="w-full block text-center py-2 bg-white text-indigo-950 font-bold text-xs rounded-xl hover:bg-indigo-50 transition shadow"
                  >
                    View My Badges & Analytics 🎯
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 mx-auto bg-amber-400/20 rounded-2xl flex items-center justify-center text-3xl">
                  🏆
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">Join the EduQuest Arena</h3>
                  <p className="text-xs text-indigo-200 mt-1">
                    Earn XP points, unlock badges, and compete with classmates across India.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <Flame className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                    <span>Daily Streaks</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <Trophy className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <span>Leaderboards</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Class Switcher Navigation Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-700">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Select Your Class:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {grades.map((grade) => {
              const active = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Class {grade}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Subjects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Class {selectedGrade} Subjects & Chapters
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a subject to read concise NCERT revision notes and take chapter quizzes.
            </p>
          </div>
          <Link
            to="/subjects"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>View All Chapters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.subjectId}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Top Gradient Banner */}
                  <div className={`p-6 bg-gradient-to-r ${subject.color} text-white flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        {getSubjectIcon(subject.icon)}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                          Class {subject.grade}
                        </span>
                        <h3 className="text-xl font-extrabold">{subject.name}</h3>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {subject.chapters?.length || 0} Chapters
                    </span>
                  </div>

                  {/* Chapter List Preview */}
                  <div className="p-6 space-y-3">
                    <p className="text-xs text-slate-500 line-clamp-2">{subject.description}</p>

                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Featured Chapters:
                      </div>
                      {subject.chapters?.slice(0, 2).map((chap) => (
                        <Link
                          key={chap.chapterId}
                          to={`/subjects/${subject.grade}/${subject.subjectId}/${chap.chapterId}`}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition group/item"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span className="text-xs font-bold text-slate-700 group-hover/item:text-indigo-600 line-clamp-1">
                              {chap.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded-full">
                            Notes & Quiz
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/subjects/${subject.grade}/${subject.subjectId}/${subject.chapters?.[0]?.chapterId || ''}`}
                    className="w-full text-center py-2.5 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 text-slate-700 text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    Open {subject.name} 📚
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500">No chapters found for Class {selectedGrade} yet.</p>
          </div>
        )}
      </section>

      {/* Gamification Highlights & Leaderboard Sneak Peek */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top 3 Leaderboard Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-slate-900 text-base">Class {selectedGrade} Top Scholars</h3>
                </div>
                <Link to="/leaderboard" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                  Full Board &rarr;
                </Link>
              </div>

              <div className="space-y-2.5">
                {topStudents.map((s, idx) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xl">{s.avatar}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{s.name}</div>
                        <div className="text-[10px] text-slate-400">Level {s.level} · {s.streak}d streak</div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-600">{s.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-center">
              <Link
                to="/leaderboard"
                className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
              >
                Compete to enter the Top 10 🚀
              </Link>
            </div>
          </div>

          {/* Gamification Features Banner */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-indigo-200 border border-white/10">
                <Target className="w-3.5 h-3.5 text-amber-300" />
                <span>The EduQuest Method</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Study smarter with active recall and daily rewards.
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-amber-300 font-bold text-sm flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>NCERT Core Summaries</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Clear, simplified chapter notes with key definitions and highlighted exam questions.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-amber-300 font-bold text-sm flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Formula Cheat Sheets</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Essential math & physics equations organized chapter-wise for rapid pre-exam revision.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-amber-300 font-bold text-sm flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Interactive Memory Cards</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Flippable flashcards to test active recall before jumping into timed tests.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-amber-300 font-bold text-sm flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Instant Explanations</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Get detailed step-by-step solutions for every quiz question to learn from your mistakes.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/subjects"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition"
              >
                <span>Start Practicing Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Award, BookOpen, Trophy, User, LogOut, Menu, X, Sparkles, GraduationCap } from 'lucide-react';

export const Navbar = () => {
  const { user, selectedGrade, setSelectedGrade, logout, guestLogin, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGradeChange = (e) => {
    setSelectedGrade(Number(e.target.value));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Subjects', path: '/subjects' },
    { label: 'NCERT Books 📚', path: '/library' },
    { label: 'Leaderboard', path: '/leaderboard' },
    ...(user?.role === 'teacher' ? [{ label: 'Teacher Studio', path: '/admin' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Grade Picker */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-3xl transform group-hover:scale-110 transition-transform">🚀</span>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
                  EduQuest
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 -mt-1">
                  CBSE Class 6–10
                </span>
              </div>
            </Link>

            {/* Class Grade Pill Selector */}
            <div className="hidden sm:flex items-center bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 text-xs font-semibold text-indigo-700 space-x-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Class:</span>
              <select
                value={selectedGrade}
                onChange={handleGradeChange}
                className="bg-transparent font-bold text-indigo-900 border-none focus:outline-none cursor-pointer"
              >
                <option value={6}>Class 6</option>
                <option value={7}>Class 7</option>
                <option value={8}>Class 8</option>
                <option value={9}>Class 9</option>
                <option value={10}>Class 10</option>
              </select>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors ${
                    active
                      ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Gamification Stats & User Auth */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Streak Counter */}
                <div
                  className="flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                  title="Daily Study Streak"
                >
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  <span>{user.streak || 1} {user.streak === 1 ? 'Day' : 'Days'}</span>
                </div>

                {/* Level & XP */}
                <div
                  className="flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                  title={`Level ${user.level || 1} - ${user.xp || 0} Total XP`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Lv.{user.level || 1}</span>
                  <span className="text-indigo-400">|</span>
                  <span className="text-indigo-600 font-extrabold">{user.xp || 0} XP</span>
                </div>

                {/* Profile Pill */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 transition"
                >
                  <span className="text-base">{user.avatar || '🚀'}</span>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => guestLogin(selectedGrade, 'student')}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full text-xs font-bold shadow-sm hover:shadow transition flex items-center space-x-1"
                >
                  <span>⚡ Quick Demo</span>
                </button>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold shadow-sm transition"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center space-x-2">
            <div className="flex items-center bg-indigo-50 rounded-lg px-2 py-1 text-xs font-bold text-indigo-700">
              <select
                value={selectedGrade}
                onChange={handleGradeChange}
                className="bg-transparent border-none focus:outline-none"
              >
                <option value={6}>Class 6</option>
                <option value={7}>Class 7</option>
                <option value={8}>Class 8</option>
                <option value={9}>Class 9</option>
                <option value={10}>Class 10</option>
              </select>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-3 shadow-lg">
          {isAuthenticated && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{user.avatar || '🚀'}</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{user.name}</div>
                  <div className="text-xs text-indigo-600 font-semibold">
                    Class {user.grade} · Lv.{user.level} ({user.xp} XP)
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>{user.streak}d</span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                My Profile & Badges
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    guestLogin(selectedGrade, 'student');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-bold shadow text-center"
                >
                  ⚡ Quick Demo Student
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center text-sm font-bold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Join Free
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

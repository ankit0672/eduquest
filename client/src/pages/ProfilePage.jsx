import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BadgeCard } from '../components/BadgeCard';
import {
  Flame,
  Sparkles,
  Trophy,
  Award,
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Save,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser, isAuthenticated, guestLogin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '🚀');
  const [grade, setGrade] = useState(user?.grade || 10);
  const [saving, setSaving] = useState(false);

  const availableAvatars = ['🚀', '🔬', '📐', '🌟', '🦉', '🧙‍♂️', '🦊', '⚡', '🎯', '👑'];

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-5xl">🔐</div>
        <h2 className="text-2xl font-extrabold text-slate-800">Sign in to view your profile</h2>
        <p className="text-sm text-slate-500">
          Track your XP, study streaks, and collect badges as you complete chapter quizzes.
        </p>
        <button
          onClick={() => guestLogin(10, 'student')}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-xl shadow"
        >
          ⚡ Load Demo Student Profile
        </button>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.updateProfile({ name, avatar, grade: Number(grade) });
      if (res.success && res.user) {
        updateUser(res.user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const unlockedBadgeIds = new Set((user.badges || []).map((b) => b.id));

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center text-5xl shadow-inner">
                {avatar}
              </div>
            </div>

            <div className="space-y-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-xl text-base font-bold focus:outline-none focus:border-indigo-500"
                    placeholder="Enter student name"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Class:</span>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(Number(e.target.value))}
                      className="px-2 py-1 text-xs border border-slate-300 rounded-lg font-bold"
                    >
                      {[6, 7, 8, 9, 10].map((g) => (
                        <option key={g} value={g}>Class {g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{user.name}</h1>
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Class {user.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </>
              )}

              <div className="flex items-center space-x-3 pt-1">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>{user.streak || 1} Day Streak</span>
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Level {user.level || 1} Scholar</span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit / Save Button */}
          <div>
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Avatar / Grade</span>
              </button>
            )}
          </div>
        </div>

        {/* Avatar Picker when in edit mode */}
        {isEditing && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-500">Choose Student Avatar:</span>
            <div className="flex flex-wrap gap-2">
              {availableAvatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition border ${
                    avatar === av
                      ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level Progression Progress Bar */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Experience Points: {user.xp || 0} XP</span>
            <span className="text-indigo-600 font-extrabold">Next Rank at Level {(user.level || 1) + 1}</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((user.xp || 0) % 300) / 3)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Badges Collection Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Achievements & Badges</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unlocked {(user.badges || []).length} milestone badges so far.
            </p>
          </div>
          <Award className="w-6 h-6 text-amber-500" />
        </div>

        {user.badges && user.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {user.badges.map((b) => (
              <BadgeCard
                key={b.id}
                badge={b}
                isUnlocked={true}
                unlockedAt={b.unlockedAt}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-600">No badges unlocked yet!</p>
            <p className="text-xs text-slate-400">
              Complete your first chapter quiz to unlock the "First Step" achievement! 🎯
            </p>
          </div>
        )}
      </div>

      {/* Quiz History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900">Recent Quiz Activity</h3>
          <span className="text-xs font-bold text-slate-400">
            {(user.quizHistory || []).length} Quizzes Attempted
          </span>
        </div>

        {user.quizHistory && user.quizHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Quiz / Chapter</th>
                  <th className="pb-3 text-center">Score</th>
                  <th className="pb-3 text-center">Accuracy</th>
                  <th className="pb-3 text-center">XP Earned</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {user.quizHistory.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 font-bold text-slate-800">
                      <div>{q.quizTitle}</div>
                      <div className="text-[10px] text-slate-400">{q.chapterTitle}</div>
                    </td>
                    <td className="py-3.5 text-center font-bold text-slate-700">
                      {q.score} / {q.totalQuestions}
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          q.accuracy >= 80
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {q.accuracy}%
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-extrabold text-amber-600">
                      +{q.xpEarned} XP
                    </td>
                    <td className="py-3.5 text-right text-slate-400">
                      {new Date(q.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
            You haven't taken any quizzes yet. Explore a chapter and test your skills!
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BadgeCard } from '../components/BadgeCard';
import { Trophy, Flame, Sparkles, Award, Medal, Crown } from 'lucide-react';

export const LeaderboardPage = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const gradeParam = selectedGrade === 'all' ? null : Number(selectedGrade);
        const [leadRes, badgeRes] = await Promise.all([
          api.getLeaderboard(gradeParam),
          api.getAllBadges(),
        ]);

        if (leadRes.success) setLeaderboard(leadRes.data);
        if (badgeRes.success) setBadges(badgeRes.data);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [selectedGrade]);

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-800">
          <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>EduQuest Hall of Fame</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Student Leaderboard & Rankings
        </h1>
        <p className="text-sm text-slate-500">
          Compete with fellow CBSE students across India by completing chapter notes and acing quizzes!
        </p>

        {/* Grade switch pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-1.5">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedGrade === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Classes
          </button>
          {[6, 7, 8, 9, 10].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(String(g))}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedGrade === String(g)
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Class {g}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 max-w-4xl mx-auto">
              {/* 2nd Place */}
              {top3[1] && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 shadow-sm order-2 md:order-1 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-700 font-extrabold text-xs px-3 py-1 rounded-full border border-slate-300">
                    🥈 2nd Rank
                  </div>
                  <div className="text-4xl pt-2">{top3[1].avatar}</div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{top3[1].name}</h3>
                    <p className="text-xs text-slate-400">Class {top3[1].grade} · Level {top3[1].level}</p>
                  </div>
                  <div className="text-lg font-black text-indigo-600 bg-indigo-50 py-1.5 rounded-xl">
                    {top3[1].xp} XP
                  </div>
                </div>
              )}

              {/* 1st Place (Center & Taller) */}
              {top3[0] && (
                <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl border-2 border-amber-300 p-8 text-center space-y-4 shadow-lg order-1 md:order-2 relative transform md:-translate-y-3">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow flex items-center space-x-1">
                    <Crown className="w-3.5 h-3.5 fill-white" />
                    <span>Grand Champion</span>
                  </div>
                  <div className="text-5xl pt-2">{top3[0].avatar}</div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{top3[0].name}</h3>
                    <p className="text-xs text-amber-700 font-semibold">
                      Class {top3[0].grade} · Level {top3[0].level} Scholar
                    </p>
                  </div>
                  <div className="text-2xl font-black text-amber-600 bg-amber-100/70 py-2 rounded-xl">
                    {top3[0].xp} XP
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-xs font-bold text-orange-600">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span>{top3[0].streak} Day Streak!</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 shadow-sm order-3 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-800 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-200">
                    🥉 3rd Rank
                  </div>
                  <div className="text-4xl pt-2">{top3[2].avatar}</div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{top3[2].name}</h3>
                    <p className="text-xs text-slate-400">Class {top3[2].grade} · Level {top3[2].level}</p>
                  </div>
                  <div className="text-lg font-black text-indigo-600 bg-indigo-50 py-1.5 rounded-xl">
                    {top3[2].xp} XP
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ranking Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Full Leaderboard Rankings</h3>
              <span className="text-xs text-slate-400">{leaderboard.length} Students Listed</span>
            </div>

            <div className="divide-y divide-slate-100">
              {leaderboard.map((student) => (
                <div
                  key={student._id}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        student.rank === 1
                          ? 'bg-amber-400 text-white'
                          : student.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : student.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {student.rank}
                    </span>
                    <span className="text-2xl">{student.avatar}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-400">
                        Class {student.grade} · Lv.{student.level} · {student.badgeCount || 0} Badges
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-right">
                    <div className="hidden sm:flex items-center space-x-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      <span>{student.streak}d</span>
                    </div>
                    <div>
                      <span className="text-sm font-black text-indigo-600">{student.xp}</span>
                      <span className="text-xs text-slate-400 ml-1">XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Gallery Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-5xl mx-auto space-y-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Rewards Catalog</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Unlockable Platform Achievements
              </h2>
              <p className="text-xs text-slate-500">
                Complete daily study streaks, solve tests with 100% accuracy, and level up to unlock these prestigious badges!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} isUnlocked={false} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

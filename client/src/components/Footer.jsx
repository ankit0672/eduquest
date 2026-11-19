import React from 'react';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-extrabold text-white">EduQuest</span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                CBSE 6–10
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering students in Classes 6 through 10 with interactive NCERT-aligned concept notes, formula flashcards, and gamified practice challenges.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Learn Daily · Earn XP · Top the Leaderboard</span>
            </div>
          </div>

          {/* Classes */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3">Classes</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition cursor-pointer">Class 10 (Board Prep)</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Class 9 (Foundation)</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Class 8 (Middle School)</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Class 7 & Class 6</span></li>
            </ul>
          </div>

          {/* Core Subjects */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3">Core Subjects</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition cursor-pointer">Science (Physics, Chem, Bio)</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Mathematics</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Social Studies</span></li>
              <li><span className="hover:text-white transition cursor-pointer">English Grammar</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EduQuest CBSE Learning Platform. Aligned with NCERT Curriculum guidelines.</p>
          <div className="flex items-center space-x-1">
            <span>Built with passion for students</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};

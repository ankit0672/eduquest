import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { ArrowLeft, BookOpen, Sparkles, CheckCircle2, Zap, Award, Share2 } from 'lucide-react';

export const ChapterDetailPage = () => {
  const { grade, subjectId, chapterId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'formulas', 'flashcards'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const res = await api.getChapterDetail(grade, subjectId, chapterId);
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to fetch chapter details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [grade, subjectId, chapterId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
      </div>
    );
  }

  if (!data || !data.chapter) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Chapter not found</h2>
        <p className="text-slate-500 mt-2">The chapter you are looking for does not exist.</p>
        <Link to="/subjects" className="mt-4 inline-block text-indigo-600 font-bold">
          &larr; Back to Subjects
        </Link>
      </div>
    );
  }

  const { subject, chapter } = data;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/subjects"
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Class {grade} {subject.name}</span>
        </Link>

        {chapter.quizId && (
          <Link
            to={`/quiz/${chapter.quizId}`}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Quiz Challenge</span>
          </Link>
        )}
      </div>

      {/* Chapter Title Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
              Class {grade} · {subject.name}
            </span>
            <span className="text-xs font-bold text-slate-400">NCERT Chapter</span>
          </div>

          <div className="text-xs font-bold text-slate-500 flex items-center space-x-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Earn +50 XP on completion</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {chapter.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          {chapter.summary}
        </p>

        {/* Tab switcher */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Key Concepts ({chapter.keyPoints?.length || 0})</span>
          </button>

          {chapter.formulas?.length > 0 && (
            <button
              onClick={() => setActiveTab('formulas')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'formulas'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Formula Sheet ({chapter.formulas.length})</span>
            </button>
          )}

          {chapter.flashcards?.length > 0 && (
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'flashcards'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Flashcard Deck ({chapter.flashcards.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Key Concepts & Bullet Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Essential Examination Points</span>
            </h3>

            <div className="space-y-3 pt-2">
              {chapter.keyPoints?.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Formula Sheet */}
      {activeTab === 'formulas' && chapter.formulas && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Formulas, Reactions & Laws Cheat Sheet
          </h3>
          <p className="text-xs text-slate-500">
            High-yield equations frequently tested in CBSE board and school assessments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {chapter.formulas.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/40 to-white border border-indigo-100 space-y-2 shadow-sm"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-full">
                  {item.label}
                </span>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 font-mono py-1">
                  {item.formula}
                </div>
                {item.explanation && (
                  <p className="text-xs text-slate-500">{item.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Flashcards */}
      {activeTab === 'flashcards' && chapter.flashcards && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Active Recall Training</h3>
            <p className="text-xs text-slate-500">
              Flip the card to test whether you remember the answer before revealing it.
            </p>
          </div>

          <FlashcardDeck flashcards={chapter.flashcards} />
        </div>
      )}

      {/* Bottom CTA Card */}
      {chapter.quizId && (
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Test Your Mastery
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold">Ready for the Chapter Quiz?</h3>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-md">
              Answer the multiple-choice questions, earn +50 XP, and unlock the "Sharp Shooter" badge!
            </p>
          </div>

          <Link
            to={`/quiz/${chapter.quizId}`}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-orange-500/30 transition transform hover:-translate-y-0.5 shrink-0 flex items-center space-x-2"
          >
            <span>Start Chapter Quiz ⚡</span>
          </Link>
        </div>
      )}
    </div>
  );
};

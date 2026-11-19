import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Timer,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  AlertCircle,
} from 'lucide-react';

export const QuizPage = () => {
  const { quizId } = useParams();
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await api.getQuiz(quizId);
        if (res.success && res.data) {
          setQuiz(res.data);
          setTimeLeft(res.data.durationSeconds || 120);
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || loading || !quiz) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, loading, quiz]);

  const handleSelectOption = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setShowHint(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  const handleSubmit = async () => {
    if (submitting || isSubmitted) return;
    setSubmitting(true);

    try {
      // Build answers array in sequential order
      const answersArray = quiz.questions.map((_, idx) =>
        selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : null
      );

      const res = await api.submitQuiz(quizId, answersArray);

      if (res.success) {
        setResults(res.results);
        setIsSubmitted(true);

        if (res.user) {
          updateUser(res.user);
        }

        if (res.results.accuracy >= 70) {
          triggerConfetti();
        }
      } else {
        alert(res.message || 'Error submitting quiz');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting quiz. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 space-y-6">
        <div className="h-6 w-36 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="h-72 bg-slate-200 animate-pulse rounded-3xl"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Quiz not found</h2>
        <p className="text-slate-500 mt-2">The quiz you requested could not be located.</p>
        <Link to="/subjects" className="mt-4 inline-block text-indigo-600 font-bold">
          &larr; Back to Subjects
        </Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/subjects`}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </Link>

        {/* Timer */}
        {!isSubmitted && (
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              timeLeft < 30
                ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {isSubmitted && results ? (
        <div className="space-y-6">
          {/* Result Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-md bg-gradient-to-tr from-amber-100 to-amber-200">
              {results.accuracy >= 80 ? '🏆' : results.accuracy >= 50 ? '🌟' : '📚'}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Quiz Complete
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">{quiz.title}</h2>
              <p className="text-sm text-slate-500">
                Great job reviewing Class {quiz.grade} {quiz.chapterTitle}!
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-2xl font-black text-slate-900">
                  {results.score}/{results.totalQuestions}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Score
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-2xl font-black text-emerald-600">{results.accuracy}%</div>
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Accuracy
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="text-2xl font-black text-amber-600">+{results.xpEarned}</div>
                <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  XP Earned
                </div>
              </div>
            </div>

            {/* Unlocked Badges Notification */}
            {results.newlyUnlockedBadges?.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-md max-w-md mx-auto space-y-2">
                <div className="flex items-center justify-center space-x-1.5 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>New Achievement Unlocked!</span>
                </div>
                {results.newlyUnlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm p-2 rounded-xl text-xs font-bold"
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span>{badge.title} — {badge.description}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setTimeLeft(quiz.durationSeconds || 120);
                }}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>

              <Link
                to="/subjects"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <span>Back to Subjects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900">
              Detailed Question Review & Explanations
            </h3>

            <div className="space-y-6">
              {results.detailedResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    item.isCorrect
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-rose-50/30 border-rose-200'
                  } space-y-3`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-2.5">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Question {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {item.questionText}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? 'Correct (+10 XP)' : 'Incorrect'}
                    </span>
                  </div>

                  {/* Options review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {item.options.map((opt, optIdx) => {
                      const isSelected = item.selectedAnswerIndex === optIdx;
                      const isCorrectAnswer = item.correctAnswerIndex === optIdx;

                      let style = 'bg-white border-slate-200 text-slate-600';
                      if (isCorrectAnswer) {
                        style = 'bg-emerald-100/70 border-emerald-300 text-emerald-900 font-bold';
                      } else if (isSelected && !item.isCorrect) {
                        style = 'bg-rose-100/70 border-rose-300 text-rose-900 font-bold';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${style}`}
                        >
                          <span>{opt}</span>
                          {isCorrectAnswer && <span className="text-[10px] text-emerald-700">✓ Correct</span>}
                          {isSelected && !isCorrectAnswer && (
                            <span className="text-[10px] text-rose-700">✕ Your Answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* NCERT Explanation box */}
                  <div className="p-3 bg-white/80 rounded-xl border border-slate-200/80 text-xs space-y-1">
                    <span className="font-bold text-indigo-700 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>NCERT Explanation:</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Active In-Progress View */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="text-indigo-600 uppercase tracking-wider font-extrabold">
                {quiz.title}
              </span>
              <span>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                {currentQ.questionText}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === index;
                const letter = String.fromCharCode(65 + index); // A, B, C, D

                return (
                  <div
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base">{option}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint Box (Optional toggle) */}
            {currentQ.hint && (
              <div className="pt-2">
                {showHint ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Teacher's Hint: </span>
                      <span>{currentQ.hint}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Need a hint? Click here</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                currentQuestionIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <span>{submitting ? 'Calculating Score...' : 'Submit Quiz 🚀'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

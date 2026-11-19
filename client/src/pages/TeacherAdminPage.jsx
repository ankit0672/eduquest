import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  AlertCircle,
  FileText,
  Lock,
  Layers,
  GraduationCap,
  Download,
  Eye,
} from 'lucide-react';

export const TeacherAdminPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz', 'pdf', 'manage'

  // --- Quiz Form State ---
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState(10);
  const [subjectId, setSubjectId] = useState('science');
  const [chapterTitle, setChapterTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [durationSeconds, setDurationSeconds] = useState(120);
  const [xpReward, setXpReward] = useState(60);

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: '',
      hint: '',
    },
  ]);

  // --- PDF Book Form State ---
  const [bookTitle, setBookTitle] = useState('');
  const [bookGrade, setBookGrade] = useState(10);
  const [bookSubjectId, setBookSubjectId] = useState('science');
  const [bookPdfUrl, setBookPdfUrl] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookFileSize, setBookFileSize] = useState('1.5 MB');

  // Status & Feedback
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [teacherBooks, setTeacherBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  // Load teacher's published books
  const loadTeacherBooks = async () => {
    setLoadingBooks(true);
    try {
      const res = await api.getBooks();
      if (res.success) {
        setTeacherBooks(res.data.filter((b) => !b.isOfficial || b.addedBy === user?.name));
      }
    } catch (err) {
      console.error('Error fetching teacher books:', err);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (isTeacher) {
      loadTeacherBooks();
    }
  }, [isTeacher, activeTab]);

  // Handle Question manipulation
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        hint: '',
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (qIndex, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return updated;
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const newOptions = [...updated[qIndex].options];
      newOptions[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: newOptions };
      return updated;
    });
  };

  // Submit Quiz
  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!title || !chapterTitle) {
      alert('Please enter Quiz Title and Chapter Name');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        alert(`Question #${i + 1} is missing text`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert(`Question #${i + 1} has empty options`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        grade: Number(grade),
        subjectId,
        chapterTitle,
        chapterId: `custom-${Date.now()}`,
        difficulty,
        durationSeconds: Number(durationSeconds),
        xpReward: Number(xpReward),
        questions,
      };

      const res = await api.createQuiz(payload);
      if (res.success) {
        setMessage('Quiz published successfully! Students can now practice it.');
        setTimeout(() => {
          navigate('/subjects');
        }, 1500);
      } else {
        alert(res.message || 'Error creating quiz');
      }
    } catch (err) {
      console.error('Quiz creation error:', err);
      alert('Error publishing quiz');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit PDF Book Link
  const handleSubmitBook = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!bookTitle || !bookPdfUrl) {
      alert('Please fill in Book Title and PDF Link');
      return;
    }

    if (!bookPdfUrl.startsWith('http://') && !bookPdfUrl.startsWith('https://')) {
      alert('PDF link must start with http:// or https://');
      return;
    }

    setSubmitting(true);
    try {
      const subjectNames = {
        science: 'Science',
        math: 'Mathematics',
        social: 'Social Studies',
        english: 'English',
      };

      const payload = {
        title: bookTitle,
        grade: Number(bookGrade),
        subjectId: bookSubjectId,
        subjectName: subjectNames[bookSubjectId] || 'General',
        pdfUrl: bookPdfUrl,
        description: bookDescription,
        fileSize: bookFileSize || 'PDF Document',
      };

      const res = await api.addBook(payload);
      if (res.success) {
        setMessage('Book PDF link published successfully to the student library!');
        setBookTitle('');
        setBookPdfUrl('');
        setBookDescription('');
        loadTeacherBooks();
        setTimeout(() => {
          setActiveTab('manage');
        }, 1200);
      } else {
        alert(res.message || 'Error publishing book PDF link');
      }
    } catch (err) {
      console.error('Error adding book:', err);
      alert('Failed to publish book PDF.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to remove this book PDF?')) return;
    try {
      const res = await api.deleteBook(id);
      if (res.success) {
        loadTeacherBooks();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Login as Demo Teacher helper for testing
  const handleQuickTeacherLogin = async () => {
    setSubmitting(true);
    await login('teacher@eduquest.in', 'admin123');
    setSubmitting(false);
  };

  // Guard: If not teacher or admin, show security access screen
  if (!isTeacher) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-50 border border-purple-200 flex items-center justify-center text-3xl">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Educator Portal Protected</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Only verified teachers and administrators can publish chapter tests and add textbook PDF links.
            </p>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 text-left space-y-1">
            <span className="text-xs font-bold text-purple-900 flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Verified Educator Account:</span>
            </span>
            <p className="text-[11px] text-purple-700">
              Email: <code className="bg-white px-1.5 py-0.5 rounded font-bold">teacher@eduquest.in</code>
            </p>
            <p className="text-[11px] text-purple-700">
              Password: <code className="bg-white px-1.5 py-0.5 rounded font-bold">admin123</code>
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleQuickTeacherLogin}
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              {submitting ? 'Verifying...' : '⚡ Quick Sign In as Demo Teacher'}
            </button>

            <Link
              to="/login"
              className="block text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              Sign in with another teacher account &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Verified Educator Studio · {user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Curriculum Authoring & Resource Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish official practice quizzes and share verified textbook or handwritten PDF links.
          </p>
        </div>

        <Link
          to="/library"
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 self-start sm:self-center transition"
        >
          <BookOpen className="w-4 h-4" />
          <span>View Student Library</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'quiz'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Create Practice Quiz ⚡</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'pdf'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Publish Book & Notes PDF 📚</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'manage'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Manage My Uploads ({teacherBooks.length})</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* TAB 1: CREATE QUIZ FORM */}
      {activeTab === 'quiz' && (
        <form onSubmit={handleSubmitQuiz} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Quiz Specifications</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Quiz Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Class 10 Physics: Electricity Diagnostic Drill"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class Grade *</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-white"
                >
                  {[6, 7, 8, 9, 10].map((g) => (
                    <option key={g} value={g}>Class {g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-white"
                >
                  <option value="science">Science</option>
                  <option value="math">Mathematics</option>
                  <option value="social">Social Studies</option>
                  <option value="english">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Name *</label>
                <input
                  type="text"
                  required
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. Life Processes"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-white"
                >
                  <option value="Easy">Easy (Foundation)</option>
                  <option value="Medium">Medium (Standard)</option>
                  <option value="Hard">Hard (Exemplar / Board)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Limit (Seconds)</label>
                <input
                  type="number"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">XP Reward</label>
                <input
                  type="number"
                  value={xpReward}
                  onChange={(e) => setXpReward(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Questions ({questions.length})
              </h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Question</span>
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    Question #{qIndex + 1}
                  </span>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Remove Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Question Text *</label>
                  <input
                    type="text"
                    required
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    placeholder="e.g. Which blood vessel carries oxygenated blood from lungs to heart?"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Multiple Choice Options (Select radio of correct answer):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded-xl border flex items-center space-x-2 ${
                          q.correctAnswerIndex === optIndex
                            ? 'border-emerald-500 bg-emerald-50/50'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswerIndex === optIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', optIndex)}
                          className="w-4 h-4 text-emerald-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          className="w-full bg-transparent text-xs sm:text-sm focus:outline-none font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Detailed NCERT Explanation *
                    </label>
                    <input
                      type="text"
                      required
                      value={q.explanation}
                      onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                      placeholder="Why this answer is scientifically correct"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Helpful Hint (Optional)
                    </label>
                    <input
                      type="text"
                      value={q.hint}
                      onChange={(e) => handleQuestionChange(qIndex, 'hint', e.target.value)}
                      placeholder="Clue to guide the student"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition"
            >
              {submitting ? 'Publishing Quiz...' : 'Publish Practice Quiz 🚀'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: PUBLISH PDF BOOK LINK FORM */}
      {activeTab === 'pdf' && (
        <form onSubmit={handleSubmitBook} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-slate-900">
                Publish Textbook or Handwritten Notes PDF Link
              </h2>
              <p className="text-xs text-slate-500">
                Provide official NCERT links, public Google Drive links, or school document URLs. Only verified teachers can submit links.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Book / Chapter Title *
                </label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="e.g. Class 10 Physics: Board Formula Handbook & Numerical Derivations"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class Grade *</label>
                <select
                  value={bookGrade}
                  onChange={(e) => setBookGrade(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-white"
                >
                  {[6, 7, 8, 9, 10].map((g) => (
                    <option key={g} value={g}>Class {g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <select
                  value={bookSubjectId}
                  onChange={(e) => setBookSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold bg-white"
                >
                  <option value="science">Science</option>
                  <option value="math">Mathematics</option>
                  <option value="social">Social Studies</option>
                  <option value="english">English</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct PDF Link (URL) *
                </label>
                <input
                  type="url"
                  required
                  value={bookPdfUrl}
                  onChange={(e) => setBookPdfUrl(e.target.value)}
                  placeholder="https://ncert.nic.in/textbook/pdf/jesc101.pdf or Google Drive link"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Teacher Guidance Note
                </label>
                <textarea
                  rows="3"
                  value={bookDescription}
                  onChange={(e) => setBookDescription(e.target.value)}
                  placeholder="e.g. Includes high-priority exam questions and step-by-step solved numericals for CBSE 2026."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated File Size</label>
                <input
                  type="text"
                  value={bookFileSize}
                  onChange={(e) => setBookFileSize(e.target.value)}
                  placeholder="e.g. 2.1 MB"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-end">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800 w-full">
                  <span>Author tag: </span>
                  <span className="font-bold">{user.name}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition"
              >
                {submitting ? 'Publishing...' : 'Publish PDF to Student Library 📚'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: MANAGE UPLOADED BOOKS */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Teacher Curated Books & Notes ({teacherBooks.length})
            </h2>
            <button
              onClick={() => setActiveTab('pdf')}
              className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Book PDF</span>
            </button>
          </div>

          {loadingBooks ? (
            <div className="p-8 text-center text-slate-400">Loading published resources...</div>
          ) : teacherBooks.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {teacherBooks.map((item) => (
                <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                        Class {item.grade} · {item.subjectName}
                      </span>
                      <span className="text-xs text-slate-400">{item.fileSize}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-indigo-600 transition"
                      title="Preview PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteBook(item._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              No custom teacher books added yet. Click "Publish Book & Notes PDF" to contribute!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

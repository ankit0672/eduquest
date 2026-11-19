import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  BookOpen,
  Download,
  Eye,
  Plus,
  Search,
  Sparkles,
  GraduationCap,
  FileText,
  ExternalLink,
  X,
  CheckCircle2,
  Trash2,
  Lock,
  Layers,
} from 'lucide-react';

export const BooksLibraryPage = () => {
  const { user, selectedGrade, setSelectedGrade, isAuthenticated } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // In-app PDF Viewer Modal state
  const [activePdfBook, setActivePdfBook] = useState(null);

  // Teacher Form State
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState(selectedGrade || 10);
  const [newSubjectId, setNewSubjectId] = useState('science');
  const [newPdfUrl, setNewPdfUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFileSize, setNewFileSize] = useState('PDF Document');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.getBooks(selectedGrade, subjectFilter, searchQuery);
      if (res.success) {
        setBooks(res.data);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedGrade, subjectFilter, searchQuery]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPdfUrl) {
      alert('Please fill in Book Title and PDF Link');
      return;
    }

    setIsSubmitting(true);
    setFormSuccessMessage('');

    try {
      const subjectNames = {
        science: 'Science',
        math: 'Mathematics',
        social: 'Social Studies',
        english: 'English',
      };

      const payload = {
        title: newTitle,
        grade: Number(newGrade),
        subjectId: newSubjectId,
        subjectName: subjectNames[newSubjectId] || 'General',
        pdfUrl: newPdfUrl,
        description: newDescription,
        fileSize: newFileSize || 'PDF Document',
      };

      const res = await api.addBook(payload);
      if (res.success) {
        setFormSuccessMessage('Book PDF published successfully! Students can now access it.');
        setNewTitle('');
        setNewPdfUrl('');
        setNewDescription('');
        setShowTeacherForm(false);
        fetchBooks();
      } else {
        alert(res.message || 'Error publishing PDF link');
      }
    } catch (err) {
      console.error('Error adding book:', err);
      alert('Failed to publish book PDF.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book PDF?')) return;
    try {
      const res = await api.deleteBook(bookId);
      if (res.success) {
        fetchBooks();
      }
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const grades = [6, 7, 8, 9, 10];
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full text-xs font-bold text-indigo-700">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital NCERT Textbook Repository</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Class {selectedGrade} E-Books & Chapter PDFs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Read official NCERT textbook chapters online with the built-in reader, download offline copies, and view teacher-curated study material.
          </p>
        </div>

        {/* Action: Teacher Add Book Button (Only for Verified Teachers & Admins) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {isTeacher ? (
            <button
              onClick={() => setShowTeacherForm(!showTeacherForm)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{showTeacherForm ? 'Close Form' : 'Teacher: Add PDF Link 🔗'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-xs text-slate-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Educator Access Only · Sign in as Teacher to post links</span>
            </div>
          )}
        </div>
      </div>

      {formSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{formSuccessMessage}</span>
        </div>
      )}

      {/* Teacher Add PDF Link Section (Strictly restricted to Teachers & Admins) */}
      {isTeacher && showTeacherForm && (
        <div className="bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/40 rounded-3xl border-2 border-purple-200 p-6 sm:p-8 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-700 font-extrabold text-sm">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <span>Educator Portal: Publish Book or Notes PDF Link</span>
            </div>
            <button
              onClick={() => setShowTeacherForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Paste any direct PDF link (NCERT link, Google Drive public file, Cloudinary, or school website) to make it available for students.
          </p>

          <form onSubmit={handleAddBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Book / Chapter Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Class 10 Science Exemplar Solutions Chapter 1"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Class Grade *</label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold bg-white"
              >
                {[6, 7, 8, 9, 10].map((g) => (
                  <option key={g} value={g}>Class {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
              <select
                value={newSubjectId}
                onChange={(e) => setNewSubjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold bg-white"
              >
                <option value="science">Science</option>
                <option value="math">Mathematics</option>
                <option value="social">Social Studies</option>
                <option value="english">English</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Direct PDF URL *</label>
              <input
                type="url"
                required
                value={newPdfUrl}
                onChange={(e) => setNewPdfUrl(e.target.value)}
                placeholder="https://ncert.nic.in/textbook/pdf/... or Google Drive public link"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="e.g. Highlights important 5-mark board questions with complete solutions"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTeacherForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition"
              >
                {isSubmitting ? 'Publishing...' : 'Publish PDF to Library 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Class Selector & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Class switcher buttons */}
        <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto">
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedGrade === grade
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Class {grade}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapter or book..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'science', 'math', 'social', 'english'].map((sub) => {
          const labels = {
            all: 'All Subjects',
            science: 'Science',
            math: 'Mathematics',
            social: 'Social Studies',
            english: 'English',
          };
          const active = subjectFilter === sub;
          return (
            <button
              key={sub}
              onClick={() => setSubjectFilter(sub)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {labels[sub]}
            </button>
          );
        })}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-60 bg-slate-200 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const isSci = book.subjectId === 'science';
            const isMath = book.subjectId === 'math';

            return (
              <div
                key={book._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                        isSci
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : isMath
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      Class {book.grade} · {book.subjectName}
                    </span>

                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {book.fileSize || 'PDF'}
                    </span>
                  </div>

                  {/* Book Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {book.description || 'Authentic NCERT textbook material.'}
                    </p>
                  </div>

                  {/* Source indicator */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-semibold border-t border-slate-100">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{book.addedBy || 'NCERT Official'}</span>
                    </span>

                    {/* Delete button (Strictly Teacher or Admin only) */}
                    {isTeacher && (!book.isOfficial || user?.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="text-slate-300 hover:text-rose-600 p-1 transition"
                        title="Delete Book (Teacher Only)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActivePdfBook(book)}
                    className="py-2.5 px-3 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 text-slate-700 text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read In-App</span>
                  </button>

                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No books found for Class {selectedGrade}</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing another subject filter, or use the "Teacher: Add PDF Link" button to contribute!
          </p>
        </div>
      )}

      {/* In-App PDF Viewer Modal */}
      {activePdfBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base truncate max-w-md sm:max-w-xl">
                    {activePdfBook.title}
                  </h3>
                  <span className="text-[11px] text-indigo-300">
                    Class {activePdfBook.grade} · {activePdfBook.subjectName} · {activePdfBook.addedBy}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={activePdfBook.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-white transition"
                  title="Open in new browser tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActivePdfBook(null)}
                  className="p-2 text-slate-400 hover:text-white transition rounded-lg"
                  title="Close Reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF iframe */}
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={activePdfBook.pdfUrl}
                title={activePdfBook.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

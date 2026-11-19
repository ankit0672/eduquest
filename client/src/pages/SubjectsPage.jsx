import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Atom, Calculator, Globe, BookText, BookOpen, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export const SubjectsPage = () => {
  const { selectedGrade, setSelectedGrade } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await api.getSubjects(selectedGrade);
        if (res.success) {
          setSubjects(res.data);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedGrade]);

  const grades = [6, 7, 8, 9, 10];

  const filteredSubjects =
    selectedSubjectFilter === 'all'
      ? subjects
      : subjects.filter((s) => s.subjectId === selectedSubjectFilter);

  const getSubjectIcon = (iconName) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-5 h-5 text-indigo-600" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-indigo-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-indigo-600" />;
      default:
        return <BookText className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CBSE / NCERT Syllabus</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Class {selectedGrade} Curriculum Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select a subject and chapter to read bite-sized revision notes, formula sheets, and take quizzes.
          </p>
        </div>

        {/* Grade switch pills */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl self-start md:self-center">
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedGrade === grade
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Class {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedSubjectFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedSubjectFilter === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Subjects ({subjects.length})
        </button>
        {subjects.map((sub) => (
          <button
            key={sub.subjectId}
            onClick={() => setSelectedSubjectFilter(sub.subjectId)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              selectedSubjectFilter === sub.subjectId
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{sub.name}</span>
          </button>
        ))}
      </div>

      {/* Subjects & Chapters List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="space-y-8">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.subjectId}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Subject Title Bar */}
              <div className="p-6 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    {getSubjectIcon(subject.icon)}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{subject.name}</h2>
                    <p className="text-xs text-slate-500">{subject.description}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1.5 rounded-full self-start sm:self-center">
                  {subject.chapters?.length || 0} NCERT Chapters
                </span>
              </div>

              {/* Chapters Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {subject.chapters?.map((chap, idx) => (
                  <div
                    key={chap.chapterId}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Chapter {idx + 1}
                        </span>
                        {chap.formulas?.length > 0 && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {chap.formulas.length} Formulas
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition">
                        {chap.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {chap.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/subjects/${subject.grade}/${subject.subjectId}/${chap.chapterId}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                      >
                        <span>Read Notes & Flashcards</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {chap.quizId && (
                        <Link
                          to={`/quiz/${chap.quizId}`}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-sm transition"
                        >
                          Take Quiz ⚡
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-slate-500">No subjects found for this selection.</p>
        </div>
      )}
    </div>
  );
};

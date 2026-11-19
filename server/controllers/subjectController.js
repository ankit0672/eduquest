import Subject from '../models/Subject.js';
import { getIsMongoConnected } from '../config/db.js';
import { getStore, saveLocalStore } from '../config/store.js';

// @desc    Get subjects for a specific class/grade
// @route   GET /api/subjects?grade=10
export const getSubjects = async (req, res) => {
  try {
    const grade = req.query.grade ? Number(req.query.grade) : null;
    const filter = grade ? { grade } : {};

    if (getIsMongoConnected()) {
      const subjects = await Subject.find(filter);
      return res.json({ success: true, count: subjects.length, data: subjects });
    } else {
      const store = getStore();
      let subjects = store.subjects;
      if (grade) {
        subjects = subjects.filter((s) => s.grade === grade);
      }
      return res.json({ success: true, count: subjects.length, data: subjects });
    }
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ success: false, message: 'Server error fetching subjects' });
  }
};

// @desc    Get specific chapter detail with notes & flashcards
// @route   GET /api/subjects/:grade/:subjectId/:chapterId
export const getChapterDetail = async (req, res) => {
  try {
    const { grade, subjectId, chapterId } = req.params;

    if (getIsMongoConnected()) {
      const subject = await Subject.findOne({ grade: Number(grade), subjectId });
      if (!subject) {
        return res.status(404).json({ success: false, message: 'Subject not found' });
      }

      const chapter = subject.chapters.find((c) => c.chapterId === chapterId);
      if (!chapter) {
        return res.status(404).json({ success: false, message: 'Chapter not found' });
      }

      return res.json({
        success: true,
        subject: {
          grade: subject.grade,
          subjectId: subject.subjectId,
          name: subject.name,
          color: subject.color,
          icon: subject.icon,
        },
        chapter,
      });
    } else {
      const store = getStore();
      const subject = store.subjects.find(
        (s) => s.grade === Number(grade) && s.subjectId.toLowerCase() === subjectId.toLowerCase()
      );

      if (!subject) {
        return res.status(404).json({ success: false, message: 'Subject not found' });
      }

      const chapter = subject.chapters.find((c) => c.chapterId === chapterId);
      if (!chapter) {
        return res.status(404).json({ success: false, message: 'Chapter not found' });
      }

      return res.json({
        success: true,
        subject: {
          grade: subject.grade,
          subjectId: subject.subjectId,
          name: subject.name,
          color: subject.color,
          icon: subject.icon,
        },
        chapter,
      });
    }
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ success: false, message: 'Server error fetching chapter' });
  }
};

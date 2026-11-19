import Book from '../models/Book.js';
import { getIsMongoConnected } from '../config/db.js';
import { getStore, saveLocalStore } from '../config/store.js';

// @desc    Get all books, filterable by grade, subject, search query
// @route   GET /api/books?grade=10&subjectId=science&q=chemical
export const getBooks = async (req, res) => {
  try {
    const { grade, subjectId, q } = req.query;

    if (getIsMongoConnected()) {
      const filter = {};
      if (grade) filter.grade = Number(grade);
      if (subjectId && subjectId !== 'all') filter.subjectId = subjectId;
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ];
      }

      const books = await Book.find(filter).sort({ grade: 1, chapterNumber: 1, createdAt: -1 });
      return res.json({ success: true, count: books.length, data: books });
    } else {
      const store = getStore();
      let books = [...(store.books || [])];

      if (grade) {
        books = books.filter((b) => b.grade === Number(grade));
      }
      if (subjectId && subjectId !== 'all') {
        books = books.filter((b) => b.subjectId === subjectId);
      }
      if (q) {
        const query = q.toLowerCase();
        books = books.filter(
          (b) =>
            b.title.toLowerCase().includes(query) ||
            (b.description && b.description.toLowerCase().includes(query))
        );
      }

      books.sort((a, b) => (a.chapterNumber || 99) - (b.chapterNumber || 99));

      return res.json({ success: true, count: books.length, data: books });
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Server error fetching books' });
  }
};

// @desc    Teacher adds a new PDF book link
// @route   POST /api/books
export const addBook = async (req, res) => {
  try {
    // Strict Role-Based Access Control: Only Teachers & Admins can add links
    if (!req.user || (req.user.role !== 'teacher' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only verified teachers or administrators can publish PDF links.',
      });
    }

    const { title, grade, subjectId, subjectName, pdfUrl, description, fileSize } = req.body;

    if (!title || !grade || !subjectId || !pdfUrl) {
      return res.status(400).json({ success: false, message: 'Please provide title, class, subject, and PDF link' });
    }

    // Basic URL validation
    if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
      return res.status(400).json({ success: false, message: 'PDF link must begin with http:// or https://' });
    }

    const teacherName = req.user ? req.user.name : 'Teacher Educator';

    const newBookData = {
      title,
      grade: Number(grade),
      subjectId,
      subjectName: subjectName || subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
      pdfUrl,
      description: description || 'Curated study resource added by teacher.',
      isOfficial: false,
      addedBy: teacherName,
      fileSize: fileSize || 'PDF Document',
    };

    if (getIsMongoConnected()) {
      const created = await Book.create(newBookData);
      return res.status(201).json({ success: true, data: created });
    } else {
      const store = getStore();
      if (!store.books) store.books = [];

      const newBook = {
        _id: 'book-' + Date.now(),
        ...newBookData,
        createdAt: new Date().toISOString(),
      };

      store.books.unshift(newBook);
      saveLocalStore();

      return res.status(201).json({ success: true, data: newBook });
    }
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ success: false, message: 'Server error adding book' });
  }
};

// @desc    Delete a book (Teacher / Admin)
// @route   DELETE /api/books/:id
export const deleteBook = async (req, res) => {
  try {
    // Strict Role-Based Access Control: Only Teachers & Admins can delete links
    if (!req.user || (req.user.role !== 'teacher' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only verified teachers or administrators can delete PDF links.',
      });
    }

    const { id } = req.params;

    if (getIsMongoConnected()) {
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }

      await Book.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Book removed successfully' });
    } else {
      const store = getStore();
      if (!store.books) store.books = [];

      const index = store.books.findIndex((b) => b._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }

      store.books.splice(index, 1);
      saveLocalStore();

      return res.json({ success: true, message: 'Book removed successfully' });
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ success: false, message: 'Server error deleting book' });
  }
};

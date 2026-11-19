import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    grade: { type: Number, required: true, min: 6, max: 10 },
    subjectId: { type: String, required: true }, // 'science', 'math', 'social', 'english'
    subjectName: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    description: { type: String, default: '' },
    isOfficial: { type: Boolean, default: false },
    addedBy: { type: String, default: 'NCERT' },
    fileSize: { type: String, default: 'PDF Document' },
    chapterNumber: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Book || mongoose.model('Book', bookSchema);

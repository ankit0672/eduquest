import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
});

const formulaSchema = new mongoose.Schema({
  label: { type: String, required: true },
  formula: { type: String, required: true },
  explanation: { type: String, default: '' },
});

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  keyPoints: [{ type: String }],
  formulas: [formulaSchema],
  flashcards: [flashcardSchema],
  quizId: { type: String, default: '' },
});

const subjectSchema = new mongoose.Schema(
  {
    grade: { type: Number, required: true, min: 6, max: 10 },
    subjectId: { type: String, required: true }, // 'math', 'science', 'social', 'english'
    name: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true },
    chapters: [chapterSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema);

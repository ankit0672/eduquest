import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
  hint: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    quizId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    grade: { type: Number, required: true, min: 6, max: 10 },
    subjectId: { type: String, required: true }, // 'math', 'science', 'social', 'english'
    chapterId: { type: String, required: true },
    chapterTitle: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    durationSeconds: { type: Number, default: 120 },
    xpReward: { type: Number, default: 50 },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

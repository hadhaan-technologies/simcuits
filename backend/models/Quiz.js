import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 4,
        message: 'Each question must have exactly 4 options',
      },
    },
    correctOptionIndex: { type: Number, required: true, min: 0, max: 3 },
    marks: { type: Number, default: 1, min: 0 },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    department: { type: String, required: true, trim: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 20,
        message: 'A quiz must have exactly 20 questions',
      },
    },

    durationMinutes: { type: Number, required: true, min: 1 },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },

    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true },

    // How many violations (tab switch, right-click, copy, fullscreen exit)
    // before we force-submit. Default is a strict 2-strike policy: first
    // violation is a warning, second one ends the test.
    maxViolationsBeforeAutoSubmit: { type: Number, default: 2, min: 1 },

    showResultsImmediately: { type: Boolean, default: true },

    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

quizSchema.index({ department: 1, status: 1, startsAt: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;

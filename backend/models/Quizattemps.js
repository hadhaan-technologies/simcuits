import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    // Index into the ORIGINAL options array (we translate shuffled-UI index
    // back to this before saving, so grading logic never has to think about
    // shuffling).
    selectedOptionIndex: { type: Number, default: null },
  },
  { _id: false }
);

const violationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'tab_hidden', // visibilitychange -> hidden (includes minimizing)
        'window_blur', // window lost focus
        'fullscreen_exit', // student exited fullscreen
        'copy_attempt', // copy/cut attempted
        'right_click', // right-click / context menu attempted
        'devtools_shortcut', // F12 / Ctrl+Shift+I etc. pressed
      ],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Per-attempt randomization, fixed at start so reloads stay consistent
    // and grading can map back to the original question/options.
    questionOrder: [{ type: mongoose.Schema.Types.ObjectId }],
    optionOrderByQuestion: {
      type: Map,
      of: [Number], // e.g. questionId -> [2,0,3,1] (shuffled -> original index)
    },

    answers: [answerSchema],

    startedAt: { type: Date, required: true },
    submittedAt: { type: Date },
    autoSubmitted: { type: Boolean, default: false },
    lateSubmission: { type: Boolean, default: false },

    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },

    violations: [violationSchema],
    flaggedForReview: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ['in_progress', 'submitted'],
      default: 'in_progress',
    },
  },
  { timestamps: true }
);

attemptSchema.index({ quiz: 1, student: 1 }, { unique: true });

const QuizAttempt = mongoose.model('QuizAttempt', attemptSchema);
export default QuizAttempt;

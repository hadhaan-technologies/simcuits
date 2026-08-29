import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true, // markdown, rendered problem statement
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    xpReward: {
      type: Number,
      default: function () {
        // sensible default tied to difficulty; can still be overridden manually
        return { easy: 10, medium: 25, hard: 50 }[this.difficulty] || 10;
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    isPremium: {
      type: Boolean,
      default: true, // problems are paywalled per your PRD
    },
    starterCode: {
      type: String, // Verilog boilerplate shown in the editor
      default: '',
    },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        isHidden: { type: Boolean, default: false }, // hidden cases used for judging, not shown to user
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    solvedCount: {
      type: Number,
      default: 0,
    },
    submissionCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

problemSchema.index({ status: 1, difficulty: 1 });
problemSchema.index({ tags: 1 });

// keep acceptance rate easy to read without storing it separately (always in sync)
problemSchema.virtual('acceptanceRate').get(function () {
  if (!this.submissionCount) return 0;
  return Math.round((this.solvedCount / this.submissionCount) * 100);
});
problemSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Problem || mongoose.model('Problem', problemSchema);

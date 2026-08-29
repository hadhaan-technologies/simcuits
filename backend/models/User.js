import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'author', 'user'],
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },

    location: {
      type: String,
      default: '',
      trim: true,
    },

    // github: {
    //   type: String,
    //   default: "",
    //   trim: true,
    // },

    website: {
      type: String,
      default: '',
      trim: true,
    },

    // --- author stats ---
    articlesPublished: {
      type: Number,
      default: 0,
    },
    totalArticleViews: {
      type: Number,
      default: 0,
    },

    // --- learner/solver stats ---

    problemsSolved: {
      type: Number,
      default: 0,
    },
    problemsAttempted: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastSolvedAt: {
      type: Date,
    },
    activity: [
      {
        date: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: 250,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    coverImage: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
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
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    readTimeMinutes: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// speeds up the articles listing page: filter by status, sort by newest
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ tags: 1 });

articleSchema.pre('save', function () {
  if (this.isModified('content')) {
    const content = this.content || '';

    const words = content.trim() ? content.trim().split(/\s+/).length : 0;

    this.readTimeMinutes = Math.max(1, Math.ceil(words / 200));
  }
});

export default mongoose.models.Article || mongoose.model('Article', articleSchema);

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  author: { type: String, default: 'NutriBite Team' },
  category: {
    type: String,
    enum: ['protein', 'nutrition', 'weight-loss', 'gym', 'healthy-snacks', 'recipes', 'fitness', 'lifestyle'],
    default: 'nutrition',
  },
  tags: [{ type: String }],
  coverImage: { type: String, default: '' },
  readTime: { type: Number, default: 5 }, // minutes
  views: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
}, { timestamps: true });

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);

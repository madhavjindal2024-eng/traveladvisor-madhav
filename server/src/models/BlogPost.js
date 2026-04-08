import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    category: { type: String, default: 'Guide' },
    destinationTag: { type: String, default: '' },
    authorName: { type: String, default: 'Travel Advisor Editorial' },
    readMinutes: { type: Number, default: 5 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);

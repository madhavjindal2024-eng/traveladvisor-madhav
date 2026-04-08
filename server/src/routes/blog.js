import { Router } from 'express';
import { BlogPost } from '../models/BlogPost.js';

const router = Router();

/**
 * GET / — list blog posts with optional search.
 */
router.get('/', async (req, res) => {
  try {
    const { q, category, destination } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { title: new RegExp(String(q), 'i') },
        { excerpt: new RegExp(String(q), 'i') },
      ];
    }
    if (category) filter.category = String(category);
    if (destination) filter.destinationTag = new RegExp(String(destination), 'i');
    const items = await BlogPost.find(filter).sort({ publishedAt: -1 }).lean();
    return res.json({ items });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list posts' });
  }
});

/**
 * GET /:slug — single post.
 */
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug }).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load post' });
  }
});

export default router;

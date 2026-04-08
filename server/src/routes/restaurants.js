import { Router } from 'express';
import mongoose from 'mongoose';
import { Restaurant } from '../models/Restaurant.js';

const router = Router();

/**
 * GET /foodie-trail — ordered one-day eating tour for a destination.
 */
router.get('/foodie-trail', async (req, res) => {
  try {
    const { dest } = req.query;
    if (!dest || !mongoose.isValidObjectId(String(dest))) {
      return res.status(400).json({ error: 'dest (destination ObjectId) required' });
    }
    const items = await Restaurant.find({ destinationId: dest }).sort({ rating: -1 }).limit(4).lean();
    return res.json({
      title: 'Foodie trail',
      stops: items.map((r, i) => ({ order: i + 1, ...r })),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Foodie trail failed' });
  }
});

/**
 * GET /search — restaurants for destination, optional category.
 */
router.get('/search', async (req, res) => {
  try {
    const { dest, category } = req.query;
    if (!dest || !mongoose.isValidObjectId(String(dest))) {
      return res.status(400).json({ error: 'dest (destination ObjectId) required' });
    }
    const filter = { destinationId: dest };
    if (category) filter.category = new RegExp(String(category), 'i');
    const items = await Restaurant.find(filter).sort({ rating: -1 }).lean();
    return res.json({ items });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Restaurant search failed' });
  }
});

/**
 * GET /:id — restaurant detail.
 */
router.get('/:id', async (req, res) => {
  try {
    const r = await Restaurant.findById(req.params.id).lean();
    if (!r) return res.status(404).json({ error: 'Not found' });
    return res.json(r);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load restaurant' });
  }
});

export default router;

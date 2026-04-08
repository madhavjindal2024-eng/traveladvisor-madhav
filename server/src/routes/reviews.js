import { Router } from 'express';
import { Review } from '../models/Review.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /user/me — all reviews by current user (before /:id routes).
 */
router.get('/user/me', requireAuth, async (req, res) => {
  try {
    const items = await Review.find({ userId: req.user._id })
      .populate('destinationId', 'name country heroImage')
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ items });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed' });
  }
});

/**
 * GET / — reviews for destination with sort.
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { destinationId, sort = 'recent' } = req.query;
    if (!destinationId) {
      return res.status(400).json({ error: 'destinationId required' });
    }
    let q = Review.find({ destinationId }).populate('userId', 'name avatarUrl');
    if (sort === 'helpful') q = q.sort({ helpfulCount: -1, createdAt: -1 });
    else q = q.sort({ createdAt: -1 });
    const items = await q.lean();
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    items.forEach((r) => {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
      sum += r.rating;
    });
    const avg = items.length ? sum / items.length : 0;
    return res.json({ items, aggregate: { average: avg, count: items.length, breakdown } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load reviews' });
  }
});

/**
 * POST / — submit review (auth).
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { destinationId, rating, title, body, photoUrl, travelDate } = req.body || {};
    if (!destinationId || !rating) {
      return res.status(400).json({ error: 'destinationId and rating required' });
    }
    const rev = await Review.create({
      userId: req.user._id,
      destinationId,
      rating: Number(rating),
      title: title || '',
      body: body || '',
      photoUrl: photoUrl || '',
      travelDate: travelDate ? new Date(travelDate) : undefined,
    });
    const populated = await rev.populate('userId', 'name avatarUrl');
    return res.status(201).json(populated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create review' });
  }
});

/**
 * POST /:id/helpful — increment helpful (simple).
 */
router.post('/:id/helpful', async (req, res) => {
  try {
    const r = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    if (!r) return res.status(404).json({ error: 'Not found' });
    return res.json({ helpfulCount: r.helpfulCount });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed' });
  }
});

/**
 * DELETE /:id — delete own review.
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const r = await Review.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (!r.deletedCount) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to delete' });
  }
});

export default router;

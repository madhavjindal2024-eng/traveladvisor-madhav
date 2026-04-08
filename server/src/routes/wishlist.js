import { Router } from 'express';
import { WishlistItem } from '../models/WishlistItem.js';
import { Destination } from '../models/Destination.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /user/:userId — wishlist for user (owner only).
 */
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const items = await WishlistItem.find({ userId: req.user._id })
      .populate('destinationId')
      .sort({ updatedAt: -1 })
      .lean();
    return res.json({ items });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load wishlist' });
  }
});

/**
 * POST / — add to wishlist.
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { destinationId, notes } = req.body || {};
    if (!destinationId) return res.status(400).json({ error: 'destinationId required' });
    const item = await WishlistItem.findOneAndUpdate(
      { userId: req.user._id, destinationId },
      { notes: notes || '' },
      { upsert: true, new: true }
    ).populate('destinationId');
    return res.status(201).json(item);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to add' });
  }
});

/**
 * DELETE /:id — remove wishlist row by id.
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const r = await WishlistItem.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (!r.deletedCount) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to delete' });
  }
});

export default router;

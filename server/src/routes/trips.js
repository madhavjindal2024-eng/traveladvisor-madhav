import { Router } from 'express';
import { SavedTrip } from '../models/SavedTrip.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET / — saved trips for current user.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const items = await SavedTrip.find({ userId: req.user._id })
      .populate('destinationId')
      .sort({ startDate: -1 })
      .lean();
    return res.json({ items });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed' });
  }
});

/**
 * POST / — create saved trip.
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const trip = await SavedTrip.create({ ...req.body, userId: req.user._id });
    return res.status(201).json(trip);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed' });
  }
});

export default router;

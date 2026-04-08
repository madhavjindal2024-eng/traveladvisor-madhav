import { Router } from 'express';
import mongoose from 'mongoose';
import { Hotel } from '../models/Hotel.js';

const router = Router();

/**
 * GET /search — hotels for destination with optional dates.
 */
router.get('/search', async (req, res) => {
  try {
    const { dest, checkin, checkout } = req.query;
    if (!dest || !mongoose.isValidObjectId(String(dest))) {
      return res.status(400).json({ error: 'dest (destination ObjectId) required' });
    }
    const hotels = await Hotel.find({ destinationId: dest }).sort({ pricePerNight: 1 }).lean();
    return res.json({ items: hotels, checkin, checkout });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Hotel search failed' });
  }
});

/**
 * GET /:id — hotel detail.
 */
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).lean();
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    return res.json(hotel);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load hotel' });
  }
});

export default router;

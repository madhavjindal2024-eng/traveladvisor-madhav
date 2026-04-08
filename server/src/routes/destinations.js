import { Router } from 'express';
import mongoose from 'mongoose';
import { Destination } from '../models/Destination.js';

const router = Router();

/**
 * GET / — list destinations with filters, search, pagination.
 */
router.get('/', async (req, res) => {
  try {
    const {
      q,
      type,
      minRating,
      maxCost,
      tag,
      page = '1',
      limit = '12',
      sort = 'popularity',
    } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: new RegExp(String(q), 'i') },
        { country: new RegExp(String(q), 'i') },
      ];
    }
    if (type) filter.type = String(type);
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (maxCost) filter.avgCostPerDay = { ...(filter.avgCostPerDay || {}), $lte: Number(maxCost) };
    if (tag) filter.tags = String(tag);

    const skip = (Number(page) - 1) * Number(limit);
    let sortSpec = { rating: -1 };
    if (sort === 'price') sortSpec = { avgCostPerDay: 1 };
    if (sort === 'rating') sortSpec = { rating: -1 };
    if (sort === 'name') sortSpec = { name: 1 };

    const [items, total] = await Promise.all([
      Destination.find(filter).sort(sortSpec).skip(skip).limit(Number(limit)).lean(),
      Destination.countDocuments(filter),
    ]);

    return res.json({
      items,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      total,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list destinations' });
  }
});

/**
 * GET /:id — single destination detail.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      const bySlug = await Destination.findOne({ slug: id }).lean();
      if (!bySlug) return res.status(404).json({ error: 'Not found' });
      return res.json(bySlug);
    }
    const doc = await Destination.findById(id).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load destination' });
  }
});

export default router;

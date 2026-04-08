import { Router } from 'express';
import OpenAI from 'openai';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth.js';
import { Itinerary } from '../models/Itinerary.js';

const router = Router();

function buildMockItinerary(body) {
  const destination = body.destination || 'Sample City';
  const days = Math.min(Math.max(Number(body.days) || 3, 1), 14);
  const daysArr = [];
  for (let d = 1; d <= days; d += 1) {
    daysArr.push({
      dayNumber: d,
      slots: [
        {
          period: 'morning',
          activity: `Explore ${destination} — neighborhood walk`,
          location: 'Historic district',
          estimatedCost: 25,
          durationMinutes: 120,
          description: 'Orientation and photo stops along main sights.',
        },
        {
          period: 'afternoon',
          activity: 'Museum or gallery visit',
          location: 'City center',
          estimatedCost: 35,
          durationMinutes: 180,
          description: 'Curated exhibit; book tickets online when available.',
        },
        {
          period: 'evening',
          activity: 'Dinner and waterfront stroll',
          location: 'Waterfront quarter',
          estimatedCost: 55,
          durationMinutes: 150,
          description: 'Local cuisine tasting menu or casual bistro.',
        },
      ],
    });
  }
  return {
    title: `${destination} — ${days}-day plan`,
    destinationName: destination,
    days: daysArr,
    packingList: ['Comfortable shoes', 'Light rain jacket', 'Portable charger', 'Reusable water bottle'],
  };
}

/**
 * POST /generate — GPT-4o itinerary or mock if no API key.
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budgetMin,
      budgetMax,
      travelers,
      styles,
      interests,
      days: daysOverride,
    } = req.body || {};

    if (!destination) {
      return res.status(400).json({ error: 'destination is required' });
    }

    let dayCount = daysOverride;
    if (!dayCount && startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      dayCount = Math.max(1, Math.ceil((e - s) / 86400000) + 1);
    }
    dayCount = Math.min(Math.max(Number(dayCount) || 3, 1), 14);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const mock = buildMockItinerary({ destination, days: dayCount });
      return res.json({ ...mock, mock: true });
    }

    const client = new OpenAI({ apiKey });
    const prompt = `You are a travel planner. Return ONLY valid JSON with this shape:
{
  "title": string,
  "destinationName": string,
  "days": Array<{
    "dayNumber": number,
    "slots": Array<{
      "period": "morning"|"afternoon"|"evening",
      "activity": string,
      "location": string,
      "estimatedCost": number,
      "durationMinutes": number,
      "description": string
    }>
  }>,
  "packingList": string[]
}
Plan ${dayCount} days for ${destination}. Budget per person roughly ${budgetMin || 50}-${budgetMax || 200} USD/day. Travelers: ${travelers || 2}. Styles: ${(styles || []).join(', ')}. Interests: ${(interests || []).join(', ')}. Dates: ${startDate || 'n/a'} to ${endDate || 'n/a'}.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return res.json({ ...parsed, mock: false });
  } catch (e) {
    console.error(e);
    const fallback = buildMockItinerary({ destination: req.body?.destination, days: req.body?.days });
    return res.json({ ...fallback, mock: true, fallback: true });
  }
});

/**
 * POST /packing — AI packing list (optional extra).
 */
router.post('/packing', async (req, res) => {
  try {
    const { destination, durationDays, season } = req.body || {};
    if (!destination) return res.status(400).json({ error: 'destination required' });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.json({
        items: [
          'Travel adapter',
          'Copies of documents',
          'Layered clothing',
          'Sun protection',
          'First-aid kit',
        ],
        mock: true,
      });
    }
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `List 12 packing items as JSON array of strings only, no prose, for ${destination}, ${durationDays || 5} days, season ${season || 'mild'}.`,
        },
      ],
      temperature: 0.5,
    });
    const text = completion.choices[0]?.message?.content || '[]';
    const arrMatch = text.match(/\[[\s\S]*\]/);
    const items = JSON.parse(arrMatch ? arrMatch[0] : '[]');
    return res.json({ items, mock: false });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Packing list failed' });
  }
});

/**
 * POST /save — save itinerary to user profile.
 */
router.post('/save', requireAuth, async (req, res) => {
  try {
    const { title, destinationName, startDate, endDate, days, packingList } = req.body || {};
    if (!title || !days?.length) {
      return res.status(400).json({ error: 'title and days required' });
    }
    const shareToken = crypto.randomBytes(12).toString('hex');
    const doc = await Itinerary.create({
      userId: req.user._id,
      title,
      destinationName: destinationName || '',
      startDate,
      endDate,
      days,
      packingList: packingList || [],
      shareToken,
    });
    return res.status(201).json({ itinerary: doc, shareUrl: `/share/trip/${shareToken}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Save failed' });
  }
});

/**
 * GET /user/:userId — list itineraries for user (owner or admin; simplified: owner only).
 */
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const list = await Itinerary.find({ userId: req.user._id }).sort({ updatedAt: -1 }).lean();
    return res.json({ items: list });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list itineraries' });
  }
});

/**
 * DELETE /itinerary/:id — delete saved itinerary.
 */
router.delete('/itinerary/:id', requireAuth, async (req, res) => {
  try {
    const r = await Itinerary.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (!r.deletedCount) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Delete failed' });
  }
});

/**
 * GET /share/:token — public share view.
 */
router.get('/share/:token', async (req, res) => {
  try {
    const it = await Itinerary.findOne({ shareToken: req.params.token }).lean();
    if (!it) return res.status(404).json({ error: 'Not found' });
    return res.json(it);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to load' });
  }
});

export default router;

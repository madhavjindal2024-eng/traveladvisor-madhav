import { Router } from 'express';

const router = Router();

/**
 * GET / — proxy OpenWeatherMap current + forecast.
 */
router.get('/', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) {
      return res.json({
        mock: true,
        current: { temp: 18, description: 'Partly cloudy', humidity: 62 },
        daily: Array.from({ length: 7 }).map((_, i) => ({
          date: new Date(Date.now() + i * 86400000).toISOString(),
          high: 20 + (i % 3),
          low: 12 + (i % 2),
          icon: '02d',
        })),
      });
    }
    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
    } else {
      return res.status(400).json({ error: 'city or lat+lon required' });
    }
    const r = await fetch(url);
    const data = await r.json();
    if (!r.ok) {
      return res.status(502).json({ error: data.message || 'Weather API error' });
    }
    return res.json({ mock: false, raw: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Weather proxy failed' });
  }
});

export default router;

import { Router } from 'express';

const router = Router();

/**
 * GET / — convert currency via ExchangeRate-API compatible endpoint.
 */
router.get('/', async (req, res) => {
  try {
    const { from = 'USD', to = 'EUR', amount = '1' } = req.query;
    const key = process.env.EXCHANGERATE_API_KEY;
    const amt = Number(amount);
    let rate;
    if (key) {
      const url = `https://v6.exchangerate-api.com/v6/${key}/pair/${from}/${to}/${amt}`;
      const r = await fetch(url);
      const data = await r.json();
      if (data.result === 'success') {
        return res.json({
          from,
          to,
          amount: amt,
          converted: data.conversion_result,
          rate: data.conversion_result / amt,
        });
      }
    }
    const fallback = `https://api.exchangerate-api.com/v4/latest/${from}`;
    const r2 = await fetch(fallback);
    const data2 = await r2.json();
    rate = data2.rates?.[to];
    if (!rate) return res.status(400).json({ error: 'Unsupported pair' });
    return res.json({
      from,
      to,
      amount: amt,
      converted: amt * rate,
      rate,
      mock: !key,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Currency conversion failed' });
  }
});

export default router;

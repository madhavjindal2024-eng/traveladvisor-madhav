import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/db.js';
import authRoutes from './routes/auth.js';
import destinationsRoutes from './routes/destinations.js';
import hotelsRoutes from './routes/hotels.js';
import restaurantsRoutes from './routes/restaurants.js';
import plannerRoutes from './routes/planner.js';
import reviewsRoutes from './routes/reviews.js';
import wishlistRoutes from './routes/wishlist.js';
import weatherRoutes from './routes/weather.js';
import currencyRoutes from './routes/currency.js';
import blogRoutes from './routes/blog.js';
import tripsRoutes from './routes/trips.js';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ ok: true }));

const v1 = '/api/v1';
app.use(`${v1}/auth`, authRoutes);
app.use(`${v1}/destinations`, destinationsRoutes);
app.use(`${v1}/hotels`, hotelsRoutes);
app.use(`${v1}/restaurants`, restaurantsRoutes);
app.use(`${v1}/planner`, plannerRoutes);
app.use(`${v1}/reviews`, reviewsRoutes);
app.use(`${v1}/wishlist`, wishlistRoutes);
app.use(`${v1}/weather`, weatherRoutes);
app.use(`${v1}/currency`, currencyRoutes);
app.use(`${v1}/blog`, blogRoutes);
app.use(`${v1}/trips`, tripsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

async function start() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Travel Advisor API listening on ${PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});

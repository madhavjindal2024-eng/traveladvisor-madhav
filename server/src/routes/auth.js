import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

/**
 * POST /register — create account, set JWT cookie.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await User.hashPassword(String(password));
    const user = await User.create({
      email: String(email).toLowerCase(),
      passwordHash,
      name: name || '',
    });
    const token = signToken(user._id.toString());
    res.cookie('token', token, cookieOptions());
    return res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /login — authenticate, set JWT cookie.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !(await user.comparePassword(String(password)))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user._id.toString());
    res.cookie('token', token, cookieOptions());
    return res.json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /logout — clear cookie.
 */
router.post('/logout', (_req, res) => {
  res.clearCookie('token', { path: '/' });
  return res.json({ ok: true });
});

/**
 * GET /me — current user profile.
 */
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatarUrl: req.user.avatarUrl,
      homeCountry: req.user.homeCountry,
      travelPreferences: req.user.travelPreferences,
      countriesVisited: req.user.countriesVisited,
      tripsCompleted: req.user.tripsCompleted,
      totalDaysTraveled: req.user.totalDaysTraveled,
    },
  });
});

/**
 * PATCH /me — update profile (authenticated).
 */
router.patch('/me', requireAuth, async (req, res) => {
  try {
    const { name, avatarUrl, homeCountry, travelPreferences } = req.body || {};
    if (name !== undefined) req.user.name = name;
    if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;
    if (homeCountry !== undefined) req.user.homeCountry = homeCountry;
    if (Array.isArray(travelPreferences)) req.user.travelPreferences = travelPreferences;
    await req.user.save();
    return res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        avatarUrl: req.user.avatarUrl,
        homeCountry: req.user.homeCountry,
        travelPreferences: req.user.travelPreferences,
        countriesVisited: req.user.countriesVisited,
        tripsCompleted: req.user.tripsCompleted,
        totalDaysTraveled: req.user.totalDaysTraveled,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Update failed' });
  }
});

export default router;

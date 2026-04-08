import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Express middleware: verifies JWT from httpOnly cookie and attaches req.user.
 */
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

/**
 * Optional auth: attaches user when cookie present.
 */
export async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (user) req.user = user;
  } catch {
    // ignore
  }
  next();
}

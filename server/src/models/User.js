import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    homeCountry: { type: String, default: '' },
    travelPreferences: [{ type: String }],
    countriesVisited: { type: Number, default: 0 },
    tripsCompleted: { type: Number, default: 0 },
    totalDaysTraveled: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
};

export const User = mongoose.model('User', userSchema);

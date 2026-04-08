import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

wishlistSchema.index({ userId: 1, destinationId: 1 }, { unique: true });

export const WishlistItem = mongoose.model('WishlistItem', wishlistSchema);

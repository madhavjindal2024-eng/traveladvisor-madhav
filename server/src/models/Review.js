import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    travelDate: { type: Date },
    helpfulCount: { type: Number, default: 0 },
    verifiedTraveler: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ destinationId: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);

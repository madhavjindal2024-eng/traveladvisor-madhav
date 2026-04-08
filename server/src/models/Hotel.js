import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    starRating: { type: Number, default: 4 },
    pricePerNight: { type: Number, default: 120 },
    amenities: [{ type: String }],
    distanceFromCenterKm: { type: Number, default: 1 },
    lat: Number,
    lng: Number,
    reviewsSnippet: [{ author: String, rating: Number, text: String }],
  },
  { timestamps: true }
);

hotelSchema.index({ destinationId: 1, slug: 1 }, { unique: true });

export const Hotel = mongoose.model('Hotel', hotelSchema);

import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    cuisine: { type: String, default: '' },
    category: { type: String, default: 'Local Cuisine' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    priceRange: { type: String, default: '$$' },
    address: { type: String, default: '' },
    lat: Number,
    lng: Number,
  },
  { timestamps: true }
);

restaurantSchema.index({ destinationId: 1, slug: 1 }, { unique: true });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);

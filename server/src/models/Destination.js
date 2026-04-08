import mongoose from 'mongoose';

const poiSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['attraction', 'hotel', 'restaurant', 'hidden'] },
  lat: Number,
  lng: Number,
  note: String,
});

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    gallery: [{ type: String }],
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    tags: [{ type: String }],
    type: { type: String, default: 'city' },
    rating: { type: Number, default: 4.5 },
    avgCostPerDay: { type: Number, default: 100 },
    bestTimeToVisit: { type: String, default: '' },
    climateMonthly: [
      {
        month: String,
        avgHighC: Number,
        avgLowC: Number,
        rainfallMm: Number,
      },
    ],
    localTips: [{ type: String }],
    costBreakdown: {
      accommodation: Number,
      food: Number,
      transport: Number,
      activities: Number,
      misc: Number,
    },
    safetyAlerts: [{ type: String }],
    phrasebook: [{ phrase: String, translation: String }],
    pointsOfInterest: [poiSchema],
  },
  { timestamps: true }
);

export const Destination = mongoose.model('Destination', destinationSchema);

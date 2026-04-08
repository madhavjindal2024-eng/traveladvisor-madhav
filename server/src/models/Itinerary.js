import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  period: { type: String, enum: ['morning', 'afternoon', 'evening'] },
  activity: String,
  location: String,
  estimatedCost: Number,
  durationMinutes: Number,
  description: String,
});

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  slots: [slotSchema],
});

const itinerarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    destinationName: { type: String, default: '' },
    startDate: Date,
    endDate: Date,
    days: [daySchema],
    shareToken: { type: String, unique: true, sparse: true },
    packingList: [{ type: String }],
  },
  { timestamps: true }
);

export const Itinerary = mongoose.model('Itinerary', itinerarySchema);

import mongoose from 'mongoose';

const savedTripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    title: { type: String, required: true },
    image: { type: String, default: '' },
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['Planned', 'Upcoming', 'Completed'], default: 'Planned' },
  },
  { timestamps: true }
);

export const SavedTrip = mongoose.model('SavedTrip', savedTripSchema);

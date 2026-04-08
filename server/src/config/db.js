import mongoose from 'mongoose';

/**
 * Connects to MongoDB using MONGO_URI from environment.
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose;
}

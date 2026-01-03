import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || '';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Please add it to your .env');
}

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose;

  try {
    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser and useUnifiedTopology are defaults in mongoose >=6
    });
    console.log('✅ Connected to MongoDB');
    return mongoose;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    throw err;
  }
}

export default mongoose;

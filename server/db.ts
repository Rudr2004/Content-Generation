import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectMongo } from './mongo';

dotenv.config();

// MongoDB connection is handled by mongo.ts
// This file is kept for backward compatibility but now uses MongoDB
// All database operations should use Mongoose models directly

// Ensure MongoDB connection is established
let dbConnection: typeof mongoose | null = null;

export async function getDb() {
  if (!dbConnection) {
    dbConnection = await connectMongo();
  }
  return dbConnection;
}

// For backward compatibility - export a db object that throws if used
// This helps identify any remaining Drizzle usage
export const db = new Proxy({} as any, {
  get() {
    throw new Error('Drizzle ORM is no longer supported. Please use Mongoose models directly from server/models/');
  }
});

// Export mongoose for direct use if needed
export { mongoose };

import mongoose from 'mongoose';
import { initLocalStore } from './store.js';

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  // If no Atlas URI is set, fall back to local store immediately
  if (!mongoURI || mongoURI.includes('127.0.0.1') || mongoURI.includes('localhost')) {
    console.log('⚠️  No MONGODB_URI set. Activating embedded storage engine.');
    initLocalStore();
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,  // 10 seconds – enough for Atlas cold start
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully!');
  } catch (err) {
    isMongoConnected = false;
    console.error('❌ MongoDB Atlas connection failed:', err.message);
    console.log('ℹ️  Falling back to embedded storage engine.');
    initLocalStore();
  }
};

export const getIsMongoConnected = () => isMongoConnected;

import mongoose from 'mongoose';
import { initLocalStore } from './store.js';

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduquest';
  
  try {
    console.log('🔄 Checking MongoDB connection...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 800,
    });
    isMongoConnected = true;
    console.log('🚀 Connected to MongoDB successfully!');
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️  MongoDB not reachable locally. Activating embedded high-speed storage engine.');
    initLocalStore();
  }
};

export const getIsMongoConnected = () => isMongoConnected;

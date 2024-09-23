// src/infrastructure/database/mongoose.ts
import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timerdb');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectMongoDB;

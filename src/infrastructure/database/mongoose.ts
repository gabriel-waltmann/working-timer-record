import mongoose from 'mongoose';

const connectMongoDB = async () => {
  const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/timerdb';

  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectMongoDB;

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://kavinamarasingha400:kavin123@cluster0.vfaprz4.mongodb.net/mental_health?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
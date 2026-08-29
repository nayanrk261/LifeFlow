import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lifeflow');
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB connection notice: ${error.message}`);
    console.warn(`Backend Express server will continue running. Ensure MongoDB service is started or set MONGO_URI in backend/.env for database persistence.`);
    return false;
  }
};

export default connectDB;

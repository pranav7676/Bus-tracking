import mongoose from 'mongoose';

export async function connectDB() {
  const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartbus';
  try {
    console.log(`📡 Attempting to connect to MongoDB: ${MONGODB_URI}`);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    } else {
      console.error('❌ Unknown error connecting to MongoDB');
    }
    process.exit(1);
  }
}

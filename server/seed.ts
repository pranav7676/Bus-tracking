import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Profile from './models/Profile.js';
import Bus from './models/Bus.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const students = [
  { fullName: 'Pranav', registerNumber: 'RA2311003020288' },
  { fullName: 'Charu', registerNumber: 'RA2311003020324' },
  { fullName: 'Kaaviya', registerNumber: 'RA2311003020321' },
  { fullName: 'Vatsa', registerNumber: 'RA2311003020326' },
  { fullName: 'Adhithya Harish', registerNumber: 'RA2311003020327' },
  { fullName: 'Yuvan', registerNumber: 'RA2311003020295' }
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbus';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Create a bus
    const bus = await Bus.findOneAndUpdate(
      { busNumber: 'BUS-001' },
      {
        busNumber: 'BUS-001',
        routeName: 'Chennai Central To SRM',
        startLocation: 'Chennai Central',
        endLocation: 'SRM University',
        capacity: 40,
        driverName: 'Ramesh',
        status: 'Active',
      },
      { upsert: true, new: true }
    );
    console.log('🚌 Seeded bus:', bus.busNumber);

    for (const s of students) {
      // Create user login
      const email = `${s.fullName.toLowerCase().replace(' ', '.')}@example.com`;
      const password = 'password123';
      
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          username: s.registerNumber.toLowerCase(),
          email,
          password,
          role: 'STUDENT'
        });
      }

      // Create profile
      await Profile.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          fullName: s.fullName,
          registerNumber: s.registerNumber,
          department: 'CSE',
          year: 2,
          phone: '+919999999999',
          gender: 'Male', // Just default for demo
        },
        { upsert: true }
      );
      console.log('👤 Seeded student:', s.fullName);
    }

    console.log('🌱 Seeding completed successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed', error);
    process.exit(1);
  }
};

seedData();

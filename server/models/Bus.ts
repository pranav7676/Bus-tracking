import mongoose from 'mongoose';

const LOCATION_SCHEMA = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true }, // e.g., BUS-001
  routeName: { type: String },
  startLocation: { type: String },
  endLocation: { type: String },
  stops: { type: [String] },
  currentLocation: { type: LOCATION_SCHEMA },
  status: { type: String, enum: ['Active', 'Maintenance', 'Off Duty'], default: 'Active' },
  driverName: { type: String },
  capacity: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Bus', busSchema);

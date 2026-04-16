import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String },
  registerNumber: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  year: { type: Number, min: 1, max: 4 },
  gender: { type: String },
  address: { type: String },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Profile', profileSchema);

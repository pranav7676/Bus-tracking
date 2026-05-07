import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  price: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'upi', 'bank'], default: 'card' },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  qrCode: { type: String, default: '' },
  invoiceNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);

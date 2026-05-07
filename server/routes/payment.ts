import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import QRCode from 'qrcode';

const router = Router();
let localOrders: any[] = [];
let useLocal = false;

export function setPaymentLocalStorage(val: boolean) { useLocal = val; }

// POST /api/payment/cart - Create order
router.post('/cart', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { plan, price, paymentMethod } = req.body;
    if (!plan || price === undefined) {
      return res.status(400).json({ message: 'Plan and price are required' });
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    if (useLocal) {
      const order = {
        _id: Date.now().toString(),
        userId: req.userId,
        plan, price, paymentMethod, status: 'pending',
        qrCode: '', invoiceNumber,
        createdAt: new Date(),
      };
      localOrders.push(order);
      return res.status(201).json(order);
    }

    const order = await Order.create({
      userId: req.userId, plan, price, paymentMethod,
      invoiceNumber, status: 'pending',
    });
    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/payment/checkout/:orderId - Complete checkout & generate QR
router.post('/checkout/:orderId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod, lastFour } = req.body;

    // Generate QR code
    const qrData = JSON.stringify({
      userId: req.userId,
      orderId,
      timestamp: new Date().toISOString(),
      type: 'smartbus_subscription',
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: { dark: '#f97316', light: '#1a1a2e' },
    });

    if (useLocal) {
      const idx = localOrders.findIndex(o => o._id === orderId);
      if (idx === -1) return res.status(404).json({ message: 'Order not found' });
      
      const order = localOrders[idx];
      order.status = 'completed';
      order.qrCode = qrCodeDataUrl;
      
      // Update user subscription (local)
      const isFreeTrial = order.plan === 'basic' && order.price === 0;
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
      
      return res.json(order);
    }

    const order = await Order.findByIdAndUpdate(orderId, {
      status: 'completed',
      qrCode: qrCodeDataUrl,
    }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update user subscription
    const isFreeTrial = order.plan === 'basic' && order.price === 0;
    const subscriptionEnd = new Date();
    
    if (isFreeTrial) {
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 14); // 14-day trial
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); // 1-month subscription
    }

    await User.findByIdAndUpdate(req.userId, {
      plan: order.plan,
      subscriptionStart: new Date(),
      subscriptionEnd,
      trialUsed: isFreeTrial ? true : false,
      $push: {
        paymentMethods: {
          id: `${paymentMethod}-${Date.now()}`,
          type: paymentMethod,
          last4: lastFour || '',
          brand: paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Bank',
          isDefault: true,
          createdAt: new Date(),
        }
      }
    });

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/payment/generate-qr - Generate standalone QR code
router.post('/generate-qr', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data } = req.body;
    const qrData = JSON.stringify({
      userId: req.userId,
      data: data || {},
      timestamp: new Date().toISOString(),
      type: 'smartbus_pass',
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: { dark: '#f97316', light: '#1a1a2e' },
    });

    res.json({ qrCode: qrCodeDataUrl });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/payment/orders - Get user orders
router.get('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (useLocal) {
      const orders = localOrders.filter(o => o.userId === req.userId);
      return res.json(orders);
    }
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/reviews - Get all reviews (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string;
    const query = role ? { role } : {};
    
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/user - Get user's reviews (authenticated)
router.get('/user/my-reviews', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const reviews = await Review.find({ userId }).sort({ createdAt: -1 }).exec();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Failed to fetch user reviews' });
  }
});

// POST /api/reviews - Create a new review (authenticated)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, title, comment, role } = req.body;
    const userId = req.userId;

    if (!rating || !title || !comment || !role) {
      return res.status(400).json({ message: 'Rating, title, comment, and role are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!['STUDENT', 'DRIVER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const review = new Review({
      userId,
      userName: user.username || user.email || 'Anonymous',
      userEmail: user.email,
      rating,
      title,
      comment,
      role,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

// PUT /api/reviews/:id - Update a review (authenticated, owner only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.userId;

    const review = await Review.findById(id).exec();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    review.updatedAt = new Date();

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

// DELETE /api/reviews/:id - Delete a review (authenticated, owner only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const review = await Review.findById(id).exec();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.deleteOne({ _id: id });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

export default router;

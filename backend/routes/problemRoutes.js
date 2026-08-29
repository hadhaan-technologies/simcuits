import express from 'express';
import Problem from '../models/Problem.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find({
      status: 'published',
    })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    console.error('Failed to fetch problems:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch problems',
    });
  }
});

export default router;

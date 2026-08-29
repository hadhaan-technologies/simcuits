import express from 'express';

import { verifyRole, verifyToken } from '../middleware/authMiddleware.js';

import {
  deleteUser,
  getProfile,
  getUsers,
  updateProfile,
  getActivity,
} from '../controllers/userController.js';

const router = express.Router();

// Admin routes
router.get('/', verifyToken, verifyRole('admin'), getUsers);

router.delete('/:id', verifyToken, verifyRole('admin'), deleteUser);

// Logged-in user's profile
router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, updateProfile);
router.get('/activity', verifyToken, getActivity);

export default router;

import express from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  [
    body('email').optional().isEmail().withMessage('Must be a valid email'),
    body('mobile').optional().isMobilePhone('any').withMessage('Must be a valid phone number'),
    body('gstNumber').optional().isLength({ min: 15, max: 15 }).withMessage('GST number should be 15 characters'),
  ],
  updateProfile
);
router.put('/password', protect, changePassword);

export default router;
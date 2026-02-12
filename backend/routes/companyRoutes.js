import express from 'express';
import { body } from 'express-validator';
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from '../controllers/companyController.js';

const router = express.Router();

router.get('/', getAllPurchases);
router.get('/:id', getPurchaseById);
router.post(
  '/',
  [
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  ],
  createPurchase
);
router.put('/:id', updatePurchase);
router.delete('/:id', deletePurchase);

export default router;
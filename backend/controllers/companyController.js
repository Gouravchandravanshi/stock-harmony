import CompanyPurchase from '../models/CompanyPurchase.js';
import { validationResult } from 'express-validator';

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await CompanyPurchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await CompanyPurchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Not found' });
    res.json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPurchase = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const purchase = await CompanyPurchase.create(req.body);
    res.status(201).json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const purchase = await CompanyPurchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!purchase) return res.status(404).json({ message: 'Not found' });
    res.json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const purchase = await CompanyPurchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
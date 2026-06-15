import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import mongoose from 'mongoose';

const router = express.Router();

const promotionSchemaModel = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchemaModel);

// Validation schema
const promotionValidation = z.object({
  code: z.string().min(3).max(20),
  discountPercentage: z.number().min(1).max(100),
  validUntil: z.string().datetime(),
  isActive: z.boolean().default(true)
});

// GET all promotions
router.get('/', async (req, res, next) => {
  try {
    const promotions = await Promotion.find({});
    res.json(promotions);
  } catch (error) {
    next(error);
  }
});

// GET single promotion
router.get('/:id', async (req, res, next) => {
  try {
    const promotion = await Promotion.findOne({ id: req.params.id });
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    next(error);
  }
});

// POST new promotion
router.post('/', async (req, res, next) => {
  try {
    const validatedData = promotionValidation.parse(req.body);
    
    const existing = await Promotion.findOne({ code: validatedData.code });
    if (existing) {
      return res.status(400).json({ error: 'Promotion code already exists' });
    }

    const newPromotion = new Promotion({
      id: uuidv4(),
      ...validatedData
    });
    
    await newPromotion.save();
    res.status(201).json(newPromotion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    next(error);
  }
});

// PUT update promotion
router.put('/:id', async (req, res, next) => {
  try {
    const validatedData = promotionValidation.parse(req.body);
    
    const existingCode = await Promotion.findOne({ code: validatedData.code, id: { $ne: req.params.id } });
    if (existingCode) {
      return res.status(400).json({ error: 'Promotion code already exists' });
    }

    const updated = await Promotion.findOneAndUpdate(
      { id: req.params.id },
      { ...validatedData },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    next(error);
  }
});

// DELETE promotion
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Promotion.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;


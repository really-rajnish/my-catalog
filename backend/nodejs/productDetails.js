import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const productDetailSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  specs: { type: Map, of: String },
  tags: { type: [String] }
}, { timestamps: true });

const ProductDetail = mongoose.model('ProductDetail', productDetailSchema);

// Initial seed data
const seedData = async () => {
  try {
    const count = await ProductDetail.countDocuments();
    if (count === 0) {
      console.log('Seeding ProductDetails...');
      const sampleDetails = [
        {
          productId: '1',
          description: 'The Pixel 8 Pro is Google\'s best phone yet, featuring a stunning Super Actua display, the powerful Tensor G3 chip, and pro-level cameras with AI-powered editing tools like Magic Editor and Best Take.',
          specs: { 'Screen': '6.7" LTPO OLED', 'Processor': 'Tensor G3', 'RAM': '12GB', 'Storage': '128GB/256GB/512GB/1TB', 'Battery': '5050 mAh' },
          tags: ['flagship', 'photography', 'ai', 'android']
        },
        {
          productId: '2',
          description: 'Forged in titanium, the iPhone 15 Pro features the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system for incredible detail.',
          specs: { 'Screen': '6.1" Super Retina XDR', 'Processor': 'A17 Pro', 'RAM': '8GB', 'Storage': '128GB/256GB/512GB/1TB', 'Battery': '3274 mAh' },
          tags: ['flagship', 'titanium', 'ios']
        },
        {
          productId: '3',
          description: 'The Galaxy S24 Ultra ushers in a new era of mobile AI, enclosed in a tough titanium exterior. Enjoy flat displays, exceptional camera arrays, and an embedded S Pen.',
          specs: { 'Screen': '6.8" Dynamic AMOLED 2X', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB', 'Storage': '256GB/512GB/1TB', 'Battery': '5000 mAh' },
          tags: ['flagship', 'spen', 'ai', 'android']
        }
      ];
      await ProductDetail.insertMany(sampleDetails);
      console.log('ProductDetails seeded!');
    }
  } catch (error) {
    console.error('Error seeding ProductDetails:', error);
  }
};

mongoose.connection.once('open', () => {
  seedData();
});

// GET single product details
router.get('/:productId', async (req, res, next) => {
  try {
    const detail = await ProductDetail.findOne({ productId: req.params.productId });
    if (!detail) {
      // Return empty details gracefully instead of 404 to allow Gateway to merge safely
      return res.json({ description: "No deep description available.", specs: {}, tags: [] });
    }
    res.json(detail);
  } catch (error) {
    next(error);
  }
});

export default router;

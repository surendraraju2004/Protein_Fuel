const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  servingSize: { type: String, default: '60g' },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  images: [{ type: String }],
  ingredients: [{ type: String }],
  benefits: [{ type: String }],
  nutrition: { type: nutritionSchema, default: {} },
  stock: { type: Number, required: true, default: 0 },
  weight: { type: String, default: '60g' },
  flavors: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  tags: [{ type: String }],
  // Extended fields
  suitableFor: [{ type: String }], // ['kids', 'gym', 'office', 'travel', 'workout', 'weight-loss']
  shelfLife: { type: String, default: '3 months' },
  storageInstructions: { type: String, default: 'Store in a cool, dry place.' },
  allergens: [{ type: String }],
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isKeto: { type: Boolean, default: false },
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);

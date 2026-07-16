const mongoose = require('mongoose');

const customBarSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String }, // for guest users
  name: { type: String, default: 'My Custom Bar' },
  selections: {
    base: { type: String, default: '' },        // oats, dates, millets, quinoa
    protein: { type: String, default: '' },     // whey, plant, soy, peanut
    nuts: [{ type: String }],                    // almond, cashew, walnut, pistachio
    seeds: [{ type: String }],                   // pumpkin, sunflower, flax, chia, sesame
    sweetener: { type: String, default: '' },   // honey, dates, jaggery, stevia
    flavor: { type: String, default: '' },      // chocolate, coffee, vanilla, mango, etc.
    toppings: [{ type: String }],               // dark-chocolate, coconut, dry-fruits, granola
  },
  calculatedNutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
  },
  estimatedPrice: { type: Number, default: 0 },
  weight: { type: String, default: '60g' },
  orderedAt: { type: Date },
  isOrdered: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('CustomBar', customBarSchema);

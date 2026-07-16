const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

// Ingredient nutritional data per 100g
const ingredientData = {
  // Base
  oats: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, sugar: 1.0 },
  dates: { calories: 282, protein: 2.5, carbs: 75.0, fat: 0.4, fiber: 8.0, sugar: 63.0 },
  millets: { calories: 378, protein: 11.0, carbs: 72.8, fat: 4.2, fiber: 8.5, sugar: 0 },
  quinoa: { calories: 368, protein: 14.1, carbs: 64.2, fat: 6.1, fiber: 7.0, sugar: 0 },
  // Protein
  whey: { calories: 400, protein: 80, carbs: 10, fat: 5, fiber: 0, sugar: 5 },
  'plant-protein': { calories: 380, protein: 72, carbs: 15, fat: 6, fiber: 3, sugar: 2 },
  soy: { calories: 336, protein: 80, carbs: 6, fat: 3.5, fiber: 2, sugar: 1 },
  'peanut-protein': { calories: 600, protein: 50, carbs: 20, fat: 30, fiber: 5, sugar: 5 },
  // Nuts
  almond: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, sugar: 4.4 },
  cashew: { calories: 553, protein: 18.2, carbs: 30.2, fat: 43.8, fiber: 3.3, sugar: 5.9 },
  walnut: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, fiber: 6.7, sugar: 2.6 },
  pistachio: { calories: 560, protein: 20.2, carbs: 27.2, fat: 45.4, fiber: 10.3, sugar: 7.7 },
  // Seeds
  pumpkin: { calories: 559, protein: 30.2, carbs: 10.7, fat: 49.1, fiber: 6.0, sugar: 1.4 },
  sunflower: { calories: 584, protein: 20.8, carbs: 20.0, fat: 51.5, fiber: 8.6, sugar: 2.6 },
  flax: { calories: 534, protein: 18.3, carbs: 28.9, fat: 42.2, fiber: 27.3, sugar: 1.6 },
  chia: { calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4, sugar: 0 },
  sesame: { calories: 573, protein: 17.7, carbs: 23.4, fat: 49.7, fiber: 11.8, sugar: 0.3 },
  // Sweeteners
  honey: { calories: 304, protein: 0.3, carbs: 82.4, fat: 0, fiber: 0.2, sugar: 82.1 },
  jaggery: { calories: 383, protein: 0.4, carbs: 98.0, fat: 0.1, fiber: 0, sugar: 96.0 },
  stevia: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
}

// Portion weights per ingredient in a bar (grams)
const portions = {
  oats: 30, dates: 20, millets: 25, quinoa: 25,
  whey: 20, 'plant-protein': 20, soy: 20, 'peanut-protein': 20,
  almond: 10, cashew: 10, walnut: 10, pistachio: 10,
  pumpkin: 5, sunflower: 5, flax: 5, chia: 5, sesame: 5,
  honey: 10, jaggery: 10, stevia: 1, 'dates': 15,
  chocolate: 5, coffee: 2, vanilla: 1, mango: 5, strawberry: 5, blueberry: 5, orange: 3,
  'dark-chocolate': 5, coconut: 5, 'dry-fruits': 10, granola: 8,
}

const basePrices = {
  oats: 10, dates: 15, millets: 12, quinoa: 20,
  whey: 30, 'plant-protein': 25, soy: 20, 'peanut-protein': 18,
}

router.post('/calculate', (req, res) => {
  const { selections } = req.body
  const allIngredients = [
    selections.base,
    selections.protein,
    ...(selections.nuts || []),
    ...(selections.seeds || []),
    selections.sweetener,
    selections.flavor,
    ...(selections.toppings || []),
  ].filter(Boolean)

  let nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  allIngredients.forEach(id => {
    const data = ingredientData[id]
    const portion = portions[id] || 5
    if (data) {
      nutrition.calories += Math.round((data.calories * portion) / 100)
      nutrition.protein += Math.round((data.protein * portion) / 100 * 10) / 10
      nutrition.carbs += Math.round((data.carbs * portion) / 100 * 10) / 10
      nutrition.fat += Math.round((data.fat * portion) / 100 * 10) / 10
      nutrition.fiber += Math.round((data.fiber * portion) / 100 * 10) / 10
      nutrition.sugar += Math.round((data.sugar * portion) / 100 * 10) / 10
    }
  })

  // Round all values
  Object.keys(nutrition).forEach(k => { nutrition[k] = Math.round(nutrition[k]) })

  // Price calculation
  const basePrice = 60
  const ingredientCost = allIngredients.reduce((sum, id) => sum + (basePrices[id] || 5), 0)
  const estimatedPrice = basePrice + ingredientCost

  res.json({ nutrition, estimatedPrice })
})

router.post('/save', protect, async (req, res) => {
  try {
    const CustomBar = require('../models/CustomBar')
    const bar = await CustomBar.create({
      user: req.user._id,
      name: req.body.name || 'My Custom Bar',
      selections: req.body.selections,
      estimatedPrice: req.body.estimatedPrice,
    })
    res.json(bar)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

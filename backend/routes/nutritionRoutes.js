const express = require('express')
const router = express.Router()

// POST /api/nutrition/calculate
router.post('/calculate', (req, res) => {
  const { age, gender, heightCm, weightKg, activityLevel, goal } = req.body

  if (!age || !heightCm || !weightKg) {
    return res.status(400).json({ message: 'Age, height, and weight are required' })
  }

  const h = Number(heightCm)
  const w = Number(weightKg)
  const a = Number(age)

  // Harris-Benedict BMR
  let bmr
  if (gender === 'female') {
    bmr = Math.round(447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a))
  } else {
    bmr = Math.round(88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a))
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  const multiplier = activityMultipliers[activityLevel] || 1.55
  const tdee = Math.round(bmr * multiplier)

  let targetCalories = tdee
  if (goal === 'lose-fat') targetCalories = Math.round(tdee * 0.8)
  else if (goal === 'gain-muscle') targetCalories = Math.round(tdee * 1.1)

  // BMI
  const heightM = h / 100
  const bmiValue = (w / (heightM * heightM)).toFixed(1)
  let bmiCategory = 'Normal weight'
  if (bmiValue < 18.5) bmiCategory = 'Underweight'
  else if (bmiValue >= 25 && bmiValue < 30) bmiCategory = 'Overweight'
  else if (bmiValue >= 30) bmiCategory = 'Obese'

  // Protein: 1.6g/kg for muscle gain, 1.2g/kg for loss, 1g/kg for maintain
  const proteinMultipliers = { 'gain-muscle': 1.6, 'lose-fat': 1.2, 'maintain-weight': 1.0 }
  const proteinGrams = Math.round(w * (proteinMultipliers[goal] || 1.0))

  // NutriBite bars avg ~18g protein per bar
  const barsPerDay = Math.ceil(proteinGrams / 18)

  res.json({
    bmi: { value: bmiValue, category: bmiCategory },
    calories: { bmr, tdee, target: targetCalories },
    protein: { grams: proteinGrams, barsPerDay: Math.min(barsPerDay, 5) },
    goal,
  })
})

module.exports = router

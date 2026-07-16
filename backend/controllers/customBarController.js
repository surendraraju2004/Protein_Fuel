const CustomBar = require('../models/CustomBar');

// Ingredient nutrition data (per unit/serving contribution)
const ingredientNutrition = {
  // Base
  oats: { calories: 68, protein: 2.4, carbs: 12, fat: 1.5, fiber: 1.7, sugar: 0, price: 15 },
  dates: { calories: 90, protein: 0.8, carbs: 22, fat: 0.1, fiber: 2.5, sugar: 18, price: 20 },
  millets: { calories: 72, protein: 2.1, carbs: 14, fat: 1.0, fiber: 1.3, sugar: 0.5, price: 18 },
  quinoa: { calories: 80, protein: 3.5, carbs: 14, fat: 1.4, fiber: 1.5, sugar: 0.5, price: 25 },
  // Protein
  whey: { calories: 40, protein: 10, carbs: 2, fat: 0.5, fiber: 0, sugar: 1, price: 40 },
  'plant-protein': { calories: 45, protein: 9, carbs: 3, fat: 0.8, fiber: 0.5, sugar: 0.5, price: 35 },
  soy: { calories: 42, protein: 8.5, carbs: 2.5, fat: 0.7, fiber: 0.3, sugar: 0.5, price: 30 },
  'peanut-protein': { calories: 38, protein: 8, carbs: 3, fat: 1.2, fiber: 0.5, sugar: 0.5, price: 28 },
  // Nuts (per nut added)
  almond: { calories: 20, protein: 0.8, carbs: 0.7, fat: 1.7, fiber: 0.3, sugar: 0.2, price: 8 },
  cashew: { calories: 22, protein: 0.7, carbs: 1.3, fat: 1.8, fiber: 0.1, sugar: 0.4, price: 7 },
  walnut: { calories: 26, protein: 0.6, carbs: 0.5, fat: 2.6, fiber: 0.3, sugar: 0.1, price: 10 },
  pistachio: { calories: 18, protein: 0.7, carbs: 0.9, fat: 1.4, fiber: 0.3, sugar: 0.3, price: 9 },
  // Seeds
  pumpkin: { calories: 9, protein: 0.5, carbs: 0.3, fat: 0.7, fiber: 0.1, sugar: 0, price: 4 },
  sunflower: { calories: 8, protein: 0.4, carbs: 0.3, fat: 0.7, fiber: 0.1, sugar: 0, price: 3 },
  flax: { calories: 7, protein: 0.3, carbs: 0.4, fat: 0.5, fiber: 0.5, sugar: 0, price: 3 },
  chia: { calories: 8, protein: 0.3, carbs: 0.5, fat: 0.5, fiber: 0.7, sugar: 0, price: 5 },
  sesame: { calories: 9, protein: 0.4, carbs: 0.4, fat: 0.7, fiber: 0.1, sugar: 0, price: 3 },
  // Sweeteners
  honey: { calories: 15, protein: 0, carbs: 4, fat: 0, fiber: 0, sugar: 4, price: 10 },
  jaggery: { calories: 18, protein: 0, carbs: 5, fat: 0, fiber: 0, sugar: 5, price: 6 },
  stevia: { calories: 2, protein: 0, carbs: 0.5, fat: 0, fiber: 0, sugar: 0, price: 8 },
  // Flavor
  chocolate: { calories: 12, protein: 0.3, carbs: 1.5, fat: 0.7, fiber: 0.2, sugar: 1, price: 10 },
  coffee: { calories: 5, protein: 0.1, carbs: 0.8, fat: 0.1, fiber: 0, sugar: 0, price: 6 },
  vanilla: { calories: 6, protein: 0, carbs: 1, fat: 0, fiber: 0, sugar: 1, price: 5 },
  mango: { calories: 10, protein: 0.1, carbs: 2.5, fat: 0, fiber: 0.1, sugar: 2, price: 7 },
  strawberry: { calories: 8, protein: 0.1, carbs: 2, fat: 0, fiber: 0.1, sugar: 1.5, price: 7 },
  blueberry: { calories: 9, protein: 0.1, carbs: 2.1, fat: 0, fiber: 0.2, sugar: 1.5, price: 8 },
  orange: { calories: 7, protein: 0.1, carbs: 1.8, fat: 0, fiber: 0.1, sugar: 1.2, price: 5 },
  // Toppings
  'dark-chocolate': { calories: 15, protein: 0.3, carbs: 1.5, fat: 1.0, fiber: 0.3, sugar: 0.8, price: 12 },
  coconut: { calories: 12, protein: 0.1, carbs: 0.5, fat: 1.1, fiber: 0.5, sugar: 0.3, price: 5 },
  'dry-fruits': { calories: 20, protein: 0.5, carbs: 4, fat: 0.3, fiber: 0.4, sugar: 3, price: 15 },
  granola: { calories: 18, protein: 0.5, carbs: 3, fat: 0.7, fiber: 0.5, sugar: 1, price: 8 },
};

const BASE_PRICE = 60; // base price ₹60

const calculateNutrition = (selections) => {
  const { base, protein, nuts = [], seeds = [], sweetener, flavor, toppings = [] } = selections;
  let nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 };
  let price = BASE_PRICE;

  const add = (key, multiplier = 1) => {
    const item = ingredientNutrition[key];
    if (!item) return;
    nutrition.calories += item.calories * multiplier;
    nutrition.protein += item.protein * multiplier;
    nutrition.carbs += item.carbs * multiplier;
    nutrition.fat += item.fat * multiplier;
    nutrition.fiber += item.fiber * multiplier;
    nutrition.sugar += item.sugar * multiplier;
    price += item.price * multiplier;
  };

  if (base) add(base);
  if (protein) add(protein);
  nuts.forEach((n) => add(n, 3));
  seeds.forEach((s) => add(s, 4));
  if (sweetener) add(sweetener);
  if (flavor) add(flavor);
  toppings.forEach((t) => add(t));

  // Round values
  Object.keys(nutrition).forEach((k) => {
    nutrition[k] = Math.round(nutrition[k] * 10) / 10;
  });

  return { nutrition, price: Math.round(price) };
};

// @POST /api/custom-bar/calculate
const calculateBar = async (req, res) => {
  const { selections } = req.body;
  const { nutrition, price } = calculateNutrition(selections);
  res.json({ nutrition, estimatedPrice: price });
};

// @POST /api/custom-bar/save
const saveBar = async (req, res) => {
  const { selections, name } = req.body;
  const { nutrition, price } = calculateNutrition(selections);

  const bar = await CustomBar.create({
    user: req.user?._id,
    name: name || 'My Custom Bar',
    selections,
    calculatedNutrition: nutrition,
    estimatedPrice: price,
  });

  res.status(201).json(bar);
};

// @GET /api/custom-bar/my-bars
const getMyBars = async (req, res) => {
  const bars = await CustomBar.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bars);
};

// @DELETE /api/custom-bar/:id
const deleteBar = async (req, res) => {
  await CustomBar.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Bar deleted' });
};

module.exports = { calculateBar, saveBar, getMyBars, deleteBar };

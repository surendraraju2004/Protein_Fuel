const mongoose = require('mongoose');

let mongodInstance = null; // keeps the in-memory server alive

const connectDB = async () => {
  // First try the configured MONGO_URI (local or Atlas)
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log(`\x1b[32m✅ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    return;
  } catch (err) {
    console.log(`\x1b[33m⚠️  Local MongoDB not available (${err.message.split(',')[0]})\x1b[0m`);
    console.log('\x1b[36m🔄 Starting built-in MongoDB (mongodb-memory-server)...\x1b[0m');
  }

  // Fallback: use in-memory MongoDB (no installation required)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    await mongoose.connect(uri);
    console.log('\x1b[32m✅ In-memory MongoDB started successfully!\x1b[0m');

    // Auto-seed when using in-memory DB (it starts empty every time)
    await autoSeed();
  } catch (memErr) {
    console.error('\x1b[31m❌ Could not start any MongoDB:', memErr.message, '\x1b[0m');
    process.exit(1);
  }
};

const autoSeed = async () => {
  try {
    const User = require('../models/User');
    const Category = require('../models/Category');
    const Product = require('../models/Product');

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('✅ Database already has data, skipping seed.');
      return;
    }

    console.log('\x1b[36m🌱 Seeding initial data...\x1b[0m');

    // Categories
    const catDocs = await Category.insertMany([
      { name: 'Protein Bars', slug: 'protein-bars', description: 'High-protein bars for muscle building', color: '#2d6a4f' },
      { name: 'Energy Bars', slug: 'energy-bars', description: 'Quick energy boosts for active lifestyles', color: '#d4a017' },
      { name: 'Kids Bars', slug: 'kids-bars', description: 'Healthy snacks for growing children', color: '#f97316' },
      { name: 'Weight Loss', slug: 'weight-loss', description: 'Low-calorie, high-fiber bars for fat loss', color: '#8b5cf6' },
      { name: 'Muscle Gain', slug: 'muscle-gain', description: 'High-calorie mass gainers for bulking', color: '#ef4444' },
      { name: 'Vegan', slug: 'vegan', description: '100% plant-based protein bars', color: '#22c55e' },
      { name: 'Keto', slug: 'keto', description: 'Low-carb, high-fat bars for keto diet', color: '#64748b' },
      { name: 'Dry Fruit', slug: 'dry-fruit', description: 'Natural bars packed with nuts and dry fruits', color: '#92400e' },
    ]);
    const catMap = {};
    catDocs.forEach(c => { catMap[c.slug] = c._id; });

    // Admin + demo users
    await User.create({ name: 'NutriBite Admin', email: 'admin@nutribite.in', password: 'Admin@123', role: 'admin', phone: '9876543210' });
    await User.create({ name: 'Arjun Sharma',    email: 'arjun@example.com', password: 'User@123',  role: 'user',  phone: '9123456780', goal: 'gain-muscle' });
    await User.create({ name: 'Priya Patel',     email: 'priya@example.com', password: 'User@123',  role: 'user',  phone: '9012345678', goal: 'lose-fat', dietPreference: 'vegan' });

    // Sample products
    const barImages = [
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600',
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
    ];

    await Product.insertMany([
      {
        name: 'Almond Choco Bliss Bar', slug: 'almond-choco-bliss-bar',
        description: 'Roasted almonds, dark chocolate, and dates. Perfect post-workout snack.',
        shortDescription: 'Roasted almonds + dark chocolate + dates',
        category: catMap['protein-bars'], price: 149, discountPrice: 129,
        images: [barImages[0], barImages[1]],
        ingredients: ['Roasted Almonds', 'Dates', 'Dark Chocolate', 'Oats', 'Honey'],
        benefits: ['High Protein', 'Natural Energy', 'No Preservatives'],
        nutrition: { servingSize: '60g', calories: 245, protein: 12, carbs: 28, fat: 9, fiber: 4, sugar: 14 },
        stock: 150, weight: '60g', flavors: ['Chocolate', 'Original'],
        isFeatured: true, isBestSeller: true, ratings: 4.8, numReviews: 124,
        tags: ['protein', 'chocolate', 'almond'],
      },
      {
        name: 'Peanut Butter Power Bar', slug: 'peanut-butter-power-bar',
        description: 'High-protein bar with natural peanut butter, oats, and jaggery.',
        shortDescription: 'Peanut butter + oats + jaggery',
        category: catMap['muscle-gain'], price: 129, discountPrice: 109,
        images: [barImages[4], barImages[5]],
        ingredients: ['Peanut Butter', 'Oats', 'Jaggery', 'Chia Seeds'],
        benefits: ['20g Protein', 'No Added Sugar', 'Muscle Recovery'],
        nutrition: { servingSize: '60g', calories: 280, protein: 20, carbs: 30, fat: 10, fiber: 3 },
        stock: 200, weight: '60g', flavors: ['Chocolate', 'Vanilla', 'Original'],
        isFeatured: true, isBestSeller: true, ratings: 4.7, numReviews: 98,
        tags: ['protein', 'peanut', 'muscle-gain'],
      },
      {
        name: 'Mango Oats Energy Bar', slug: 'mango-oats-energy-bar',
        description: 'Tropical twist with dried mango, oats, sunflower seeds, and honey.',
        shortDescription: 'Dried mango + oats + honey',
        category: catMap['energy-bars'], price: 99, discountPrice: 85,
        images: [barImages[2], barImages[3]],
        ingredients: ['Oats', 'Dried Mango', 'Honey', 'Sunflower Seeds'],
        benefits: ['Natural Energy', 'Vitamin C Rich', 'No Preservatives'],
        nutrition: { servingSize: '50g', calories: 195, protein: 5, carbs: 38, fat: 4, fiber: 3 },
        stock: 120, weight: '50g', flavors: ['Mango', 'Original'],
        isFeatured: true, isBestSeller: false, ratings: 4.5, numReviews: 67,
        isVegan: true, tags: ['energy', 'mango', 'oats'],
      },
      {
        name: 'Kids Banana Oats Bar', slug: 'kids-banana-oats-bar',
        description: 'Soft, chewy banana oats bar for children. No artificial anything.',
        shortDescription: 'Banana + oats + honey — kids love it!',
        category: catMap['kids-bars'], price: 79, discountPrice: 69,
        images: [barImages[3], barImages[2]],
        ingredients: ['Oats', 'Banana', 'Honey', 'Dates', 'Coconut'],
        benefits: ['Kid-Friendly', 'Natural Sweetness', 'No Artificial Colors'],
        nutrition: { servingSize: '40g', calories: 155, protein: 3.5, carbs: 30, fat: 3, fiber: 2.5 },
        stock: 200, weight: '40g', flavors: ['Banana', 'Vanilla'],
        isFeatured: true, isBestSeller: false, ratings: 4.9, numReviews: 156,
        tags: ['kids', 'banana', 'oats'],
      },
      {
        name: 'Green Vegan Protein Bar', slug: 'green-vegan-protein-bar',
        description: '100% plant-based protein bar with pea protein, hemp seeds, and berries.',
        shortDescription: 'Pea protein + hemp + berries — 100% vegan',
        category: catMap['vegan'], price: 169, discountPrice: 149,
        images: [barImages[5], barImages[0]],
        ingredients: ['Pea Protein', 'Hemp Seeds', 'Oats', 'Mixed Berries'],
        benefits: ['18g Plant Protein', 'Vegan Certified', 'No Dairy'],
        nutrition: { servingSize: '60g', calories: 235, protein: 18, carbs: 25, fat: 7, fiber: 5 },
        stock: 100, weight: '60g', flavors: ['Mixed Berry', 'Vanilla'],
        isFeatured: true, isBestSeller: false, ratings: 4.4, numReviews: 52,
        isVegan: true, isGlutenFree: true, tags: ['vegan', 'plant-protein'],
      },
      {
        name: 'Choco Crunch Keto Bar', slug: 'choco-crunch-keto-bar',
        description: 'Low-carb dark chocolate bar with MCT oil and macadamia nuts for keto.',
        shortDescription: 'Low-carb dark chocolate + nuts',
        category: catMap['keto'], price: 199, discountPrice: 179,
        images: [barImages[1], barImages[4]],
        ingredients: ['Dark Chocolate', 'Macadamia Nuts', 'Coconut Oil', 'Almonds'],
        benefits: ['Low Carb (<5g)', 'Keto Friendly', 'No Sugar'],
        nutrition: { servingSize: '55g', calories: 310, protein: 8, carbs: 4, fat: 26, fiber: 5 },
        stock: 80, weight: '55g', flavors: ['Dark Chocolate'],
        isFeatured: false, isBestSeller: false, ratings: 4.6, numReviews: 43,
        isKeto: true, isGlutenFree: true, tags: ['keto', 'low-carb'],
      },
    ]);

    console.log('\x1b[32m🎉 Auto-seed complete! Admin: admin@nutribite.in / Admin@123\x1b[0m');
  } catch (err) {
    console.error('⚠️  Auto-seed warning:', err.message);
  }
};

module.exports = connectDB;

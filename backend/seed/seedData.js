const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Blog = require('../models/Blog');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nutribite');
  console.log('✅ MongoDB Connected');
};

// Picsum placeholder images (reliable, no sign-up needed)
const barImages = [
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
  'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600',
  'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600',
];

const categories = [
  { name: 'Protein Bars', slug: 'protein-bars', description: 'High-protein bars for muscle building', image: barImages[0], color: '#2d6a4f' },
  { name: 'Energy Bars', slug: 'energy-bars', description: 'Quick energy boosts for active lifestyles', image: barImages[1], color: '#d4a017' },
  { name: 'Kids Bars', slug: 'kids-bars', description: 'Healthy snacks for growing children', image: barImages[2], color: '#f97316' },
  { name: 'Weight Loss', slug: 'weight-loss', description: 'Low-calorie, high-fiber bars for fat loss', image: barImages[3], color: '#8b5cf6' },
  { name: 'Muscle Gain', slug: 'muscle-gain', description: 'High-calorie mass gainers for bulking', image: barImages[4], color: '#ef4444' },
  { name: 'Vegan', slug: 'vegan', description: '100% plant-based protein bars', image: barImages[5], color: '#22c55e' },
  { name: 'Keto', slug: 'keto', description: 'Low-carb, high-fat bars for keto diet', image: barImages[6], color: '#64748b' },
  { name: 'Dry Fruit', slug: 'dry-fruit', description: 'Natural bars packed with nuts and dry fruits', image: barImages[7], color: '#92400e' },
];

const seedData = async () => {
  await connectDB();

  // Clear
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Review.deleteMany({});
  await Coupon.deleteMany({});
  await Blog.deleteMany({});

  console.log('🗑️  Cleared existing data');

  // Create categories
  const createdCategories = await Category.insertMany(categories);
  const catMap = {};
  createdCategories.forEach((c) => { catMap[c.slug] = c._id; });
  console.log(`📁 Created ${createdCategories.length} categories`);

  // Create users
  const admin = await User.create({
    name: 'NutriBite Admin',
    email: 'admin@nutribite.in',
    password: 'Admin@123',
    role: 'admin',
    phone: '9876543210',
  });

  const user1 = await User.create({
    name: 'Arjun Sharma',
    email: 'arjun@example.com',
    password: 'User@123',
    role: 'user',
    phone: '9123456780',
    goal: 'gain-muscle',
  });

  const user2 = await User.create({
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'User@123',
    role: 'user',
    phone: '9012345678',
    goal: 'lose-fat',
    dietPreference: 'vegan',
  });

  console.log('👤 Created 1 admin + 2 users');

  // Create products
  const products = [
    {
      name: 'Almond Choco Bliss Bar',
      slug: 'almond-choco-bliss-bar',
      description: 'A delicious blend of roasted almonds, dark chocolate, and dates. Perfect post-workout snack loaded with natural protein and healthy fats.',
      shortDescription: 'Roasted almonds + dark chocolate + dates',
      category: catMap['protein-bars'],
      price: 149,
      discountPrice: 129,
      images: [barImages[0], barImages[1]],
      ingredients: ['Roasted Almonds', 'Dates', 'Dark Chocolate', 'Oats', 'Honey', 'Flax Seeds'],
      benefits: ['High Protein', 'Natural Energy', 'Rich in Antioxidants', 'No Preservatives'],
      nutrition: { servingSize: '60g', calories: 245, protein: 12, carbs: 28, fat: 9, fiber: 4, sugar: 14, sodium: 20 },
      stock: 150,
      weight: '60g',
      flavors: ['Chocolate', 'Original'],
      isFeatured: true,
      isBestSeller: true,
      ratings: 4.8,
      numReviews: 124,
      suitableFor: ['gym', 'office', 'travel', 'workout'],
      shelfLife: '3 months',
      tags: ['protein', 'chocolate', 'almond', 'bestseller'],
      isVegan: false,
      isGlutenFree: false,
    },
    {
      name: 'Peanut Butter Power Bar',
      slug: 'peanut-butter-power-bar',
      description: 'High-protein bar made with natural peanut butter, oats, and jaggery. Fuel your gym sessions with clean, sustained energy.',
      shortDescription: 'Peanut butter + oats + jaggery',
      category: catMap['muscle-gain'],
      price: 129,
      discountPrice: 109,
      images: [barImages[4], barImages[5]],
      ingredients: ['Peanut Butter', 'Oats', 'Jaggery', 'Whey Protein', 'Chia Seeds', 'Flax Seeds'],
      benefits: ['20g Protein', 'Long-lasting Energy', 'No Added Sugar', 'Muscle Recovery'],
      nutrition: { servingSize: '60g', calories: 280, protein: 20, carbs: 30, fat: 10, fiber: 3.5, sugar: 8, sodium: 35 },
      stock: 200,
      weight: '60g',
      flavors: ['Chocolate', 'Vanilla', 'Original'],
      isFeatured: true,
      isBestSeller: true,
      ratings: 4.7,
      numReviews: 98,
      suitableFor: ['gym', 'workout', 'muscle-gain'],
      shelfLife: '3 months',
      tags: ['protein', 'peanut', 'muscle-gain', 'high-protein'],
    },
    {
      name: 'Mango Oats Energy Bar',
      slug: 'mango-oats-energy-bar',
      description: 'A tropical twist with dried mango, oats, sunflower seeds, and honey. Light, refreshing, and perfect for a midday energy boost.',
      shortDescription: 'Dried mango + oats + honey',
      category: catMap['energy-bars'],
      price: 99,
      discountPrice: 85,
      images: [barImages[2], barImages[3]],
      ingredients: ['Oats', 'Dried Mango', 'Honey', 'Sunflower Seeds', 'Pumpkin Seeds', 'Dates'],
      benefits: ['Natural Energy', 'Vitamin C Rich', 'Light & Refreshing', 'No Preservatives'],
      nutrition: { servingSize: '50g', calories: 195, protein: 5, carbs: 38, fat: 4, fiber: 3, sugar: 20, sodium: 15 },
      stock: 120,
      weight: '50g',
      flavors: ['Mango', 'Original'],
      isFeatured: true,
      isBestSeller: false,
      ratings: 4.5,
      numReviews: 67,
      suitableFor: ['office', 'travel', 'kids'],
      shelfLife: '2 months',
      tags: ['energy', 'mango', 'oats', 'tropical'],
      isVegan: true,
      isGlutenFree: false,
    },
    {
      name: 'Choco Crunch Keto Bar',
      slug: 'choco-crunch-keto-bar',
      description: 'Low-carb dark chocolate bar with MCT oil, macadamia nuts, and coconut. Designed for keto dieters who want to stay in ketosis.',
      shortDescription: 'Low-carb dark chocolate + nuts',
      category: catMap['keto'],
      price: 199,
      discountPrice: 179,
      images: [barImages[6], barImages[7]],
      ingredients: ['Dark Chocolate', 'Macadamia Nuts', 'Coconut Oil', 'Almonds', 'Stevia', 'Chia Seeds'],
      benefits: ['Low Carb (<5g)', 'Keto Friendly', 'Ketosis Support', 'No Sugar'],
      nutrition: { servingSize: '55g', calories: 310, protein: 8, carbs: 4, fat: 26, fiber: 5, sugar: 1, sodium: 10 },
      stock: 80,
      weight: '55g',
      flavors: ['Dark Chocolate', 'Coconut'],
      isFeatured: false,
      isBestSeller: false,
      ratings: 4.6,
      numReviews: 43,
      suitableFor: ['keto', 'weight-loss'],
      shelfLife: '4 months',
      tags: ['keto', 'low-carb', 'chocolate', 'sugar-free'],
      isKeto: true,
      isGlutenFree: true,
    },
    {
      name: 'Kids Banana Oats Bar',
      slug: 'kids-banana-oats-bar',
      description: 'Soft, chewy, and delicious banana oats bar made for children. No artificial flavors, no preservatives — just wholesome goodness kids love.',
      shortDescription: 'Banana + oats + honey — kids love it!',
      category: catMap['kids-bars'],
      price: 79,
      discountPrice: 69,
      images: [barImages[3], barImages[2]],
      ingredients: ['Oats', 'Banana', 'Honey', 'Dates', 'Pumpkin Seeds', 'Coconut'],
      benefits: ['Kid-Friendly', 'Natural Sweetness', 'Calcium & Iron Rich', 'No Artificial Colors'],
      nutrition: { servingSize: '40g', calories: 155, protein: 3.5, carbs: 30, fat: 3, fiber: 2.5, sugar: 16, sodium: 8 },
      stock: 200,
      weight: '40g',
      flavors: ['Banana', 'Vanilla'],
      isFeatured: true,
      isBestSeller: false,
      ratings: 4.9,
      numReviews: 156,
      suitableFor: ['kids'],
      shelfLife: '2 months',
      tags: ['kids', 'banana', 'oats', 'healthy-snack'],
      isVegan: false,
      isGlutenFree: false,
    },
    {
      name: 'Green Vegan Protein Bar',
      slug: 'green-vegan-protein-bar',
      description: 'A 100% plant-based protein bar with pea protein, hemp seeds, spinach powder, and mixed berries. Clean, green, and guilt-free.',
      shortDescription: 'Pea protein + hemp + berries — 100% vegan',
      category: catMap['vegan'],
      price: 169,
      discountPrice: 149,
      images: [barImages[5], barImages[0]],
      ingredients: ['Pea Protein', 'Hemp Seeds', 'Oats', 'Mixed Berries', 'Spinach Powder', 'Dates', 'Stevia'],
      benefits: ['18g Plant Protein', 'Vegan Certified', 'Rich in Iron', 'No Dairy'],
      nutrition: { servingSize: '60g', calories: 235, protein: 18, carbs: 25, fat: 7, fiber: 5, sugar: 9, sodium: 25 },
      stock: 100,
      weight: '60g',
      flavors: ['Mixed Berry', 'Vanilla'],
      isFeatured: true,
      isBestSeller: false,
      ratings: 4.4,
      numReviews: 52,
      suitableFor: ['vegan', 'gym', 'workout'],
      shelfLife: '3 months',
      tags: ['vegan', 'plant-protein', 'berry', 'dairy-free'],
      isVegan: true,
      isGlutenFree: true,
    },
    {
      name: 'Dates & Dry Fruit Delight',
      slug: 'dates-dry-fruit-delight',
      description: 'A rich medley of Medjool dates, walnuts, cashews, raisins, and figs. No baking, no artificial anything — pure natural energy.',
      shortDescription: 'Medjool dates + mixed nuts + figs',
      category: catMap['dry-fruit'],
      price: 219,
      discountPrice: 189,
      images: [barImages[7], barImages[4]],
      ingredients: ['Medjool Dates', 'Walnuts', 'Cashews', 'Raisins', 'Dried Figs', 'Almonds', 'Sesame Seeds'],
      benefits: ['Natural Sugars Only', 'Rich in Iron & Calcium', 'No Baking', 'High in Fiber'],
      nutrition: { servingSize: '65g', calories: 268, protein: 7, carbs: 42, fat: 9, fiber: 6, sugar: 32, sodium: 5 },
      stock: 90,
      weight: '65g',
      flavors: ['Original'],
      isFeatured: false,
      isBestSeller: true,
      ratings: 4.7,
      numReviews: 88,
      suitableFor: ['office', 'travel', 'yoga'],
      shelfLife: '2 months',
      tags: ['dry-fruit', 'dates', 'natural', 'no-bake'],
      isVegan: true,
      isGlutenFree: true,
    },
    {
      name: 'Slim-Fit Fat Burner Bar',
      slug: 'slim-fit-fat-burner-bar',
      description: 'Designed for weight watchers — high fiber, low calorie bar with green tea extract, flax seeds, and quinoa. Supports fat loss naturally.',
      shortDescription: 'Low calorie + high fiber for weight loss',
      category: catMap['weight-loss'],
      price: 139,
      discountPrice: 119,
      images: [barImages[1], barImages[6]],
      ingredients: ['Quinoa', 'Flax Seeds', 'Chia Seeds', 'Green Tea Extract', 'Oats', 'Stevia', 'Pumpkin Seeds'],
      benefits: ['Only 160 Calories', 'High Fiber (7g)', 'Boosts Metabolism', 'Keeps You Full Longer'],
      nutrition: { servingSize: '55g', calories: 160, protein: 10, carbs: 20, fat: 5, fiber: 7, sugar: 3, sodium: 18 },
      stock: 130,
      weight: '55g',
      flavors: ['Original', 'Coffee'],
      isFeatured: true,
      isBestSeller: false,
      ratings: 4.3,
      numReviews: 71,
      suitableFor: ['weight-loss', 'yoga', 'office'],
      shelfLife: '3 months',
      tags: ['weight-loss', 'low-calorie', 'high-fiber', 'keto-friendly'],
      isVegan: true,
      isGlutenFree: true,
    },
    {
      name: 'Coffee Kick Morning Bar',
      slug: 'coffee-kick-morning-bar',
      description: 'Start your morning strong with natural cold brew coffee, dark chocolate, oats, and almonds. No crash, just clean energy all morning.',
      shortDescription: 'Cold brew coffee + dark chocolate + almonds',
      category: catMap['energy-bars'],
      price: 159,
      discountPrice: 139,
      images: [barImages[0], barImages[4]],
      ingredients: ['Cold Brew Coffee', 'Dark Chocolate', 'Oats', 'Almonds', 'Dates', 'Honey', 'Vanilla'],
      benefits: ['Natural Caffeine', 'Sustained Energy', 'Rich in Antioxidants', 'No Jitters'],
      nutrition: { servingSize: '60g', calories: 255, protein: 11, carbs: 31, fat: 10, fiber: 4, sugar: 15, sodium: 22 },
      stock: 110,
      weight: '60g',
      flavors: ['Coffee', 'Mocha'],
      isFeatured: false,
      isBestSeller: true,
      ratings: 4.6,
      numReviews: 63,
      suitableFor: ['office', 'gym', 'travel'],
      shelfLife: '3 months',
      tags: ['coffee', 'energy', 'morning', 'chocolate'],
    },
    {
      name: 'Strawberry Whey Crunch Bar',
      slug: 'strawberry-whey-crunch-bar',
      description: 'Light, fruity, and protein-packed with real strawberry pieces, whey protein, and puffed quinoa for that satisfying crunch.',
      shortDescription: 'Strawberry + whey protein + puffed quinoa',
      category: catMap['protein-bars'],
      price: 149,
      discountPrice: 0,
      images: [barImages[3], barImages[5]],
      ingredients: ['Whey Protein', 'Dried Strawberry', 'Puffed Quinoa', 'Oats', 'Honey', 'Almonds'],
      benefits: ['22g Protein', 'Real Fruit Pieces', 'Crunchy Texture', 'Low Sugar'],
      nutrition: { servingSize: '60g', calories: 240, protein: 22, carbs: 24, fat: 7, fiber: 3, sugar: 10, sodium: 40 },
      stock: 175,
      weight: '60g',
      flavors: ['Strawberry', 'Mixed Berry'],
      isFeatured: false,
      isBestSeller: true,
      ratings: 4.5,
      numReviews: 89,
      suitableFor: ['gym', 'workout', 'travel'],
      shelfLife: '3 months',
      tags: ['protein', 'strawberry', 'whey', 'crunch'],
    },
  ];

  const createdProducts = await Product.insertMany(products);
  console.log(`🥜 Created ${createdProducts.length} products`);

  // Create reviews
  const reviews = [
    { product: createdProducts[0]._id, user: user1._id, name: user1.name, rating: 5, comment: 'Absolutely love this bar! Best protein snack I\'ve had. The almond-chocolate combo is perfect.' },
    { product: createdProducts[0]._id, user: user2._id, name: user2.name, rating: 5, comment: 'My go-to post-workout snack. Tastes amazing and the ingredients are all natural!' },
    { product: createdProducts[1]._id, user: user1._id, name: user1.name, rating: 4, comment: 'Great protein content and the peanut flavor is rich and creamy. Will definitely reorder.' },
    { product: createdProducts[4]._id, user: user2._id, name: user2.name, rating: 5, comment: 'My kids absolutely love this! Finally a healthy snack they actually want to eat.' },
  ];

  await Review.insertMany(reviews);
  console.log(`⭐ Created ${reviews.length} reviews`);

  // Create coupons
  const coupons = [
    { code: 'WELCOME20', description: '20% off on your first order', discountType: 'percent', value: 20, minOrderAmount: 199, maxDiscountAmount: 100, maxUses: 1000, isActive: true, expiresAt: new Date('2026-12-31') },
    { code: 'SAVE50', description: 'Flat ₹50 off on orders above ₹499', discountType: 'flat', value: 50, minOrderAmount: 499, maxUses: 500, isActive: true, expiresAt: new Date('2026-12-31') },
    { code: 'PROTEIN10', description: '10% off on all protein bars', discountType: 'percent', value: 10, minOrderAmount: 0, maxUses: 0, isActive: true },
    { code: 'VEGAN15', description: '15% off on all vegan products', discountType: 'percent', value: 15, minOrderAmount: 249, maxUses: 200, isActive: true, expiresAt: new Date('2026-12-31') },
  ];
  await Coupon.insertMany(coupons);
  console.log(`🎟️  Created ${coupons.length} coupons`);

  // Create blog posts
  const blogs = [
    {
      title: 'Why Homemade Protein Bars Are Better Than Store-Bought',
      slug: 'homemade-vs-store-bought-protein-bars',
      excerpt: 'Store shelves are flooded with protein bars, but most are packed with artificial sweeteners and preservatives. Here\'s why homemade wins.',
      content: '<p>When you pick up a protein bar at the store, do you actually read the ingredient list? Most commercial bars contain maltitol syrup, artificial flavors, soy lecithin, and a cocktail of preservatives...</p><p>At NutriBite, we believe food should be simple. Our bars are made with ingredients you can pronounce and trust.</p>',
      author: 'NutriBite Team',
      category: 'protein',
      tags: ['homemade', 'natural', 'protein-bars', 'healthy'],
      coverImage: barImages[0],
      readTime: 5,
      published: true,
      publishedAt: new Date('2026-06-15'),
    },
    {
      title: 'How Much Protein Do You Really Need Per Day?',
      slug: 'how-much-protein-per-day',
      excerpt: 'The protein requirement varies based on your weight, goals, and activity level. Let\'s break down the science behind optimal protein intake.',
      content: '<p>The RDA (Recommended Dietary Allowance) for protein is 0.8g per kg of body weight. But for athletes and gym-goers, this number needs to be much higher...</p>',
      author: 'NutriBite Team',
      category: 'nutrition',
      tags: ['protein', 'nutrition', 'gym', 'muscle'],
      coverImage: barImages[4],
      readTime: 7,
      published: true,
      publishedAt: new Date('2026-06-20'),
    },
    {
      title: '5 Natural Ingredients That Help You Lose Weight Faster',
      slug: '5-natural-ingredients-weight-loss',
      excerpt: 'Flax seeds, chia seeds, green tea, oats, and protein — the science-backed ingredients in our Weight Loss bars that actually work.',
      content: '<p>Losing weight doesn\'t require expensive supplements or crash diets. These 5 natural ingredients, when consumed consistently, can accelerate your fat-loss journey...</p>',
      author: 'NutriBite Team',
      category: 'weight-loss',
      tags: ['weight-loss', 'natural', 'ingredients', 'fat-loss'],
      coverImage: barImages[1],
      readTime: 6,
      published: true,
      publishedAt: new Date('2026-07-01'),
    },
  ];
  await Blog.insertMany(blogs);
  console.log(`📝 Created ${blogs.length} blog posts`);

  console.log('\n🎉 Seed Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Login: admin@nutribite.in / Admin@123');
  console.log('User Login:  arjun@example.com / User@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  mongoose.connection.close();
};

seedData().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.connection.close();
  process.exit(1);
});

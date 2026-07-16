const Product = require('../models/Product');
const Category = require('../models/Category');

// @GET /api/products
const getProducts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.minRating) query.ratings = { $gte: Number(req.query.minRating) };

  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'rating': { ratings: -1 },
    'newest': { createdAt: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.json({ products, page, pages: Math.ceil(total / limit), total });
};

// @GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(6).populate('category', 'name');
  res.json(products);
};

// @GET /api/products/bestsellers
const getBestSellers = async (req, res) => {
  const products = await Product.find({ isBestSeller: true }).limit(6).populate('category', 'name');
  res.json(products);
};

// @GET /api/products/:slug
const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @POST /api/products (admin) — accepts JSON body with image URLs
const createProduct = async (req, res) => {
  const {
    name, slug, description, shortDescription, category,
    price, discountPrice, images, ingredients, benefits, nutrition,
    stock, weight, flavors, isFeatured, isBestSeller, tags,
    isVegan, isKeto, isGlutenFree, suitableFor, shelfLife,
    storageInstructions, allergens,
  } = req.body;

  const product = await Product.create({
    name, slug, description, shortDescription, category,
    price, discountPrice: discountPrice || 0,
    images: Array.isArray(images) ? images : (images ? [images] : []),
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    benefits: Array.isArray(benefits) ? benefits : [],
    nutrition: nutrition || {},
    stock, weight: weight || '60g',
    flavors: Array.isArray(flavors) ? flavors : [],
    isFeatured: Boolean(isFeatured),
    isBestSeller: Boolean(isBestSeller),
    tags: Array.isArray(tags) ? tags : [],
    isVegan: Boolean(isVegan),
    isKeto: Boolean(isKeto),
    isGlutenFree: Boolean(isGlutenFree),
    suitableFor: Array.isArray(suitableFor) ? suitableFor : [],
    shelfLife: shelfLife || '3 months',
    storageInstructions: storageInstructions || 'Store in a cool, dry place.',
    allergens: Array.isArray(allergens) ? allergens : [],
  });

  res.status(201).json(product);
};

// @PUT /api/products/:id (admin) — accepts JSON body with image URLs
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const scalarFields = [
    'name', 'slug', 'description', 'shortDescription', 'category',
    'price', 'discountPrice', 'stock', 'weight', 'isFeatured', 'isBestSeller',
    'isVegan', 'isKeto', 'isGlutenFree', 'shelfLife', 'storageInstructions',
  ];
  scalarFields.forEach((f) => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

  const arrayFields = ['ingredients', 'benefits', 'flavors', 'tags', 'images', 'suitableFor', 'allergens'];
  arrayFields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = Array.isArray(req.body[f]) ? req.body[f] : [];
  });

  if (req.body.nutrition) product.nutrition = req.body.nutrition;

  const updated = await product.save();
  res.json(updated);
};

// @DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

module.exports = {
  getProducts, getFeaturedProducts, getBestSellers,
  getProductBySlug, createProduct, updateProduct, deleteProduct,
};

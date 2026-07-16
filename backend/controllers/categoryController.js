const Category = require('../models/Category');

const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { name, slug, description } = req.body;
  const image = req.file ? req.file.path : '';
  const category = await Category.create({ name, slug, description, image });
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  Object.assign(category, req.body);
  if (req.file) category.image = req.file.path;
  await category.save();
  res.json(category);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  await category.deleteOne();
  res.json({ message: 'Category deleted' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

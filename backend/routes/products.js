const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductStamp = require('../models/ProductStamp');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.getByCategory(req.params.category);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get user's stamps for all products
router.get('/stamps', authenticateToken, async (req, res) => {
  try {
    const stamps = await ProductStamp.getUserStamps(req.user.id);
    res.json(stamps);
  } catch (error) {
    console.error('Error fetching stamps:', error);
    res.status(500).json({ error: 'Failed to fetch stamps' });
  }
});

// Get stamps for specific product
router.get('/stamps/:productId', authenticateToken, async (req, res) => {
  try {
    const stamps = await ProductStamp.getStamps(req.user.id, req.params.productId);
    res.json(stamps || { stamps_count: 0, free_products_earned: 0, free_products_used: 0 });
  } catch (error) {
    console.error('Error fetching product stamps:', error);
    res.status(500).json({ error: 'Failed to fetch stamps' });
  }
});

// Admin: Create product
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, category, price } = req.body;
    
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Name, category, and price are required' });
    }
    
    const productId = await Product.create({ name, category, price });
    const product = await Product.getById(productId);
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Admin: Update product
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, category, price, active } = req.body;
    
    await Product.update(req.params.id, { name, category, price, active });
    const product = await Product.getById(req.params.id);
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin: Delete product (soft delete)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;

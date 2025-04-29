import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import cache from '../cache.js';

export const getProducts = async (req, res) => {
  try {
    const cached = cache.get('products');
    if (cached) {
      return res.status(200).json({ success: true, data: cached });
    }
    const products = await Product.find({});
    cache.set('products', products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log('error in fetching products:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body; // user will send this data

  if (!product.name || !product.price || !product.image) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    cache.del('products'); // invalidate cache
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error in Create product:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid Product Id' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    cache.del('products'); // invalidate cache
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (_) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          total: { $sum: 1 },
        },
      },
    ]);
    res.json(stats[0] || { avgPrice: 0, total: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Aggregation error' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid Product Id' });
  }

  try {
    await Product.findByIdAndDelete(id);
    cache.del('products'); // invalidate cache
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.log('error in deleting product:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

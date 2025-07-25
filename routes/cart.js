const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add to cart
router.post('/add', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId == productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }
    await cart.save();
    res.json({ message: 'Added to cart', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quantity
router.patch('/update', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    const item = cart.items.find(item => item.productId == productId);
    if (item) item.quantity = quantity;
    await cart.save();
    res.json({ message: 'Quantity updated', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete('/remove', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    cart.items = cart.items.filter(item => item.productId != productId);
    await cart.save();
    res.json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;
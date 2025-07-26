const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  try {
    const { productId, userId } = req.body;

    const newOrder = new Order({ productId, userId });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});
const Product = require('../models/Product');

// GET user orders
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId })
      .populate('productId') // this is key step
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
router.delete('/:orderId', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

 module.exports = router;

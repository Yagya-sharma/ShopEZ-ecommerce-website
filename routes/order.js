// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');

// // ➕ Place an order
// router.post('/', async (req, res) => {
//   const { userId, productId } = req.body;

//   if (!userId || !productId) {
//     return res.status(400).json({ error: 'Missing userId or productId' });
//   }

//   try {
//     const order = new Order({ userId, productId });
//     await order.save();
//     res.status(200).json({ message: 'Order placed successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error placing order' });
//   }
// });

// // 📦 Get user's orders
// router.get('/:userId', async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.params.userId }).populate('productId');
//     res.status(200).json(orders);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// });

// // ❌ Cancel order
// router.patch('/cancel/:orderId', async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.orderId);
//     if (!order) return res.status(404).json({ error: 'Order not found' });

//     if (order.status === 'Delivered') {
//       return res.status(400).json({ error: 'Delivered orders cannot be canceled' });
//     }

//     order.status = 'Cancelled';
//     await order.save();
//     res.status(200).json({ message: 'Order cancelled successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to cancel order' });
//   }
// });

// module.exports = router;


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

// router.get('/:userId', async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.params.userId }).populate('productId');
//     res.json(orders);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// });

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

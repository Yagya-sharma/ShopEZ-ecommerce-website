const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust path if needed

// GET /api/search/:name
router.get('/:name', async (req, res) => {
  const searchName = req.params.name;

  try {
    const products = await Product.find({
      name: { $regex: new RegExp(searchName, 'i') } // Case-insensitive
    });
    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
  console.log("Searching for:", searchName);
const products = await Product.find({
  name: { $regex: new RegExp(searchName, 'i') }
});
console.log("Found products:", products);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User');

// Get single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~delete account or change password~~~~~~~~~~~~~~

// Change Password
router.post("/change-password", async (req, res) => {
  try {
    const userId = req.session.userId; // Or however you're identifying logged-in users
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Account
router.delete("/delete", async (req, res) => {
  try {
    const userId = req.session.userId;
    await User.findByIdAndDelete(userId);
    req.session.destroy();
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
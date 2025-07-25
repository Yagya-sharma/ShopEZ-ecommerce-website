const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  email: { type: String, unique: true },
  password: String,
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

module.exports = mongoose.model("User", userSchema);
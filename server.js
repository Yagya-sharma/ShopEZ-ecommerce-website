//server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("./models/User");
const fs = require('fs');
const path = require('path');

const app = express();
const searchRoutes = require('./routes/search');
const authRoutes=require('./routes/auth')
const orderRoutes = require('./routes/order');
const settingsRoutes = require('./routes/settings');
const cartRoutes = require('./routes/cart');
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


mongoose.connect('mongodb://localhost:27017/shopEZ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));
app.use('/api/search', searchRoutes);

 app.use('/api/auth',authRoutes);
app.use('/api/order', orderRoutes);



const usersFilePath = path.join(__dirname, 'data', 'users.json');
// Ensure users.json exists
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, '[]');
}

// Register route
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { name, email, password };
  users.push(newUser);

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  res.status(200).json({ message: 'User registered successfully' });
});



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Route to save favorite
app.post("/api/favorites", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    res.json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Route to get favorites
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: "Failed to get favorites" });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({ message: `Welcome back, ${user.name} `});
});

const contactFilePath = path.join(__dirname, 'data', 'contact.json');

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const contacts = fs.existsSync(contactFilePath)
    ? JSON.parse(fs.readFileSync(contactFilePath, 'utf-8'))
    : [];

  contacts.push({ name, email, message, date: new Date().toISOString() });

  fs.writeFileSync(contactFilePath, JSON.stringify(contacts, null, 2));
  res.status(200).json({ message: 'Thank you! Your message has been received.' });
});

app.use('/api/cart', cartRoutes);
app.use('/api/settings', settingsRoutes);


app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});


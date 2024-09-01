const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection
const dbURI = 'mongodb+srv://root:root@temp-pro-db.6b2me.mongodb.net/temp-pro-db?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Registration API route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

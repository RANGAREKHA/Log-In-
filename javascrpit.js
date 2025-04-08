javascrpit
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['General User', 'Admin'] },
});

module.exports = mongoose.model('User', userSchema);

// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Dummy data for demonstration
const dummyUsers = [
  { userId: 'user1', password: 'pass1', role: 'General User' },
  { userId: 'admin', password: 'adminpass', role: 'Admin' },
];

// API to authenticate user
app.post('/api/login', async (req, res) => {
  const { userId, password } = req.body;
  const user = dummyUsers.find(u => u.userId === userId && u.password === password);
  if (user) {
    res.status(200).json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// API to get user details
app.get('/api/user/:userId', async (req, res) => {
  const user = dummyUsers.find(u => u.userId === req.params.userId);
  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// API to get all users (Admin only)
app.get('/api/users', async (req, res) => {
  const { role } = req.query;
  if (role === 'Admin') {
    res.status(200).json({ users: dummyUsers });
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.js

// Add a delay for the API to simulate async processing
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Modify the login API to include a delay
app.post('/api/login', async (req, res) => {
  const { userId, password, delayTime } = req.body;
  await delay(delayTime || 0); // Add delay if provided
  const user = dummyUsers.find(u => u.userId === userId && u.password === password);
  if (user) {
    res.status(200).json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
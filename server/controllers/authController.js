const User = require('../models/User');
const { generateToken } = require('../config/jwt');


const register = async (req, res) => {
  try {
    console.log(" Register API HIT");

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    console.log(" Login API HIT");

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    console.log("User found:", user);

    if (!user || !(await user.matchPassword(password))) {
      console.log("❌ Invalid credentials");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("✅ Password matched");

    const token = generateToken(user._id);

    console.log("Sending response");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log("❌ Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };
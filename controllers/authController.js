const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const register = async (req, res) => {
  try {
    const { name, pin, mobile, email, nid, accountType } = req.body;

    const hashedPin = await bcrypt.hash(pin, 10);

    let initialBalance =
      accountType === 'User' ? 40 : accountType === 'Agent' ? 100000 : 0;

    const newUser = new User({
      name,
      pin: hashedPin,
      mobile,
      email,
      nid,
      accountType,
      balance: initialBalance,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

const login = async (req, res) => {
  try {
    const { mobile, pin } = req.body;
    const user = await User.findOne({ mobile });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(400).json({ message: 'Invalid PIN' });

    const token = jwt.sign(
      { userId: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

const logout = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { currentToken: null });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error });
  }
};

module.exports = { register, login, logout };

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const authRoutes = require('./routes/authRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to myKash',
  });
});

module.exports = app;

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  pin: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  nid: {
    type: String,
    unique: true,
  },
  accountType: {
    type: String,
    enum: ['User', 'Agent', 'Admin'],
    required: true,
    default: 'User',
  },
  balance: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  }, // For agents
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);

// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   mobileNumber: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   nid: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   pin: {
//     type: String,
//     required: true,
//   }, // Hashed PIN
//   accountType: {
//     type: String,
//     enum: ['User', 'Agent'],
//     required: true,
//   },
//   balance: {
//     type: Number,
//     default: 0,
//   },
//   income: {
//     type: Number,
//     default: 0,
//   }, // For agents
//   transactions: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Transaction',
//     },
//   ],
//   status: {
//     type: String,
//     enum: ['Active', 'Blocked'],
//     default: 'Active',
//   },
//   deviceSession: {
//     type: String,
//     default: null,
//   }, // To ensure login from one device
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('User', UserSchema);

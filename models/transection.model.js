const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: Number,
  type: {
    type: String,
    enum: ['Send Money', 'Cash-Out', 'Cash-In'],
  },
  fee: Number,
  transactionId: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);

// const mongoose = require('mongoose');

// const TransactionSchema = new mongoose.Schema({
//   transactionId: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   senderBalanceBefore: {
//     type: Number,
//     required: true,
//   },
//   receiverBalanceAfter: {
//     type: Number,
//     required: true,
//   },
//   adminFee: {
//     type: Number,
//     default: 0,
//   },
//   agentFee: {
//     type: Number,
//     default: 0,
//   },
//   type: {
//     type: String,
//     enum: ['Send-Money', 'Cash-Out', 'Cash-In'],
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Completed', 'Failed'],
//     default: 'Completed',
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Transaction', TransactionSchema);

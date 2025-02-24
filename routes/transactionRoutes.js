const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Send Money
router.post('/send-money', async (req, res) => {
  try {
    const { senderId, receiverMobile, amount } = req.body;

    if (amount < 50)
      return res.status(400).json({ message: 'Minimum amount is 50 taka' });

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ mobile: receiverMobile });

    if (!receiver)
      return res.status(404).json({ message: 'Receiver not found' });

    let fee = amount > 100 ? 5 : 0;
    if (sender.balance < amount + fee)
      return res.status(400).json({ message: 'Insufficient balance' });

    sender.balance -= amount + fee;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'Send Money',
      fee,
      transactionId: Date.now().toString(),
    });

    await transaction.save();

    res.json({ message: 'Transaction successful', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Transaction failed', error });
  }
});

module.exports = router;

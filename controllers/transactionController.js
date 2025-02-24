const express = require('express');
const User = require('../models/user.model');
const Transaction = require('../models/transection.model');
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

// Cash-Out (User withdraws money through an agent)
router.post('/cash-out', async (req, res) => {
  try {
    const { userId, agentMobile, amount, pin } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) return res.status(400).json({ message: 'Invalid PIN' });

    const agent = await User.findOne({
      mobile: agentMobile,
      accountType: 'Agent',
    });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    if (!agent.isApproved)
      return res.status(400).json({ message: 'Agent not approved' });

    const fee = amount * 0.015; // 1.5% fee
    const totalDeduction = amount + fee;

    if (user.balance < totalDeduction)
      return res.status(400).json({ message: 'Insufficient balance' });

    // Deduct from user
    user.balance -= totalDeduction;
    await user.save();

    // Update agent earnings (1% of transaction)
    const agentEarnings = amount * 0.01;
    agent.balance += amount - agentEarnings;
    await agent.save();

    // Admin earns 0.5% of transaction
    const adminEarnings = amount * 0.005;
    const admin = await User.findOne({ accountType: 'Admin' });
    admin.balance += adminEarnings;
    await admin.save();

    // Save transaction
    const transaction = new Transaction({
      sender: user._id,
      receiver: agent._id,
      amount,
      type: 'Cash-Out',
      fee,
      transactionId: Date.now().toString(),
    });

    await transaction.save();

    res.json({ message: 'Cash-Out successful', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Cash-Out failed', error });
  }
});

// Cash-In (User deposits money through an agent)
router.post('/cash-in', async (req, res) => {
  try {
    const { userId, agentMobile, amount, pin } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const agent = await User.findOne({
      mobile: agentMobile,
      accountType: 'Agent',
    });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    if (!agent.isApproved)
      return res.status(400).json({ message: 'Agent not approved' });

    if (agent.balance < amount)
      return res
        .status(400)
        .json({ message: 'Agent has insufficient balance' });

    // Agent enters PIN to authorize the transaction
    const isPinValid = await bcrypt.compare(pin, agent.pin);
    if (!isPinValid) return res.status(400).json({ message: 'Invalid PIN' });

    // Update balances
    user.balance += amount;
    await user.save();

    agent.balance -= amount;
    await agent.save();

    // Save transaction
    const transaction = new Transaction({
      sender: agent._id,
      receiver: user._id,
      amount,
      type: 'Cash-In',
      fee: 0,
      transactionId: Date.now().toString(),
    });

    await transaction.save();

    res.json({ message: 'Cash-In successful', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Cash-In failed', error });
  }
});

module.exports = router;

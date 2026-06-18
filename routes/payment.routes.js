const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction.model');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');
const checkBlocked = require('../middleware/checkBlocked.middleware');

// 🔒 PRIVATE (User): Create Stripe Payment Intent for a class booking
router.post('/create-payment-intent', verifyToken, authorizeRoles('user'), checkBlocked, async (req, res) => {
  const { amount } = req.body; // Amount in USD cents or whole numbers depending on frontend calculation
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid payment amount requested.' });
  }

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents for Stripe
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: { userId: req.user.id }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: 'Stripe Payment Intent generation failed', error: error.message });
  }
});

// 🔒 PRIVATE (User): Save successful payment transaction statement
router.post('/ledger', verifyToken, authorizeRoles('user'), checkBlocked, async (req, res) => {
  const { transactionId, amount, classId, className } = req.body;
  try {
    const newTransaction = new Transaction({
      userId: req.user.id,
      userEmail: req.user.email,
      transactionId,
      amount,
      classId,
      className,
      date: new Date()
    });

    await newTransaction.save();
    res.status(201).json({ message: 'Transaction securely logged in the ledger', newTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to log transaction ledger', error: error.message });
  }
});

// 👑 ADMIN: Fetch complete financial ledger statements
router.get('/history', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const ledger = await Transaction.find().sort({ date: -1 });
    res.status(200).json(ledger);
  } catch (error) {
    res.status(500).json({ message: 'Failed to pull transaction ledger data', error: error.message });
  }
});

module.exports = router;
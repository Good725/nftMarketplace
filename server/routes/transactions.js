const express = require('express');
const router = express.Router();
const { Transaction } = require('../models/Transaction');
const { auth } = require('../middlewares/auth');

//=================================
//             User
//=================================

router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    res.status(200).json({ transactions, success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;

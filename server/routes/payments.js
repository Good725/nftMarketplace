const express = require("express");
const router = express.Router();
const { Payment } = require("../models/Payment");
const { auth } = require("../middlewares/auth");

router.post("/payment", auth, (req, res) => {
  const payment = new Payment(req.body);
  payment.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.get('/payments', auth, async (req, res) => {
    try {
      const payments = await Payment.find({ user: req.user._id });
      res.status(200).json({ payments, success: true });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  });

module.exports = router;

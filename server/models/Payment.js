const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPaypal: {
        type: Boolean,
        default: false,
    },
    paypalEmail: {
      type: String,
    },
    payerID: {
      type: String,
    },
    paymentID: {
      type: String,
    },
    paymentToken: {
      type: String,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    type: {
        type: String
    },
    dbiliaBalanceUSD: {
        type: mongoose.Types.Decimal128,
        default: 0,
    },
    amountPaidDbiliaUSD: {
        type: mongoose.Types.Decimal128,
        default: 0,
    },
    amountPaidPaypalUSD: {
        type: mongoose.Types.Decimal128,
        default: 0,
    },
    total: {
        type: mongoose.Types.Decimal128,
        default: 0,
    },
    productId: {
        type: Schema.Types.ObjectId,
    },
    edition: {
        type: Number
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment };

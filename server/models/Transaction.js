const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  transactionType: { type: String },
  nftTitle: { type: String },
  edition: { type: Number },
  royalty: { type: Number },
  currency: { type: String },
  institution: { type: String },
  transactionBalance: { type: Number },
  usdBalance: { type: Number },
  ethBalance: { type: Number },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Transaction };

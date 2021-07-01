const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 100,
    },
    price: {
      type: Number,
      default: 10,
    },
    images: {
      type: Array,
      default: [],
    },
    layout: { type: String, default: 'Classic' },
    category: { type: String, default: 'None' },
    numberCardsInPack: { type: Number },
    totalEditions: { type: Number },
    remainingCards: [],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Pack = mongoose.model('Pack', packSchema);

module.exports = { Pack };

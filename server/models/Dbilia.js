const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbiliaSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    channelId: {
      type: String,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    media: {
      type: Number,
    },
    description: {
      type: String,
    },
    edition: {
      type: Number,
    },
  },
  { timestamps: true }
);

dbiliaSchema.index(
  {
    title: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 5,
      description: 1,
    },
  }
);

const Dbilia = mongoose.model('Dbilia', dbiliaSchema);

module.exports = { Dbilia };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
    },
    packId: { type: String, ref: 'Pack', default: 'no-pack' },
    packPosition: { type: Number, default: 0 },
    marketCount: { type: Number, default: 0 },
    mostRecentEditionDate: { type: Date },

    channelId: {
      type: String,
    },
    channelTitle: {
      type: String,
    },
    subCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    auction: {
      type: Boolean,
      default: false,
    },
    startingBid: {
      type: Number,
    },
    auctionStartDate: { type: Date },

    auctionDeadline: {
      type: Date,
    },
    auctionDone: { type: Boolean, default: false },
    auctionHistory: {
      type: Array,
      default: [],
    },
    unlockable: {
      type: Boolean,
      default: false,
    },
    unlockableText: {
      type: String,
    },
    unlockableMedia: {
      type: Array,
      default: [],
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      maxlength: 100,
    },
    currency: {
      type: String,
    },
    price: {
      type: Number,
      default: 10,
    },
    images: {
      type: Array,
      default: [],
    },
    videoPreview: {
      type: String,
      default: 'false',
    },
    category: {
      type: String,
      default: 'None',
    },
    layout: {
      type: String,
      default: 'Classic',
    },
    royalties: {
      type: Number,
      default: 10,
    },
    continents: {
      type: Number,
      default: 1,
    },
    purchaseLimitAmount: {
      type: Number,
    },
    numberEditions: { type: Number },
    // set for infinite editions
    saleDeadline: { type: Date },
    editions: { type: Array, default: [] },
    sold: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    introCard: {
      type: Boolean,

      default: function () {
        this.username === 'dbilia' ? true : false;
      },
    },
  },

  { timestamps: true }
);

productSchema.index(
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

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };

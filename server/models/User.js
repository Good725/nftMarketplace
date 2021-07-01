const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    lowercasefullname: {
      type: String,
      trim: true,
      maxlength: 15,
    },
    username: {
      type: String,
      required: true,
      maxlength: 15,
      trim: true,
      unique: 1,
      minglength: 3,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    bio: {
      type: String,
      maxlength: 150,
    },
    role: {
      type: Number,
      default: 0,
    },
    money: {
      type: mongoose.Types.Decimal128,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    dailyrewardpickup: {
      type: String,
    },
    cart: {
      type: Array,
      default: [],
    },
    shop: {
      type: Array,
      default: [],
    },
    links: {
      type: Array,
      default: [],
    },
    uploaded: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    museum: {
      type: Array,
      default: [],
    },
    history: {
      type: Array,
      default: [],
    },
    cardscreated: {
      type: Number,
      default: 0,
    },
    accountCategory: {
      type: String,
    },
    image: String,
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExp: {
      type: Number,
    },
    firstLogin: {
      type: Boolean,
      default: true,
    },
    firstLoginTracker: {
      type: Number,
      default: 1,
    },
    createTour: {
      type: Boolean,
      default: true,
    },
    createTourTracker: {
      type: Number,
      default: 1,
    },
    introCardGuide: {
      type: Boolean,
      default: true,
    },
    introCardGuideTracker: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), config.jwt.secret);
  var tokenExp = moment()
    .add(config.jwt.accessExpirationMinutes, 'minutes')
    .valueOf();
  var refreshToken = jwt.sign(user._id.toHexString(), config.jwt.secret);
  var refreshTokenExp = moment()
    .add(config.jwt.refreshExpirationDays, 'days')
    .valueOf();

  user.tokenExp = tokenExp;
  user.token = token;
  user.refreshTokenExp = refreshTokenExp;
  user.refreshToken = refreshToken;

  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, config.jwt.secret, function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };

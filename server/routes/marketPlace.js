const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');
const { User } = require('../models/User');
const { Transaction } = require('../models/Transaction');
const mongoose = require('mongoose');
const { auth } = require('../middlewares/auth');

// GET ALL EDITIONS IN MARKET OF CARD
router.get('/getCardEditionsInMarket', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    const cartObject = req.user.cart.filter((cartItem) => {
      return cartItem.id === req.query.id;
    });

    // ONLY SHOWING THE EDITIONS THE LOGGED IN USER DOES NOT OWN
    // SO THEY DO NOT PURCHASE A CARD THEY ALREADY OWN
    let editionsInMarket;

    if (cartObject.length > 0) {
      editionsInMarket = product.editions
        .filter(function (edition) {
          if (edition.inMarket) {
            return (
              cartObject[0].ownedEditions.filter(function (cartItem) {
                return cartItem.edition === edition.edition;
              }).length == 0
            );
          }
        })
        .map((item) => item.edition);
    } else {
      editionsInMarket = product.editions
        .filter(function (edition) {
          if (edition.inMarket) {
            return edition;
          }
        })
        .map((item) => item.edition);
    }

    res.status(200).json({ editionsInMarket });
  } catch {
    return;
  }
});

// place item for sale
router.get('/getMarketCardsByCategory', async (req, res) => {
  try {
    const products = await Product.find({
      category: req.query.category,
      marketCount: { $gt: 0 },
    });
    res.status(200).json({ products });
  } catch {
    res.status(500).json({ success: 'false' });
  }
});
router.patch('/addToMarketPlace', auth, async (req, res) => {
  console.log(req.body);
  try {
    const {
      auction,
      startingBid,
      auctionStartDate,
      auctionDeadline,
      marketPrice,
    } = req.body.info;
    console.log(auction);
    if (auction === 'true') {
      const product = await Product.findOneAndUpdate(
        {
          _id: req.body.productId,
          'editions.id': mongoose.Types.ObjectId(req.body.editionId),
        },
        {
          mostRecentEditionDate: Date.now(),
          $inc: { marketCount: 1 },
          'editions.$.inMarket': true,
          $set: {
            'editions.$.auction': auction,
            'editions.$.startingBid': +startingBid,
            'editions.$.auctionStartDate': auctionStartDate,
            'editions.$.auctionDeadline': auctionDeadline,
            'editions.$.auctionHistory': [],
          },
        },
        { new: true }
      );
      res.status(200).json({ success: true, product });
    } else {
      const product = await Product.findOneAndUpdate(
        {
          _id: req.body.productId,
          'editions.id': mongoose.Types.ObjectId(req.body.editionId),
        },
        {
          mostRecentEditionDate: Date.now(),
          $inc: { marketCount: 1 },
          'editions.$.inMarket': true,
          'editions.$.marketPrice': +marketPrice,
        },
        { new: true }
      );
      res.status(200).json({ success: true, product });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

router.patch('/removeFromMarketplace', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.query.id,
        'editions.id': mongoose.Types.ObjectId(req.query.editionId),
      },
      {
        $inc: { marketCount: -1 },
        'editions.$.marketPrice': 0,
        'editions.$.inMarket': false,
      },
      { new: true }
    );

    res.status(200).json({ success: true, product });
  } catch {
    res.status(500).json({ success: false });
  }
});
// item purchased

router.get('/addToCartFromMarketAndRemove', auth, async (req, res) => {
  const editionIndexNumber = req.query.edition - 1;

  const productId = req.query.id;

  try {
    Product.findOne({ _id: productId }, (err, product) => {
      const editionId = product.editions[editionIndexNumber].id;
      // history item being added to purchased edition
      const historyItem = {
        owner: req.user._id,
        username: req.user.username,
        price: product.editions[editionIndexNumber].marketPrice,
        date: Date.now(),
      };

      // Is item still on the market/has it already been purchased
      if (!product.editions[editionIndexNumber].inMarket) {
        return res
          .status(500)
          .json({ success: 'Edition had already been purchased' });
      }

      Product.findOneAndUpdate(
        {
          _id: productId,
          'editions.id': mongoose.Types.ObjectId(editionId),
        },
        {
          $push: { 'editions.$.history': historyItem },
          'editions.$.inMarket': false,
          $inc: { marketCount: -1 },
        },
        { new: true },
        (err, product) => {
          if (err)
            return res.status(500).json({
              success: 'Product failed to add history and change market status',
            });

          res.status(200);
        }
      );
    });

    ///////////////////////////  ADDING AND REMOVING USERS CART SECTION /////////
    // GETTING PRODUCT FOR REMOVING AND ADDING TO SELLING AND BUYING USERS CARTS
    const product = await Product.findById(productId).populate('writer');

    // GETTING THE SELLING USERS ID BY FINDING THE LAST OWNED

    // GETTING THE EDITIONS OBJECT (FOR CODE SIMPLIFICATION, USED MANY TIMES)
    const editionObject = product.editions[editionIndexNumber];

    const editionId = product.editions[editionIndexNumber].id;

    // GETTING THE EDITIONS HISTORY ARRAY LAST INDEX NUMBER
    const lastEditionNumber = editionObject.history.length - 1;

    // USING LAST INDEX NUMBER TO FIND THE INDIVIDUAL SELLING THE EDITION/THE LAST PERSON TO OWN THE EDITION
    const sellersUserId = editionObject.history[lastEditionNumber].owner;

    // ADDING ROYALTIES TO CREATOR
    // REMOVED IF STATEMENT BECAUSE BUYER CAN BE A CREATOR AS WELL
    //if (req.user.username !== product.writer.username) {
    let owner = await User.findByIdAndUpdate(
      product.writer,
      {
        $inc: {
          money: editionObject.marketPrice * (product.royalties / 100),
        },
      },
      { new: true }
    );

    const transaction2 = new Transaction({
      user: owner._id,
      transactionType: 'royalty',
      nftTitle: product.title,
      edition: editionIndexNumber + 1,
      royalty: product.royalties,
      transactionBalance: editionObject.marketPrice * (product.royalties / 100),
      usdBalance: owner.money,
    });

    await transaction2.save();
    User.findOne({ _id: sellersUserId }, (err, userInfo) => {
      let length;
      userInfo.cart.forEach((item, i) => {
        if (item.id == productId) {
          length = item.ownedEditions.length;
        }
      });

      ////// REMOVING THE CARD FROM THE OTHER USERS CART /////

      // IF THEY HAVE MORE THAN ONE EDITION WE JUST WANT TO REMOVE THE CORRECT OBJECT FROM THE OWNED EDITIONS
      if (length > 1) {
        User.findOneAndUpdate(
          {
            _id: sellersUserId,
            'cart.id': productId,
          },
          {
            $pull: { 'cart.$.ownedEditions': { id: editionId } },
            //$inc: { money: editionObject.marketPrice },
          },
          { new: true },
          (err, userInfo) => {
            if (err) return res.json({ success: false, err });
            res.status(200);
          }
        );
      }

      // IF THIS IS THE ONLY EDITION THEY HAVE IN THE CART THEN WE WANT TO REMOVE THE ENTIRE CART PRODUCT OBJECT
      else {
        User.findOneAndUpdate(
          {
            _id: sellersUserId,
            'cart.id': productId,
          },
          {
            $pull: { cart: { id: productId } },
            //$inc: { money: editionObject.marketPrice },
          },
          { new: true },
          (err, userInfo) => {
            if (err) return res.json({ success: false, err });
            res.status(200);
          }
        );
      }
    });
    //////// ADDING CARD TO THE BUYERS CART //////

    // CREATING OBJECT THAT WILL BE ADDED TO THE OWNEDEDITIONS
    const ownedEdition = {
      id: product.editions[editionIndexNumber].id,
      edition: product.editions[editionIndexNumber].edition,
      date: Date.now(),
    };

    // DOES USER PURCHASING CARD ALREADY HAVE AN EDITION OF THIS CARD

    User.findOne({ _id: req.user._id }, (err, userInfo) => {
      let duplicate = false;

      userInfo.cart.forEach((item, i) => {
        if (item.id == productId) {
          duplicate = true;
        }
      });
      // IF THE BUYER OWNS AN EDITION JUST ADD AN OBJECT TO OWNEDEDITIONS
      if (duplicate) {
        User.findOneAndUpdate(
          { _id: req.user._id, 'cart.id': productId },
          {
            $push: { 'cart.$.ownedEditions': ownedEdition },
            //$inc: { money: -editionObject.marketPrice },
          },
          { new: true },
          (err, userInfo) => {
            if (err) return res.json({ success: false, err });
            res.status(200);
          }
        );
      }
      // IF THIS IS THE USERS FIRST EDITION OF THIS CARD
      else {
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              cart: {
                id: productId,
                ownedEditions: [ownedEdition],
                date: Date.now(),
              },
              //$inc: { money: -editionObject.marketPrice },
            },
          },
          { new: true },
          (err, userInfo) => {
            if (err) return res.json({ success: false, err });
            res.status(200);
          }
        );
      }
    });

    const transaction = new Transaction({
      user: req.user._id,
      transactionType: 'buy',
      nftTitle: product.title,
      edition: editionIndexNumber + 1,
      transactionBalance: editionObject.marketPrice,
      usdBalance: req.user.money,
    });
    await transaction.save();

    // ADDING SELLERS TRANSACTION

    const seller = await User.findOne({ _id: sellersUserId });

    const transaction1 = new Transaction({
      user: sellersUserId,
      transactionType: 'resale',
      nftTitle: product.title,
      edition: editionIndexNumber + 1,
      transactionBalance: editionObject.marketPrice,
      usdBalance: seller.money,
    });

    await transaction1.save();

    // adding royalty sale
  } catch (error) {
    console.log('file: marketPlace.js ~ line 390 ~ router.get ~ error', error);
    res
      .status(500)
      .json({ success: 'Item failed to be taken off marketplace' });
  }
});

// take item off marketplace

// get marketplace cards

router.get('/marketCards', async (req, res) => {
  try {
    const product = await Product.find({ marketCount: { $gt: 0 } }).populate(
      'writer'
    );

    res.status(200).json({ success: true, product });
  } catch {
    res.status(500).json({ success: false });
  }
});

module.exports = router;

// packs notes.
// only create one card, can still create one card, people can still create a pool of cards, then when people buy a pack they get a random card and random edition, each pack should contain 3 cards. someone buys a pack they get 3 cards all chosen at random, guaranteed that each card is different.  3 separte aindividual cards, when the user who makes the pack, they make a pool of cards, could be a 100 cards, they random have a chance of getting 1 of the 100 cards.

// the only way to get cards in a pool, only way to get them is to buy a pack, random what card you are going to get.  wont appear the same way on somebodys page the way another card would

// pack option in the create
// choose how many cards they want in their pack/pool
// the next ten steps will be create card 1, then create card 2 and image
// DONT NEED TO SELECT A PRICE
// ONCE THEYVE CREATED THE 10 CARDS THEN YOU CREATE THE COVER OF THE PACK
// THE PRICE OF THE PACK
// EDITIONS WILL BE AUTOGENERATED
// UPLOAD A COVER, CHANGE OUTLINE TO BE A DIFFERENT COLOR
// SHOULD BE RANDOMIZED WHAT EDITION THEY GET
// WILL ALLOW PEOPLE TO BURN UNSOLD CARDS
// WILL JUST ADD THREE INDIVIDUAL CARDS
// WILL ONLY BE SPECIAL TILL ITS PURCHASED
// VARIABLE TO SAY ITS IN A PACK
// WILL NEED A PACK ID
// POOL NEEDS TO BE DIVISIBLE BY 3
// COULD PUT SUGGESTIONS
//

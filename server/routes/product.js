const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');
const { User } = require('../models/User');
const { Pack } = require('../models/Packs');
const multer = require('multer');
const mongoose = require('mongoose');
const { auth } = require('../middlewares/auth');
const moment = require('moment');
const { Transaction } = require('../models/Transaction');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' || ext !== '.png') {
      return cb(res.status(400).end('only jpg, png are allowed'), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single('file');

//=================================
//             Product
//=================================

router.post('/uploadImage', auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/uploadSold', auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true, sold: res });
  });
});

router.patch('/updateMinted', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.query.id,
        'editions.id': mongoose.Types.ObjectId(req.query.editionId),
      },
      {
        'editions.$.minted': true,
        'editions.$.tokenId': +req.query.tokenId,
      },
      { new: true }
    );
    res.status(200).json({ success: true, editions: product.editions });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// GETTING SINGLE PRODUCT ITEM
router.get('/getProduct', async (req, res) => {
  try {
    const product1 = await Product.findById(req.query.id);
    let product;
    if (product1.packId !== 'no-pack') {
      product = await Product.findById(req.query.id)
        .populate('writer')
        .populate('packId');
    } else {
      product = await Product.findById(req.query.id).populate('writer');
    }

    res.status(200).json({ product, success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

router.post('/uploadProduct', auth, (req, res) => {
  //save all the data we got from the client into the DB
  if (req.body.numberEditions < 10000000000) {
    const editions = Array.apply(null, Array(req.body.numberEditions)).map(
      (v, i) =>
        (v = {
          id: new mongoose.Types.ObjectId(),
          edition: i + 1,
          marketPrice: 0,
          history: [],
          inMarket: false,
          minted: false,
        })
    );

    const product = new Product({ ...req.body, editions });

    product.save((err) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, id: product._id });
    });
  } else {
    const product = new Product({ ...req.body });

    product.save((err) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, id: product._id });
    });
  }
});

router.post('/getProducts', (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit =
    req.body.searchString === '' && req.body.searchBar
      ? 0
      : req.body.limit
      ? parseInt(req.body.limit)
      : 100;
  let skip = parseInt(req.body.skip);
  let searchBar = req.body.searchBar;

  let string = req.body.searchString;
  findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  if (string !== '') {
    Product.find(findArgs)
      .find({
        title: { $regex: '.*' + string + '.*', $options: 'i' },
        packId: 'no-pack',
      })
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  } else {
    Product.find(findArgs)
      .find({ packId: 'no-pack' })
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });

        res.status(200).json({
          success: true,
          products: searchBar && string === '' ? [] : products,
          postSize: products.length,
        });
      });
  }
});

router.get('/products_by_id', (req, res) => {
  try {
    let type = req.query.type;
    let productIds = req.query.id;

    if (type === 'array') {
      let ids = req.query.id.split(',');
      productIds = [];
      productIds = ids.map((item) => {
        return item;
      });
    }

    // GET SHOP AND CART USE THE SAME ROUTE
    // WANT TO SHOP CARDS FROM PACKS IN COLLECTION
    // NOT IN SHOP
    if (req.query.id) {
      if (req.query.collection) {
        Product.find({
          _id: { $in: productIds },
        })
          .populate('writer')
          .exec((err, product) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json(product);
          });
      }
      // THIS IS OFR SHOP
      else {
        Product.find({
          _id: { $in: productIds },
          packId: 'no-pack',

          // this means the card has no pack
        })
          .populate('writer')
          .exec((err, product) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json(product);
          });
      }
    } else {
      res.status(200).json({ product: [] });
    }
  } catch (error) {
    console.log('product', error);
  }
});

router.get('/getProductsByCategory', async (req, res) => {
  try {
    const products = await Product.find({ category: req.query.category });
    res.status(200).json({ products });
  } catch {
    res.status(500).json({ success: 'false' });
  }
});
//we need to find the product information that belong to product Id

router.get('/products_by_channelid', (req, res) => {
  const query = req.query;

  Product.find(query).then((items) => {
    return res.status(200).json({ success: true, items });
  });
});

router.post('/updatesold', (req, res) => {
  const query = req.query;
  const productId = query.id;
  delete query['id'];

  Product.findByIdAndUpdate(productId, query, { new: true }).then((item) => {
    res.json({
      confirmation: 'success',
      data: item,
    });
  });
});

router.post('/incrementSold', (req, res) => {
  const query = req.query;
  const productId = query.id;
  delete query['id'];

  Product.findByIdAndUpdate(
    { _id: req.query.productId },
    { $inc: { sold: 1 } },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200);
    }
  );
});

router.post('/placeInitialProductBid', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    if (product.auctionHistory.length > 0) {
      lowestBid = product.auctionHistory.reduce((acc, curr) => {
        if (acc.bid < curr.bid) {
          return acc;
        } else return curr;
      });
    }
    if (Date.now() < product.auctionDeadline) {
      if (product.numberEditions > product.auctionHistory.length) {
        await Product.findOneAndUpdate(
          { _id: req.query.id },
          {
            $push: {
              auctionHistory: {
                bidId: new mongoose.Types.ObjectId(),
                userId: req.user._id,
                username: req.user.username,
                bid: +req.query.bid,
                bidTime: Date.now(),
              },
            },
          }
        );
        const transaction = new Transaction({
          user: req.user._id,
          transactionType: 'bid',
          nftTitle: product.title,
          transactionBalance: (+req.query.bid + +req.query.bid * 0.025).toFixed(
            2
          ),
          usdBalance: (
            req.user.money -
            +req.query.bid -
            +req.query.bid * 0.025
          ).toFixed(2),
        });
        transaction.save();
      } else {
        await Product.findOneAndUpdate(
          { _id: req.query.id },
          {
            // REMOVING THE LOWEST BID
            $pull: { auctionHistory: lowestBid },
          },
          { new: true }
        );
        const refundUser = await User.findOneAndUpdate(
          { _id: lowestBid.userId },
          { $inc: { money: lowestBid.bid } },
          { new: true }
        );

        const transaction2 = new Transaction({
          user: req.user._id,
          transactionType: 'bid',
          nftTitle: product.title,
          transactionBalance: (+req.query.bid + +req.query.bid * 0.025).toFixed(
            2
          ),
          usdBalance: (
            req.user.money -
            +req.query.bid +
            +req.query.bid * 0.025
          ).toFixed(2),
        });
        transaction2.save();

        const transaction1 = new Transaction({
          user: lowestBid.userId,
          transactionType: 'refund',
          nftTitle: product.title,
          transactionBalance: lowestBid.bid,
          usdBalance: refundUser.money,
        });
        transaction1.save();

        await Product.findOneAndUpdate(
          { _id: req.query.id },
          {
            // REMOVING THE LOWEST BID
            $push: {
              auctionHistory: {
                bidId: new mongoose.Types.ObjectId(),
                userId: req.user._id,
                username: req.user.username,
                bid: +req.query.bid,
                bidTime: Date.now(),
              },
            },
          },
          { new: true }
        );
        // await User.findOneAndUpdate(
        //   { _id: req.user._id },
        //   { $inc: { money: -req.query.bid } },
        //   { new: true }
        // );
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log('catch', error);
    res.status(500).json({ success: false });
  }
});

router.post('/placeInitialMarketBid', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    const { auctionHistory, auctionDeadline, id } =
      product.editions[req.query.edition];

    if (auctionHistory.length > 0) {
      lowestBid = auctionHistory.reduce((acc, curr) => {
        if (acc.bid < curr.bid) {
          return acc;
        } else return curr;
      });
    }
    if (Date.now() < moment(auctionDeadline)) {
      // no bids yet
      if (1 > auctionHistory.length) {
        await Product.findOneAndUpdate(
          { _id: req.query.id, 'editions.id': id },
          {
            $push: {
              'editions.$.auctionHistory': {
                bidId: new mongoose.Types.ObjectId(),
                userId: req.user._id,
                username: req.user.username,
                bid: +req.query.bid,
                bidTime: Date.now(),
              },
            },
            'editions.$.marketPrice': +req.query.bid,
          }
        );

        const transaction = new Transaction({
          user: req.user._id,
          transactionType: 'market bid',
          nftTitle: product.title,
          transactionBalance: (+req.query.bid + +req.query.bid * 0.025).toFixed(
            2
          ),
          usdBalance: (
            req.user.money -
            +req.query.bid -
            +req.query.bid * 0.025
          ).toFixed(2),
        });
        transaction.save();
      } else {
        // refund previous highest bidder
        await Product.findOneAndUpdate(
          { _id: req.query.id, 'editions.id': id },
          {
            // REMOVING THE LOWEST BID
            $pull: { 'editions.$.auctionHistory': lowestBid },
          },
          { new: true }
        );

        await Product.findOneAndUpdate(
          { _id: req.query.id, 'editions.id': id },
          {
            // adding new bid
            $push: {
              'editions.$.auctionHistory': {
                bidId: new mongoose.Types.ObjectId(),
                userId: req.user._id,
                username: req.user.username,
                bid: +req.query.bid,
                bidTime: Date.now(),
              },
            },
          },
          { new: true }
        );

        const refundUser = await User.findOneAndUpdate(
          { _id: lowestBid.userId },
          { $inc: { money: lowestBid.bid } },
          { new: true }
        );

        const transaction2 = new Transaction({
          user: req.user._id,
          transactionType: 'bid',
          nftTitle: product.title,
          transactionBalance: (+req.query.bid + +req.query.bid * 0.025).toFixed(
            2
          ),
          usdBalance: (
            req.user.money -
            +req.query.bid +
            +req.query.bid * 0.025
          ).toFixed(2),
        });
        transaction2.save();

        const transaction1 = new Transaction({
          user: lowestBid.userId,
          transactionType: 'refund',
          nftTitle: product.title,
          transactionBalance: lowestBid.bid,
          usdBalance: refundUser.money,
        });
        transaction1.save();

        // await User.findOneAndUpdate(
        //   { _id: req.user._id },
        //   { $inc: { money: -req.query.bid } },
        //   { new: true }
        // );
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log('catch', error);
    res.status(500).json({ success: false });
  }
});
router.get('/updateBid', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { 'auctionHistory.bidId': mongoose.Types.ObjectId(req.query.id) },
      { 'auctionHistory.$.bid': +req.query.amount },
      { new: true }
    );
    console.log('file: product.js ~ line 516 ~ router.get ~ product', product);

    // ADD TRANSACTIONS
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500);
    console.log('file: product.js ~ line 387~ router.patch ~ error', error);
  }
});

router.get('/updateMarketBid', async (req, res) => {
  console.log(req.query);
  try {
    const product = await Product.findOneAndUpdate(
      {
        'editions.auctionHistory.bidId': mongoose.Types.ObjectId(req.query.id),
      },

      {
        'editions.$[editions].auctionHistory.$[auctionHistory].bid':
          +req.query.amount,
      },
      {
        arrayFilters: [
          { 'editions.edition': +req.query.edition + 1 },
          {
            'auctionHistory.bidId': mongoose.Types.ObjectId(req.query.id),
          },
        ],
        new: true,
      }
    );
    // ADD TRANSACTIONS
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500);
    console.log('file: product.js ~ line 387~ router.patch ~ error', error);
  }
});

router.get('/allAuctions', async (req, res) => {
  try {
    const allAuctions = await Product.find({
      'auctionHistory.0': { $exists: true },
    });

    res
      .status(200)
      .json({ allAuctions: allAuctions.length > 0 ? allAuctions : [] });
  } catch (error) {
    console.log('465', error);
  }
});

router.get('/allMarketAuctions', async (req, res) => {
  try {
    const auctions = await Product.find({
      'editions.inMarket': true,
      'editions.auction': 'true',
    });
    const newArray = [];
    auctions.forEach((item) => {
      newArray.push(item.editions);
    });
    const flattenedArray = [].concat.apply([], newArray);
    const allMarketAuctions = flattenedArray.filter(
      (item) => item.inMarket && item.auction === 'true'
    );
    res.status(200).json({
      allMarketAuctions: allMarketAuctions.length > 0 ? allMarketAuctions : [],
    });
  } catch (error) {
    console.log('465', error);
  }
});

router.put('/saleDeadline', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.body._id },
      { saleDeadline: req.body.date },
      { new: true }
    ).populate('writer');

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log('sale deadline', error);
    res.status(500).json({ success: false });
  }
});
module.exports = router;

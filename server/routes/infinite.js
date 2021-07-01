const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');
const { User } = require('../models/User');
const mongoose = require('mongoose');
const { auth } = require('../middlewares/auth');

router.post('/featuredProducts', async (req, res) => {
  try {
    // GETTING ALL PRODUCTS ////
    const arrayOfItems = req.body.products.filter(
      (item, index) =>
        index + 1 <= parseInt(req.body.page) * 5 &&
        index + 1 > parseInt(req.body.page - 1) * 5
    );

    let products = [];
    if (arrayOfItems.filter((i, index) => i.type === 'card').length > 0) {
      products = await Product.find({
        _id: {
          $in: arrayOfItems.filter((item) => {
            if (item.type === 'card') {
              return mongoose.Types.ObjectId(item._id);
            }
          }),
        },
      }).populate('writer');
    }
    // GETTING ALL PACKS ////
    let packs = [];
    if (arrayOfItems.filter((i) => i.type === 'pack').length > 0) {
      packs = await Pack.find({
        _id: {
          $in: arrayOfItems.map((item) => {
            if (item.type === 'pack') {
              return mongoose.Types.ObjectId(item._id);
            }
          }),
        },
      }).populate('writer');
    }
    // GETTING ALL USERS ////
    let users = [];
    if (arrayOfItems.filter((i) => i.type === 'user').length > 0) {
      users = await User.find({
        _id: {
          $in: arrayOfItems.map((item) => {
            if (item.type === 'user') {
              return mongoose.Types.ObjectId(item._id);
            }
          }),
        },
      });
    }
    let mixedObjects = [products, users, packs];

    // flattening all three arrays into one of the 6 featured objects
    const featuredItems = mixedObjects.flat();

    res.status(200).json({ featuredItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ featuredProducts: 'Error getting products' });
  }
});

router.post('/feedProducts', (req, res) => {
  try {
    let multiplier = parseInt(req.body.page);
    let total = 5 * (multiplier - 1);

    Product.find()
      .populate('writer')
      .skip(total)
      .limit(5)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, feedItems: products });
      });
  } catch (error) {
    console.log('file: infinite.js ~ line 83 ~ outer.post ~ error', error);
  }
});

router.post('/marketProducts', (req, res) => {
  try {
    let multiplier = parseInt(req.body.page);
    let total = 2 * (multiplier - 1);
    if (req.body.category !== 'All') {
      Product.find({ marketCount: { $gt: 0 }, category: req.body.category })
        .populate('writer')
        .skip(total)
        .limit(2)
        .exec((err, products) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).json({ success: true, marketItems: products });
        });
    } else {
      Product.find({ marketCount: { $gt: 0 } })
        .populate('writer')
        .skip(total)
        .limit(2)
        .exec((err, products) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).json({ success: true, marketItems: products });
        });
    }
  } catch (error) {
    console.log('file: infinite.js ~ line 98 ~ outer.post ~ error', error);
  }
});

router.post('/shopProducts', (req, res) => {
  try {
    let multiplier = parseInt(req.body.page);
    let total = 5 * (multiplier - 1);
    Product.find({ _id: { $in: req.body.productIds } })
      .populate('writer')
      .skip(total)
      .limit(5)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, shopItems: products });
      });
  } catch (error) {
    console.log('file: infinite.js ~ line 115 ~ outer.post ~ error', error);
  }
});

router.post('/collectionProducts', (req, res) => {
  try {
    let multiplier = parseInt(req.body.page);
    let total = 2 * (multiplier - 1);

    Product.find({
      _id: { $in: req.body.productIds },
    })
      .populate('writer')
      .skip(total)
      .limit(2)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, collectionItems: products });
      });
  } catch (error) {
    console.log('file: infinite.js ~ line 136 ~ outer.post ~ error', error);
  }
});
router.post('/saleProducts', async (req, res) => {
  try {
    let multiplier = parseInt(req.body.page);
    let total = 2 * (multiplier - 1);
    const product = await Product.find({ _id: { $in: req.body.productIds } });

    const filteredProduct = product
      .filter((p) => p.marketCount > 0)
      .filter(
        (prod) =>
          prod.editions.map(
            (edition, i) =>
              edition.inMarket &&
              edition.history[edition.history.length - 1].owner ===
                req.body.profileId
          ).length > 0
      )
      .map((i) => i._id);
    if (filteredProduct.length > 0) {
      await Product.find({ _id: { $in: filteredProduct } })
        .populate('writer')
        .skip(total)
        .limit(2)
        .exec((err, products) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).json({ success: true, saleItems: products });
        });
    }
  } catch (error) {
    console.log('file: infinite.js ~ line 153 ~ outer.post ~ error', error);
  }
});

router.post('/searchCardProducts', (req, res) => {
  try {
    console.log(req.body);
    let multiplier = parseInt(req.body.page);
    let total = 5 * (multiplier - 1);
    console.log('file: infinite.js ~ line 161 ~ router.post ~ total', total);
    Product.find({
      title: { $regex: '.*' + req.body.searchString + '.*', $options: 'i' },
    })
      .populate('writer')
      .skip(total)
      .limit(5)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, searchCardItems: products });
      });
  } catch (error) {
    console.log('file: infinite.js ~ line 171 ~ router.post ~ error', error);
  }
});

router.post('/searchUserProducts', async (req, res) => {
  try {
    let multiplier = parseInt(req.body.page);
    let total = 2 * (multiplier - 1);

    const user = await User.find({
      $or: [
        {
          username: {
            $regex: '.*' + req.body.searchString + '.*',
            $options: 'i',
          },
        },
        {
          fullname: {
            $regex: '.*' + req.body.searchString + '.*',
            $options: 'i',
          },
        },
      ],
    })
      .populate('writer')
      .skip(total)
      .limit(2);

    const sortedUsers = user.sort((a, b) => {
      return b.cart.length - a.cart.length;
    });
    res.status(200).json({ success: true, searchUserItems: sortedUsers });
  } catch (error) {
    console.log('file: infinite.js ~ line 171 ~ outer.post ~ error', error);
  }
});

module.exports = router;

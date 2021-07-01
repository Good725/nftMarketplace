//ADD PACK
const express = require('express');
const router = express.Router();
const { Pack } = require('../models/Packs');
const { Product } = require('../models/Product');
const { auth } = require('../middlewares/auth');
const mongoose = require('mongoose');
const { User } = require('../models/User');
// ADDING A PACK TO PACK COLLECTION AND ALL CARDS TO PRODUCT COLLECTION
router.post('/addPack', auth, async (req, res) => {
  try {
    const totalEditions = req.body.packCards.reduce(
      (acc, curr) => (acc += curr.numberEditions),
      0
    );
    // REMAINING CARDS IS USED TO SELECT CARDS TO BE GIVEN FROM PACK
    // EACH CARD IN A PACK HAS A CARD POSITION AND AN ARRAY OF EACH EDITION
    // AND TRACK WHICH CARDS HAVE ALREADY BEEN REMOVED
    // AS CARDS ARE REMOVED, THOSE EDITION NUMBERS WILL BE REMOVED FROM THE ARRAY
    const remainingCards = req.body.packCards.map((card, index) => {
      return {
        packPosition: index + 1,
        editions: Array.apply(null, Array(card.numberEditions)).map(
          (v, i) => i + 1
        ),
      };
    });
    // MAPPING THROUGH ALL THE CARDS IN THE PACK AND ADDING EACH ONE
    const pack = new Pack({
      ...req.body.pack,
      numberCardsInPack: req.body.packCards.length,
      totalEditions,
      remainingCards,
    });
    pack.save((err) => {
      if (err) {
        return res.status(400).json({ success: false, err });
      }
      return res.status(200);
    });
    // TO THE PRODUCT COLLECTION
    req.body.packCards.map((card, index) => {
      const editions = Array.apply(null, Array(card.numberEditions)).map(
        (v, i) =>
          (v = {
            id: new mongoose.Types.ObjectId(),
            edition: i + 1,
            history: [],
            inMarket: false,
          })
      );

      // PACKID ADDED TO PRODUCT ITEM TO TRACK IT
      const product = new Product({
        ...card,
        editions,
        packId: mongoose.Types.ObjectId(pack._id),
        packPosition: index + 1,
      });

      product.save((err, product) => {
        if (err) return res.status(407).json({ success: false, err });
      });
      console.log('success');
      return res.status(200);
    });
  } catch {
    return res.stats(200).json({ success: 'false' });
  }
});

// GET SHOP PROFILE USERS PACKS

router.get('/getProfileShopPacks', async (req, res) => {
  try {
    const packs = await Pack.find({
      writer: mongoose.Types.ObjectId(req.query.id),
    });

    res.status(200).json({ success: true, packs });
  } catch {
    console.log('failed to get packs');
  }
});

router.get('/getPacksByCategory', async (req, res) => {
  try {
    const packs = await Pack.find({ category: req.query.category });
    res.status(200).json({ packs });
  } catch {
    res.status(500).json({ success: 'false' });
  }
});
router.get('/getPackCards', async (req, res) => {
  try {
    console.log(req.query.id);
    const product = await Product.find({
      packId: req.query.id,
    });
    console.log(product);

    res.status(200).json({ success: true, pack: product });
  } catch {
    console.log('failed to get packs');
  }
});

router.get('/getPackInfo', async (req, res) => {
  try {
    const pack = await Pack.findById(mongoose.Types.ObjectId(req.query.id));
    res.status(200).json({ success: true, pack });
  } catch {
    console.log('failed to get packs');
  }
});

router.post('/getPacks', async (req, res) => {
  try {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
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
      Pack.find(findArgs)
        .find({ title: { $regex: '.*' + string + '.*', $options: 'i' } })
        .populate('writer')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, packs) => {
          if (err) return res.status(400).json({ success: false, err });
          res
            .status(200)
            .json({ success: true, packs, postSize: packs.length });
        });
    } else {
      Pack.find(findArgs)
        .populate('writer')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, packs) => {
          if (err) return res.status(400).json({ success: false, err });

          res
            .status(200)
            .json({ success: true, packs, postSize: packs.length });
        });
    }
  } catch (error) {
    console.log('failed to get packs', error);
  }
});
// RETURN ARRAY OF CARDS BEING SELECTED AND ADDS THEM TO PRODUCT
// BUYFROMPACK2 USES THIS ARRAY TO MAP THROUGH AND ADD EACH USER
// COULDNT DO IT ALL IN ONE ROUTE DUE TO ORDER OF OPERATIONS
// WOULD CHECK IF ALL THREE CARDS WERE DUPLICATES FIRST, RETURNING FALSE
// THEN RUN THE FUNCTION THREE TIMES AS IF THE CART HADNT BEEN ADDED, AS IT HADNT
// FUNCION IS RUN 3 TIMES ON FRONT END
router.put('/buyFromPack', auth, async (req, res) => {
  try {
    const pack = await Pack.findById(req.query.id);

    const cardPositionArray = [].concat.apply(
      [],
      pack.remainingCards.map((card, index) => {
        return pack.remainingCards[index].editions.map((edition) => {
          return card.packPosition.toString();
        });
      })
    );

    const editionsArray = [].concat.apply(
      [],
      pack.remainingCards.map((card, index) => {
        return pack.remainingCards[index].editions.map((edition) => {
          return edition.toString();
        });
      })
    );

    const combinedArray = cardPositionArray.map(
      (card, i) => card + editionsArray[i]
    );

    let firstEdition =
      combinedArray[Math.floor(Math.random() * combinedArray.length)];

    let secondEdition =
      combinedArray[Math.floor(Math.random() * combinedArray.length)];

    // LOOP GETTING RANDOM NUMBERS UNTIL IF IS NOT FROM A PREVIOUSLY SELECTED CARD

    while (secondEdition === firstEdition) {
      secondEdition =
        combinedArray[Math.floor(Math.random() * combinedArray.length)];
      if (secondEdition !== firstEdition) {
        break;
      }
    }
    let thirdEdition =
      combinedArray[Math.floor(Math.random() * combinedArray.length)];

    // LOOP GETTING RANDOM NUMBERS UNTIL IF IS NOT FROM A PREVIOUSLY SELECTED CARD
    while (thirdEdition === firstEdition || thirdEdition === secondEdition) {
      thirdEdition =
        combinedArray[Math.floor(Math.random() * combinedArray.length)];
      if (thirdEdition !== firstEdition && thirdEdition !== secondEdition) {
        break;
      }
    }

    // CREATING ARRAY OF CARD INFO
    const selectedCardsInfo = [
      {
        packPosition: parseInt(firstEdition.charAt(0)),
        edition: parseInt(firstEdition.slice(1)),
      },
      {
        packPosition: parseInt(secondEdition.charAt(0)),
        edition: parseInt(secondEdition.slice(1)),
      },
      {
        packPosition: parseInt(thirdEdition.charAt(0)),
        edition: parseInt(thirdEdition.slice(1)),
      },
    ];

    selectedCardsInfo.map((card) => {
      Pack.findOneAndUpdate(
        {
          _id: req.query.id,
          'remainingCards.packPosition': card.packPosition,
        },
        {
          $pull: { 'remainingCards.$.editions': card.edition },
        },
        { new: true },
        (err, pack) => {
          if (err) return res.json({ success: false, err });
          res.status(200);
        }
      );
    });

    selectedCardsInfo.map((card) => {
      Product.find(
        { packId: req.query.id, packPosition: card.packPosition },
        (err, product) => {
          const historyItem = {
            owner: req.user._id,
            price: product[0].price,
            date: Date.now(),
          };
          Product.findOneAndUpdate(
            {
              packPosition: card.packPosition,
              packId: req.query.id,
              'editions.id': mongoose.Types.ObjectId(
                product[0].editions[card.edition - 1].id
              ),
            },
            { $push: { 'editions.$.history': historyItem } },
            { new: true },
            (err, productItem) => {
              if (err) return res.status(500);

              res.status(200);
            }
          );
        }
      );
    });

    res.status(200).json({ success: true, selectedCardsInfo });
  } catch {
    console.log('failed to buy packs');
  }
});

router.put('/addPackCardsToCart', auth, async (req, res) => {
  try {
    const packPosition = req.body.packPosition;

    const editionNumber = req.body.edition;

    const product = await Product.find({
      packId: req.query.id,
      packPosition: packPosition,
    });
    console.log('file: pack.js ~ line 307 ~ router.put ~ product', product);

    const edition = {
      id: product[0].editions[editionNumber - 1].id,
      edition: editionNumber,
      date: Date.now(),
    };
    console.log('file: pack.js ~ line 314 ~ router.put ~ edition', edition);
    const user = await User.findOne({
      _id: req.user._id,
      'cart.id': product[0]._id,
    });
    console.log('file: pack.js ~ line 319 ~ router.put ~ user', user);

    if (user) {
      User.findOneAndUpdate(
        { _id: req.user._id, 'cart.id': product[0]._id },
        { $push: { 'cart.$.ownedEditions': edition } },
        { new: true },
        (err, userInfo) => {
          console.log(
            'file: pack.js ~ line 327 ~ router.put ~ userInfo',
            userInfo
          );
          if (err) return res.json({ success: false, err });
          res.status(200).json({ success: true });
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: product[0]._id,
              ownedEditions: [edition],
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          console.log(
            'file: pack.js ~ line 346 ~ router.put ~ userInfo',
            userInfo
          );
          if (err) return res.json({ success: false, err });
          res.status(200).json({ success: true });
        }
      );
    }
    console.log('success');
  } catch {
    console.log('could not add cards to users cart');
  }
});
module.exports = router;

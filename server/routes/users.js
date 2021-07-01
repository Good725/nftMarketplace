const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { Transaction } = require('../models/Transaction');
const { auth } = require('../middlewares/auth');
const mongoose = require('mongoose');
const config = require('../config/config');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');

//=================================
//             User
//=================================

router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    fullname: req.user.fullname,
    lowercasefullname: req.user.lowercasefullname,
    username: req.user.username,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    shop: req.user.shop,
    links: req.user.links,
    followers: req.user.followers,
    following: req.user.following,
    history: req.user.history,
    money: +req.user.money.toString(),
    dailyrewardpickup: req.user.dailyrewardpickup,
    museum: req.user.museum,
    bio: req.user.bio,
    level: req.user.level,
    firstLogin: req.user.firstLogin,
    createTour: req.user.createTour,
    introCardGuide: req.user.introCardGuide,
    firstLoginTracker: req.user.firstLoginTracker,
    createTourTracker: req.user.createTourTracker,
    introCardGuideTracker: req.user.introCardGuideTracker,
    firstLoginTracker: req.user.firstLoginTracker,
    createTourTracker: req.user.createTourTracker,
    introCardGuideTracker: req.user.introCardGuideTracker,
    accountCategory: req.user.accountCategory,
    token: req.token,
    // cardscreated: req.user.cardscreated,
  });
});

router.post('/register', validate(authValidation.register), (req, res) => {
  const user = new User(req.body);
  console.log(req.body);
  user.save((err, doc) => {
    if (err) {
      console.log('file: users.js ~ line 58 ~ user.save ~ err', err);
      return res.json({ success: false, err: err });
    }
    return res.status(200).json({
      success: true,
    });
  });
});
router.post('/changePassword', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    user.password = req.body.password;
    user.save().then((doc) => res.status(201).json({ success: true }));
  } catch (error) {
    console.log(error);
  }
});

router.post('/checkPassword', auth, async (req, res) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.status(200).json({
          passwordSuccess: false,
          message: 'Wrong password',
        });
      else if (isMatch) {
        return res.status(200).json({ passwordSuccess: true, message: '' });
      }
    });
  });
});
router.post('/login', validate(authValidation.login), (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('w_auth', user.token, {
          httpOnly: true,
          secure: config.env === 'production' ? true : false,
          maxAge: 60 * 60 * 1000, // expire after 1 hour
          path: '/',
          domain:
            config.env === 'production'
              ? 'beta-dbilia.herokuapp.com'
              : 'localhost',
        });
        res.cookie('rt', user.refreshToken, {
          httpOnly: true,
          secure: config.env === 'production' ? true : false,
          maxAge: 1000 * 60 * 60 * 24 * 30, // expire after 30 days
          path: '/',
          domain:
            config.env === 'production'
              ? 'beta-dbilia.herokuapp.com'
              : 'localhost',
        });
        return res.status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    { refreshToken: '', refreshTokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});
router.post('/updateProfileTourProgress', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { firstLoginTracker: 1 } },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
router.post('/updateCreateTourProgress', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { createTourTracker: 1 } },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
router.post('/updateCardTourProgress', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { introCardGuideTracker: 1 } },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.post('/endCardTour', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { introCardGuide: false },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.post('/endTour', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstLogin: false },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log('file: users.js ~ line 149 ~ router.post ~ error', error);
    res.status(500).json({ success: false });
  }
});

router.post('/endCreateTour', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { createTour: false },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log('file: users.js ~ line 149 ~ router.post ~ error', error);
    res.status(500).json({ success: false });
  }
});

router.get('/cardOwner', async (req, res) => {
  try {
    const user = await User.findById(req.query.ownerId);

    res.status(200).json({ user });
  } catch {
    return res.status(500).json({ message: 'Error' });
  }
});

router.post('/getUsers', (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : 'level';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};
  let term = req.body.searchTerm;

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

  if (term) {
    User.find(findArgs)
      .find({ $text: { $search: term } })
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, users) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, users, postSize: users.length });
      });
  } else {
    User.find(findArgs)
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, users) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, users, postSize: users.length });
      });
  }
});

router.get('/addToShop', auth, (req, res) => {
  Product.findByIdAndUpdate(
    { _id: req.query.productId },
    { $inc: { cardscreated: 1 } },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200);
    }
  );
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let duplicate = false;

    userInfo.shop.forEach((item) => {
      if (item.id == req.query.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user._id, 'shop.id': req.query.productId },

        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.shop);
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            shop: {
              id: req.query.productId,
              // quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.shop);
        }
      );
    }
  });
});

router.get('/addToCart', auth, async (req, res) => {
  try {
    await Product.findOne(
      { _id: req.query.productId },
      async (err, product) => {
        // history item being added to purchased edition
        const historyItem = {
          owner: req.user._id,
          username: req.user.username,
          price: product.price,
          date: Date.now(),
        };

        // DOES CARD HAVE INFINITE VERSIONS
        if (product.numberEditions === 10000000000) {
          product = await Product.findOneAndUpdate(
            { _id: req.query.productId },
            {
              $push: {
                editions: {
                  id: new mongoose.Types.ObjectId(),
                  edition: product.sold + 1,
                  marketPrice: 0,
                  history: [historyItem],
                  inMarket: false,
                  minted: false,
                },
              },
              $inc: { sold: 1 },
            },
            { new: true }
          ).populate('writer');
        } else {
          let editionObject = product.editions.find((edition) => {
            return edition.history.length === 0;
          });

          // finds first edition that hasn't been purchased

          if (!editionObject) {
            return res.status(200);
          }
          product = await Product.findOneAndUpdate(
            {
              _id: req.query.productId,
              'editions.id': mongoose.Types.ObjectId(editionObject.id),
            },
            { $push: { 'editions.$.history': historyItem }, $inc: { sold: 1 } },
            { new: true }
          ).populate('writer');
        }
        // CREATING OBJECT THAT WILL BE ADDED TO THE OWNEDEDITIONS
        const edition = {
          id: product.editions[product.sold - 1].id,
          edition: product.editions[product.sold - 1].edition,
          date: Date.now(),
        };

        await User.findOne({ _id: req.user._id }, (err, userInfo) => {
          let duplicate = false;

          userInfo.cart.forEach((item, i) => {
            if (item.id == req.query.productId) {
              duplicate = true;
            }
          });

          if (duplicate) {
            User.findOneAndUpdate(
              { _id: req.user._id, 'cart.id': req.query.productId },
              { $push: { 'cart.$.ownedEditions': edition } },
              { new: true },
              (err, userInfo) => {
                if (err) return res.json({ success: false, err });
                res.status(200).json(userInfo.cart);
              }
            );
          } else {
            User.findOneAndUpdate(
              { _id: req.user._id },
              {
                $push: {
                  cart: {
                    id: req.query.productId,
                    ownedEditions: [edition],
                    date: Date.now(),
                  },
                },
              },
              { new: true },
              (err, userInfo) => {
                if (err) return res.json({ success: false, err });
                res.status(200).json(userInfo.cart);
              }
            );
          }
        });
        const usersBalance = req.user.money.toString();

        const sellersBalance = product.writer.money.toString();
        // ADDING BUYER TRANSACTION
        const transaction = new Transaction({
          user: req.user._id,
          transactionType: 'buy',
          nftTitle: product.title,
          edition: product.sold,
          transactionBalance:
            product.price > +usersBalance
              ? product.price +
                product.price * 0.025 +
                (product.price - +usersBalance) * 0.029 +
                0.3
              : (product.price + product.price * 0.025).toFixed(2),
          usdBalance: (product.price > +usersBalance
            ? 0
            : +usersBalance
          ).toFixed(2),
        });
        await transaction.save();
        // ADDING SELLERS TRANSACTION
        const transaction1 = new Transaction({
          user: product.writer._id,
          transactionType: 'sale',
          nftTitle: product.title,
          edition: product.sold,
          transactionBalance: (product.price - product.price * 0.025).toFixed(
            2
          ),
          usdBalance: (+sellersBalance).toFixed(2),
        });
        await transaction1.save();
      }
    );
  } catch (error) {
    res.status(500).json({ success: false });
    console.log('file: users.js ~ line 520 ~ router.get ~ error', error);
  }
});

router.get('/removeFromCart', auth, (req, res) => {});

router.get('/userCartInfo', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let cart = userInfo.cart;
    let array = cart.map((item) => {
      return item.id;
    });

    Product.find({ _id: { $in: array } })
      .populate('writer')
      .exec((err, cartDetail) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({ success: true, cartDetail, cart });
      });
  });
});
// router.post('/register', (req, res) => {
// 	const user = new User(req.body);

// 	user.save((err, doc) => {
// 		if (err) return res.json({ success: false, err });
// 		return res.status(200).json({
// 			success: true,
// 		});
// 	});
// });

router.get('/addToLinks', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: {
        links: {
          title: req.query.title,
          url: req.query.url,
          idnum: req.query.idnum,
          date: Date.now(),
        },
      },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(userInfo.links);
    }
  );
});

router.get('/removeLink', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      // $pull: {
      // 	links: {
      // 		date: req.query.date,
      // 	},
      // },
      $pull: {
        links: {
          idnum: req.query.idnum,
        },
      },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(userInfo.links);
    }
  );
});

// router.get('/removeFollowing', auth, (req, res) => {
// 	// const query = req.query;
// 	User.findOneAndUpdate(
// 		{ _id: req.user._id },
// 		{
// 			$pull: {
// 				following: {
// 					id: req.query._id,
// 				},
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.cart);
// 		}
// 	);
// });
// router.get('/removeFollower', auth, (req, res) => {
// 	User.findOneAndUpdate(
// 		{ _id: req.query._id },
// 		{
// 			$pull: {
// 				followers: {
// 					id: req.user._id,
// 				},
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.cart);
// 		}
// 	);
// });

router.post('/addCoins', auth, (req, res) => {
  const query = req.query;
  User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
    (user) => {
      res.json({
        confirmation: 'success',
        data: user,
      });
    }
  );
});
// router.post('/addCoinsOther', auth, (req, res) => {
// 	const query = req.query;

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then((user) => {
// 		res.json({
// 			confirmation: 'success',
// 			data: user,
// 		});
// 	});
// });

// router.post('/addCoinsOther', auth, (req, res) => {
// 	const query = req.query;

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then((user) => {
// 		res.json({
// 			confirmation: 'success',
// 			data: user,
// 		});
// 	});
// });

//this works as a get
// router.get('/addCoinsOther', auth, (req, res) => {
// 	const query = req.query;

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }),(err, userInfo) => {
// 		if (err) return res.json({ success: false, err });
// 		res.status(200).json(userInfo.cart);
// 	}
// });

router.get('/addCoinsOther', auth, (req, res) => {
  const query = req.query;
  User.findOneAndUpdate(
    { _id: req.query._id },
    query,
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(userInfo.cart);
    }
  );
});

// router.get('/addCoinsOther', auth, (req, res) => {
// 	User.findOneAndUpdate(
// 		{ _id: req.user._id },
// 		{
// 			$push: {
// 				money: 100
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.cart);
// 		}
// 	);
// });
// router.get('/addCoinsOther', auth, (req, res) => {
// 	User.findOneAndUpdate(
// 		{ _id: req.query._id },
// 		{
// 			$push: {
// 				money: money
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.cart);
// 		}
// 	);
// });

// router.post('/addCoinsOther', auth, (req, res) => {
// 	const query = req.query;

// 		User.findById(id).then((users) => {
// 		return res.status(200).json({ success: true, users });

// 	});

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then((user) => {
// 		res.json({
// 			confirmation: 'success',
// 			data: user,
// 		});
// 	});
// });
// router.get('/addCoinsOther', auth, (req, res) => {

// 	User.findOneAndUpdate(
// 		{ userId: req.query.userId },
// 		{ wallet: req.query.coinBalance },
// 		{
// 			$push: {
// 				money: {
// 					wallet: req.query.coinBalance
// 				},
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.cart);
// 		}
// 	);
// });

// router.get('/addCoinsOther', auth, (req, res) => {
// 	const query = req.query;
// 	const userId = query.id
// 	delete query['id']

// 	User.findByIdAndUpdate(userId, query, {new:true})
// 	res.json({
// 		confirmation: 'success',
// 		data: query,
// 	});
// });

// router.post('/addCoinsOther', auth, (req, res) => {
// 	const id = req.query._id;
// 	const query = req.query;

// 		User.findById(id).then((users) => {

// 		return res.status(200).json({ success: true, users });

// 	});

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then((user) => {
// 		res.json({
// 			confirmation: 'success',
// 			data: user,
// 		});
// 	});
// });

// router.get('/addFollowing', auth, (req, res) => {
// 	// const query = req.query;
// 	User.findOneAndUpdate(
// 		{ _id: req.user._id },
// 		{
// 			$push: {
// 				following: {
// 					id: req.query._id,
// 					date: Date.now(),
// 				},
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.cart);
// 		}
// 	);
// });

// router.get('/getUserById', (req, res) => {
// 	const id = req.query._id;

// 	User.findById(id).then((users) => {
// 		return res.status(200).json({ success: true, users });
// 	});
// });

router.get('/showCoins', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let money = +userInfo.money.toString();
    res.json({
      confirmation: 'success',
      coins: money,
    });
  });
});

router.get('/getCoins', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    let money = +doc.money.toString();
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, money });
  });
});

router.get('/getCart', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    let cart = doc.cart;

    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, cart });
  });
});

router.get('/getMuseum', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let museum = userInfo.museum;
    if (err) return res.status(200).send(err);
    return res.status(200).json({ success: true, museum });
  });
});

router.post('/addToMuseum', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let duplicate = false;

    userInfo.museum.forEach((item) => {
      if (item.channelId == req.query.channelId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user._id, 'museum.channelId': req.query.channelId },
        { $inc: { 'museum.$.quantity': 1 } },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.museum);
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            museum: {
              channelId: req.query.channelId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.museum);
        }
      );
    }
  });
});

router.get('/userMuseumInfo', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let cart = userInfo.cart;
    let array = cart.map((item) => {
      return item.id;
    });

    Product.find({ _id: { $in: array } })
      .populate('writer')
      .exec((err, cartDetail) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({ success: true, cartDetail, cart });
      });
  });
});

router.get('/getRole', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    let role = doc.role;
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, role });
  });
});

router.get('/getAvatar', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    let avatar = doc.image;
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, avatar });
  });
});

router.post('/addCoins', auth, (req, res) => {
  const query = req.query;

  User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
    (user) => {
      res.json({
        confirmation: 'success',
        data: user,
      });
    }
  );
});

router.get('/name', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let name = userInfo.name;
    res.json({
      confirmation: 'success',
      name: name,
    });
  });
});

//this on works in the browser
// router.get('/getName', auth, (req, res) => {
// 	const query = req.query;

// 	User.find(query).then((users) => {
// 		res.json({
// 			confirmation: 'success',
// 			users: users,
// 		});
// 	});
// });

router.get('/getName', (req, res) => {
  const query = req.query;

  User.find(query).then((users) => {
    return res.status(200).json({ success: true, users });
  });
});

router.get('/getUserById', (req, res) => {
  const id = req.query._id;

  User.findById(id).then((users) => {
    return res.status(200).json({ success: true, users });
  });
});

// router.get('/getName', auth, (req, res) => {
// 	const query = req.query;

// 	User.find(query).then((err, users) => {
// 		// if (err) return res.status(400).send(err);
// 		// return res.status(200).json({ success: true, users });
// 		if (err) return res.status(400).json({ success: false });
// 		return res.status(200).json({ success: true, users });
// 	});
// });

router.get('/getOtherUser', (req, res) => {
  const query = req.query;

  User.find(query).then((users) => {
    return res.status(200).json({ success: true, users });
  });
});

// router.get('/getName', auth, (req, res) => {
// 	const query = req.query;

// 	User.find({ query }, (users) => {
// 		let user = users;
// 		if (err) return res.status(400).send(err);
// 		return res.status(200).json({ success: true, user });
// 	});
// });

// router.get('/getName', (req, res) => {
// 	const query = req.query;

// 	User.find(query).then((users) => {
// 		let users = users;
// 		if (err) return res.status(400).send(err);
// 		return res.status(200).json({ success: true, users });
// 	});
// });
// router.get('/getName', (req, res) => {
// 	const query = req.query;

// 	User.find(query). ((users) => {
// 		let users = users;
// 		if (err) return res.status(400).send(err);
// 		return res.status(200).json({ success: true, users });
// 	});
// });
// router.get('/getName', (req, res) => {
// 	const query = req.query;
// 	User.find({ query }, (err, doc) => {
// 		let money = doc;
// 		if (err) return res.status(400).send(err);
// 		return res.status(200).json({ success: true, money });
// 	});
// });

// router.get('/showCoins', auth, (req, res) => {
// 	User.findOne({ _id: req.user._id }, (err, userInfo) => {
// 		let money = userInfo.money;
// 		res.json({
// 			confirmation: 'success',
// 			coins: money,
// 		});
// 	});
// });

// router.get('/getCoins', auth, (req, res) => {
// 	User.findOne({ _id: req.user._id }, (err, doc) => {
// 		let money = doc.money;
// 		if (err) return res.status(400).send(err);
// 		return res.status(200).json({ success: true, money });
// 	});
// });

router.post('/user/updateusername', auth, async (req, res) => {
  try {
    const query = req.query;

    const product = await Product.updateMany(
      {},
      {
        $set: {
          'editions.$[].history.$[history].username': req.query.username,
        },
      },
      {
        arrayFilters: [{ 'history.username': req.user.username }],

        multi: true,
      }
    );

    User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
      (user) => {
        // if (err) return res.json({ success: false, err });
        res.json({
          confirmation: 'success',
          data: user,
        });
      }
    );
  } catch (err) {
    console.log('905', err);
  }
});

// router.get('/getDailyReward', auth, (req, res) => {
// 	User.findOne({ _id: req.user._id }, (err, doc) => {
// 		let lastdailypickup = doc.dailyrewardpickup;
// 		if (err) return res.status(400).send(err);
// 		return res.status(200).json({ success: true, lastdailypickup });
// 	});
// });

// router.post('/register', (req, res) => {
// 	const user = new User(req.body);

// 	user.save((err, doc) => {
// 		if (err) return res.json({ success: false, err });
// 		return res.status(200).json({
// 			success: true,
// 		});
// 	});
// });

router.post('/user/updatefullname', auth, (req, res) => {
  const query = req.query;

  User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
    (user) => {
      res.json({
        confirmation: 'success',
        data: user,
      });
    }
  );
});

router.post('/user/updateCategory', auth, async (req, res) => {
  try {
    const query = req.query;

    await User.findOneAndUpdate({ _id: req.user._id }, query, {
      new: true,
    });
    res.status(200).json({
      success: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});
router.post('/user/updatelowercasefullname', auth, (req, res) => {
  const query = req.query;

  User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
    (user) => {
      res.json({
        confirmation: 'success',
        data: user,
      });
    }
  );
});

router.post('/user/updatebio', auth, (req, res) => {
  const query = req.query;

  User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
    (user) => {
      res.json({
        confirmation: 'success',
        data: user,
      });
    }
  );
});

router.post('/user/updateimage', auth, (req, res) => {
  const query = req.query;

  User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
    (user) => {
      res.json({
        confirmation: 'success',
        data: user,
      });
    }
  );
});

// router.post('/user/updateUsername', auth, (req, res) => {
// 	const query = req.query;

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then((user) => {
// 		res.json({
// 			confirmation: 'success',
// 			data: user,
// 		});
// 	});
// });
// router.post('/user/updateBio', auth, (req, res) => {
// 	const query = req.query;

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then((user) => {
// 		res.json({
// 			confirmation: 'success',
// 			data: user,
// 		});
// 	});
// });

router.get('/showDailyReward', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let lastdailypickup = userInfo.dailyrewardpickup;
    res.json({
      confirmation: 'success',
      date: lastdailypickup,
    });
  });
});

router.get('/getDailyReward', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    let lastdailypickup = doc.dailyrewardpickup;
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, lastdailypickup });
  });
});

router.post('/updatedailyreward', auth, (req, res) => {
  const query = req.query;

  User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
    (user) => {
      res.json({
        confirmation: 'success',
        data: user,
      });
    }
  );
});

router.post('/searchUser', (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};
  let term = req.body.searchString;

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
  if (term !== '') {
    User.find(findArgs)
      .find({ username: { $regex: '.*' + term + '.*', $options: 'i' } })
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, users) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, users, postSize: users.length });
      });
  } else {
    User.find(findArgs)
      .find()
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(0)
      .exec((err, users) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, users, postSize: users.length });
      });
  }
});

router.post('/getUsers', (req, res) => {
  User.find().exec((err, user) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, users });
  });
});

router.post('/getOtherUsers', (req, res) => {
  User.find().exec((err, user) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, users });
  });
});

// router.get('/addToCart', auth, (req, res) => {
// 	Product.findByIdAndUpdate({ _id: req.query.productId }, { $inc: { sold: 1 } }, { new: true }, (err, userInfo) => {
// 		if (err) return res.json({ success: false, err });
// 		res.status(200);
// 	});
// 	User.findOne({ _id: req.user._id }, (err, userInfo) => {
// 		let duplicate = false;

// 		console.log(userInfo);

// 		userInfo.cart.forEach((item) => {
// 			if (item.id == req.query.productId) {
// 				duplicate = true;
// 			}
// 		});

// 		if (duplicate) {
// 			User.findOneAndUpdate(
// 				{ _id: req.user._id, 'cart.id': req.query.productId },
// 				{ $inc: { 'cart.$.quantity': 1 } },
// 				{ new: true },
// 				(err, userInfo) => {
// 					if (err) return res.json({ success: false, err });
// 					res.status(200).json(userInfo.cart);
// 				}
// 			);
// 		} else {
// 			User.findOneAndUpdate(
// 				{ _id: req.user._id },
// 				{
// 					$push: {
// 						cart: {
// 							id: req.query.productId,
// 							quantity: 1,
// 							date: Date.now(),
// 						},
// 					},
// 				},
// 				{ new: true },
// 				(err, userInfo) => {
// 					if (err) return res.json({ success: false, err });
// 					res.status(200).json(userInfo.cart);
// 				}
// 			);
// 		}
// 	});
// });

router.get('/addFollowing', auth, (req, res) => {
  // const query = req.query;
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: {
        following: {
          id: req.query._id,
          date: Date.now(),
        },
      },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(userInfo.cart);
    }
  );
});
router.get('/addFollower', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.query._id },
    {
      $push: {
        followers: {
          id: req.user._id,
          num: '109',
          date: Date.now(),
        },
      },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(userInfo.cart);
    }
  );
});

// router.get('/removeFromCart', auth, (req, res) => {
// 	User.findOneAndUpdate(
// 		{ _id: req.user._id },
// 		{
// 			$pull: { cart: { id: req.query._id } },
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			let cart = userInfo.cart;
// 			let array = cart.map((item) => {
// 				return item.id;
// 			});

// 			Product.find({ _id: { $in: array } })
// 				.populate('writer')
// 				.exec((err, cartDetail) => {
// 					return res.status(200).json({
// 						cartDetail,
// 						cart,
// 					});
// 				});
// 		}
// 	);
// });

router.get('/removeFollowing', auth, (req, res) => {
  // const query = req.query;
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        following: {
          id: req.query._id,
        },
      },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(userInfo.cart);
    }
  );
});
router.get('/removeFollower', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.query._id },
    {
      $pull: {
        followers: {
          id: req.user._id,
        },
      },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(userInfo.cart);
    }
  );
});

router.post('/updateLevel', auth, (req, res) => {
  const query = req.query;

  User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then(
    (user) => {
      res.json({
        confirmation: 'success',
        data: user,
      });
    }
  );
});

//Success Buy

// router.post('/successBuy', auth, (req, res) => {
// 	let history = [];
// 	let transactionData = {};

// 	req.body
// })
// router.get('/successBuy', auth, (req, res) => {
// 	User.findOneAndUpdate(
// 		{ _id: req.query._id },
// 		{
// 			$push: {
// 				followers: {
// 					id: req.user._id,
// 					date: Date.now(),
// 				},
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.cart);
// 		}
// 	);
// });

// router.get('/addToLinks', auth, (req, res) => {
// 	User.findOneAndUpdate(
// 		{ _id: req.user._id },
// 		{
// 			$push: {
// 				links: {
// 					title: req.query.title,
// 					url: req.query.url,
// 					idnum: req.query.idnum,
// 					date: Date.now(),
// 				},
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.links);
// 		}
// 	);
// });

// router.get('/addFollower', auth, (req, res) => {
// 	User.findOneAndUpdate(
// 		{ _id: req.query._id },
// 		{
// 			$push: {
// 				followers: {
// 					id: req.user._id,
// 					date: Date.now(),
// 				},
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.cart);
// 		}
// 	);
// });

// router.post('/addCoins', auth, (req, res) => {
// 	const query = req.query;

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then((user) => {
// 		res.json({
// 			confirmation: 'success',
// 			data: user,
// 		});
// 	});
// });

// router.post('/successfulPurchase', auth, (req, res) => {
// 	const query = req.query;

// 	User.findOneAndUpdate({ _id: req.user._id }, query, { new: true }).then((user) => {
// 		res.json({
// 			confirmation: 'success',
// 			data: user,
// 		});
// 	});
// });
// router.get('/successfulPurchase', auth, (req, res) => {
// 	User.findOneAndUpdate(
// 		{ _id: req.user._id },
// 		{
// 			$push: {
// 				history: {
// 					Paid: req.query.PriceValue,
// 					email: req.query.data.email,
// 					address: req.query.address,
// 					cancelled: req.query.cancelled,
// 					paid: req.query.paid,
// 					payerID: req.query.payerId,
// 					paymentID: req.query.paymentID,
// 					paymentToken: req.query.paymentToken,
// 					returnUrl: req.query.returnUrl,
// 					// quantity: 1,
// 					date: Date.now(),
// 				},
// 			},
// 		},
// 		{ new: true },
// 		(err, userInfo) => {
// 			if (err) return res.json({ success: false, err });
// 			res.status(200).json(userInfo.history);
// 		}
// 	);
// });

router.get('/successfulPurchase', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: {
        history: {
          amount: req.query.PriceValue,
          email: req.query.email,
          address: req.query.address,
          cancelled: req.query.cancelled,
          paid: req.query.paid,
          payerID: req.query.payerID,
          paymentID: req.query.paymentID,
          paymentToken: req.query.paymentToken,
          returnUrl: req.query.returnUrl,

          // quantity: 1,
          date: Date.now(),
        },
      },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(userInfo.history);
    }
  );
});

// router.get('/getReward', auth, (req, res) => {
// 	User.findOne({ _id: req.user._id }, (err, userInfo) => {
// 		let duplicate = false;

// 		console.log(userInfo);

// 		userInfo.cart.forEach((item) => {
// 			if (item.id == req.query.productId) {
// 				duplicate = true;
// 			}
// 		});

// 		if (duplicate) {
// 			User.findOneAndUpdate(
// 				{ _id: req.user._id, 'cart.id': req.query.productId },
// 				{ $inc: { 'cart.$.quantity': 1 } },
// 				{ new: true },
// 				(err, userInfo) => {
// 					if (err) return res.json({ success: false, err });
// 					res.status(200).json(userInfo.cart);
// 				}
// 			);
// 		} else {
// 			User.findOneAndUpdate(
// 				{ _id: req.user._id },
// 				{
// 					$push: {
// 						cart: {
// 							id: req.query.productId,
// 							quantity: 1,
// 							date: Date.now(),
// 						},
// 					},
// 				},
// 				{ new: true },
// 				(err, userInfo) => {
// 					if (err) return res.json({ success: false, err });
// 					res.status(200).json(userInfo.cart);
// 				}
// 			);
// 		}
// 	});
// });

router.patch('/updateMoney', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.query.id },
      {
        $inc: {
          money:
            req.query.increment === 'true' ? req.query.money : -req.query.money,
        },
      },
      { new: true }
    );

    res.status(200).json({ money: +user.money.toString() });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post('/setDeposit', auth, async (req, res) => {
  try {
    const transaction = new Transaction({
      user: req.user._id,
      transactionType: 'deposit',
      transactionBalance: req.body.amount,
      usdBalance: req.user.money,
      institution: 'Paypal',
    });

    await transaction.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post('/setWithdrawal', auth, async (req, res) => {
  try {
    const transaction = new Transaction({
      user: req.user._id,
      transactionType: 'withdrawal',
      transactionBalance: req.body.amount.toFixed(2),
      usdBalance: req.user.money,
      institution: 'Paypal',
    });

    await transaction.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;

const express = require('express');
const config = require('./config/config');
const logger = require('./startup/logs');
const db = require('./startup/db');
const { Product } = require('./models/Product');
const { User } = require('./models/User');
const { Transaction } = require('./models/Transaction');
const app = express();
const mongoose = require('mongoose');
const io = require('socket.io')(3001, {
  cors: {
    origin:
      config.env === 'development' || config.env === 'test'
        ? 'http://localhost:3000'
        : 'https://backcreatorsapp.herokuapp.com',
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  const clientArray = [...io.sockets.sockets.keys()];

  let clientNumber = Math.floor(Math.random() * (clientArray.length - 1 + 1));

  socket.on('set', async (item) => {
    try {
      if (item._id === clientArray[clientNumber]) {
        const product = await Product.findById(item.product._id).populate(
          'writer'
        );

        const sortedItems = product.auctionHistory.sort(function (a, b) {
          return b.bid - a.bid;
        });

        sortedItems.forEach(async (bidItem, index) => {
          const editionId = product.editions[index].id;
          const user = await User.findById(bidItem.userId);

          const historyItem = {
            owner: bidItem.userId,
            username: user.username,
            price: bidItem.bid,
            date: Date.now(),
          };

          Product.findOneAndUpdate(
            {
              _id: item.product._id,
              'editions.id': mongoose.Types.ObjectId(editionId),
            },
            {
              $push: { 'editions.$.history': historyItem },
              sold: sortedItems.length,
            },
            { new: true },
            (err, product) => {}
          );

          const edition = {
            id: product.editions[index].id,
            edition: index + 1,
            date: Date.now(),
          };

          setTimeout(async () => {
            User.findOne(
              {
                username: bidItem.username,
                'cart.id': product._id.toString(),
              },
              (err, user1) => {
                if (user1) {
                  User.findOneAndUpdate(
                    { _id: bidItem.userId, 'cart.id': product._id.toString() },
                    {
                      $push: { 'cart.$.ownedEditions': edition },
                    },
                    { new: true },
                    async (err, userInfo) => {
                      const transaction = new Transaction({
                        user: userInfo._id,
                        transactionType: 'won',
                        nftTitle: product.title,
                        edition: index + 1,
                        transactionBalance: bidItem.bid,
                        usdBalance: userInfo.money,
                      });
                      await transaction.save();
                      // ADDING SELLERS TRANSACTION
                      const transaction1 = new Transaction({
                        user: product.writer._id,
                        transactionType: 'sale',
                        nftTitle: product.title,
                        edition: index + 1,
                        transactionBalance: (
                          +bidItem.bid -
                          +bidItem.bid * 0.025
                        ).toFixed(2),
                        usdBalance: (
                          +product.writer.money +
                          (+bidItem.bid - +bidItem.bid * 0.025)
                        ).toFixed(2),
                      });
                      await transaction1.save();
                    }
                  );
                } else {
                  User.findOneAndUpdate(
                    { _id: bidItem.userId },
                    {
                      $push: {
                        cart: {
                          id: product._id.toString(),
                          ownedEditions: [edition],
                          date: Date.now(),
                        },
                      },
                    },
                    { new: true },
                    async (err, userInfo) => {
                      // winning card
                      const transaction = new Transaction({
                        user: userInfo._id,
                        transactionType: 'won',
                        nftTitle: product.title,
                        edition: index + 1,
                        transactionBalance: bidItem.bid,
                        usdBalance: userInfo.money,
                      });
                      await transaction.save();

                      // ADDING SELLERS TRANSACTION
                      const transaction1 = new Transaction({
                        user: product.writer._id,
                        transactionType: 'sale',
                        nftTitle: product.title,
                        edition: index + 1,
                        transactionBalance: bidItem.bid,
                        usdBalance: (
                          +product.writer.money +
                          (+bidItem.bid - +bidItem.bid * 0.025)
                        ).toFixed(2),
                      });
                      await transaction1.save();
                    }
                  );
                }
              }
            );
          }, 1000 * index);

          // PAYING THE CREATOR
          await User.findByIdAndUpdate(
            product.writer._id,
            {
              $inc: { money: bidItem.bid - bidItem.bid * 0.025 },
            },
            { new: true }
          );

          setTimeout(async () => {
            Product.findOneAndUpdate(
              {
                'auctionHistory.bidId': mongoose.Types.ObjectId(bidItem.bidId),
              },
              { auctionHistory: [] },

              { new: true },
              (err, product) => {}
            );
          }, 1000 * index + 1000);
        });
        console.log('success');
      } else {
        console.log('sent id', item._id);
        console.log('random id', clientArray[clientNumber]);
      }
    } catch (error) {
      console.log('socket error', error);
    }
  });
  const clientArray2 = [...io.sockets.sockets.keys()];

  let clientNumber2 = Math.floor(Math.random() * (clientArray2.length - 1 + 1));

  socket.on('set2', async (item) => {
    try {
      if (item._id === clientArray2[clientNumber2]) {
        const { editionObject } = item;
        const bidItem = editionObject.auctionHistory[0];
        const product = await Product.findOne({
          'editions.auctionHistory.bidId': mongoose.Types.ObjectId(
            bidItem.bidId
          ),
        }).populate('writer');
        console.log(
          'sellerid',
          editionObject.history[editionObject.history.length - 1].owner
        );
        const user = await User.findById(bidItem.userId);

        // paying seller
        const seller = await User.findByIdAndUpdate(
          editionObject.history[editionObject.history.length - 1].owner,
          {
            $inc: {
              money: +bidItem.bid - +bidItem.bid * 0.025,
            },
          },
          { new: true }
        );

        // paying seller
        const payingSeller = new Transaction({
          user: seller._id,
          transactionType: 'sale',
          nftTitle: product.title,
          edition: editionObject.edition,
          transactionBalance: (+bidItem.bid - +bidItem.bid * 0.025).toFixed(2),
          usdBalance: +seller.money,
        });
        await payingSeller.save();
        const historyItem = {
          owner: bidItem.userId,
          username: user.username,
          price: bidItem.bid,
          date: Date.now(),
        };

        const product2 = await Product.findOneAndUpdate(
          {
            _id: product._id,
            'editions.id': mongoose.Types.ObjectId(editionObject.id),
          },
          {
            $push: { 'editions.$.history': historyItem },
          },
          { new: true }
        );

        const edition = {
          id: editionObject.id,
          edition: editionObject.edition,
          date: Date.now(),
        };

        await User.findOne(
          {
            username: bidItem.username,
            'cart.id': product._id.toString(),
          },
          async (err, user1) => {
            // if user already has a version of this card
            if (user1) {
              ('already has card');
              await User.findOneAndUpdate(
                { _id: bidItem.userId, 'cart.id': product._id.toString() },
                {
                  $push: { 'cart.$.ownedEditions': edition },
                },
                { new: true },
                async (err, userInfo) => {
                  //  buyer
                  const transaction = new Transaction({
                    user: userInfo._id,
                    transactionType: 'won',
                    nftTitle: product.title,
                    edition: editionObject.edition,
                    transactionBalance: (
                      +bidItem.bid +
                      +bidItem.bid * 0.025
                    ).toFixed(2),
                    usdBalance: userInfo.money,
                  });

                  await transaction.save();
                }
              );
            } else {
              await User.findOneAndUpdate(
                { _id: bidItem.userId },
                {
                  $push: {
                    cart: {
                      id: product._id.toString(),
                      ownedEditions: [edition],
                      date: Date.now(),
                    },
                  },
                },
                { new: true },
                async (err, userInfo) => {
                  // winning card
                  const transaction = new Transaction({
                    user: userInfo._id,
                    transactionType: 'won',
                    nftTitle: product.title,
                    edition: editionObject.edition,
                    transactionBalance: (
                      +bidItem.bid +
                      +bidItem.bid * 0.025
                    ).toFixed(2),
                    usdBalance: userInfo.money,
                  });

                  await transaction.save();
                }
              );
            }
          }
        );

        const user1 = await User.findByIdAndUpdate(
          product.writer._id,
          {
            $inc: { money: bidItem.bid * (product.royalties / 100) },
          },
          { new: true }
        );
        const royalties = new Transaction({
          user: product.writer._id,
          transactionType: 'royalties',
          nftTitle: product.title,
          edition: editionObject.edition,
          transactionBalance: bidItem.bid * (product.royalties / 100),
          usdBalance: user1.money,
        });
        await royalties.save();

        await payingSeller.save();

        setTimeout(async () => {
          await Product.findOneAndUpdate(
            {
              'editions.auctionHistory.bidId': mongoose.Types.ObjectId(
                bidItem.bidId
              ),
            },
            { 'editions.$.auctionHistory': [], 'editions.$.auction': 'false' },

            { new: true },
            (err, product) => {
              console.log(
                'file: index.js ~ line 315 ~ setTimeout ~ product',
                product
              );
            }
          );
        }, 5000);

        console.log('success');
      } else {
        console.log('sent id', item._id);
        console.log('random id', clientArray2[clientNumber2]);
      }
    } catch (error) {
      console.log('socket error', error);
    }
  });
});
require('./startup/routes')(app);

let isAppGoingToBeClosed = false;

const server = app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);
  db().start();
  if (process.send) {
    // send the ready signal to PM2
    process.send('ready');
  }
});

app.use(function (req, res, next) {
  // stop processing requests when server is ready to shut down
  if (isAppGoingToBeClosed) {
    res.set('Connection', 'close');
  }
  next();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('unexpectedErrorHandler, server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

const shutDown = () => {
  logger.info('Received kill signal, shutting down gracefully');
  isAppGoingToBeClosed = true;
  // if pm2 receives reload signal, shutdown db and server
  if (server) {
    db().close();
    server.close(function (err) {
      logger.info('server closed');
      process.exit(err ? 1 : 0);
    });
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

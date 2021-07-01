const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const httpStatus = require('http-status');
const config = require('../config/config');
const { authLimiter } = require('../middlewares/rateLimiter');
const ApiError = require('../utils/ApiError');

module.exports = function (app) {
  app.use(cors({ origin: true, credentials: true }));
  // parse json request body
  app.use(express.json());
  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  // set security HTTP headers
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       directives: {
  //         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  //         "img-src": ["'self'", "res.cloudinary.com"],
  //       },
  //     },
  //   })
  // );
  // sanitize mongodb queries
  app.use(mongoSanitize());
  // gzip compression
  app.use(compression());

  // limit repeated failed requests to auth endpoints
  if (config.env === 'production') {
    app.use('/auth', authLimiter);
  }

  app.use('/api/users', require('../routes/users'));
  app.use('/api/product', require('../routes/product'));
  app.use('/api/market', require('../routes/marketPlace'));
  app.use('/api/pack', require('../routes/pack'));
  app.use('/api/payouts', require('../routes/payouts'));
  app.use('/api/infinite', require('../routes/infinite'));
  app.use('/api/transactions', require('../routes/transactions'));
  app.use('/api/payments', require('../routes/payments'));
  //use this to show the image you have in node js server to client (react js)
  //https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
  app.use('/uploads', express.static('uploads'));

  if (config.env === 'production') {
    // Serve static assets if in production
    app.use(express.static('client/build'));
    // index.html for all page routes
    app.get('*', (req, res) => {
      res.sendFile(
        path.resolve(__dirname, '../../client', 'build', 'index.html'),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );
    });
  }
  app.get('/_health', (req, res) => {
    res.status(200).send('ok');
  });
  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
  });
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });
  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });
};

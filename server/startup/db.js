const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../startup/logs');

const db = () => {
  const start = () => {
    mongoose.set('useUnifiedTopology', true);
    mongoose
      .connect(
        config.env == 'production'
          ? config.mongoose.prod
          : config.mongoose.dev,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
        }
      )
      .then(() => logger.info('MongoDB connected...'))
      .catch((err) => logger.error(err));
  };

  const close = () => {
    mongoose.connection.close();
    logger.info('MongoDB closed...');
  };

  return {
    start,
    close,
  };
};

module.exports = db;

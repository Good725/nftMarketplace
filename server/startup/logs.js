const { createLogger, transports, format } = require('winston');
require('winston-mongodb');
require('express-async-errors');

let date = new Date().toISOString();
const logFormat = format.printf(function (info) {
  return `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}\n`;
});
// Turns an unhandledrejection into a unhandled exception
// allowing winston to catch it
process.on('unhandledRejection', (ex) => {
  throw ex;
});
const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new transports.File({ filename: 'logfile.log' }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'uncaughtExceptions.log' }),
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
  ],
});

module.exports = logger;

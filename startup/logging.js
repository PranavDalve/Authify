const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
require('express-async-errors');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(({ message }) => {
            return `${message}`;
          })
        )
      }),
    new transports.File({ filename: 'logfile.log' }),
    new transports.MongoDB({
      db: 'mongodb://localhost/auth-service-api',
      level: 'error',
      collection: 'log'
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'uncaughtExceptions.log' }),
    new transports.MongoDB({
      db: 'mongodb://localhost/auth-service-api',
      level: 'error',
      collection: 'uncaughtExceptions'
    })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'unhandledRejections.log' }),
    new transports.MongoDB({
      db: 'mongodb://localhost/auth-service-api',
      level: 'error',
      collection: 'unhandledRejections'
    })
  ]
});

module.exports = logger;

const mongoose = require('mongoose');
const logger = require('./logging');
const config = require('./config');
require('dotenv').config()

module.exports = function () {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => logger.info('Connected to MongoDB...'))
  .catch(err => logger.error('Could not connect to MongoDB:', err));
};
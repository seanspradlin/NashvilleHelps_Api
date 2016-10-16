'use strict';
const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.url);

module.exports = mongoose;

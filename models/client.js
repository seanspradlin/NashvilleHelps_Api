'use strict';
const mongoose = require('../lib/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    first: String,
    last: String,
  },
  email: String,
  address: String,
  phone: String,
  assistant: String,
  referral: [{
    isComplete: {
      type: Boolean,
      default: false,
    },
    requested: Date,
    service: Schema.Types.ObjectId,
  }],
});

module.exports = mongoose.model('Client', schema);

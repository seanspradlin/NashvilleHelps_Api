'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    first: String,
    last: String,
  },
  email: String,
  phone: String,
  agency: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});


module.exports = mongoose.model('User', schema);


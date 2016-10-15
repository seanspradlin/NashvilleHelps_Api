'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const schema = new Schema({
  name: {
    first: String,
    last: String,
  },
  email: String,
  password: String,
  phone: String,
  agency: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

schema.methods.generateHash = function generateHash(password) {
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function validPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', schema);


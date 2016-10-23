const mongoose = require('../lib/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    postal: String,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Agency', schema);

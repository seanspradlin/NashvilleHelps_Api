const mongoose = require('../lib/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    first: String,
    last: String,
  },
  email: String,
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    postal: String,
  },
  phone: String,
  assistant: String,
  referrals: [{
    is_complete: {
      type: Boolean,
      default: false,
    },
    agency: Schema.Types.ObjectId,
    requested: Date,
    service: Schema.Types.ObjectId,
    service_name: String,
    notes: String,
  }],
  is_fulfilled: {
    type: Boolean,
    default: false,
  },
  date_completed: Date,
  date_created: Date,
  client_notes: String,
});

module.exports = mongoose.model('Client', schema);


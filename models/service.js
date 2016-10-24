const mongoose = require('../lib/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  category: String,
});

module.exports = mongoose.model('Service', schema);


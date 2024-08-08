const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
      type: String,
      default: '',
    },
    number: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    product: {
      type: String,
      default: '',
    },
  });

  module.exports = mongoose.model('Lead', leadSchema);

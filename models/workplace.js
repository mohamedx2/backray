const mongoose = require('mongoose');

const workplaceSchema = new mongoose.Schema({
  location_name: {
    type: String,
    required: true
  },
  map_link: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  shifts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift'
  }]
});

module.exports = mongoose.model('Workplace', workplaceSchema);

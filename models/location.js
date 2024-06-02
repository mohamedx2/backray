const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  workplaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workplace'
  }]
});

module.exports = mongoose.model('Location', locationSchema);

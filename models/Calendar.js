const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // You can use 'String' type to store time in 'HH:MM' format
    required: true
  },
  endTime: {
    type: String, // You can use 'String' type to store time in 'HH:MM' format
    required: true
  }
}, {
  timestamps: true
});

const Calendar = mongoose.model('Calendar', CalendarSchema);

module.exports = Calendar;

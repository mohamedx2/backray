const Calendar = require('../models/Calendar'); // Import the Calendar model

module.exports.createCalendar = async (req, res) => {
  const { detail, type, date, startTime, endTime } = req.body;
  
  try {
    const newCalendarEntry = new Calendar({
      owner: req.decodedToken.userId,
      detail,
      type,
      date,
      startTime,
      endTime
    });

    const savedCalendarEntry = await newCalendarEntry.save();
    res.status(201).json(savedCalendarEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getCalendarsByUser = async (req, res) => {
  try {
    const calendars = await Calendar.find({ owner: req.decodedToken.userId });
    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getAllCalendars = async (req, res) => {
  try {
    const calendars = await Calendar.find();
    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getCalendarById = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id).populate('owner', 'username email');
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar entry not found' });
    }
    res.status(200).json(calendar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.updateCalendar = async (req, res) => {
  if (req.body.owner !== req.decodedToken.userId) return req.status(404).json({ message: 'Not the user' });

  try {
    const updatedCalendar = await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCalendar) {
      return res.status(404).json({ message: 'Calendar entry not found' });
    }
    res.status(200).json(updatedCalendar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.deleteCalendar = async (req, res) => {
  try {
    const deletedCalendar = await Calendar.findByIdAndDelete(req.params.id);
    if (!deletedCalendar) {
      return res.status(404).json({ message: 'Calendar entry not found' });
    }
    res.status(200).json({ message: 'Calendar entry deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

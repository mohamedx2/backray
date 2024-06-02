const Calendar = require('../models/Calendar'); // Adjust this path as necessary
const User = require('../models/user'); // Adjust this path as necessary

// Get users not working in a specified time range
module.exports.getUsersNotWorkingInTimeRange = async (req, res) => {
  const { startDate, endDate } = req.body; // Using req.body to fetch parameters
  
  try {
    // Validate the date inputs
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find all calendar entries within the specified time range
    const calendarsInTimeRange = await Calendar.find({
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    // Extract unique worker IDs from the calendar entries
    const workerIdsInTimeRange = [...new Set(calendarsInTimeRange.flatMap(calendar => calendar.workers))];

    // Find all users who are not assigned to calendars in the time range
    const usersNotWorking = await User.find({
      _id: { $nin: workerIdsInTimeRange }
    });

    res.status(200).json(usersNotWorking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new calendar entry
module.exports.createCalendar = async (req, res) => {
  const { workers, type, content, startDate, endDate, startTime, endTime } = req.body;
  
  try {
    const newCalendarEntry = new Calendar({
      owner: req.decodedToken.id, // Assuming req.decodedToken contains user information from auth middleware
      workers,
      type,
      content,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime
    });
    const savedCalendarEntry = await newCalendarEntry.save();
    res.status(201).json(savedCalendarEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all calendar entries for a specific user
module.exports.getCalendarsByUser = async (req, res) => {
  try {
    const calendars = await Calendar.find({
      workers: req.decodedToken.id
    }).populate('workers', 'Firstname Lastname email');

    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all calendar entries
module.exports.getAllCalendars = async (req, res) => {
  try {
    const calendars = await Calendar.find().populate('owner workers', 'Firstname Lastname email');
    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a calendar entry by ID
module.exports.getCalendarById = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id).populate('owner workers', 'username email Firstname Lastname');
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar entry not found' });
    }
    res.status(200).json(calendar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a calendar entry
module.exports.updateCalendar = async (req, res) => {
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

// Delete a calendar entry
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

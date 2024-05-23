const express = require('express');
const calendarController = require('../controllers/callenderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.post('/', authMiddleware, calendarController.createCalendar);
router.get('/user', authMiddleware, calendarController.getCalendarsByUser);
router.get('/', authMiddleware, calendarController.getAllCalendars);
router.get('/:id', authMiddleware, calendarController.getCalendarById);
router.put('/:id', authMiddleware, calendarController.updateCalendar);
router.delete('/:id', authMiddleware, calendarController.deleteCalendar);

module.exports = router;
s

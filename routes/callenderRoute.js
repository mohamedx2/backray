const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/callenderController'); // Adjust this path as necessary
const {verifyAdminToken} = require('../middlewares/verifyToken'); // Adjust this path as necessary

router.post('/not-working',verifyAdminToken, calendarController.getUsersNotWorkingInTimeRange);
router.post('/',verifyAdminToken, calendarController.createCalendar);
router.get('/user', calendarController.getCalendarsByUser);
router.get('/',verifyAdminToken, calendarController.getAllCalendars);
router.get('/:id',verifyAdminToken, calendarController.getCalendarById);
router.patch('/:id',verifyAdminToken,  calendarController.updateCalendar); // Protect this route with verifyAdmin
router.delete('/:id',verifyAdminToken,  calendarController.deleteCalendar); // Protect this route with verifyAdmin

module.exports = router;
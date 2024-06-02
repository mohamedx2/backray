const express = require('express');
const router = express.Router();
const Workplace = require('../models/workplace');
const Shift = require('../models/shift');

// Get all workplaces
router.get('/', async (req, res) => {
  try {
    const workplaces = await Workplace.find().populate('shifts');
    res.json(workplaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a workplace by ID
router.get('/:id', getWorkplace, (req, res) => {
  res.json(res.workplace);
});

// Create a new workplace
router.post('/', async (req, res) => {
  const workplace = new Workplace({
    location_name: req.body.location_name,
    map_link: req.body.map_link,
    color: req.body.color,
    shifts: req.body.shifts
  });

  try {
    const newWorkplace = await workplace.save();
    res.status(201).json(newWorkplace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a workplace by ID
router.patch('/:id', getWorkplace, async (req, res) => {
  if (req.body.location_name != null) {
    res.workplace.location_name = req.body.location_name;
  }
  if (req.body.map_link != null) {
    res.workplace.map_link = req.body.map_link;
  }
  if (req.body.color != null) {
    res.workplace.color = req.body.color;
  }
  if (req.body.shifts != null) {
    res.workplace.shifts = req.body.shifts;
  }
  try {
    const updatedWorkplace = await res.workplace.save();
    res.json(updatedWorkplace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a workplace by ID
router.delete('/:id', getWorkplace, async (req, res) => {
  try {
    await res.workplace.remove();
    res.json({ message: 'Deleted Workplace' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a workplace by ID
async function getWorkplace(req, res, next) {
  let workplace;
  try {
    workplace = await Workplace.findById(req.params.id).populate('shifts');
    if (workplace == null) {
      return res.status(404).json({ message: 'Cannot find workplace' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.workplace = workplace;
  next();
}

module.exports = router;

const express = require('express');
const router = express.Router();
const Shift = require('../models/shift');

// Get all shifts
router.get('/', async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a shift by ID
router.get('/:id', getShift, (req, res) => {
  res.json(res.shift);
});

// Create a new shift
router.post('/', async (req, res) => {
  const shift = new Shift({
    name: req.body.name,
    shortcut: req.body.shortcut,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    color: req.body.color
  });

  try {
    const newShift = await shift.save();
    res.status(201).json(newShift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a shift by ID
router.patch('/:id', getShift, async (req, res) => {
  if (req.body.name != null) {
    res.shift.name = req.body.name;
  }
  if (req.body.shortcut != null) {
    res.shift.shortcut = req.body.shortcut;
  }
  if (req.body.start_time != null) {
    res.shift.start_time = req.body.start_time;
  }
  if (req.body.end_time != null) {
    res.shift.end_time = req.body.end_time;
  }
  if (req.body.color != null) {
    res.shift.color = req.body.color;
  }
  try {
    const updatedShift = await res.shift.save();
    res.json(updatedShift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a shift by ID
router.delete('/:id', getShift, async (req, res) => {
  try {
    await res.shift.remove();
    res.json({ message: 'Deleted Shift' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a shift by ID
async function getShift(req, res, next) {
  let shift;
  try {
    shift = await Shift.findById(req.params.id);
    if (shift == null) {
      return res.status(404).json({ message: 'Cannot find shift' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.shift = shift;
  next();
}

module.exports = router;

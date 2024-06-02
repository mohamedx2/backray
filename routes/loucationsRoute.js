const express = require('express');
const router = express.Router();
const Location = require('../models/location');
const Workplace = require('../models/workplace');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().populate({
      path: 'workplaces',
      populate: { path: 'shifts' }
    });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a location by ID
router.get('/:id', getLocation, (req, res) => {
  res.json(res.location);
});

// Create a new location
router.post('/', async (req, res) => {
  const location = new Location({
    name: req.body.name,
    workplaces: req.body.workplaces
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a location by ID
router.patch('/:id', getLocation, async (req, res) => {
  if (req.body.name != null) {
    res.location.name = req.body.name;
  }
  if (req.body.workplaces != null) {
    res.location.workplaces = req.body.workplaces;
  }
  try {
    const updatedLocation = await res.location.save();
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a location by ID
router.delete('/:id', getLocation, async (req, res) => {
  try {
    await res.location.remove();
    res.json({ message: 'Deleted Location' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a location by ID
async function getLocation(req, res, next) {
  let location;
  try {
    location = await Location.findById(req.params.id).populate({
      path: 'workplaces',
      populate: { path: 'shifts' }
    });
    if (location == null) {
      return res.status(404).json({ message: 'Cannot find location' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.location = location;
  next();
}

module.exports = router;

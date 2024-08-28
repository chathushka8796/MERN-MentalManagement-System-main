// routes/activities.js

const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// GET all activities
router.get('/', async (req, res, next) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

// GET a single activity by ID
router.get('/:id', async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

// CREATE a new activity
router.post('/', async (req, res, next) => {
  try {
    const activity = new Activity(req.body);
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    next(err);
  }
});

// UPDATE an existing activity by ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(updatedActivity);
  } catch (err) {
    next(err);
  }
});

// DELETE an activity by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedActivity = await Activity.findByIdAndDelete(id);
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

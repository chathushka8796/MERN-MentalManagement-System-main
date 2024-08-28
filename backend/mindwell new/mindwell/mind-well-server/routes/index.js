// routes/index.js

const express = require('express');
const router = express.Router();
const activitiesRouter = require('./Activities');  // Correctly import the activities router

router.use('/activities', activitiesRouter);

module.exports = router;

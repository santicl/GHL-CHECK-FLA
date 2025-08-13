const express = require('express');
const getClientToken = require('../services/getClientToken');
const getValidAccessToken = require('../services/verifyClientToken');
const getAvailabilityCalendar = require('../controllers/getAvailabilityCalendar');
const router = express.Router();

router.post('/',
    getClientToken,
    getValidAccessToken,
    getAvailabilityCalendar
);

module.exports = router;

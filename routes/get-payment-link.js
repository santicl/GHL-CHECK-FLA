const express = require('express');
const getFormAllByIdSubmissions = require('../middleware/getAllSubmitions');
const validateDateMatches = require('../controllers/validateDateMatches');
const getCustomFields = require('../middleware/getCustomField');
const getAllExperiences = require('../controllers/getAllExperienceByToken');
const getClientToken = require('../services/getClientToken');
const getValidAccessToken = require('../services/verifyClientToken');
const getPaymentLink = require('../controllers/getPaymentLink');
const router = express.Router();

router.post('/',
    getClientToken,
    getValidAccessToken,
    getPaymentLink
);

module.exports = router;

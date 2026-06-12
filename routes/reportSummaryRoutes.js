const express = require('express');
const router = express.Router();
const reportSummaryController = require('../API/reportSummaryController');

router.get('/GetAdminDashboard', reportSummaryController.getAdminDashboard);
router.get('/GetMonthWiseReport', reportSummaryController.getMonthWiseReport);

module.exports = router;

const express = require('express');
const router = express.Router();
const admindashboardController = require('../API/admindashboardController');
const basicAuth = require('../middleware/basicAuth');

router.get('/all_dashboardData_data', basicAuth, admindashboardController.getDashboardData);
module.exports = router;
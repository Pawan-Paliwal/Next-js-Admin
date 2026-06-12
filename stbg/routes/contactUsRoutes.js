// routes/contactUsRoutes.js
const express = require('express');
const router = express.Router();
const contactUsController = require('../API/contactUsController');
const basicAuth = require('../middleware/basicAuth');

router.get('/all-leads', basicAuth, contactUsController.getAllLeads);
router.delete('/delete-enquiry/:ContactID', basicAuth, contactUsController.deleteEnquiry);
router.post('/save-enquiry', basicAuth, contactUsController.saveNewEnquiry);
module.exports = router;
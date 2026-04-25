// routes/contactUsRoutes.js
const express = require('express');
const router = express.Router();
const contactUsController = require('../API/contactUsController');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-leads', verifyToken, contactUsController.getAllLeads);
router.delete('/delete-enquiry/:ContactID', verifyToken, contactUsController.deleteEnquiry);
router.post('/save-enquiry', verifyToken, contactUsController.saveNewEnquiry);
module.exports = router;
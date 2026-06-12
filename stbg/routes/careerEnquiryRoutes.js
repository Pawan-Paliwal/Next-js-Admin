const express = require('express');
const router = express.Router();
const careerEnquiryController = require('../API/careerEnquiryController');
const upload = require('../middleware/upload');
const basicAuth = require('../middleware/basicAuth');


router.get('/all-careerdata', careerEnquiryController.getAllCareerAdminData);
router.delete('/delete-career/:CareerID', basicAuth, careerEnquiryController.deleteCareerData);
router.post(
    '/save-career-enquiry',
    upload.fields([
        { name: 'Resume', maxCount: 1 }
    ]),
    careerEnquiryController.saveNewCareerEnquiry
);


module.exports = router;

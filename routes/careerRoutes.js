const express = require('express');
const router = express.Router();
const careerController = require('../API/careerController');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-career', verifyToken, careerController.getAllCareers);
router.get('/get-career-by-id', verifyToken, careerController.getCareerById);
router.post('/save-or-update-career', verifyToken, careerController.saveOrUpdateCareer);
router.delete('/delete-career/:CareerID', verifyToken, careerController.deleteCareer);
router.post('/update-status', verifyToken, careerController.updateCareerStatus);
router.post('/update-display-order', verifyToken, careerController.updateDisplayOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const careerController = require('../API/careerController');
const upload = require('../middleware/upload');
const basicAuth = require('../middleware/basicAuth');

router.get('/all-career', basicAuth, careerController.getAllCareers);
router.get('/all-careerdata', basicAuth, careerController.getAllCareersdata);
router.delete('/delete-career/:JobCategoryID', basicAuth, careerController.deleteCareer);
router.post(
    '/save-or-update-career',
    upload.fields([
        { name: 'career', maxCount: 1 }
    ]),
    basicAuth,
    careerController.saveOrUpdateCareer
);
router.get('/fill-career-data', basicAuth, careerController.getCareerById);
router.post('/update-display-order', basicAuth, careerController.updateCareerDisplayOrder);
router.post("/update-status", basicAuth, careerController.updateActiveStatus);
router.get("/max-display-order", basicAuth, careerController.getMaxDisplayOrder);
module.exports = router;

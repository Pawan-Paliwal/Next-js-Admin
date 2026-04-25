const express = require('express');
const router = express.Router();
const awardController = require('../API/awardController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

router.get('/all-AwardLogos', verifyToken, awardController.getAllAwardLogo);
router.get('/fill-AwardLogo-data', verifyToken, awardController.getAwardLogoById);
router.post(
    '/save-or-update-AwardLogo',
    upload.fields([
        { name: 'AwardLogoImage', maxCount: 1 }
    ]),
    verifyToken, awardController.saveOrUpdateAwardLogo
);
router.delete('/delete-AwardLogo/:AwardLogoID', verifyToken, awardController.deleteAwardLogo);
router.post("/update-status", verifyToken, awardController.updateActiveStatus);
router.post('/update-display-order', verifyToken, awardController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, awardController.getMaxDisplayOrder);

module.exports = router;

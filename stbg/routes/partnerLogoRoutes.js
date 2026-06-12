const express = require('express');
const router = express.Router();
const partnerLogoController = require('../API/partnerLogoController');
const basicAuth = require('../middleware/basicAuth');
const upload = require('../middleware/upload');

router.get('/all-partnerLogos', basicAuth, partnerLogoController.getAllPartnerLogo);
router.get('/fill-partnerLogo-data', basicAuth, partnerLogoController.getPartnerLogoById);
router.post(
    '/save-or-update-partnerLogo',
    upload.fields([
        { name: 'PartnerLogoImage', maxCount: 1 }
    ]),
    basicAuth, partnerLogoController.saveOrUpdatePartnerLogo
);
router.delete('/delete-partnerLogo/:PartnerLogoID', basicAuth, partnerLogoController.deletePartnerLogo);
router.post("/update-status", basicAuth, partnerLogoController.updateActiveStatus);
router.post('/update-display-order', basicAuth, partnerLogoController.updateDisplayOrder);
router.get('/max-display-order', basicAuth, partnerLogoController.getMaxDisplayOrder);

module.exports = router;

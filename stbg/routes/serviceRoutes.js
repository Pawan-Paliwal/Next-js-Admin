const express = require('express');
const router = express.Router();
const serviceController = require('../API/serviceController');
const basicAuth = require('../middleware/basicAuth');
const upload = require('../middleware/upload');

router.get('/all-services', basicAuth, serviceController.getAllServices);
router.get('/fill-service-data', basicAuth, serviceController.getServiceById);
router.post(
  '/save-or-update-service',
  upload.fields([
    { name: 'ServiceImage', maxCount: 1 },
    { name: 'ServiceBannerImage', maxCount: 1 }
  ]),
  basicAuth,
  serviceController.saveOrUpdateService
);
router.delete('/delete-service/:ServiceID', basicAuth, serviceController.deleteService);
router.post('/update-status', basicAuth, serviceController.updateActiveStatus);
router.post('/update-display-order', basicAuth, serviceController.updateDisplayOrder);
router.get('/max-display-order', basicAuth, serviceController.getMaxDisplayOrder);

module.exports = router;

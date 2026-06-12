const express = require('express');
const router = express.Router();
const mediaController = require('../API/mediaController');
const basicAuth = require('../middleware/basicAuth');
const upload = require('../middleware/upload');

// Get all media items (public - active only)
router.get('/all-media', mediaController.getAllMedia);
router.get('/all-media-admin', basicAuth, mediaController.getAllMediaAdmin);
router.get('/fill-media-data', basicAuth, mediaController.getMediaById);
router.post(
  '/save-or-update-media',
  upload.fields([
    { name: 'MediaImage', maxCount: 1 }
  ]),
  basicAuth,
  mediaController.saveOrUpdateMedia
);
router.delete('/delete-media/:MediaID', basicAuth, mediaController.deleteMedia);
router.post('/update-status', basicAuth, mediaController.updateActiveStatus);
router.post('/update-display-order', basicAuth, mediaController.updateDisplayOrder);
router.get('/max-display-order', basicAuth, mediaController.getMaxDisplayOrder);

module.exports = router;
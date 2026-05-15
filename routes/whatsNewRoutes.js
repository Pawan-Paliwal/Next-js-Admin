const express = require('express');
const router = express.Router();
const whatsNewController = require('../API/whatsNewController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-whatsnew', verifyToken, whatsNewController.getAllWhatsNew);
router.get('/fill-whatsnew-data', verifyToken, whatsNewController.getWhatsNewById);
router.post(
  '/save-or-update-whatsnew',
  upload.fields([
    { name: 'WhatsNewImage', maxCount: 1 },
  ]),
  verifyToken,
  whatsNewController.saveOrUpdateWhatsNew
);
router.post('/update-display-order', verifyToken, whatsNewController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, whatsNewController.getMaxDisplayOrder);
router.delete('/delete-whatsnew/:WhatsNewID', verifyToken, whatsNewController.deleteWhatsNew);
router.post("/update-status", verifyToken, whatsNewController.updateActiveStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const manufacturingController = require('../API/manufacturingController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

router.get('/all-manufacturing', verifyToken, manufacturingController.getAllManufacturing);
router.get('/fill-manufacturing-data', verifyToken, manufacturingController.getManufacturingById);
router.post(
    '/save-or-update-manufacturing',
    upload.fields([
        { name: 'ManufacturingVideoUrl', maxCount: 1 }
    ]),
    verifyToken, manufacturingController.saveOrUpdateManufacturing
);
router.delete('/delete-manufacturing/:ManufacturingID', verifyToken, manufacturingController.deleteManufacturing);
router.post("/update-status", verifyToken, manufacturingController.updateActiveStatus);
router.post('/update-display-order', verifyToken, manufacturingController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, manufacturingController.getMaxDisplayOrder);

module.exports = router;

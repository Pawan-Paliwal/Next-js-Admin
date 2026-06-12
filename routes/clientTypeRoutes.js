const express = require('express');
const router = express.Router();
const clientTypeController = require('../API/clientTypeController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

router.get('/all', verifyToken, clientTypeController.getAllClientTypes);
router.get('/get-by-id', verifyToken, clientTypeController.getClientTypeById);

router.post(
    '/save-or-update',
    upload.fields([
        { name: 'BannerImage', maxCount: 1 },
        { name: 'Image1', maxCount: 1 },
        { name: 'Image2', maxCount: 1 },
        { name: 'Image3', maxCount: 1 },
    ]),
    verifyToken,
    clientTypeController.saveOrUpdateClientType,
);
router.post('/update-display-order', verifyToken, clientTypeController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, clientTypeController.getMaxDisplayOrder);
router.delete('/delete/:ClientTypeID', verifyToken, clientTypeController.deleteClientType);
router.post("/update-status", verifyToken, clientTypeController.updateActiveStatus);

router.get('/active-category', verifyToken, clientTypeController.getActiveTurnkeycategory);
router.get("/turnkey/:slug", verifyToken, clientTypeController.getTurnkeyProjectBySlug);

module.exports = router;

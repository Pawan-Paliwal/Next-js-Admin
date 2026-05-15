const express = require('express');
const router = express.Router();
const clientTypeController = require('../API/clientTypeController');
const verifyToken = require('../middleware/verifyToken');

router.get('/all', verifyToken, clientTypeController.getAllClientTypes);
router.get('/get-by-id', verifyToken, clientTypeController.getClientTypeById);
router.post('/save-or-update', verifyToken, clientTypeController.saveOrUpdateClientType);
router.post('/update-display-order', verifyToken, clientTypeController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, clientTypeController.getMaxDisplayOrder);
router.delete('/delete/:ClientTypeID', verifyToken, clientTypeController.deleteClientType);
router.post("/update-status", verifyToken, clientTypeController.updateActiveStatus);

module.exports = router;

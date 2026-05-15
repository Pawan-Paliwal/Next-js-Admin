const express = require('express');
const router = express.Router();
const clientLogoMappingController = require('../API/clientLogoMappingController');
const verifyToken = require('../middleware/verifyToken');

router.get('/logos-by-type', verifyToken, clientLogoMappingController.getLogosWithAssignment);
router.post('/assign', verifyToken, clientLogoMappingController.assignLogosToType);

module.exports = router;

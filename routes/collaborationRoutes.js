const express = require('express');
const router = express.Router();
const collaborationController = require('../API/collaborationController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-collaborations', verifyToken, collaborationController.getAllCollaborations);
router.get('/fill-collaboration-data', verifyToken, collaborationController.getCollaborationById);
router.post(
  '/save-or-update-collaboration',
  upload.fields([
    { name: 'CollaborationImage', maxCount: 1 },
  ]),
  verifyToken,
  collaborationController.saveOrUpdateCollaboration
);
router.post('/update-display-order', verifyToken, collaborationController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, collaborationController.getMaxDisplayOrder);
router.delete('/delete-collaboration/:CollaborationID', verifyToken, collaborationController.deleteCollaboration);
router.post("/update-status", verifyToken, collaborationController.updateActiveStatus);

module.exports = router;

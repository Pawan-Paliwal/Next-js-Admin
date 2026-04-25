const express = require('express');
const router = express.Router();
const milestoneController = require('../API/milestoneController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-milestones', verifyToken, milestoneController.getAllMilestones);
router.get('/fill-milestone-data', verifyToken, milestoneController.getMilestoneById);
router.post(
  '/save-or-update-milestone',
  upload.fields([
    { name: 'MilestoneImage', maxCount: 1 },
  ]),
  verifyToken,
  milestoneController.saveOrUpdateMilestone
);
router.post('/update-display-order', verifyToken, milestoneController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, milestoneController.getMaxDisplayOrder);
router.delete('/delete-milestone/:MilestoneID', verifyToken, milestoneController.deleteMilestone);
router.post("/update-status", verifyToken, milestoneController.updateActiveStatus);

module.exports = router;

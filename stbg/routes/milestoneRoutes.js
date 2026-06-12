const express = require('express');
const router = express.Router();
const milestoneController = require('../API/milestoneController');
const basicAuth = require('../middleware/basicAuth');
const upload = require('../middleware/upload');

router.get('/all-milestones', basicAuth, milestoneController.getAllMilestones);
router.get('/fill-milestone-data', basicAuth, milestoneController.getMilestoneById);
router.post(
  '/save-or-update-milestone',
  upload.fields([{ name: 'MilestoneImage', maxCount: 1 }]),
  basicAuth,
  milestoneController.saveOrUpdateMilestone
);
router.delete('/delete-milestone/:MilestoneID', basicAuth, milestoneController.deleteMilestone);
router.post('/update-status', basicAuth, milestoneController.updateActiveStatus);
router.post('/update-display-order', basicAuth, milestoneController.updateMilestoneDisplayOrder);
router.get('/max-display-order', basicAuth, milestoneController.getMaxMilestoneDisplayOrder);

module.exports = router;

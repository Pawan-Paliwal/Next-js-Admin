const express = require('express');
const router = express.Router();
const teamController = require('../API/teamController');
const basicAuth = require('../middleware/basicAuth');
const upload = require('../middleware/upload');

router.get('/all-team-members', basicAuth, teamController.getAllTeamMembers);
router.get('/fill-team-data', basicAuth, teamController.getTeamMemberById);
router.post(
    '/save-or-update-team',
    upload.fields([
        { name: 'TeamImage', maxCount: 1 }
    ]),
    basicAuth,
    teamController.saveOrUpdateTeamMember
);
router.delete('/delete-team/:TeamID', basicAuth, teamController.deleteTeamMember);
router.post('/update-status', basicAuth, teamController.updateActiveStatus);
router.post('/update-display-order', basicAuth, teamController.updateDisplayOrder);
router.get('/max-display-order', basicAuth, teamController.getMaxDisplayOrder);

module.exports = router;
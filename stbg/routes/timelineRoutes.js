const express = require('express');
const router = express.Router();
const timelineController = require('../API/timelineController');
const upload = require('../middleware/upload');
const basicAuth = require('../middleware/basicAuth');

router.get('/all-timeline', basicAuth, timelineController.getAllTimelines);
router.get('/all-timelinedata', basicAuth, timelineController.getAllTimelinesdata);
router.delete('/delete-timeline/:TimelineID', basicAuth, timelineController.deleteTimeline);
router.post(
    '/save-or-update-timeline',
    upload.fields([
        { name: 'TimelineImage', maxCount: 1 }
    ]),
    basicAuth,
    timelineController.saveOrUpdateTimeline
);

router.get('/fill-timeline-data', basicAuth, timelineController.getTimelineById);
router.post('/update-display-order', basicAuth, timelineController.updateTimelineDisplayOrder);
router.post("/update-status", basicAuth, timelineController.updateActiveStatus);
router.get("/max-display-order", basicAuth, timelineController.getMaxDisplayOrder);
module.exports = router;

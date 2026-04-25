const express = require('express');
const router = express.Router();
const directorController = require('../API/directorController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-directors', verifyToken, directorController.getAllDirectors);
router.get('/fill-director-data', verifyToken, directorController.getDirectorById);
router.post(
  '/save-or-update-director',
  upload.fields([
    { name: 'DirectorImage', maxCount: 1 },
  ]),
  verifyToken,
  directorController.saveOrUpdateDirector
);
router.post('/update-display-order', verifyToken, directorController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, directorController.getMaxDisplayOrder);
router.delete('/delete-director/:DirectorID', verifyToken, directorController.deleteDirector);
router.post("/update-status", verifyToken, directorController.updateActiveStatus);

module.exports = router;

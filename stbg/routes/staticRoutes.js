const express = require('express');
const router = express.Router();
const multer = require('multer');
const staticController = require('../API/staticController');
const basicAuth = require('../middleware/basicAuth'); // << Import the middleware
const upload = require('../middleware/upload');

/*************************************Admin Panel******************************************************/
router.get('/all-statics', basicAuth, staticController.getAllStatics);
router.get('/fill-static-data', basicAuth, staticController.getStaticById);
router.post(
  '/save-or-update-static',
  upload.fields([
    { name: 'StaticImage', maxCount: 1 },
    { name: 'StaticBannerImage', maxCount: 1 }
  ]),
  staticController.saveOrUpdateStatic
);
router.delete('/delete-static/:StaticID', basicAuth, staticController.deleteStatic);
/*************************************Admin Panel******************************************************/
/*************************************Front End Panel******************************************************/
router.get('/meta_data/:ID', basicAuth, staticController.getMataDataById);
router.get('/meta_data_by_url/:url', basicAuth, staticController.getMataDataByUrl);
/*************************************Front End Panel******************************************************/
module.exports = router;

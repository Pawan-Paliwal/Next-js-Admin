const express = require('express');
const router = express.Router();
const galleryController = require('../API/galleryController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

router.get('/all-gallery', verifyToken, galleryController.getAllGallery);
router.get('/get-gallery-by-id', verifyToken, galleryController.getGalleryById);

router.post(
    '/save-or-update-gallery',
    upload.fields([
        { name: 'galleryImage', maxCount: 1 }
    ]),
    verifyToken, galleryController.saveOrUpdateGallery
);

router.delete('/delete-gallery/:galleryID', verifyToken, galleryController.deleteGallery);
router.post('/update-status', verifyToken, galleryController.updateGalleryStatus);

router.get('/get-photos-by-gallery-id', verifyToken, galleryController.getPhotosByGalleryId);
router.post(
    '/save-gallery-photos',
    upload.fields([
        { name: 'photoImages', maxCount: 100 }
    ]),
    verifyToken, galleryController.saveGalleryPhotos
);
router.delete('/delete-gallery-photo/:photoID', verifyToken, galleryController.deleteGalleryPhoto);

module.exports = router;

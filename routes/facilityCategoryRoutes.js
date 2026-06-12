const express = require('express');
const router = express.Router();
const facilityCategoryController = require('../API/facilityCategoryController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-categories', verifyToken, facilityCategoryController.getAllFacilityCategories);
router.get('/fill-category-data', verifyToken, facilityCategoryController.getFacilityCategoryById);
router.post(
  '/save-or-update-category',
  upload.fields([
    { name: 'CategoryImage', maxCount: 1 },
    { name: 'BannerImage', maxCount: 1 },
  ]),
  verifyToken,
  facilityCategoryController.saveOrUpdateFacilityCategory
);
router.post('/update-display-order', verifyToken, facilityCategoryController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, facilityCategoryController.getMaxDisplayOrder);
router.delete('/delete-category/:CategoryID', verifyToken, facilityCategoryController.deleteFacilityCategory);
router.post("/update-status", verifyToken, facilityCategoryController.updateActiveStatus);
router.get("/activefacility", verifyToken, facilityCategoryController.getAllActiveFacilityCategories);
router.get("/facility/:slug", verifyToken, facilityCategoryController.getFacilityCategoryBySlug);

module.exports = router;

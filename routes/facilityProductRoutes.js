const express = require('express');
const router = express.Router();
const facilityProductController = require('../API/facilityProductController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-products', verifyToken, facilityProductController.getAllFacilityProducts);
router.get('/fill-product-data', verifyToken, facilityProductController.getFacilityProductById);
router.post(
  '/save-or-update-product',
  upload.fields([
    { name: 'FacilityDefaultImage', maxCount: 1 },
    { name: 'FacilityOtherImage1', maxCount: 1 },
    { name: 'FacilityOtherImage2', maxCount: 1 },
    { name: 'FacilityOtherImage3', maxCount: 1 },
  ]),
  verifyToken,
  facilityProductController.saveOrUpdateFacilityProduct
);
router.post('/update-display-order', verifyToken, facilityProductController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, facilityProductController.getMaxDisplayOrder);
router.delete('/delete-product/:ProductID', verifyToken, facilityProductController.deleteFacilityProduct);
router.post("/update-status", verifyToken, facilityProductController.updateActiveStatus);

module.exports = router;

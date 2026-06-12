const express = require('express');
const router = express.Router();
const categoryController = require('../API/categoryController');
const upload = require('../middleware/upload');
const basicAuth = require('../middleware/basicAuth');

router.get('/all-categorys', basicAuth, categoryController.getAllCategorys);
router.get('/fill-category-data', basicAuth, categoryController.getCategoryById);
router.get('/all-categoryData', basicAuth, categoryController.getAllCategoryData);
router.post(
  '/save-or-update-category',
  upload.fields([
    { name: 'CategoryImage', maxCount: 1 }
  ]),
  basicAuth,
  categoryController.saveOrUpdateCategory
);

router.post('/update-display-order', basicAuth, categoryController.updateDisplayOrder);
router.get('/max-display-order', basicAuth, categoryController.getMaxDisplayOrder);
router.delete('/delete-category/:CategoryID', basicAuth, categoryController.deleteCategory);
router.post("/update-status", basicAuth, categoryController.updateActiveStatus);


module.exports = router;
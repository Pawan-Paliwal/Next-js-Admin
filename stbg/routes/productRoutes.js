const express = require('express');
const router = express.Router();
const productController = require('../API/productController');
const sectionItemController = require('../API/sectionItemController');
const basicAuth = require('../middleware/basicAuth');
const upload = require('../middleware/upload');

// Product routes
router.get('/all-products', basicAuth, productController.getAllProducts);
router.get('/get-activeProducts', basicAuth, productController.getActiveProducts);
router.get('/fill-product-data', basicAuth, productController.getProductById);
router.get('/project_data/:slug', basicAuth, productController.getProductBySlug);

router.post(
    '/save-or-update-product',
    upload.fields([
        { name: 'ProductMedia', maxCount: 1 },
        { name: 'Section1MediaUrl', maxCount: 1 },
        { name: 'Section2MediaUrl', maxCount: 1 },
        { name: 'Section3MediaUrl', maxCount: 1 },
        { name: 'Section4MediaUrl', maxCount: 1 }
    ]),
    basicAuth,
    productController.saveOrUpdateProduct
);
router.delete('/delete-product/:ProductId', basicAuth, productController.deleteProduct);
router.post("/update-status", basicAuth, productController.updateActiveStatus);

// Section items routes
router.get('/section-items', basicAuth, sectionItemController.getItemsByProductAndSection);
router.post(
    '/save-or-update-section-item',
    upload.fields([{ name: 'ItemIconUrl', maxCount: 1 }]),
    basicAuth,
    sectionItemController.saveOrUpdateSectionItem
);
router.delete('/delete-section-item/:ItemId', basicAuth, sectionItemController.deleteSectionItem);

module.exports = router;
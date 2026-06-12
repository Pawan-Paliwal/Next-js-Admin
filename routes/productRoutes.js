const express = require("express");
const router = express.Router();
const productController = require("../API/productController");
const productHighlightController = require("../API/productHighlightController");
const productGalleryController = require("../API/productGalleryController");
const productCircuitController = require("../API/productCircuitController");
const productTechnologyController = require("../API/productTechnologyController");
const productDriveController = require("../API/productDriveController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

router.get("/all-products", verifyToken, productController.getAllProducts);
router.get(
  "/get-active-products",
  verifyToken,
  productController.getActiveProducts,
);
router.get("/fill-product-data", verifyToken, productController.getProductById);
router.get("/product/:slug", verifyToken, productController.getProductBySlug);
router.get("/product-data/:slug", productController.getProductBySlugPublic);
router.post(
  "/save-or-update-product",
  upload.fields([
    { name: "ProductMedia", maxCount: 1 },
    { name: "Section1MediaUrl", maxCount: 1 },
    { name: "Section3MediaUrl", maxCount: 1 },
    { name: "Section4MediaUrl", maxCount: 1 },
  ]),
  verifyToken,
  productController.saveOrUpdateProduct,
);

router.delete(
  "/delete-product/:ProductId",
  verifyToken,
  productController.deleteProduct,
);
router.post(
  "/update-product-status",
  verifyToken,
  productController.updateActiveStatus,
);
router.post(
  "/update-display-order",
  verifyToken,
  productController.updateDisplayOrder,
);
router.get(
  "/max-display-order",
  verifyToken,
  productController.getMaxDisplayOrder,
);

router.get(
  "/highlights",
  verifyToken,
  productHighlightController.getHighlightsByProduct,
);
router.post(
  "/save-or-update-highlight",
  verifyToken,
  productHighlightController.saveOrUpdateHighlight,
);
router.delete(
  "/delete-highlight/:HighlightId",
  verifyToken,
  productHighlightController.deleteHighlight,
);
router.post(
  "/update-highlight-status",
  verifyToken,
  productHighlightController.updateActiveStatus,
);

router.get(
  "/gallery",
  verifyToken,
  productGalleryController.getGalleryByProduct,
);
router.post(
  "/save-or-update-gallery",
  upload.fields([{ name: "ImageUrl", maxCount: 1 }]),
  verifyToken,
  productGalleryController.saveOrUpdateGallery,
);
router.delete(
  "/delete-gallery/:GalleryId",
  verifyToken,
  productGalleryController.deleteGallery,
);
router.post(
  "/update-gallery-status",
  verifyToken,
  productGalleryController.updateActiveStatus,
);

router.get(
  "/circuits",
  verifyToken,
  productCircuitController.getCircuitsByProduct,
);
router.post(
  "/save-or-update-circuit",
  upload.fields([{ name: "ImageUrl", maxCount: 1 }]),
  verifyToken,
  productCircuitController.saveOrUpdateCircuit,
);
router.delete(
  "/delete-circuit/:CircuitId",
  verifyToken,
  productCircuitController.deleteCircuit,
);
router.post(
  "/update-circuit-status",
  verifyToken,
  productCircuitController.updateActiveStatus,
);

router.get(
  "/technology",
  verifyToken,
  productTechnologyController.getTechnologyByProduct,
);
router.post(
  "/save-or-update-technology",
  verifyToken,
  productTechnologyController.saveOrUpdateTechnology,
);
router.delete(
  "/delete-technology/:TechnologyId",
  verifyToken,
  productTechnologyController.deleteTechnology,
);
router.post(
  "/update-technology-status",
  verifyToken,
  productTechnologyController.updateActiveStatus,
);

router.get("/drives", verifyToken, productDriveController.getDrivesByProduct);
router.post(
  "/save-or-update-drive",
  upload.fields([
    { name: "IconImage", maxCount: 1 },
    { name: "DefaultImage", maxCount: 1 },
  ]),
  verifyToken,
  productDriveController.saveOrUpdateDrive,
);
router.delete(
  "/delete-drive/:DriveId",
  verifyToken,
  productDriveController.deleteDrive,
);
router.post(
  "/update-drive-status",
  verifyToken,
  productDriveController.updateActiveStatus,
);

module.exports = router;

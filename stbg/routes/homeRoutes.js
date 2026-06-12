const express = require("express");
const router = express.Router();
const homePageController = require("../API/homePageController");
const basicAuth = require("../middleware/basicAuth");

router.get("/all-homedata", basicAuth, homePageController.getHomeData);
router.get("/all-product", basicAuth, homePageController.getProductSectionData);
router.get("/all-headerproduct", basicAuth, homePageController.getProductHeaderSectionData);
router.get("/all-aboutusdata", basicAuth, homePageController.getAboutPageData);
router.get("/footer-data", basicAuth, homePageController.getFooterProducts);


module.exports = router;

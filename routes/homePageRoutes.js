const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const homePageController = require("../API/homePageController");

router.get("/home-data", verifyToken, homePageController.getHomePageData);
router.get("/about-data", verifyToken, homePageController.getAboutPageData);
router.get("/client-data", verifyToken, homePageController.getClientPageData);
router.get("/whatsnew-data", verifyToken, homePageController.getWhatsNewData);
router.get("/testimonial-data", verifyToken, homePageController.getTestimonialData);
router.get("/gallery-data", verifyToken, homePageController.getGalleryData);
router.get("/video-gallery-data", verifyToken, homePageController.getVideoGalleryData);
router.get("/career-data", verifyToken, homePageController.getCareerData);
router.get("/header-data", verifyToken, homePageController.getAllDataOfHeader);
router.get("/footer-data", verifyToken, homePageController.getAllDataOfFooter);
router.post("/search-data", verifyToken, homePageController.getSearchData);

module.exports = router;
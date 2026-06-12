const express = require("express");
const router = express.Router();
const masterController = require("../API/masterController");
const basicAuth = require("../middleware/basicAuth");

router.get("/all-partnerdata", basicAuth, masterController.getPartnerPageData);
router.get("/all-mediadata", basicAuth, masterController.getMediaPageData);
router.get("/all-jobdata", basicAuth, masterController.getJobCategoryData);


module.exports = router;

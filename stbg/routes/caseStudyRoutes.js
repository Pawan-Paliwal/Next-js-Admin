const express = require("express");
const router = express.Router();
const caseStudyController = require("../API/caseStudyController");
const upload = require("../middleware/upload");

// GET routes
router.get("/all-casestudies", caseStudyController.getAllCaseStudies);
router.get("/fill-casestudy-data", caseStudyController.getCaseStudyById);
router.get(
  "/casestudies-by-product",
  caseStudyController.getCaseStudiesByProductId
);
router.get(
  "/casestudies-by-subproduct",
  caseStudyController.getCaseStudyById
);
router.get("/casestudy_data/:slug", caseStudyController.getCaseStudyBySlug);
router.post(
  "/save-or-update-casestudy",
  upload.fields([
    { name: "CaseStudyImage", maxCount: 1 },
    { name: "Box1Media", maxCount: 1 },
    { name: "Box2Media", maxCount: 1 },
    { name: "Box3Media", maxCount: 1 },
    { name: "Section1MediaUrl", maxCount: 1 },
    { name: "Section2MediaUrl", maxCount: 1 },
    { name: "Section3MediaUrl", maxCount: 1 },
    { name: "Section4MediaUrl", maxCount: 1 },
  ]),
  caseStudyController.saveOrUpdateCaseStudy
);
router.post("/update-casestudy-status", caseStudyController.updateActiveStatus);
router.delete(
  "/delete-casestudy/:CaseStudyId",
  caseStudyController.deleteCaseStudy
);

module.exports = router;

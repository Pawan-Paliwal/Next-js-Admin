const express = require('express');
const router = express.Router();
const companyController = require('../API/companyController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-companies', verifyToken, companyController.getAllCompanies);
router.get('/fill-company-data', verifyToken, companyController.getCompanyById);
router.post(
  '/save-or-update-company',
  upload.fields([
    { name: 'CompanyImage', maxCount: 1 },
    { name: 'CompanyBannerImage', maxCount: 1 },
  ]),
  verifyToken,
  companyController.saveOrUpdateCompany
);
router.post('/update-display-order', verifyToken, companyController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, companyController.getMaxDisplayOrder);
router.delete('/delete-company/:CompanyID', verifyToken, companyController.deleteCompany);
router.post("/update-status", verifyToken, companyController.updateActiveStatus);

module.exports = router;

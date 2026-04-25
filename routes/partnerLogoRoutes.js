const express = require('express');
const router = express.Router();
const partnerLogoController = require('../API/partnerLogoController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/verifyToken');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/OnlineImages/PartnerLogos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/all-logos', verifyToken, partnerLogoController.getAllPartnerLogos);
router.get('/fill-logo-data', verifyToken, partnerLogoController.getPartnerLogoById);
router.post('/save-or-update-logo', upload.single('PartnerLogoImage'), verifyToken, partnerLogoController.saveOrUpdatePartnerLogo);
router.post('/update-display-order', verifyToken, partnerLogoController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, partnerLogoController.getMaxDisplayOrder);
router.delete('/delete-logo/:PartnerLogoID', verifyToken, partnerLogoController.deletePartnerLogo);
router.post('/update-status', verifyToken, partnerLogoController.updateActiveStatus);

module.exports = router;

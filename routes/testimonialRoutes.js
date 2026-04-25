const express = require('express');
const router = express.Router();
const testimonialController = require('../API/testimonialController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verifyToken');

router.get('/all-testimonials', verifyToken, testimonialController.getAllTestimonials);
router.get('/fill-testimonial-data', verifyToken, testimonialController.getTestimonialById);
router.post(
  '/save-or-update-testimonial',
  upload.fields([
    { name: 'TestimonialImage', maxCount: 1 },
  ]),
  verifyToken,
  testimonialController.saveOrUpdateTestimonial
);
router.post('/update-display-order', verifyToken, testimonialController.updateDisplayOrder);
router.get('/max-display-order', verifyToken, testimonialController.getMaxDisplayOrder);
router.delete('/delete-testimonial/:TestimonialID', verifyToken, testimonialController.deleteTestimonial);
router.post("/update-status", verifyToken, testimonialController.updateActiveStatus);
module.exports = router;

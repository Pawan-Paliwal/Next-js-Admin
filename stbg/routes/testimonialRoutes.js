const express = require('express');
const router = express.Router();
const testimonialController = require('../API/testimonialController');
const upload = require('../middleware/upload');
const basicAuth = require('../middleware/basicAuth');

router.get('/all-testimonials', basicAuth, testimonialController.getAllTestimonials);
router.get('/fill-testimonial-data', basicAuth, testimonialController.getTestimonialById);
router.post(
  '/save-or-update-testimonial',
  upload.fields([
    { name: 'TestimonialImage', maxCount: 1 },
  ]),
  basicAuth,
  testimonialController.saveOrUpdateTestimonial
);
router.post('/update-display-order', basicAuth, testimonialController.updateDisplayOrder);
router.get('/max-display-order', basicAuth, testimonialController.getMaxDisplayOrder);
router.delete('/delete-testimonial/:TestimonialID', basicAuth, testimonialController.deleteTestimonial);
router.post("/update-status", basicAuth, testimonialController.updateActiveStatus);
module.exports = router;

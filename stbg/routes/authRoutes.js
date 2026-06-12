const express = require('express');
const router = express.Router();
const authController = require("../API/authController");
const basicAuth = require('../middleware/basicAuth');
const upload = require('../middleware/upload');

router.post('/login', basicAuth, authController.login);
router.post(
    "/save-or-update-user",
    upload.fields([{ name: "ProfileImage", maxCount: 1 }]),
    basicAuth,
    authController.saveOrUpdateUser
);

router.get('/check-login', basicAuth, authController.checkLogin);
router.post('/logout', authController.logout);
router.get('/all-user', authController.getAllUsers);
router.post("/update-status", authController.updateUserActiveStatus);
router.get('/fill-user-data', authController.getUserById);
router.post("/update-password", basicAuth, authController.updatePassword);

module.exports = router;
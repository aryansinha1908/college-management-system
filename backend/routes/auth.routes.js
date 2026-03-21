const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");

router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);

router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password", authControllers.resetPassword);

router.post("/send-otp", authControllers.sendOtp);
router.post("/verify-otp", authControllers.verifyOtp);

module.exports = router;

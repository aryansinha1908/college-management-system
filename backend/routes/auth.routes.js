const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.post("/register", authMiddleware, roleMiddleware(['admin']), authControllers.register);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);

router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password/:token", authControllers.resetPassword);

router.post("/send-otp", authControllers.sendOtp);
router.post("/verify-otp", authControllers.verifyOtp);

router.post("/set-password", authControllers.setPassword);

router.post("/reset-token", authMiddleware, authControllers.resetToken);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get('/profile', authMiddleware, userController.showProfile);

router.patch('/profile', authMiddleware, userController.updateProfile);

module.exports = router;

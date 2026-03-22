const express = require("express");
const router = express.Router();
const userService = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        user: userService.profile
    });
});

module.exports = router;

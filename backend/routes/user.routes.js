const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get('/profile', authMiddleware, userController.showProfile);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), userController.showUser);

router.patch('/:id', authMiddleware, userController.updateProfile);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;

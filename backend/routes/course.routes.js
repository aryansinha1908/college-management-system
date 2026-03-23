const express = require("express");
const router = express.Router();
const roleMiddleware = require("../middleware/role.middleware");
const authMiddleware = require("../middleware/auth.middleware");

router.post('/', authMiddleware, roleMiddleware(['admin','professor']), courseService.newCourse);

router.get('/:id', authMiddleware, courseService.showCourse);
router.patch('/:id', authMiddleware, roleMiddleware(['admin', 'professor']), courseService.updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'professor']), courseService.deleteCourse);

module.exports = router;

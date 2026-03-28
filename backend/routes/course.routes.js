const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const roleMiddleware = require("../middleware/role.middleware");
const authMiddleware = require("../middleware/auth.middleware");

router.get('/:id', authMiddleware, courseController.showCourse);
router.get('/', authMiddleware, courseController.showAllCourses);
router.get('/:id/professors', authMiddleware, roleMiddleware(['admin', 'professor']), courseController.showAllCoursesOfProfessor);

router.post('/', authMiddleware, roleMiddleware(['admin','professor']), courseController.newCourse);

router.patch('/:id', authMiddleware, roleMiddleware(['admin', 'professor']), courseController.updateCourse);

router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'professor']), courseController.deleteCourse);

module.exports = router;

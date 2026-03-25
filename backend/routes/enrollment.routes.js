const express = require("express");
const enrollmentController = require('../controllers/enrollment.controller');
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin', 'student']), enrollmentController.getUserEnrollments);
router.get('/:code/students', authMiddleware, roleMiddleware(['admin']), enrollmentController.getStudents);
router.get('/:studentId/courses', authMiddleware, roleMiddleware(['admin']), enrollmentController.getCourses);

router.post('/', authMiddleware, roleMiddleware(['admin', 'student']), enrollmentController.enrollUser);

router.delete('/', authMiddleware, roleMiddleware(['admin', 'student']), enrollmentController.unenrollUser);

module.exports = router;

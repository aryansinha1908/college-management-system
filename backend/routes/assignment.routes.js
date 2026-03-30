const express = require("express");
const router = express.Router();
const assignmentsController = require("../controllers/assignment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get('/', authMiddleware, roleMiddleware(['admin', 'professor', 'student']), assignmentsController.getAllAssignments);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'professor', 'student']), assignmentsController.getAssignment);
router.get('/:courseCode/course', authMiddleware, roleMiddleware(['admin', 'professor', 'student']), assignmentsController.getAssignmentsOfCourse);

router.post('/', authMiddleware, roleMiddleware(['admin', 'professor']), assignmentsController.createAssignment);

router.patch('/:id', authMiddleware, roleMiddleware(['admin', 'professor']), assignmentsController.updateAssignment);

router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'professor']), assignmentsController.deleteAssignment);

module.exports = router;

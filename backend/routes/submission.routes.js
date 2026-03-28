const express = require("express");
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get('/:id', authMiddleware, roleMiddleware(['admin', 'professor', 'student']), submissionController.getSubmission);
router.get('/:id/students', authMiddleware, roleMiddleware(['admin', 'professor']), submissionController.getStudents);
router.get('/:id/assignments', authMiddleware, roleMiddleware(['admin', 'professor', 'student']), submissionController.getSubmissionsFromAssignmentId);
router.get('/:id/submissions', authMiddleware, roleMiddleware(['admin', 'professor', 'student']), submissionController.getSubmissionsFromStudentId);

router.post('/', authMiddleware, roleMiddleware(['admin', 'student']), submissionController.createSubmission);

router.patch('/:id', authMiddleware, roleMiddleware(['admin', 'professor', 'student']), submissionController.updateSubmission);

router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'student']), submissionController.deleteSubmission);

module.exports = router;

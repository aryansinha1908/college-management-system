const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const attendanceController = require("../controllers/attendance.controller");
const router = express.Router();

router.get('/:courseCode', authMiddleware, roleMiddleware(['admin', 'professor', 'student']), attendanceController.attendanceByDate);
router.get('/:courseCode/student', authMiddleware, attendanceController.attendanceOfStudent);

router.post('/', authMiddleware, roleMiddleware(['admin', 'professor']), attendanceController.recordAttendance);

module.exports = router;

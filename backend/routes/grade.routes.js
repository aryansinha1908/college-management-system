const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/grade.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Get grade by testId
router.get("/test/:id", authMiddleware, roleMiddleware(['student', 'professor', 'admin']), gradeController.getGradeByTestId);

// Get grades by studentId
router.get("/student/:id", authMiddleware, roleMiddleware(['student', 'professor', 'admin']), gradeController.getGradeByStudentId);

// Create grade
router.post("/", authMiddleware, roleMiddleware(['professor', 'admin']), gradeController.createGrade);

// Update grade
router.patch("/:id", authMiddleware, roleMiddleware(['professor', 'admin']), gradeController.updateGrade);

// Delete grade
router.delete("/:id", authMiddleware, roleMiddleware(['professor', 'admin']), gradeController.deleteGrade);

module.exports = router;

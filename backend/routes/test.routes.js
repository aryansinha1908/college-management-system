const express = require("express");
const router = express.Router();
const testController = require("../controllers/test.controller");
const authmiddleware = require("../middleware/auth.middleware");
const rolemiddleware = require("../middleware/role.middleware");

// Get the Test by Id
router.get("/:id", authmiddleware, rolemiddleware(['student', 'professor', 'admin']), testController.getTestById);

// Get the Tests by CourseId
router.get("/course/:id", authmiddleware, rolemiddleware(['student', 'professor', 'admin']), testController.getTestByCourseId);

// Get the Tests by CreatedBy
router.get("/professor/:id", authmiddleware, rolemiddleware(['professor', 'admin']), testController.getTestByCreatedBy);

// Create a new Test
router.post("/", authmiddleware, rolemiddleware(['professor', 'admin']), testController.createTest);

// Update a Test
router.patch("/:id", authmiddleware, rolemiddleware(['professor', 'admin']), testController.updateTest);

// Delete a Test
router.delete("/:id", authmiddleware, rolemiddleware(['professor', 'admin']), testController.deleteTest);

module.exports = router;
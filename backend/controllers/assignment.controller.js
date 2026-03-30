const assignmentsService = require("../services/assignment.service");

exports.getAllAssignments = async (req, res, next) => {
    try {
        const user = req.user;

        if (user.role === 'student') {
            const assignments = await assignmentsService.getAssignmentsOfStudent(user);

            return res.status(200).json({
                success: true,
                message: "Assignments Data Found",
                assignments: assignments
            });
        }
        if (user.role === 'professor') {
            const assignments = await assignmentsService.getAssignmentsOfProfessor(user.userId);

            return res.status(200).json({
                success: true,
                message: "Assignments Data Found",
                assignments: assignments
            });
        }
        if (user.role === 'admin') {
            const assignments = await assignmentsService.getAssignmentsOfAdmin();

            return res.status(200).json({
                success: true,
                message: "Assignments Data Found",
                assignments: assignments
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to Retrieve Data",
            error: error
        })
    }
}

exports.getAssignment = async (req, res, next) => {
    try {
        const assignmentId = req.params.id;

        if (!assignmentId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            })
        }

        const assignment = await assignmentsService.getAssignment(assignmentId);

        return res.status(200).json({
            success: true,
            message: (assignment) ? "Assignment Found" : "Assignment Does Not Exist",
            assignment: assignment
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to Retrieve Data",
            error: error
        })
    }
}

exports.getAssignmentsOfCourse = async (req, res, next) => {
    try {
        const courseCode = req.params.courseCode;

        const assignments = await assignmentsService.getAssignmentsOfCourse(courseCode);

        return res.status(200).json({
            success: true,
            message: "Assignments Found Successfully",
            assignments: assignments
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Assignments Not Found",
            error: error.message
        })
    }
}

exports.createAssignment = async (req, res, next) => {
    try {
        const data = { ...req.body, professorId: req.user.userId };

        if (!data.title || !data.courseId || !data.dueDate) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            })
        }

        const created = await assignmentsService.createAssignment(data);

        return res.status(201).json({
            success: true,
            message: "Assignment Created Successfully",
            createdAssignment: created
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to Create Assignment",
            error: error
        })
    }
}

exports.updateAssignment = async (req, res, next) => {
    try {
        const data = { _id: req.params.id, ...req.body, professorId: req.user.userId };

        const updated = await assignmentsService.updateAssignment(data);

        if (!updated) {
            return res.status(400).json({
                success: false,
                message: "Assignment Could Not be Updated"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Assignment Updated Successfully",
            updatedAssignment: updated
        })
    } catch (error){
        return res.status(400).json({
            success: false,
            message: "Unable to Update Assignment",
            error: error
        })
    }
}

exports.deleteAssignment = async (req, res, next) => {
    try {
        const assignmentId = req.params.id;

        const deleted = await assignmentsService.deleteAssignment(assignmentId);

        return res.status(200).json({
            success: true,
            message: "Assignment Deleted Successfully",
            deletedAssignment: deleted
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to Delete Assignment",
            error: error
        })
    }
}

const enrollmentService = require('../services/enrollment.service');

exports.enrollUser = async (req, res, next) => {
    try {
        const user = req.user;
        const code = req.body.code;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            })
        }
        
        // console.log(user.userId);

        const enrolled = await enrollmentService.enroll(user.userId, code);

        return res.status(201).json({
            success: true,
            message: "User Successfully Enrolled in Course",
            enrolledUser: enrolled
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to Enroll",
            error: error
        })
    }
}

exports.unenrollUser = async (req, res, next) => {
    try {
        const user = req.user;
        const code = req.body.code;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            })
        }
        
        // console.log(user.userId);

        const enrolled = await enrollmentService.unenroll(user.userId, code);

        return res.status(201).json({
            success: true,
            message: "User Successfully Unenrolled in Course",
            enrolledUser: enrolled
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to Unenroll",
            error: error
        })
    }
}

exports.getUserEnrollments = async (req, res, next) => {
    try {
        const user = req.user;

        const enrollments = await enrollmentService.getEnrollments(user.userId);

        return res.status(200).json({
            success: true,
            message: "Enrollenment Data Retrieved",
            enrollments: enrollments
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed To Retrieve Data",
            error: error
        })
    }
}

exports.getStudents = async (req, res, next) => {
    try {
        const code = req.params.code;

        const students = await enrollmentService.getStudents(code);

        return res.status(200).json({
            success: true,
            message: "Students Data Retrieved",
            students: students
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed To Retrieve Data",
            error: error
        })
    }
}

exports.getCourses = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;

        const courses = await enrollmentService.getCourses(studentId);

        return res.status(200).json({
            success: true,
            message: "Course Data Retrieved",
            courses: courses
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed To Retrieve Data",
            error: error
        })
    }
}

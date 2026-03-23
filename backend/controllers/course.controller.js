const courseService = require("../services/course.service");

exports.newCourse = async (req, res, next) => {
    try {
        const data = req.body;

        if (!data.title || !data.code || !data.professorId) {
            return res.status(400).json({
                success: false,
                message: "Incomplete data"
            })
        }
        
        const createdCourse = await courseService.createCourse(data);

        return res.status(200).json({
            success: true,
            message: "New course has been created",
            newCourse: createdCourse
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Course could not be created",
            error: error
        })
    }
}

exports.showCourse = async (req, res, next) => {
    try {
        const code = req.query.id;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Course Code not found"
            })
        }

        const course = await courseService.showCourse(code);

        return res.status(200).json({
            success: true,
            message: "Course found in Database",
            course: course
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Course Not Found",
            error: error
        })
    }
}

exports.updateCourse = async (req, res, next) => {
    try {
        const code = req.query.id;
        const userId = req.user.userId;
        const data = req.body;

        const updatedCourse = await courseService.updateCourse(code, userId, data);

        return res.status(200).json({
            success: true,
            message: "Course Updated successfully",
            updatedCourse: updatedCourse
        })
    } catch (error){
        return res.status(400).json({
            success: false,
            message: "Course could be Updated",
            error: error
        })
    }
}

exports.deleteCourse = async (req, res, next) => {
    try {
        const code = req.query.id;
        const userId = req.user.userId;

        const deletedCourse = await courseService.deleteCourse(code, userId);

        return res.status(200).json({
            success: true,
            message: "Course Deleted successfully",
            updatedCourse:deletedCourse 
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Course could be Deleted",
            error: error
        })
    }
}

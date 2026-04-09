const gradeService = require("../services/grade.service");

exports.getGradeByTestId = async (req, res, next) => {
    try {
        const id = req.params.id;

        const grade = await gradeService.getGradeByTestId(id);

        if (!grade) {
            return res.status(404).json({
                success: false,
                message: "Grade Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Grade Found",
            grade: grade
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Grade Not Found",
            error: error.message
        });
    }
}

exports.getGradeByStudentId = async (req, res, next) => {
    try {
        const id = req.params.id;

        const grade = await gradeService.getGradeByStudentId(id);

        if (!grade) {
            return res.status(404).json({
                success: false,
                message: "Grades Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Grades Found",
            grade: grade
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Grades Not Found",
            error: error.message
        });
    }
}

exports.createGrade = async (req, res, next) => {
    try {
        const data = req.body;

        if (!data.studentId || !data.testId || !data.grade){
            return res.status(400).json({
                success: false,
                message: "Invalid or Incomplete Data"
            });
        }

        // console.log(data);
        const grade = await gradeService.createGrade(data);

        if (!grade) {
            return res.status(404).json({
                success: false,
                message: "Grade Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Grade Created Successfully",
            grade: grade
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Grade Could Not be Created",
            error: error.message
        });
    }
}

exports.updateGrade = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // console.log(data);
        const grade = await gradeService.updateGrade(id, data);

        if (!grade) {
            return res.status(404).json({
                success: false,
                message: "Grade Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Grade Updated Successfully",
            grade: grade
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Grade Could Not be Updated",
            error: error.message
        });
    }
}

exports.deleteGrade = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);

        const grade = await gradeService.deleteGrade(id);

        if (!grade) {
            return res.status(404).json({
                success: false,
                message: "Grade Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Grade Deleted Successfully",
            grade: grade
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Grade Could Not be Deleted",
            error: error.message
        })
    }
}
const testService = require("../services/test.service");

exports.getTestById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const test = await testService.getTestById(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Test Found Successfully",
            test: test
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getTestByCreatedBy = async (req, res, next) => {
    try {
        const id = req.params.id;

        const tests = await testService.getTestByCreatedBy(id);

        if (!tests) {
            return res.status(404).json({
                success: false,
                message: "Tests Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Tests Found Successfully",
            tests: tests
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getTestByCourseId = async (req, res, next) => {
    try {
        const id = req.params.id;

        const tests = await testService.getTestByCourseId(id);

        if (!tests) {
            return res.status(404).json({
                success: false,
                message: "Tests Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Tests Found Successfully",
            tests: tests
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.createTest = async (req, res, next) => {
    try {
        const { title, maximumMarks, questions, courseId } = req.body;
        const createdBy = req.user.userId;

        // console.log(req.body);

        if (!title || !maximumMarks || !questions.length || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Invalid or Incomplete Data"
            })
        }

        const test = await testService.createTest(title, createdBy, maximumMarks, questions, courseId);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test Could Not be Created"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Test Created Successfully",
            createdTest: test
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Test Could Not be Created"
        });
    }
}

exports.updateTest = async (req, res, next) => {
    try {
        const data = req.body;
        const id = req.params.id;

        const test = await testService.updateTest(data, id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test Could Not be Updated"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Test Updated Successfully",
            updatedTest: test
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Test Could Not be Updated"
        });
    }
}

exports.deleteTest = async (req, res, next) => {
    try{
        const id = req.params.id;

        const test = await testService.deleteTest(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test Could Not be Deleted"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Test Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Test Could Not be Deleted"
        });
    }
}
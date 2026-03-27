const submissionService = require('../services/submission.service');

exports.getSubmission = async (req, res, next) => {
    try {
        const id = req.params.id;

        const submission = await submissionService.getSubmission(id);

        return res.status(200).json({
            success: true,
            message: "Submission Found",
            submission: submission
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            message: "Submission Not Found",
            error: error
        })
    }
}

exports.getStudents = async (req, res, next) => {
    try {
        const id = req.params.id;

        const students = await submissionService.getStudents(id);

        return res.status(200).json({
            success: true,
            message: "Students Found",
            students: students
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            message: "Students Not Found",
            error: error
        })
    }
}

exports.getSubmissions = async (req, res, next) => {
    try {
        const id = req.params.id;

        const submissions = await submissionService.getSubmissions(id);

        return res.status(200).json({
            success: true,
            message: "Submissions Found",
            submissions: submissions
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            message: "Submissions Not Found",
            error: error
        })
    }
}

exports.createSubmission = async (req, res, next) => {
    try {
        const data = { ...req.body, studentId: req.user.userId};

        // console.log(data);
        if (!data.assignmentId || !data.fileUrl) {
            return res.status(400).json({
                success: false,
                message: "Invalid or Incomplete Data"
            })
        }

        const created = await submissionService.createSubmission(data);

        return res.status(201).json({
            success: true,
            message: "Submission Created",
            created: created
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message: "Submission Could Not be Created",
            error: error
        })
    }
}

exports.updateSubmission = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = { ...req.body };

        const updated = await submissionService.updateSubmission(data, id);

        return res.status(200).json({
            success: true,
            message: "Submission Updated Successfully",
            updated: updated
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message: "Submission Could Not be Updated",
            error: error
        })
    }
}

exports.deleteSubmission = async (req, res, next) => {
    try {
        const id = req.params.id;

        const deleted = await submissionService.deleteSubmission(id);

        return res.status(200).json({
            success: true,
            message: "Submission Deleted Successfully",
            deleted: deleted
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message: "Submission Could Not be Deleted",
            error: error
        })
    }
}

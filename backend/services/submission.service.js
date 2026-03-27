const Submission = require('../models/submission.model');

exports.getSubmission = async (id) => {
    
    const submission = await Submission.findOne({ _id: id });

    if (!submission) {
        throw new Error("Submission Not Found");
    }

    return submission;
}

exports.getStudents = async (id) => {

    const students = await Submission.find({ _id: id });

    return students;
}

exports.getSubmissions = async (id) => {

    const submissions = await Submission.find({ assignmentId: id });

    return submissions;
}

exports.createSubmission = async (data) => {

    const created = await Submission.create(data);

    if (!created) {
        throw new Error("Submission Could Not be Created");
    }

    return created;
}

exports.updateSubmission = async (data, id) => {

    const updated = await Submission.findOneAndUpdate(
        { _id: id },
        data,
        { new: true }
    );
    // console.log(updated);

    return updated;
}

exports.deleteSubmission = async (id) => {

    const deleted = await Submission.findOneAndDelete({ _id: id });

    return deleted;
}

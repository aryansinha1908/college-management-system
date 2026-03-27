const Assignment = require("../models/assignment.model");
const Enrollment = require("../models/enrollment.model");

exports.getAssignmentsOfStudent = async (user) => {

    const courses = await Enrollment.find({ studentId: user.userId });
    // console.log(courses);

    const courseCodes = courses.map((course) => course.code);
    // console.log(courseCodes);

    const assignments = await Promise.all(
        courseCodes.map((code) => 
            Assignment.find({ courseId: code })
        )
    );
    return assignments.flat();
}

exports.getAssignmentsOfProfessor = async (professorId) => {

    const assignments = await Assignment.find({ createdBy: professorId });

    return assignments;
}

exports.getAssignmentsOfAdmin = async () => {

    const assignments = await Assignment.find();

    return assignments;
}

exports.getAssignment = async (assignmentId) => {
    
    const assignment = await Assignment.findOne({ _id: assignmentId });

    return assignment;
}

exports.createAssignment = async (data) => {

    const assignment = await Assignment.findOne({ _id: data._id });

    if (assignment) {
        throw new Error("Assignment Already Exists");
    }

    const created = await Assignment.create(data);

    if (!created) {
        throw new Error("Assignment Could Not be Created");
    }

    return created;
}

exports.updateAssignment = async (data) => {
    
    const updated = await Assignment.findOneAndUpdate({ _id: data._id }, data, { upserts: true });

    if (!updated) {
        throw new Error("Unable to Update Assignment");
    }

    return updated;
}

exports.deleteAssignment = async (assignmentId) => {

    const deleted = await Assignment.findOneAndDelete({ _id: assignmentId });

    if (!deleted) {
        throw new Error("Assignment Not Found");
    }

    return deleted;
}

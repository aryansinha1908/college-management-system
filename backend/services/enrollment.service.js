const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');

exports.enroll = async (userId, code) => {

    const course = await Course.findOne({ code: code });

    if (!course) {
        throw new Error("Invalid Data");
    }

    const enrolled = await Enrollment.create({
        studentId: userId,
        code: course.code,
    })

    if (!enrolled) {
        throw new Error("Failed to Enroll");
    }

    return enrolled;
}

exports.unenroll = async (userId, code) => {

    const unenrolled = await Enrollment.findOneAndDelete({
        studentId: userId,
        code: code,
    })

    if (!unenrolled) {
        throw new Error("Failed to Unenroll");
    }

    return unenrolled;
}

exports.getEnrollments = async (userId) => {
    
    const data = await Enrollment.find({ studentId: userId });

    const enrolledCourses = data.map(i => i.code);

    return enrolledCourses;
}

exports.getStudents = async (code) => {
    
    const data = await Enrollment.find({ code: code });

    const studentsData = data.map(i => i.studentId);

    return studentsData;
}

exports.getCourses = async (userId) => {
    
    const data = await Enrollment.find({ studentId: userId });

    const courseData = data.map(i => i.code);
    // console.log(data);

    return courseData;
}


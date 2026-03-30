const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');

exports.enroll = async (userId, code) => {

    // const course = await Course.findOne({ code: code });

    // if (!course) {
    //     throw new Error("Invalid Data");
    // }

    const check = await Enrollment.find(
        {
            studentId: userId,
            code: code
        }
    );

    if (check.length !== 0) {
        return check;
    }
    // console.log(check);

    const enrolled = await Enrollment.create({
        studentId: userId,
        code: code,
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

    // console.log(data);

    return data;
}


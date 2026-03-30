const Attendance = require('../models/attendance.model');

exports.attendanceByDate = async (date, courseCode) => {

    const attendance = await Attendance.findOne({ courseCode: courseCode, date: date });

    return attendance;
}

exports.attendanceOfStudent = async (userId, courseCode) => {

    const totalClasses = await Attendance.countDocuments({ courseCode: courseCode });

    const attendedClasses = await Attendance.countDocuments({
        courseCode: courseCode,
        presentees: userId 
    });

    return {
        totalClasses,
        attendedClasses,
    };
}

exports.recordAttendance = async (data) => {

    const attendance = await Attendance.create(data);

    return attendance;
}


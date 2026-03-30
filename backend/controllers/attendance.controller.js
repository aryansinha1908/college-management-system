const attendanceService = require("../services/attendance.service");

exports.attendanceByDate = async (req, res, next) => {

    try {
        const courseCode = req.params.courseCode;
        const date = new Date(req.query.date);

        const attendance = await attendanceService.attendanceByDate(date, courseCode);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance Not Found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Attendance Found Successfully",
            attendance: attendance
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Attendance Not Found",
            error: error.message
        })
    }
}

exports.attendanceOfStudent = async (req, res, next) => {
    try {
        const user = req.user;
        const courseCode = req.params.courseCode;
        
        const attendance = await attendanceService.attendanceOfStudent(user.userId, courseCode);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance Not Found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Attendance Found Successfully",
            attendance: attendance
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Attendance Not Found",
            error: error.message
        })
    }
}

exports.recordAttendance = async (req, res, next) => {
    try {
        const data = req.body;

        const attendance = await attendanceService.recordAttendance(data);

        return res.status(201).json({
            success: true,
            message: "Attendance Recorded Successfully",
            attendance: attendance
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Attendance Could Not be Recorded",
            error: error.message
        })
    }

}

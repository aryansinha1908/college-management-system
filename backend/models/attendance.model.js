const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    presentees: [{
        type: String
    }]
}, { timestamps: true })

module.exports = mongoose.model("Attendance", attendanceSchema);

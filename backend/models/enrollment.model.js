const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('enrollment', enrollmentSchema);

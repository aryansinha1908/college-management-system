const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    assignmentId: {
        type: String,
        required: true
    },
    studentId: {
        type: String, 
        required: true
    },
    fileUrl: {
        type: String, 
        trim: true
    },
    feedback: {
        type: String,
        trim: true
    }
}, { timestamps: true });


module.exports = mongoose.model('submission', submissionSchema);

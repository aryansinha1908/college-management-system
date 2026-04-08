const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true 
    },
    createdBy: {
        type: String,
        required: true,
    },
    maximumMarks: {
        type: Number,
        required: true,
        min: [1, 'Maximum marks must be at least 1'] 
    },
    questions: {
        type: [{
            type: String,
            required: true 
        }],
        validate: [arrayLimit, 'A test must have at least one question']
    },
    courseId: {
        type: String,
        required: true
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length > 0;
}

module.exports = mongoose.model('Test', testSchema);

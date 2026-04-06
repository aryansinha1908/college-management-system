const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    testId: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true,
        uppercase: true
    },
    pass: {
        type: Boolean
    }
}, { timestamps: true });

gradeSchema.pre('save', function(next) {
    if (this.isModified('grade')) {
        this.pass = this.grade !== 'F'; 
    }
    next();
});

module.exports = mongoose.model('Grade', gradeSchema);

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [3, "Title must be longer than 2 characters"]
    },
    code: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.length === 6;
            },
            message: "Course Code must be of 6 characters"
        }
    },
    description: {
        type: String
    },
    professorId: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

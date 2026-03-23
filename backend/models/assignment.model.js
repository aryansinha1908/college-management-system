const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length === 6;
            },
            message: "Course Code must be of 6 characters"
        }
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Title must be longer than 3 characters"]
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(v) {
                const creationDate = this.createdAt || new Date();

                return v > creationDate;
            }
        }
    },
    createdBy: {
        type: String,
        required: true
    }
}, {timestamps})

module.exports = mongoose.model('assignment', assignmentSchema);

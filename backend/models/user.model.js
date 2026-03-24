const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, "Name must be longer than 1 character"]
    },
    rollno: {
        type: String,
        validate: {
            validator: function(v) {
                return v.length === 11;
            },
            message: "Roll number must be of 11 characters"
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'student', 'professor']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

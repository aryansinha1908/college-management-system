const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
})

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
